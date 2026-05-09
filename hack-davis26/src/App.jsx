import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import React from "react"
import Webcam from "react-webcam";

const WebcamComponent = () => {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null)
  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current.getScreenshot())
    },
    [webcamRef]
  );

  return (<>
            <Webcam 
              ref = {webcamRef}
              screenshotFormat="image/jpeg"/>
              <button onClick = {capture}>Take photo</button>
              {imageSrc && (<img src={imageSrc} />)}
              </>
              );
            };


function App() {

  return (
    <>
      {WebcamComponent()}

    </>
  )
}

export default App
