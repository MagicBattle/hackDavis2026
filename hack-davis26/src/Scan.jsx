import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'




async function sendImage(imageSrc,setJSON) {
  try {
    const response = await fetch("http://localhost:8000/save-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageSrc,
      }),
    });

    const json =  await response.json();
    setJSON(json);
  } catch(error) {
    console.error("SendImage: ",error);
    setJSON(null);
  }
}

async function checkpermission() {
  return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    });
    
    return true;
  }catch(err) {
    return false;
  }
}


function Camera(webcamRef) {
 <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-xl border border-gray-300 shadow"
      /> 
}
function Scan() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [json, setJSON] = useState(null);
  const [allowed, setAllowed] = useState(true);

  const capture = React.useCallback(
    () => {
        const img = webcamRef.current.getScreenshot()
        setImageSrc(img);
        sendImage(img,setJSON);

    },
    [webcamRef]
  );

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 px-6 py-8">
      {allowed ? <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-xl border border-gray-300 shadow"
        onUserMedia = {() => setAllowed(true) }
        onUserMediaError = {() => setAllowed(false)}
      />: <p> Please turn on webcam permissions and refresh the page</p>
    }
      <button
        onClick={capture}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
      >
        Take photo
      </button>
      {imageSrc && <img src={imageSrc} className="rounded-xl border border-gray-200 shadow" />}
      {json && FormatResponse(json)}
    </div>
  );
}

// Json might be null
function FormatResponse(json) {
  console.log(json);
}


export default Scan
