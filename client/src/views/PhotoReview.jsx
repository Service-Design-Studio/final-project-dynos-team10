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
import SwipeableTextMobileStepper from '../components/PhotoCarousel';

import './PhotoReview.css';

function PhotoReview() {
    const navigate = useNavigate();

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
                {/* <video autoPlay ref={videoElement}></video> */}
                <SwipeableTextMobileStepper/>
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