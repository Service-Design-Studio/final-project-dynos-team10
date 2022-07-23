import { Button,
        Stack,
        Center,
        Text,
    Modal } from "@mantine/core";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";
import {useState} from 'react';

function Options() {
    const navigate= useNavigate();
    const [opened, setOpened] = useState();

    const [pictures, setPictures] = useState([]);

    const getBase64 = (file) =>{
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
            setPictures(oldArray => [...oldArray, base64String])
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

        };
    //    const pics = file.map(data => (
    //         URL.createObjectURL(data)
    //     ))
        // console.log(pics)
        // file.forEach(i => {
        //     console.log(i)
        //     setPictures([...pictures, URL.createObjectURL(i)]);
        // })


    return ( 
        <div>
            <input
            multiple={true}
            onChange={handleChange}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="contained-button-file"
            />

            <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Warning"
            >
                <Text>
                    Please take note to ONLY use the upload option given.
                </Text>
            </Modal>


            <Center>
                <Stack
                style={{marginTop: 50}}
                spacing={50}
                >
                    <Button
                    variant="light"
                    style={{height: 150, width: 200}}
                    onClick={() => navigate("/camera")}
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
                        style={{height: 150, width: 200}}
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
        </div>
     );
}

export default Options;