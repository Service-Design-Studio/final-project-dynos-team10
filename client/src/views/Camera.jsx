import { useEffect, useMemo, useRef, useState } from "react";
import { createSearchParams, useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaArrowRight, FaRegCircle } from "react-icons/fa";
import { IoFlash, IoFlashOutline } from "react-icons/io5"; // in case got flash option
import { BsCardImage } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
import { updateCurrentComponentStatus } from "../store/workorder/workorderSlice";
import { 
    selectCurrentComponentName,
    addImageToComponent,
    selectCurrentComponent
} from "../store/workorder/workorderSlice";

import {
    ActionIcon,
    Grid,
    Space,
    ThemeIcon
} from "@mantine/core";

function Camera() {
    // const theme = useMantineTheme();

    const currentComponentName = useSelector(selectCurrentComponentName);
    const currentComponent = useSelector(selectCurrentComponent);
    const dispatch = useDispatch();

    const count = useMemo(() => {
        return currentComponent.images.length;
    }, [currentComponent]);

    const navigate = useNavigate();
    const videoElement = useRef(null);
    const photoRef = useRef(null);

    // current image capture
    const [imageCapture, setImageCapture] = useState();

    const openCamera = async () =>  {
        try {
            // .getUserMedia() method - display live video feed from camera 
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    // minAspectRatio: 1.333,
                    // minFrameRate: 30,
                    // width: 1920,
                    // heigth: 2000,
                    facingMode: 'environment'
                }
            });
            const videoTrack = stream.getVideoTracks()[0];
            videoElement.current.srcObject = stream;
            setImageCapture(new ImageCapture(videoTrack));

        } catch (e) {
            alert(`${e.name}`);
            console.error(e);
        }
    }  

    const takePhoto = async () => {
        console.log("take photo");
        console.log(count);

        if (count > -1 && !['green', 'red'].includes(currentComponent.status)) {
            dispatch(updateCurrentComponentStatus("yellow"))
        } 
        
        const imageBitmap = await imageCapture.grabFrame();
        let photo = photoRef.current;
        photo.width = imageBitmap.width;
        photo.height = imageBitmap.height;
        photo.getContext('2d').drawImage(imageBitmap, 0, 0, photo.width, photo.height);
        console.log({imageBitmap});
        const base64Image = photo.toDataURL();

        dispatch(addImageToComponent({
            componentName: currentComponentName,
            image: base64Image
        }));
    }

    useEffect(() => {
        if (videoElement.current) {
            // videoElement.current has been null before, causing errors
            openCamera();
        }
    }, [videoElement]);

    const [canTakePhoto, setCanTakePhoto] = useState(false);
    useEffect(() => {
        if (imageCapture) {
            setCanTakePhoto(true);
        }
    }, [imageCapture])


    const continueEdit = ['green', 'red'].includes(currentComponent.status);
    
    const checkContinueEdit = (editMode) => {
        console.log(continueEdit);
        if (continueEdit){
            navigate({
                pathname: "/status-report",
                search: createSearchParams({
                    editMode: continueEdit
                }).toString()
            });
        } else {
            navigate('/photo-review');
        }
    };

    return (
        <div style={{margin: 30}}>

            {/* top section */}
            <Space h="xl" />

            <Grid grow align="center">

                <Grid.Col span={1} align="center">
                    <ActionIcon color="dark" variant="transparent">
                        <FaArrowLeft 
                            onClick={() => navigate('/component-status')} 
                            className="back-btn" 
                            style={{fontSize: "2rem"}} />
                    </ActionIcon>
                </Grid.Col>
                    
                <Grid.Col span={6}></Grid.Col>

                <Grid.Col span={1} align="center">
                    <ActionIcon color="dark" variant="transparent">
                        {count > 0 ? 
                            <BsCardImage 
                                onClick={checkContinueEdit}
                                style={{fontSize: "2rem"}}
                                /> 
                            : null} 
                    </ActionIcon>
                </Grid.Col>

            </Grid>

            <Space h={35}/>

            {/* middle section -> video */}
            <Grid grow>
                {/* <Grid.Col span={1}></Grid.Col> */}
                    
                <Grid.Col span={10} align="center">
                    <video 
                        style={{width: "100%"}} 
                        className="camera" 
                        autoPlay 
                        ref={videoElement}>
                    </video>
                </Grid.Col>

                {/* <Grid.Col span={1}></Grid.Col> */}
            </Grid>

            <Space h={35}/>

            <div style={{display: "none"}} >
                <canvas ref={photoRef}></canvas>
            </div>

            {/* bottom section*/}
            <Grid grow align="center">

                <Grid.Col span={3} align="right">
                    {count > 0 ?
                        <ThemeIcon 
                            variant="outline" 
                            radius="md" 
                            size="lg" 
                            color="dark" 
                            className="counter">
                            <span>{count}</span>
                        </ThemeIcon> 
                        : null}
                </Grid.Col>
                    
                <Grid.Col span={3} align="center">
                    <ActionIcon 
                        disabled={!canTakePhoto} 
                        onClick={takePhoto} 
                        className="take-photo-btn" 
                        color="dark" 
                        size="3.5rem"
                        radius="xl" 
                        variant="outline"
                        >
                    </ActionIcon>
                </Grid.Col>

                <Grid.Col span={3} align="left">
                    <ActionIcon color="dark" variant="transparent">
                        {count > 0 ? 
                            <FaArrowRight 
                                onClick={checkContinueEdit}
                                className="to-photo-review-btn" 
                                style={{fontSize: "2rem"}}
                                /> 
                            : null} 
                    </ActionIcon>
                </Grid.Col>

            </Grid>

        </div>
    )
}

export default Camera;