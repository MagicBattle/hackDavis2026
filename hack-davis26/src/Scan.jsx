import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'

function Scan() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current.getScreenshot());
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
