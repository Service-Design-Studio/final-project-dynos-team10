import { useEffect, useRef } from "react";
import "./Camera.css"
import { useNavigate } from 'react-router-dom';

import { FaArrowLeft, FaTrashAlt} from "react-icons/fa";
import { AiOutlineSend } from "react-icons/ai";
import { MdLibraryAdd } from "react-icons/md";
import PassIconSvg from '../assets/pass-icon.svg';
import FailIconSvg from '../assets/fail-icon.svg';

import photo_array from './Camera';
import photoURI_array from './Camera';

import './PhotoReview.css';

function PhotoReview() {
    const navigate = useNavigate();
    const videoElement = useRef(null);

    const openCamera = async () =>  {
        try {
            // .getUserMedia() method - display live video feed from camera 
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    minAspectRatio: 1.333,
                    // minFrameRate: 30,
                    // width: 1920,
                    // heigth: 1080,
                    facingMode: 'environment'
                }
            });
            // const videoTrack = stream.getVideoTracks()[0];
            videoElement.current.srcObject = stream;

        } catch (e) {
            alert(`${e.name}`);
            console.error(e);
        }
    }

    useEffect(() => {
        openCamera();
    }, [videoElement]);


    const display_canva = () => {
        const dataURI = photoURI_array[0];
        // imgConverted.src = dataURI;
        console.log(dataURI);
        const photo = photo_array[0];
        console.log(photo);
    }

    
    return (
        // 3 flexbox container along cross/vertical axis (header, camera, bottom)
        // 3 flexbox item along main/hori axis (go back, empty or take photo button, other icons)
        <div className="flexbox-column">

            <div className="flexbox-top">
                <FaArrowLeft className="hover" onClick={() => navigate('/component-status')} style={{fontSize: "40px"}}/> 
                <div className="empty-space"></div>
                <MdLibraryAdd className="hover" onClick={() => navigate('/camera')} style={{fontSize: "40px", marginRight: '1rem'}}/>
                <FaTrashAlt style={{fontSize: "40px"}}/>
            </div>
                
            <div className="flexbox-center">
                <video autoPlay ref={videoElement}></video>
                {/* <img> src={photo_array[0]}</img>  */}
                <img src="" id="imgConverted"></img>
            </div>


            <h3 style={{textAlign: 'center'}}>Indicate Status to Proceed</h3>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button className="photo-review-status-btn">
                    <img src={FailIconSvg} width={65}></img>
                    <p>Fail</p>
                </button>
                <button className="photo-review-status-btn">
                    <img src={PassIconSvg} width={65}></img>
                    <p>Pass</p>
                </button>
            </div>
        </div>
    )
}


export default PhotoReview;