import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { $axios } from '../helpers/axiosHelper';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputDisplay from "../components/InputDisplay.jsx";
import {
    Button,
    Text,
    Center,
    Modal,
} from "@mantine/core";
import { 
    selectCurrentComponent, 
    selectCurrentComponentName, 
    selectWorkorderNumber, 
    updateCurrentComponentStatus,
    replaceCurrentComponentImageArray
} from "../store/workorder/workorderSlice";
import { deepCompare } from "../helpers/objectHelper";
import { buildComponentObjWithImages } from "../helpers/componentsHelper";

export default function PassFail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isPass = useMemo(() => {
        return state.chosenStatus === 'green';
    }, [state])

    const currentComponentName = useSelector(selectCurrentComponentName);
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);
    const currentComponent = useSelector(selectCurrentComponent);

    const [value, setValue] = useState("");
    const [reasons, setReasons] = useState([]);
    const[opened, setOpened] = useState(false);

    useEffect(() => {
        setReasons(currentComponent.failingReasons);
    }, [])

    const UploadButton = () => {
        if (reasons.length > 0) {
            return (<Button className="upload-btn" onClick={updateComponentRecord} style={{marginLeft: 10}} size="md" variant="filled" uppercase>UPLOAD</Button>)
        };
        return (<Button style={{marginLeft: 10}} size="md" variant="filled" uppercase disabled>UPLOAD</Button>)
    };

    const findWorkorderRecord = async() => {
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            console.log({response});
            return response.result.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
            return null;
        }
    }

    const createNewComponent = async(workorderId) => {
        const payload = {
            workorder_id: workorderId,
            component_type: currentComponentName,
        }

        if (isPass) {
            payload.status = true;
        } else {
            payload.failing_reasons = reasons;
        }

        let response;
        try {
            response = await $axios.post('components', payload);
            if (!response.data.success) {
                return;
            }
            console.log({response});
            const { id: component_id } = response.data.result;
            response = await $axios.post('images/batch-create', {
                component_id,
                images: currentComponent.images.map(el => el.src)
            })
            console.log({response});
            successfulUpload(response);
        } catch (e) {
            console.error(e);
        }
    }

    const successfulUpload = (response) => {
        dispatch(updateCurrentComponentStatus(state.chosenStatus));
        // store all links into array ( from response.result.)
        const URL_array = response.data.result.map(image => {
            return {
                id: image.id,
                src: image.public_url
            }
        });
        console.log(URL_array);
        dispatch(replaceCurrentComponentImageArray(URL_array));
        setOpened(true);
    }


    const updateComponentRecord = async() => {
        // get workorder id
        const workorderId = await findWorkorderRecord();
        if (!workorderId) {
            return;
        }

        // POST request, new component
        if (currentComponent.id === null) {
            console.log('We are working with a new component');
            createNewComponent(workorderId);
            return;
        }

        // here we deal with EDITING/patch requests
        let response = await $axios.get(`components/${currentComponent.id}`);
        const dbComponent = response.data.result;
        response = await $axios.get(`components/${currentComponent.id}/images`);
        const dbImages = response.data.result;
        const dbComponentWithImages = buildComponentObjWithImages(dbComponent, dbImages);
        // Issue 1: component status only updated after successful upload, so this compare will not detect status changes (yet)
        // Issue 2: component status changes to yellow when using camera, if got use camera to add photos, then this will detect status change (to yellow), which is not submittable
        // Issue 3: figure out why "differences" is weird when we delete images, check the images array
        const differences = deepCompare(dbComponentWithImages, currentComponent);
        console.log({differences, dbComponentWithImages, currentComponent});

        if (differences.images) {
            // await this?
            updateImages(currentComponent.id, dbComponentWithImages.images, currentComponent.images);
        }

        const payload = {
            component_id: currentComponent.id
        }
        if (differences.failingReasons) {
            payload.failing_reasons = currentComponent.failingReasons;
        }
        if (differences.status) {
            payload.status = currentComponent.status;
        }
        console.log({payload});

        // await $axios.patch(`components/${currentComponent.id}`, payload);
    }

    const updateImages = async(componentId, oldImages, updatedImages) => {
        // Note: images can only be added or deleted, they cannot be edited
        console.log({componentId, oldImages, updatedImages});
        const newImages = updatedImages.filter(el => el.id === null); 
        const deletedImages = oldImages.filter(old => {
            return !updatedImages.find(newEl => newEl.id === old.id);
        })
        console.log({newImages, deletedImages});

        // 1) find the new images to add
        // let response = await $axios.post('images/batch-create', {
        //     component_id: componentId,
        //     images: newImages.map(el => el.src)
        // })

        // 2) find images that are missing from the old images and delete them
        
    }


    return (
        <div>
            <div
                style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                marginTop: "5%",
                }}
            >
                {
                    isPass ?
                    <>
                        <CheckCircleOutlineIcon style={{ fontSize: 100, color: "green", alignItems: "center" }}></CheckCircleOutlineIcon>
                        <Text weight="bold" align="center" size="xl" style={{marginTop: 15}}>Passed</Text>
                        <Text align="center" size="md" style={{marginTop: 5, marginBottom:20}}>(Manual Check)</Text>
                    </> :
                    <>
                        <HighlightOffIcon style={{ fontSize: 95, color: "red", alignItems: "center" }}></HighlightOffIcon>
                        <Text weight="bold" align="center" size="xl" style={{marginTop: 5}} >Failed</Text>
                    </>
                }
            </div>

            {
                !isPass && 
                <InputDisplay 
                    reasons={reasons}
                    value={value}
                    setReasons={setReasons}
                    setValue={setValue}
                />
            }
            {
                isPass ?
                <Center>
                    <Button 
                        onClick={updateComponentRecord} 
                        style={{marginLeft: 10}} 
                        size="md" 
                        variant="filled" 
                        uppercase
                        className="upload-btn"
                    >
                        Upload
                    </Button> 
                </Center> :
                <Center style={{marginTop:15, marginRight: 10}}>
                    <UploadButton />
                </Center>
            }
                <Modal
                opened={opened}
                onClose={() =>{ 
                    setOpened(false);
                    navigate('/component-status');
                }}
                
                >
                <Text size="lg" align="center" style={{margin: 20}}>Upload Successful</Text>
                </Modal>

                </div>
                            
    )
}