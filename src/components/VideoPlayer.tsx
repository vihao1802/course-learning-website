"use client";
import React, { useEffect, useState } from "react";
// import ReactPlayer from "react-player";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  setPlayed: (second: number) => void;
  setDuration: (second: number) => void;
}

const VideoPlayer = ({ setPlayed, setDuration }: VideoPlayerProps) => {
  //video path
  let videosrc = "/videos/toeic.mp4";

  return (
    <div>
      <ReactPlayer
        width="100%"
        height="400px"
        url={videosrc}
        controls={true}
        onProgress={(progress) => {
          setPlayed(progress.playedSeconds);
        }}
        onDuration={(duration) => {
          setDuration(duration);
        }}
        // light is usefull incase of dark mode
        light={false}
        // picture in picture
        pip={true}
      />
      <source src={videosrc} type="video/mp4" />
    </div>
  );
};
export default VideoPlayer;
