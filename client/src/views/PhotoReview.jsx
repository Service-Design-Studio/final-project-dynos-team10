import { useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaTrashAlt} from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import PassIconSvg from '../assets/pass-icon.svg';
import FailIconSvg from '../assets/fail-icon.svg';
import SwipeableTextMobileStepper from '../components/PhotoCarousel';

import './PhotoReview.css';
import { useDispatch, useSelector } from "react-redux";
import { removeComponentImageByIndex, selectCurrentComponent, selectCurrentComponentName, selectWorkorderNumber } from "../store/workorder/workorderSlice";

import {
    Container,
    ActionIcon,
    Grid,
    Space,
    Button
  } from "@mantine/core";

import { $axios } from '../helpers/axiosHelper';

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
    const hasImages = useMemo(() => {
        return currentComponent.images.length > 0;
    }, [currentComponent]);

    const deleteActivePhoto = () => {
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
    const postComponentPhotos = async() => {
        // get workorder id
        let workorderId;
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            workorderId = response.data.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
        }

        const payload = {
            workorder_id: workorderId,
            component_type: currentComponentName
        }
        if (chosenStatus === 'pass') {
            // only pass this param if pass
            payload.status = true;
        }

        let response;
        try {
            response = await $axios.post('components', payload);
            if (!response.data.success) {
                return;
            }
            const { id: component_id } = response.data.data;
            response = await $axios.post('images/batch-create', {
                component_id,
                images: currentComponent.images
            })
            console.log({response});
        } catch (e) {
            console.error(e);
        }
    }

    return (
        
        <div style={{margin: 30}}>

            {/* top section */}
            <Space h="xl" />

            <Grid grow align="center">

                <Grid.Col span={3} align="center" >
                    <ActionIcon color="dark" variant="transparent">
                        <FaArrowLeft onClick={() => navigate('/component-status')} className="back-btn" style={{fontSize: "2rem"}} />
                    </ActionIcon>
                </Grid.Col>
                    
                <Grid.Col span={4}></Grid.Col>

                <Grid.Col span={2} align="right">
                    <ActionIcon color="dark" variant="transparent">
                        <MdLibraryAdd onClick={() => navigate('/camera')} style={{fontSize: "2rem"}} />
                    </ActionIcon>
                </Grid.Col>

                <Grid.Col span={2} align="center">
                    <ActionIcon color="dark" variant="transparent">
                        <FaTrashAlt onClick={deleteActivePhoto} className="photo-review-delete-btn" style={{fontSize: "2rem"}} />
                    </ActionIcon>
                </Grid.Col>

            </Grid>
            
            <Space h="xl" />

            {/* middle section -> carousel */}
            <Container px="xs">
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
                    <h3>Indicate Status to Proceed</h3>

                    <Grid grow align="center">

                        <Grid.Col span={3} align="right" variant="subtle">
                            <button 
                                className="photo-review-status-btn photo-review-status-btn--fail" 
                                onClick={() => setChosenStatus('fail')}
                                style={{backgroundColor: "transparent"}}>
                                <img src={FailIconSvg} width={55}></img>
                                <p>Fail</p>
                            </button>
                        </Grid.Col>

                        <Grid.Col span={1} align="center"></Grid.Col>
                            
                        <Grid.Col span={3} align="left">
                            <button 
                                className="photo-review-status-btn photo-review-status-btn--pass" 
                                onClick={() => setChosenStatus('pass')}
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
                                <h4>You have chosen: {chosenStatus.toUpperCase()}</h4>
                                <Button 
                                    onClick={postComponentPhotos}
                                    colour="blue" 
                                    variant="outline" 
                                    size="md"
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