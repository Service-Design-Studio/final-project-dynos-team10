import { useMemo } from "react";
import { Button,
    Stack,
    Center,
    Text,
Modal } from "@mantine/core";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate, useLocation } from "react-router-dom";
import {useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { 
selectCurrentComponentName,
addImageToComponent,
selectCurrentComponent
} from "../store/workorder/workorderSlice";
import { updateCurrentComponentStatus } from "../store/workorder/workorderSlice";


function OptionsModal({optionsModal, setOptionsModal}) {
const navigate= useNavigate();
const location= useLocation();

const currentComponentName = useSelector(selectCurrentComponentName);
const currentComponent = useSelector(selectCurrentComponent);
const dispatch = useDispatch();

const count = useMemo(() => {
    return currentComponent.images.length;
}, [currentComponent]);



const getBase64 = (file) =>{
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result
        dispatch(addImageToComponent({
            componentName: currentComponentName,
            image: base64String
        }));

        if (count > -1 && !['green', 'red'].includes(currentComponent.status)) {
            dispatch(updateCurrentComponentStatus("yellow"))
        } 
        // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
    };
    reader.readAsDataURL(file);
};

const handleChange = (e) => {
    const file = Array.from(e.target.files);
    console.log("files: " + file)
    
    file.forEach(i=>{
        getBase64(i)

    });
    
    if (location.pathname==='/photo-review' | location.pathname==='/component-status'){
        navigate('/photo-review')
    };
    setOptionsModal(false)
};

return ( 
    <Modal
    opened={optionsModal}
    onClose={()=>setOptionsModal(false)}
    >
    <input
    multiple={true}
    onChange={handleChange}
    type="file"
    accept="image/*"
    style={{ display: 'none' }}
    id="contained-button-file"
    />


    <Center>
        <Stack
        spacing='xl'
        >
            <Button
            variant="light"
            style={{height: 150, width: 200}}
            onClick={() => navigate("/camera")}
            className="camera-btn"
            >
                <Stack
                spacing="xs"
                >
                    <Center>
                        <CameraAltIcon
                        sx={{fontSize: 50}}
                        />
                    </Center>
                        <Text
                        size="lg"
                        >
                            Camera
                        </Text>
                </Stack>
            </Button>
            
            <label htmlFor="contained-button-file">
                <Button
                variant="light"
                style={{height: 150, width: 200, marginBottom: "2rem"}}
                component="span"
                >
                    <Stack
                    spacing="xs"
                    >
                        <Center>
                            <FileUploadIcon
                            sx={{fontSize: 50}}
                            />
                        </Center>
                            <Text
                            size="lg"
                            >
                                Upload
                            </Text>
                    </Stack>
                </Button>
            </label>
        </Stack>
    </Center>
    
    </Modal>
 );
}

export default OptionsModal;