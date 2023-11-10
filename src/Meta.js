import React from "react";
import "./App.css";
const Meta = ({ metadata }) => {
  const { Name, Size, Type, Duration, LastModified } = metadata;
  //   console.log(metadata);
  return (
    <div className="video-metadata">
      <p>Name: {Name}</p>
      <p>Size: {Size}</p>
      <p>Type: {Type}</p>
      <p>Duration: {Duration}</p>
      <p>Last Modified: {LastModified}</p>
    </div>
  );
};

export default Meta;
