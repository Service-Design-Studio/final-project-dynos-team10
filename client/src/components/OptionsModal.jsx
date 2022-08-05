import { useMemo } from "react";
import { Button,
    Stack,
    Center,
    Text,
Modal, 
Notification} from "@mantine/core";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react';
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

const [showFileErrorNotif, setShowFileErrorNotif] = useState(false);

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
    
    // check if there exists a file that is not an image file
    if (!file.every(el => el.type.match('image.*'))) {
        console.log('non-image files detected!');
        setShowFileErrorNotif(true);
        return;
    }

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
    className="options-modal"
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
            className="options-modal__camera-btn"
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
                className="options-modal__upload-btn"
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

    {
        showFileErrorNotif &&
        <Notification
            color="red"
            onClose={() => setShowFileErrorNotif(false)}
        >
            Non-image file(s) detected! Please try again and upload only image files.
        </Notification>
    }
    
    </Modal>
 );
}

export default OptionsModal;