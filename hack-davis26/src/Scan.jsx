import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'

async function sendImage(imageSrc) {
  return {text:"Here is text LOL"};
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

    return await response.json();
  } catch(error) {
    console.error("SendImage: ",error);
  }
  return null;
}

function Scan() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [json, setJSON] = useState(null);
  const capture = React.useCallback(
    () => {
      const img = webcamRef.current.getScreenshot()
      setImageSrc(img);
      setJSON(sendImage(img));
    },
    [webcamRef]
  );

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 px-6 py-8">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-xl border border-gray-300 shadow"
      />
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
  return <p> Yahoo </p>
}


export default Scan
