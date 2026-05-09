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
    <>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg" />
      <button onClick={capture}>Take photo</button>
      {imageSrc && (<img src={imageSrc} />)}
    </>
  );
}

export default Scan
