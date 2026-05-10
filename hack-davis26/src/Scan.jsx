import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'
import Header from './Header'
import Footer from './Footer'

async function sendImage(imageSrc, setJSON) {
  try {
    const response = await fetch("http://localhost:8000/save-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageSrc }),
    });
    const json = await response.json();
    setJSON(json);
  } catch (error) {
    console.error("SendImage: ", error);
    setJSON(null);
  }
}

const gradeColor = {
  A: "text-green-600",
  B: "text-lime-600",
  C: "text-yellow-500",
  D: "text-orange-500",
  F: "text-red-600",
};

const severityStyle = {
  high: "text-red-700 border-red-300 bg-red-50",
  medium: "text-orange-600 border-orange-300 bg-orange-50",
  low: "text-yellow-600 border-yellow-300 bg-yellow-50",
};

function FormatResponse({ json }) {
  if (!json) return null;

  const grade = json.overall_grade?.replace(/['"]/g, "");
  const productName = json.product_name?.replace(/['"]/g, "");
  const summary = json.summary?.replace(/['"]/g, "");
  const healthySwap = json.healthy_swap?.replace(/['"]/g, "");

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{productName}</h2>
        <span className={`text-5xl font-black ${gradeColor[grade] ?? "text-gray-600"}`}>
          {grade}
        </span>
      </div>

      <p className="text-slate-600">{summary}</p>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-slate-700">Flagged Ingredients</h3>
        {json.flagged_ingredients?.map((item, i) => {
          const sev = item.severity?.replace(/['"]/g, "");
          const name = item.name?.replace(/['"]/g, "");
          const reason = item.reason?.replace(/['"]/g, "");
          return (
            <div key={i} className={`border rounded-lg px-4 py-2 text-sm ${severityStyle[sev] ?? "text-gray-600 border-gray-300"}`}>
              <span className="font-bold">{name}</span> — {reason}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-slate-500 italic">
        Healthier swap: {healthySwap}
      </p>
    </div>
  );
}

function Scan() {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [json, setJSON] = useState(null);
  const [allowed, setAllowed] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const capture = React.useCallback(async () => {
    setDisabled(true);
    const img = webcamRef.current.getScreenshot();
    setImageSrc(img);
    await sendImage(img, setJSON);
    setDisabled(false);
  }, [webcamRef]);

  const reset = () => {
    setImageSrc(null);
    setJSON(null);
  };

  // Camera view
  if (!imageSrc) {
    return (
      <div className="min-h-screen flex flex-col bg-purple-100">
        <Header />
        <main className="flex flex-col items-center gap-6 px-6 py-10 grow">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-black text-indigo-900">Scan a Label</h1>
            <p className="text-slate-500 max-w-sm">Point your camera at a food label and tap Take Photo to get an ingredient analysis.</p>
          </div>
          {allowed
            ? <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-xl border border-purple-200 shadow-md"
                onUserMedia={() => setAllowed(true)}
                onUserMediaError={() => setAllowed(false)}
              />
            : <p className="text-red-500">Please turn on webcam permissions and refresh the page</p>
          }
          <button
            onClick={capture}
            disabled={disabled}
            className={!disabled
              ? "bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
              : "bg-indigo-400 text-white px-8 py-3 rounded-xl font-semibold"}
          >
            {!disabled ? "Take Photo" : "Processing..."}
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Results view
  return (
    <div className="min-h-screen flex flex-col bg-purple-100">
      <Header />
      <main className="flex flex-col gap-8 px-6 py-8 grow">
        <div className="flex flex-row gap-6 items-start">
          <img src={imageSrc} className="rounded-xl border border-purple-200 shadow-md w-64 shrink-0" />
          {!json
            ? <p className="text-slate-500 text-lg">Analyzing...</p>
            : <FormatResponse json={json} />
          }
        </div>
        <button
          onClick={reset}
          className="self-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          Scan Another Item
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default Scan
