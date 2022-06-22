import { useEffect, useMemo, useRef, useState } from "react";
import "./Camera.css"
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

function Camera() {
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
                    // heigth: 1080,
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
        photo.getContext('2d').drawImage(imageBitmap, 0, 0);
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
    
    return (
        // 3 flexbox container along cross/vertical axis (header, camera, bottom)
        // 3 flexbox item along main/hori axis (go back, empty or take photo button, other icons)
        <div class="flexbox-column">

            <div class="flexbox-top">
                <div> <FaArrowLeft class="hover" onClick={() => navigate('/component-status')} style={{fontSize: "2rem"}}/> </div>
                <div class="empty-space"></div>
                <div class="flexbox-top-right" >
                    <IoFlashOutline style={{fontSize: "2rem", marginRight: "0.2em"}}/>
                    {/* will use if flash is implemented */}
                    {/* <IoFlash style={{fontSize: "2rem", marginRight: "0.2em"}}/> */}
                    <div> {count > 0 ? <BsCardImage  class="hover" onClick={() => navigate('/photo-review')} style={{fontSize: "2rem"}}/> : <BsCardImage style={{fontSize: "2rem", color: "transparent"}}/>  } </div>
                </div>
            </div>
                
            <div class="flexbox-center">
                <video autoPlay ref={videoElement}></video>
            </div>

            
            <div class='wrapper'>
                <div class="centered-vertically"> {count > 0 ? <div class="counter"> <span>{count}</span> </div> : null} </div>
                <button onClick={takePhoto} class="take-photo-btn ignore-global" ></button> 
                <div class="centered-vertically"> {count > 0 ? <FaArrowRight onClick={() => navigate('/photo-review')} class="hover to-photo-review-btn" style={{fontSize: "2rem"}}/> : null} </div>   
            </div> 

            <div style={{display: "none"}} >
                <canvas ref={photoRef}></canvas>
            </div>

        </div>
    )
}


export default Camera;