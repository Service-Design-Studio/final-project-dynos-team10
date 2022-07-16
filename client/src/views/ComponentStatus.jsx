import ComponentStatusButton from "../components/ComponentStatusButton";
import { useSelector, useDispatch } from 'react-redux';
import { selectWorkorderNumber, addNewComponent, addImagesArrayToComponent, updateComponentStatus, addFailingReasons } from "../store/workorder/workorderSlice";
import { Button, Modal, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { $axios } from '../helpers/axiosHelper';
import { useNavigate } from "react-router-dom";

function ComponentStatus() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const componentnames = ["label" , "wire", "xxx", "yyy"];
    const workorderNumber = useSelector(selectWorkorderNumber);
    const [modalOpened, setModalOpened] = useState(false);

    const [componentsReady, setComponentsReady] = useState(false);

    const processExistingComponent = (componentData) => {
        const { componentStatus, componentType, images, componentFailingReasons } = componentData;
        if (!componentnames.includes(componentType)) {
            // this means that a custom component was created by the user for this workorder
            // we need to initialise it, and add the details
            dispatch(addNewComponent(componentType));

            // TODO: to check this again when feature to create custom components is added
            // the dispatch above is not synchoronous and might affect the following code in this function
        }
        dispatch(addImagesArrayToComponent({
            componentName: componentType,
            images: images.map(el => el.url)
        }));
        const colorStatus = componentStatus ? 'green' : 'red';
        dispatch(updateComponentStatus({
            componentName: componentType,
            status: colorStatus
        }))

        if (!componentStatus) {
            // i.e. it's a red/failed component, add failing reasons
            dispatch(addFailingReasons({
                componentName: componentType,
                failingReasons: componentFailingReasons
            }));
        }
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
                console.log({response});
                const components = response.data.result;
                // 3a) if there are 0 components (akin to a new qc entry), simply proceed
                // 3b) if there are components, for each component found, get images
                if (components.length > 0) {
                    const items = components.map(async(el) => {
                        response = await $axios.get(`components/${el.id}/images`);
                        console.log({response});
                        const images = response.data.result;
                        const formattedImages = images.map(imageEl => {
                            return {
                                imageId: imageEl.id,
                                url: imageEl.public_url
                            }
                        })
                        const componentObj = {
                            componentId: el.id,
                            componentType: el.component_type,
                            componentStatus: el.status,
                            images: formattedImages
                        }
                        if (!el.status) {
                            componentObj.componentFailingReasons = el.failing_reasons;
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
            componentnames.forEach(componentName => {
                dispatch(addNewComponent(componentName));
            });
            // --------------------
            if (componentsWithImages.length > 0) {
                // if there are existing records of components for this workorder, we process them
                componentsWithImages.forEach(el => processExistingComponent(el));
            }
            setComponentsReady(true);
        })();
    }, []);

    return (
        <>
            <div style={{ display: "flex", flexDirection:"row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {
                    componentsReady &&
                    componentnames.map((componentname, index) => 
                        <ComponentStatusButton key={index} component={componentname} />
                    )
                }
            </div>
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
        </>
    )
}

export default ComponentStatus;