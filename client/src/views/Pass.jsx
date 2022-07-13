import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { $axios } from '../helpers/axiosHelper';
import {
    useMantineTheme,
    Button,
    Text,
    Center
  } from "@mantine/core";
  import { 
    selectCurrentComponent, 
    selectCurrentComponentName, 
    selectWorkorderNumber, 
    updateCurrentComponentStatus,
    replaceCurrentComponentImageArray
} from "../store/workorder/workorderSlice";

function Pass() {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const dispatch = useDispatch();
    // const [chosenStatus, setChosenStatus] = useState('');
    const currentComponentName = useSelector(selectCurrentComponentName);
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);
    const currentComponent = useSelector(selectCurrentComponent);

    const postComponentPhotos = async() => {
        // get workorder id
        let workorderId;
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            workorderId = response.result.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
        }

        const payload = {
            workorder_id: workorderId,
            component_type: currentComponentName,
            status: true
        }

        let response;
        try {
            response = await $axios.post('components', payload);
            if (!response.data.success) {
                return;
            }
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
      console.log("able to upload component status");
      dispatch(updateCurrentComponentStatus("green"));
      // store all links into array ( from response.result.)
      const URL_array = response.data.result.map(image => image.public_url);
      console.log(URL_array);
      dispatch(replaceCurrentComponentImageArray(URL_array));
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
            <CheckCircleOutlineIcon
              style={{ fontSize: 100, color: "green", alignItems: "center" }}
            ></CheckCircleOutlineIcon>
            <Text weight="bold" align="center" size="xl" style={{marginTop: 15}}>Passed</Text>
            <Text align="center" size="md" style={{marginTop: 5, marginBottom:20}}>(Manual Check)</Text>
          </div>
        
          <Center>
            <Button 
              onClick={postComponentPhotos} 
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