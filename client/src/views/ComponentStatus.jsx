import ComponentStatusButton from "../components/ComponentStatusButton";
import { useSelector, useDispatch } from 'react-redux';
import {
    selectWorkorderNumber,
    addNewComponent,
    putOrAddComponent,
    selectWorkorderComponents
} from "../store/workorder/workorderSlice";
import { Button, Modal, Text, Center, Paper, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { $axios } from '../helpers/axiosHelper';
import { useNavigate } from "react-router-dom";

function ComponentStatus() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [componentTypes, setComponentTypes] = useState([]);
    const workorderNumber = useSelector(selectWorkorderNumber);
    const workorderComponents = useSelector(selectWorkorderComponents);
    useEffect(() => {
        (async() => {
            let response;
            try {
                response = await $axios.get(`workorders?workorder_number=${workorderNumber}`);
                const machineTypeId = response.data.result.machine_type_id;
                response = await $axios.get(`machine_types/${machineTypeId}/component_types`);
                setComponentTypes(response.data.result)
            } catch (e) {
                console.log(e);
            }
        })()
    }, [workorderNumber])

    // const componentnames = ["label" , "wire", "xxx", "yyy"];
    const [modalOpened, setModalOpened] = useState(false); // modal for camera or upload photos
    const [submitModal, setSubmitModal] = useState(false); // modal after submitting workorder successfully
    const [cannotSubmit, setCannotSubmit] = useState(false); // modal if cannot submit workorder
    const [submitting, setSubmitting] = useState(false); // loader when submitting
    const [componentsReady, setComponentsReady] = useState(false); 

    const processExistingComponent = (componentData) => {
        const { componentId, componentStatus, componentName, images, componentFailingReasons, componentTypeId } = componentData;

        // since this is an existing component in the DB, we add a non-null ID to it
        const payload = { 
            componentName,
            images: images.map(el => {
                return {
                    id: el.imageId,
                    src: el.url
                }
            }),
            status: componentStatus ? 'green' : 'red',
            failingReasons: componentFailingReasons,
            id: componentId,
            componentTypeId
        }

        dispatch(putOrAddComponent(payload));
    }

    useEffect(() => {
        if (!workorderNumber) {
            setModalOpened(true);
            return;
        }
        let componentsWithImages = [];
        (async() => {
            let response;
            try {
                // 1) get workorder id, also checks if it is valid
                response = await $axios.get(`workorders?workorder_number=${workorderNumber}`);
                // response = await $axios.get(`workorders?workorder_number=aerfvaefbaef`);
                // 2) get components (that have been added ALREADY)
                // TODO: for now, component records are committed to DB at point of upload, along with imges
                // when we do custom component adding, proboably need to change component creation at that point instead, and move creation of DEFAULT components there as well
                const workorderId = response.data.result.id;
                response = await $axios.get(`workorders/${workorderId}/components`);
                const componentIds = response.data.result.map(el => el.id);
                // console.log({componentIds});

                // 3a) if there are 0 components (akin to a new qc entry), simply proceed
                // 3b) if there are components, for each component found, get images
                if (componentIds.length > 0) {
                    const items = componentIds.map(async(componentId) => {
                        const el = (await $axios.get(`components/${componentId}`)).data.result;
                        response = await $axios.get(`components/${componentId}/images`);
                        const images = response.data.result;
                        const formattedImages = images.map(imageEl => {
                            return {
                                imageId: imageEl.id,
                                url: imageEl.public_url
                            }
                        })
                        const componentTypeId = el.component_type_id;
                        response = await $axios.get(`component_types/${componentTypeId}`);
                        const componentTypeName = response.data.result.type_name;
                        const componentObj = {
                            componentId: el.id,
                            componentName: componentTypeName,
                            componentStatus: el.status,
                            images: formattedImages,
                            componentFailingReasons: el.failing_reasons_types.map(reasonEl => ({failingReasonTypeId: reasonEl.id, failingReasonName: reasonEl.reason})) || [],
                            componentTypeId
                        }
                        return componentObj;
                    })
                    componentsWithImages = await Promise.all(items);
                }
                console.log({componentsWithImages});
            } catch(e) {
                // case 1: workorder number does not exist
                // case 2: component id does not exist
                console.error(e);
            }
            // ---- important -----
            // no matter what, we always INITIALISE the DEFAULT components
            componentTypes.forEach(componentTypeObj => {
                dispatch(addNewComponent(componentTypeObj));
            })
            // --------------------
            if (componentsWithImages.length > 0) {
                // if there are existing records of components for this workorder, we process them
                componentsWithImages.forEach(el => processExistingComponent(el));
            }
            setComponentsReady(true);
        })();
    }, [workorderNumber, componentTypes]);


    const submitWorkorder = async() => {
        setSubmitting(true);
        let response;
        try {
            // 1) get workorder id, also checks if it is valid
            response = await $axios.get(`workorders?workorder_number=${workorderNumber}`);
            // 2) get components (that have been added ALREADY)
            const workorderId = response.data.result.id;
            response = await $axios.get(`workorders/${workorderId}`);
            const components = response.data.result;
            // console.log({components});
            
            const payload = {
                completed: true
            }

            const submit = await $axios.patch(`workorders/${workorderId}`, payload);
            console.log({submit});
            setSubmitting(false);
            setSubmitModal(true);

        } catch(e) {
            console.error(e);
            console.log('cannot submit, at least 1 component with status not indicated');
            setSubmitting(false);
            setCannotSubmit(true);
        }

    }



    return (
        <>
        { 
            componentTypes.length === 0 ?
            <Center>
                <Paper shadow="sm" p="md" m="sm" style={{margin: "5rem", padding: "1rem"}}>
                    It seems like there are no component types for this machine yet
                </Paper>
            </Center> 
            :
            !submitting &&
            <>
                <div style={{ 
                        display: "flex", 
                        flexDirection:"row", 
                        flexWrap: "wrap", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        height: "100%", 
                        overflowY: 'scroll', 
                        // maxHeight: .8*window.innerHeight
                        maxHeight: "80vh"
                        }}>
                    {
                        componentsReady &&
                        componentTypes.map((componentTypeObj, index) => 
                            <ComponentStatusButton key={index} component={componentTypeObj.type_name} />
                        )
                    }
                </div> 
                <Center>
                    <Button onClick={submitWorkorder} style={{marginTop: "0.8rem"}}>
                        Submit 
                    </Button>
                </Center>
            </>
        }
            
        { // loading screen when submitting
            submitting && 
            <Center style={{ height: 200, flexDirection: 'column' }}>
                <Loader size="lg"/>
                <Text weight={500} mt="xs">Submitting</Text>
            </Center>
        }
        

            <Modal
                centered
                onClose={() => setModalOpened(false)}
                opened={modalOpened}
                withCloseButton={false}
                closeOnEscape={false}
                closeOnClickOutside={false}
                title="Please select a work order"
            >
                <Text>No work order was detected, please create a new work order or select an existing one.</Text>
                <Button mt="md" onClick={() => navigate('/')}>Choose Work Order</Button>
            </Modal>
            
            <Modal
                centered
                onClose={() => setSubmitModal(false)}
                opened={submitModal}
                withCloseButton={false}
                closeOnEscape={false}
                closeOnClickOutside={false}
                title="Workorder submitted successfully"
            >
                <Center> <Button onClick={() => {navigate("/");}}>Home</Button> </Center>
            </Modal>

            <Modal
                centered
                onClose={() => setCannotSubmit(false)}
                opened={cannotSubmit}
                title="Unable to submit Workorder"
            >
                <Text color="red" weight={500}>Not all component status updated</Text>
            </Modal>


        </>
    )
}

export default ComponentStatus;