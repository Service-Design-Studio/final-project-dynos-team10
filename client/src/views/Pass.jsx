import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import {
    useMantineTheme,
    Button,
    Text,
    Center
  } from "@mantine/core";

function Pass() {
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const handleNextPage =() => {
        navigate('/component-status');
    };

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
        <CheckCircleOutlineIcon
          style={{ fontSize: 100, color: "green", alignItems: "center" }}
        ></CheckCircleOutlineIcon>
      <Text weight="bold" align="center" size="xl" style={{marginTop: 15}}>Passed</Text>
      
      <Text align="center" size="md" style={{marginTop: 5, marginBottom:20}}>(Manual Check)</Text>
      </div>
        
        <Center>
        <Button 
       onClick={handleNextPage} 
       style={{marginLeft: 10}} 
       size="md" 
       variant="filled" 
       uppercase>
        Upload
        </Button> 
        </Center>

        </div>
     );
}

export default Pass;