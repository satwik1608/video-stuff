import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import Meta from "./Meta";
import { getMetadata, getThumbnails } from "video-metadata-thumbnails";
import WaveSurfer from "wavesurfer.js";

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
function formatDate(date) {
  const d = new Date(date);
  const dt = d.toUTCString();

  const str = dt.substr(5, 11);
  return str;
}
export default function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [audio, setAudio] = useState(null);
  const [url, setUrl] = useState(null);
  const handleChange = async (event) => {
    const file = event.target.files[0];
    const data = await getMetadata(file);
    const obj = {
      Name: file.name,
      Size: round(file.size / (1024 * 1024), 2) + " mb",
      Type: file.type,
      Duration: round(data.duration / 60, 2) + " min",
      LastModified: formatDate(file.lastModified),
    };
    setMetaData(obj);
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(
      await file.arrayBuffer()
    );
    setAudio(audioBuffer);
    console.log(audioBuffer);
    if (file.type === "video/mp4") {
      setVideoFile(file);
      setUrl(URL.createObjectURL(file));
    } else {
      alert("Invalid file type. Please select an MP4 video file.");
    }
  };
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const videoRef = useRef(null);
  const [isPause, setPause] = useState(true);
  const [controls, setControls] = useState(false);

  function handleClick(e) {
    console.log("wow");
    let canvas = canvasRef.current;
    let video = videoRef.current;
    var rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    console.log(centerX, centerY);
    console.log(x, y);
    if (
      x >= centerX - 50 &&
      x <= centerX + 50 &&
      y >= centerY - 25 &&
      y <= centerY + 25
    ) {
      if (isPause) {
        video.play();
        setPause(false);
      } else {
        video.pause();
        setPause(true);
      }
      console.log("Button clicked", isPause);
    }
  }
  useEffect(() => {
    let canvas = canvasRef.current;
    let canvas2 = canvas2Ref.current;
    let video = videoRef.current;
    // console.log(video);
    if (video) {
      const fps = 60;
      const width = 500;
      const height = 300;
      let canvasInterval = null;
      function drawImage() {
        canvas
          .getContext("2d", { alpha: false })
          .drawImage(video, 0, 0, width, height);
      }
      canvasInterval = window.setInterval(() => {
        drawImage(video);
      }, 1000 / fps);
      video.onpause = function () {
        clearInterval(canvasInterval);
      };
      video.onended = function () {
        clearInterval(canvasInterval);
      };
      video.onplay = function () {
        clearInterval(canvasInterval);
        canvasInterval = window.setInterval(() => {
          drawImage(video);
        }, 1000 / fps);
      };
      const ctx = canvas2.getContext("2d");
      ctx.fillStyle = "white";

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.fillRect(centerX - 50, centerY - 25, 100, 50);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px sans-serif";

      ctx.fillText(
        isPause ? "Play" : "Pause",
        canvas2.width / 2,
        canvas2.height / 2
      );
    }
  });
  return (
    <>
      <div className="video-container">
        <input
          type="file"
          accept="video/mp4"
          required
          onChange={handleChange}
        />
      </div>
      <div className="container">
        <span className="container-box">
          <canvas
            id="canvas1"
            width="500"
            height="300"
            ref={canvasRef}
            onMouseEnter={() => setControls(true)}
            onMouseLeave={() => setControls(false)}
          />
          <canvas
            width="500"
            height="300"
            id="canvas2"
            ref={canvas2Ref}
            onMouseEnter={() => setControls(true)}
            onMouseLeave={() => setControls(false)}
            className={controls === true ? "le" : ""}
            onClick={(e) => handleClick(e)}
          />
        </span>
        <div>{metaData && <Meta metadata={metaData} />}</div>
      </div>

      {videoFile && (
        <video
          src={url}
          ref={videoRef}
          preload="auto"
          playsInline={true}
          webkit-playsinline="true"
          controls={true}
          hidden={true}
        />
      )}
      {audio && <audio src={audio} controls={true} />}
    </>
  );
}
