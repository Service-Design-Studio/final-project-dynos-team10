import { useEffect, useRef, useState } from "react";
import "./Camera.css"
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaArrowRight} from "react-icons/fa";
import { IoFlash, IoFlashOutline } from "react-icons/io5";
import { BsCardImage } from "react-icons/bs";

function Camera() {
    const navigate = useNavigate();
    const videoElement = useRef(null);

    // only display counter and right arrow after user takes the first photo
    const [counter, setHasCounter] = useState(false)
    // increase value of counter after each photo is taken
    const [currentCount, addCount] = useState(0)

    function increaseCount() {
        setHasCounter(true)
        addCount(prevCount => prevCount + 1)
    }

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

        } catch (e) {
            alert(`${e.name}`);
            console.error(e);
        }
    }

    useEffect(() => {
        openCamera();
    }, [videoElement]);

    
    return (
        // 3 flexbox container along cross/vertical axis (header, camera, bottom)
        // 3 flexbox item along main/hori axis (go back, empty or take photo button, other icons)
        <div class="flexbox-column">

            <div class="flexbox-top">
                <div class="flexbox-top"> <FaArrowLeft class="hover" onClick={() => navigate('/component-status')} style={{fontSize: "40px"}}/> </div>
                <div class="flexbox-top empty-space"></div>
                <div class="flexbox-top-right" >
                    <IoFlashOutline style={{fontSize: "40px", marginRight: "0.2em"}}/>
                    <IoFlash style={{fontSize: "40px", marginRight: "0.2em"}}/>
                    <BsCardImage  class="hover" onClick={() => navigate('/photo-review')} style={{fontSize: "40px"}}/>
                </div>
                    
            </div>
                
            <div class="flexbox-center">
                <video autoPlay ref={videoElement}></video>
            </div>

            <div class="flexbox-bottom">
                {/* make counter square w rounded edges */}
                <div> {counter ? <div class="counter"> <span>{currentCount}</span> </div> : null} </div>
                <div> <button onClick={()=>increaseCount()} class="takePhoto" ></button> </div>
                <div> {counter ? <FaArrowRight onClick={() => navigate('/photo-review')} class="hover" style={{fontSize: "40px"}}/> : null} </div>
            </div>

        </div>
        
        
    )
}


export default Camera;