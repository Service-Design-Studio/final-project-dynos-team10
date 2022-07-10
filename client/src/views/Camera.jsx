import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaArrowRight} from "react-icons/fa";
import { IoFlash, IoFlashOutline } from "react-icons/io5";
import { BsCardImage } from "react-icons/bs";

import { useSelector, useDispatch } from "react-redux";
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
        openCamera();
    }, [videoElement]);

    const [canTakePhoto, setCanTakePhoto] = useState(false);
    useEffect(() => {
        if (imageCapture) {
            setCanTakePhoto(true);
        }
    }, [imageCapture])
    
    return (
        <div style={{margin: 30}}>

            {/* top section */}
            <Space h="xl" />

            <Grid grow align="center">

                <Grid.Col span={3} align="center" >
                    <ActionIcon color="dark" variant="transparent">
                        <FaArrowLeft onClick={() => navigate('/component-status')} style={{fontSize: "2rem"}} />
                    </ActionIcon>
                </Grid.Col>
                    
                <Grid.Col span={6}></Grid.Col>

                <Grid.Col span={3} align="center">
                    <ActionIcon color="dark" variant="transparent">
                        {count > 0 ? <BsCardImage onClick={() => navigate('/photo-review')} style={{fontSize: "2rem"}}/> : null} 
                    </ActionIcon>
                </Grid.Col>

            </Grid>

            <Space h={60}/>

            {/* middle section -> video */}
            <Grid grow>

                <Grid.Col span={1}></Grid.Col>
                    
                <Grid.Col span={10} align="center">
                    <video style={{width: "100%"}} autoPlay ref={videoElement}></video>
                </Grid.Col>

                <Grid.Col span={1}></Grid.Col>
                
            </Grid>

            <Space h={60}/>

            <div style={{display: "none"}} >
                <canvas ref={photoRef}></canvas>
            </div>

            {/* bottom section*/}
            <Grid grow align="center">

                <Grid.Col span={3} align="right">
                    {count > 0 ?
                        <ThemeIcon 
                            variant="outline" radius="md" size="lg" color="dark">
                            <span>{count}</span>
                        </ThemeIcon> : null}
                </Grid.Col>
                    
                <Grid.Col span={3} align="center">
                    <ActionIcon disabled={!canTakePhoto} onClick={takePhoto} color="dark" size="xl" radius="xl" variant="outline"></ActionIcon>
                </Grid.Col>

                <Grid.Col span={3} align="left">
                    <ActionIcon color="dark" variant="transparent">
                        {count > 0 ? <FaArrowRight onClick={() => navigate('/photo-review')} style={{fontSize: "2rem"}}/> : null} 
                    </ActionIcon>
                </Grid.Col>

            </Grid>

        </div>
    )
}

export default Camera;