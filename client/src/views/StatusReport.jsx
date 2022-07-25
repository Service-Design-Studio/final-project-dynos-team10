import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

import { FaArrowLeft } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import { MdLibraryAdd } from "react-icons/md";
import { BsCameraFill, BsPencilSquare } from "react-icons/bs";
import PassIconSvg from '../assets/pass-icon.svg';
import FailIconSvg from '../assets/fail-icon.svg';
import SwipeableTextMobileStepper from '../components/PhotoCarousel';
import ReportFailReasons from "../components/ReportFailReasons";
import { cloneDeep } from "lodash";
import { deepCompare } from "../helpers/objectHelper";
import { buildComponentObjWithImages } from "../helpers/componentsHelper";
import './PhotoReview.css';
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
    ScrollArea,
    Modal,
    Center
  } from "@mantine/core";
import { useListState } from '@mantine/hooks';
import { $axios } from '../helpers/axiosHelper';
import { current } from "@reduxjs/toolkit";

let colourToStatus = {"red": "FAIL", "green": "PASS"};

function StatusReport() {

    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    const currentComponentName = useSelector(selectCurrentComponentName);
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);
    const currentComponent = useSelector(selectCurrentComponent);
    const workorderComponents = useSelector(selectWorkorderComponents);
    
    const [editReport, setEditReport] = useState(false); // view vs edit mode for report
    const [reasons, setReasons] = useListState(currentComponent.failingReasons); // failing reasons
    const [chosenStatus, setChosenStatus] = useState(currentComponent.status); // current status (locally)
    const [opened, setOpened] = useState(false); // modal if successful
    const [openedNoChanges, setOpenedNoChanges] = useState(false); // modal if no changes

    // if go the camera from report and navigate back to report -> stay in edit mode
    useEffect(() => {
        setEditReport(searchparams.get('editMode'));
    }, [searchparams]);
    

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
    
    const hasImages = useMemo(() => {
        return currentComponent.images.length > 0;
    }, [currentComponent]);

    const deleteActivePhoto = () => {
        if (currentComponent.images.length === 1 && !['green', 'red'].includes(currentComponent.status)){
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

    // save button disabled if no fail reasons
    const UploadButton = () => {
        if (chosenStatus === 'red' && reasons.length === 0) {
            return (
                <Button 
                    className="save-btn"
                    variant="outline" 
                    disabled
                    style={{
                        margin: "2rem", 
                        marginTop: "0.5rem", 
                        marginBottom: "0.5rem"}}>
                    Save
                </Button>)
        } else {
            return (
                <Button 
                    className="save-btn"
                    variant="outline" 
                    onClick={updateComponentRecord}
                    style={{
                        margin: "2rem", 
                        marginTop: "0.5rem", 
                        marginBottom: "0.5rem"}}>
                    Save
                </Button>)
        }
    };


    const updateImages = async(componentId, oldImages, updatedImages) => {
        // Note: images can only be added or deleted, they cannot be edited
        console.log({componentId, oldImages, updatedImages});
        const newImages = updatedImages.filter(el => el.id === null); 
        const deletedImages = oldImages.filter(old => {
            return !updatedImages.find(newEl => newEl.id === old.id);
        })
        console.log({newImages, deletedImages});

        // await these??

        // 1) find the new images to add
        await $axios.post('images/batch', {
            component_id: componentId,
            images: newImages.map(el => el.src)
        })

        // 2) find images that are missing from the old images and delete them
        const deleteQueryParams = new URLSearchParams({
            ids: deletedImages.map(el => el.id)
        })
        await $axios.delete(`images/batch?${deleteQueryParams.toString()}`);
    }

    // taken from PassFail.jsx

    const findWorkorderRecord = async() => {
        try {
            const { data: response } = await $axios.get(`workorders?workorder_number=${currentWorkorderNumber}`);
            console.log({response});
            return response.result.id;
        } catch(e) {
            console.error(e);
            console.log('cannot find current workorder');
            return null;
        }
    }

    const successfulUpload = (response) => {
        // open modal
        setOpened(true);
    }

    const updateComponentRecord = async() => {
        // get workorder id
        const workorderId = await findWorkorderRecord();
        if (!workorderId) {
            return;
        }

        // here we deal with EDITING/patch requests
        let response = await $axios.get(`components/${currentComponent.id}`);
        const dbComponent = response.data.result;
        response = await $axios.get(`components/${currentComponent.id}/images`);
        const dbImages = response.data.result;
        const dbComponentWithImages = buildComponentObjWithImages(dbComponent, dbImages);
        // Issue 1 (SOLVED): component status only updated after successful upload, so this compare will not detect status changes (yet)
        // Issue 2 (SOLVED): component status changes to yellow when using camera, if got use camera to add photos, then this will detect status change (to yellow), which is not submittable
        // to solve these 2 issues, we do a deep clone of the currentComponent object, and set the status to the current state.chosenStatus (from routing)
        const currentComponentChanges = cloneDeep(currentComponent);
        currentComponentChanges.status = chosenStatus; 
        currentComponentChanges.failingReasons = reasons;

        // Issue 3 (OVERLOOKED): figure out why "differences" is weird when we delete images, check the images array
        // IS THIS OKAY TO OVERLOOK? BECAUSE our updateImages array does not take the weird missing values from "differences",
        // but from the sources of truth that is "dbComponentWithImages" and "currentComponentChanges"
        // we merely use "differences" to detect changes?
        const differences = deepCompare(dbComponentWithImages, currentComponentChanges);
        console.log({differences, dbComponentWithImages, currentComponentChanges});

        if (Object.keys(differences).length === 0) {
            // no differences to be updated found, tell user?
            console.log('no differences/changes to be committed');
            setOpenedNoChanges(true);
            return;
        }

        if (differences.images) {
            // await this?
            updateImages(currentComponentChanges.id, dbComponentWithImages.images, currentComponentChanges.images);
        }

        const payload = {
            component_id: currentComponentChanges.id
        }
        if (differences.status) {
            payload.status = currentComponentChanges.status === 'green';
        }
        if (differences.failingReasons) {
            payload.failing_reasons = payload.status ? [] : currentComponentChanges.failingReasons;
        }
        console.log({payload});

        const finalUpdateResponse = await $axios.patch(`components/${currentComponentChanges.id}`, payload);
        console.log({finalUpdateResponse});

        successfulUpload(finalUpdateResponse);
    }

    return (
        
        <div style={{margin: 20}}>

            <Stack spacing="xs">
                {
                    !editReport ?
                    <h2 
                        style={{
                            textTransform: "capitalize", 
                            margin: "auto"}}> 
                        {currentComponentName}: {colourToStatus[chosenStatus]}
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

                {/* different displays depending on chosenStatus and editReport */}
                {
                    !editReport ?
                        null
                    :
                        <Button 
                            component="a" 
                            href="#" 
                            variant="light" 
                            onClick={() => {
                                if (chosenStatus==="green"){
                                    setChosenStatus("red");
                                } else if (chosenStatus==="red"){
                                    setChosenStatus("green");
                                }}}
                            style={{
                                margin: "2rem", 
                                marginTop: "0.5rem", 
                                marginBottom: "0.5rem"}}
                            leftIcon={<BsPencilSquare size={18}/>}
                            >
                            Change Status
                        </Button>
                    }

                {
                    (chosenStatus !== "green") && 
                    <ReportFailReasons 
                        editReport={editReport}
                        reasons={reasons}
                        setReasons={setReasons}
                        />
                }

                {
                    (chosenStatus === "green") && 
                    <img src={PassIconSvg} width={75} style={{margin:"auto"}}></img>
                }

                {
                    !editReport ? 
                        <Button 
                            variant="filled"
                            onClick={() => setEditReport(true)} 
                            style={{
                                margin: "2rem", 
                                marginTop: "0.5rem", 
                                marginBottom: "0.5rem"}}>
                            Edit
                        </Button>
                    :
                        <UploadButton/>
                }

            </Stack>

            <Modal
                opened={opened}
                onClose={() =>{ 
                    setOpened(false);
                    navigate('/component-status');
                }}
                >
                <Text  style={{margin: 20}}>Update Successful</Text>
            </Modal>

            <Modal
                opened={openedNoChanges}
                onClose={() =>{ 
                    setOpenedNoChanges(false);
                }}
                >
                <Text size="lg" align="center" style={{margin: 20}}>No changes detected!</Text>
                <Center><Button onClick={() => navigate('/component-status')}>Go Components List</Button></Center>
            </Modal>

        </div>
    )
}

export default StatusReport;