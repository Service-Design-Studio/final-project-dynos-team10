import { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import OptionsModal from "../components/OptionsModal";

import { FaArrowLeft } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";
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
    Text
  } from "@mantine/core";

import { $axios } from '../helpers/axiosHelper';

let colourToStatus = {"red": "FAIL", "green": "PASS"};

function PhotoReview() {
    const navigate = useNavigate();

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
    const [optionsModal, setOptionsModal] = useState(false);


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

            {
                optionsModal &&
                <OptionsModal
                    optionsModal={optionsModal}
                    setOptionsModal={setOptionsModal}
                />
            }
            

            {/* top section */}
            <Space h="lg" />

            <Grid grow align="center" style={{marginLeft:"1rem", marginRight:"1rem", marginTop: "1rem"}}>

                <Grid.Col span={1} align="center" >
                    <ActionIcon color="dark" variant="transparent" size="2.8rem">
                        <FaArrowLeft onClick={() => navigate('/component-status')} className="back-btn" style={{fontSize: "1.8rem"}} />
                    </ActionIcon>
                </Grid.Col>
                    
                <Grid.Col span={3}></Grid.Col>

                <Grid.Col span={1} align="right">
                    <ActionIcon color="blue" variant="outline" radius="md" size="3rem">
                        <MdLibraryAdd onClick={() => setOptionsModal(true)} size="1.7rem"/>
                    </ActionIcon>
                </Grid.Col>

                <Grid.Col span={1} align="center" >
                    <ActionIcon color="red" variant="outline" radius="md" size="3rem">
                        <IoTrashSharp onClick={deleteActivePhoto} className="photo-review-delete-btn" size="1.7rem" />
                    </ActionIcon>
                </Grid.Col>

            </Grid>
            
            <Space h="xs" />

            {/* middle section -> carousel */}
            <Container px="0">
            {
                    !hasImages
                    ?   
                        <Container align="center">
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
            {
                hasImages &&
                <div style={{textAlign: 'center'}}>
                    <h3 style={{ marginTop: "0.5rem"}} >Indicate Status to Proceed</h3>

                    <Grid grow align="center">

                        <Grid.Col span={3} align="right" variant="subtle">
                            <button 
                                className="photo-review-status-btn photo-review-status-btn--fail" 
                                onClick={() => setChosenStatus('red')}
                                style={{backgroundColor: "transparent"}}>
                                <img src={FailIconSvg} width={55}></img>
                                <p>Fail</p>
                            </button>
                        </Grid.Col>
                        <Grid.Col span={1} align="center"></Grid.Col>
                        <Grid.Col span={3} align="left">
                            <button 
                                className="photo-review-status-btn photo-review-status-btn--pass" 
                                onClick={() => setChosenStatus('green')}
                                style={{backgroundColor: "transparent"}}>
                                <img src={PassIconSvg} width={55}></img>
                                <p>Pass</p>
                            </button>
                        </Grid.Col>

                    </Grid>

                    {
                        chosenStatus &&
                        (
                            <>
                                <h4 style={{ marginTop: "0.5rem"}}>You have chosen: {colourToStatus[chosenStatus]}</h4>
                                <Button 
                                    onClick={proceedStatus}
                                    colour="blue" 
                                    variant="outline" 
                                    size="md"
                                    className="proceed-btn"
                                >
                                    Proceed
                                </Button>
                            </>
                        )
                    }
                </div>
            }
        </div>
    )
}

export default PhotoReview;