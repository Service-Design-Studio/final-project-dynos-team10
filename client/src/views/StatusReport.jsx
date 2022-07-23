import { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";
import { BsCameraFill, BsPencilSquare } from "react-icons/bs";
import PassIconSvg from '../assets/pass-icon.svg';
import FailIconSvg from '../assets/fail-icon.svg';
import SwipeableTextMobileStepper from '../components/PhotoCarousel';

import './PhotoReview.css';
import { useDispatch, useSelector } from "react-redux";
import { 
    removeComponentImageByIndex, 
    selectCurrentComponent, 
    selectCurrentComponentName, 
    selectWorkorderNumber, 
    updateCurrentComponentStatus,
    selectWorkorderComponents
} from "../store/workorder/workorderSlice";

import {
    Container,
    ActionIcon,
    Grid,
    Space,
    Button,
    Text,
    Stack,
    Paper,
    ScrollArea
  } from "@mantine/core";

import { $axios } from '../helpers/axiosHelper';

let colourToStatus = {"red": "FAIL", "green": "PASS"};

function StatusReport() {
    const navigate = useNavigate();
    const [report, editReport] = useState(false);

    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const dispatch = useDispatch();
    const currentComponentName = useSelector(selectCurrentComponentName);
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);
    const currentComponent = useSelector(selectCurrentComponent);
    const workorderComponents = useSelector(selectWorkorderComponents);

    console.log(workorderComponents[currentComponentName].status);

    const hasImages = useMemo(() => {
        return currentComponent.images.length > 0;
    }, [currentComponent]);

    const deleteActivePhoto = () => {
        if (currentComponent.images.length === 1){
            console.log("1 image left, changing component status = blue after deletion");
            dispatch(updateCurrentComponentStatus("blue"));
        }

        dispatch(removeComponentImageByIndex({
            index: activeStep,
            componentName: currentComponentName
        }));
        toggleCarouselKey();
    }

    const [carouselKey, setCarouselKey] = useState(0);
    const toggleCarouselKey = () => {
        // hacky way to cause photo carousel to rerender using keys
        carouselKey === 0 ? setCarouselKey(1) : setCarouselKey(0);
    }

    const [chosenStatus, setChosenStatus] = useState('');
    const proceedStatus = (() => {
        navigate('/pass-fail', { state: { chosenStatus } });
    });

    return (
        
        <div style={{margin: 20}}>

            <Stack spacing="xs">
                {
                    !report ?
                    <h2 
                        style={{
                            textTransform: "capitalize", 
                            margin: "auto"}}> 
                        {currentComponentName}: {workorderComponents.status} 
                    </h2>
                    :
                    <div style={{display: "flex", justifyContent:"space-evenly"}}>
                    <Button 
                        component="a" 
                        href="#" 
                        variant="outline" 
                        onClick={() => navigate('/camera')} 
                        leftIcon={<BsCameraFill size={18}/>}>
                        Add Photo
                    </Button>
                    <Button 
                        color="red" 
                        component="a" 
                        href="#" 
                        variant="outline" 
                        onClick={deleteActivePhoto} 
                        leftIcon={<IoTrashSharp size={18}/>}>
                        Delete Photo
                    </Button>
                </div>
                }

                {/* middle section -> carousel */}
                <Container px="0">
                {
                        !hasImages
                        ?   
                            <Container align="center">``
                                <Button
                                    className="photo-review-camera-btn--secondary"
                                    colour="blue" 
                                    variant="outline" 
                                    style={{marginTop: 30, marginInline: 20, width: "auto", height: 120, fontSize: "1.2rem"}}
                                    onClick={() => navigate('/camera')}
                                >
                                    go back to camera
                                </Button>
                        </Container>
                        : <SwipeableTextMobileStepper
                            activeStep={activeStep}
                            handleNext={handleNext}
                            handleBack={handleBack}
                            handleStepChange={handleStepChange}
                            key={carouselKey}
                            className="photo-carousel"
                            style={{display: "flex",
                                justify: "center"}}
                            
                        />
                    }
                </Container>


                <Paper shadow="sm" p="xs" withBorder>

                    <div 
                        style={{
                            display: "flex", 
                            justifyContent:"space-between", 
                            alignItems:"center"}}>
                        <Text color="red" weight="Bold" style={{marginLeft: "0.5rem"}}>Fail Reason(s)</Text>
                        <Button 
                            component="a" 
                            href="#" 
                            variant="light" 
                            // onClick={() => navigate('/camera')} 
                            leftIcon={<BsPencilSquare size={18}/>}
                            >
                            Change Status
                        </Button>
                    </div>
                    
                    <ScrollArea 
                        style={{height: 120,
                                margin: "2rem", 
                                marginTop: "0.1rem", 
                                marginBottom: "1rem", 
                                padding: 10}}
                                type="scroll"
                                >
                    </ScrollArea>
                </Paper>

                <Stack align="center" spacing="xs">
                    {/* {
                    
                        workorderComponents[currentComponentName].status === "green" ?
                        <img src={PassIconSvg} width={75} style={{margin:"auto"}}></img>
                        :
                        <Paper shadow="sm" p="sm" withBorder></Paper>
                    } */}

                    
                    {
                        !report ?
                        null
                        :
                        <Button 
                            component="a" 
                            href="#" 
                            variant="light" 
                            // onClick={() => navigate('/camera')} 
                            leftIcon={<BsPencilSquare size={18}/>}
                            
                            >
                            Change Status
                        </Button>

                    }
                </Stack>

                {
                    !report ? 
                    <Button 
                        variant="filled"
                        onClick={() => editReport(true)} 
                        style={{
                            margin: "2rem", 
                            marginTop: "0.5rem", 
                            marginBottom: "0.5rem"}}>
                        Edit
                    </Button>
                    :
                    <Button 
                        variant="outline" 
                        onClick={() => editReport(false)}
                        style={{
                            margin: "2rem", 
                            marginTop: "0.5rem", 
                            marginBottom: "0.5rem"}}>
                        Save
                    </Button>
                }
                
                
            </Stack>




        </div>
    )
}

export default StatusReport;