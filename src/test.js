import React, { useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
const Test = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleFileChange = (event) => {
    console.log(event.target.files[0]?.mv);
    const file = event.target.files[0];
    setVideoFile(file);
  };

  const convertToAudio = async () => {
    if (!videoFile) {
      alert("Please select a video file first.");
      return;
    }
    console.log(videoFile);
    const obj = {
      files: videoFile,
    };
    const formData = new FormData();
    formData.append("mp4", videoFile);
    const response = await fetch("http://localhost:5500/mp4tomp3", {
      method: "POST",
      body: formData,
    });
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    const audioElement = URL.createObjectURL(blob);
    console.log(audioElement);
    console.log(videoFile);
    setAudioBlob(audioElement);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={convertToAudio}>Convert to Audio</button>

      {audioBlob && (
        <div>
          <ReactPlayer url={audioBlob} controls width="100%" height="50px" />
        </div>
      )}
    </div>
  );
};

export default Test;

// import React, { useState } from "react";

// const Test = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [metaData, setMetaData] = useState(null);
//   const [audio, setAudio] = useState(null);
//   const [url, setUrl] = useState(null);

//   const handleChange = async (event) => {
//     const file = event.target.files[0];
//     if (file.type === "video/mp4") {
//       setVideoFile(file);
//       setUrl(URL.createObjectURL(file));
//       // audioConverter(url, "./output.mp3", {
//       //   mp3Only: true,
//       //   progressBar: true,
//       // }).then(function () {
//       //   console.log("Done!");
//       // });
//     } else {
//       alert("Invalid file type. Please select an MP4 video file.");
//     }
//   };

//   return (
//     <>
//       <div>
//         <input
//           type="file"
//           accept="video/mp4"
//           required
//           onChange={handleChange}
//         />
//       </div>

//       <div>
//         <audio src="./output.mp3"></audio>
//       </div>
//     </>
//   );
// };

// export default Test;
