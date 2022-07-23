import { Button,
        Stack,
        Center,
    Text } from "@mantine/core";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";

function Options() {
    const navigate= useNavigate();

    return ( 
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

                <Button
                variant="light"
                style={{height: 150, width: 200}}
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
            </Stack>
        </Center>
     );
}

export default Options;