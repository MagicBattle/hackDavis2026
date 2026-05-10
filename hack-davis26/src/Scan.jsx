import { useState } from 'react'
import React from 'react'
import Webcam from 'react-webcam'
import Header from './Header'
import Footer from './Footer'
import {Ban} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL;

async function sendImage(imageSrc, setJSON) {
  try {
    const response = await fetch(`${API_URL}/save-image`, {
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
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('scan_history')) || {};
    } catch { return {}; }
  });

  const saveHistory = (updated) => {
    setHistory(updated);
    localStorage.setItem('scan_history', JSON.stringify(updated));
  };

  const capture = React.useCallback(async () => {
    setDisabled(true);
    const img = webcamRef.current.getScreenshot();
    setImageSrc(img);
    await sendImage(img, (result) => {
      setJSON(result);
      if (result && Object.keys(result).length > 0) {
        const grade = result.overall_grade?.replace(/['"]/g, "").trim();
        if (grade) {
          const updated = { ...history };
          if (!updated[grade]) updated[grade] = [];
          updated[grade] = [...updated[grade], result];
          const total = Object.values(updated).reduce((s, v) => s + v.length, 0);
          if (total > 15) {
            const largest = Object.keys(updated).reduce((a, b) => updated[a].length > updated[b].length ? a : b);
            updated[largest] = updated[largest].slice(1);
            if (!updated[largest].length) delete updated[largest];
          }
          saveHistory(updated);
        }
      }
    });
    setDisabled(false);
  }, [webcamRef, history]);

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

          {Object.keys(history).length > 0 && (
            <div className="w-full max-w-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-indigo-900">Scan History</h2>
                <button
                  onClick={() => {
                    localStorage.removeItem('scan_history');
                    setHistory({});
                  }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Clear
                </button>
              </div>
              {["A", "B", "C", "D", "F"].map(grade => history[grade] && (
                <div key={grade} className="flex flex-col gap-2">
                  <span className={`font-black text-lg ${gradeColor[grade]}`}>{grade}</span>
                  {history[grade].map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3 border border-purple-200">
                      <span className="text-slate-700 font-medium">{item.product_name}</span>
                      <span className={`font-black text-xl ${gradeColor[grade]}`}>{grade}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
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
        {json && Object.keys(json).length === 0
          ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <span><Ban size={50} className="text-purple-500"/></span>
              <h2 className="text-2xl font-bold text-slate-800">No food label detected</h2>
              <p className="text-slate-500 max-w-sm">Make sure the label is clearly visible and try again.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <img src={imageSrc} className="rounded-xl border border-purple-200 shadow-md w-64" />
              {!json
                ? <p className="text-slate-500 text-lg">Analyzing...</p>
                : <FormatResponse json={json} />
              }
            </div>
          )
        }
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
