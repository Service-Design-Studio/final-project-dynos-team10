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

    const handleNextPage = () => {
        navigate('/component-status');
    };

    const UploadButton = () => {
        if (reasons.length > 0) {
            return (<Button className="upload-btn" onClick={postComponentPhotos} style={{marginLeft: 10}} size="md" variant="filled" uppercase>UPLOAD</Button>)
        };
        return (<Button style={{marginLeft: 10}} size="md" variant="filled" uppercase disabled>UPLOAD</Button>)
    };


    const postComponentPhotos = async() => {
        // get workorder id
        let workorderId;
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            console.log({response});
            workorderId = response.result.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
        }

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
                images: currentComponent.images
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
        const URL_array = response.data.result.map(image => image.public_url);
        console.log(URL_array);
        dispatch(replaceCurrentComponentImageArray(URL_array));
        setOpened(true);
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
                        onClick={postComponentPhotos} 
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