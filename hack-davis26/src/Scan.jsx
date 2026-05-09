import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'

async function sendImage(imageSrc) {
  const response = await fetch("http://localhost:8000/save-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageSrc,
    }),
  });

  console.log("sent image");
  console.log(imageSrc);
}

function Scan() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current.getScreenshot());
      sendImage(imageSrc);
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
    </div>
  );
}

export default Scan
