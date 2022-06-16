import { useEffect, useRef } from "react";

function Camera() {
    const videoElement = useRef(null);

    const openCamera = async () =>  {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    // minAspectRatio: 1.333,
                    // minFrameRate: 30,
                    // width: 1280,
                    // heigth: 720,
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
    }, []);

    return (
        <div className="camera">
            <video autoPlay ref={videoElement}></video>
        </div>
    )
}

export default Camera;