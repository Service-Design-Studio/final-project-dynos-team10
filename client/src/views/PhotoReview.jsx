import { useMemo, useState } from "react";
import "./Camera.css"
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaTrashAlt} from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { MdLibraryAdd } from "react-icons/md";
import PassIconSvg from '../assets/pass-icon.svg';
import FailIconSvg from '../assets/fail-icon.svg';
import SwipeableTextMobileStepper from '../components/PhotoCarousel';

import './PhotoReview.css';
import { useDispatch, useSelector } from "react-redux";
import { removeComponentImageByIndex, selectCurrentComponent, selectCurrentComponentName, selectWorkorderNumber } from "../store/workorder/workorderSlice";

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
        // 3 flexbox container along cross/vertical axis (header, camera, bottom)
        // 3 flexbox item along main/hori axis (go back, empty or take photo button, other icons)
        <div className="flexbox-column">

            <div className="flexbox-top">
                <FaArrowLeft className="hover" onClick={() => navigate('/component-status')} style={{fontSize: "2rem"}}/> 
                <div className="empty-space"></div>
                <MdLibraryAdd className="hover" onClick={() => navigate('/camera')} style={{fontSize: "2rem", marginRight: '1rem'}}/>
                <FaTrashAlt className="photo-review-delete-btn" style={{fontSize: "2rem"}} onClick={deleteActivePhoto}/>
            </div>
                
            <div className="flexbox-center">
                {
                    !hasImages
                    ?   <button
                            className="photo-review-camera-btn--secondary"
                            style={{
                                textTransform: 'capitalize'
                            }}
                            onClick={() => navigate('/camera')}
                        >
                        go back to camera
                    </button>
                    : <SwipeableTextMobileStepper
                        activeStep={activeStep}
                        handleNext={handleNext}
                        handleBack={handleBack}
                        handleStepChange={handleStepChange}
                        key={carouselKey}
                    />
                }
            </div>

            {
                hasImages &&
                <div style={{textAlign: 'center'}}>
                    <h3>Indicate Status to Proceed</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button className="photo-review-status-btn photo-review-status-btn--fail" onClick={() => setChosenStatus('fail')}>
                            <img src={FailIconSvg} width={65}></img>
                            <p>Fail</p>
                        </button>
                        <button className="photo-review-status-btn photo-review-status-btn--pass" onClick={() => setChosenStatus('pass')}>
                            <img src={PassIconSvg} width={65}></img>
                            <p>Pass</p>
                        </button>
                    </div>
                    {
                        chosenStatus &&
                        (
                            <>
                                <h4>You have chosen: {chosenStatus.toUpperCase()}</h4>
                                <button 
                                    onClick={postComponentPhotos}
                                    style={{
                                        margin: 0,
                                        padding: '10px 0',
                                        height: 'auto',
                                        backgroundColor: '#4285F4',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Proceed
                                </button>
                            </>
                        )
                    }
                </div>
            }
        </div>
    )
}


export default PhotoReview;