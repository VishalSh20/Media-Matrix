import React from "react";
import { Sequence, AbsoluteFill, Img, Audio,useCurrentFrame } from "remotion";
import RemotionSubtitles from "./RemotionSubtitles";

function RemotionVideo({ images, audioUrl,transcript,totalDuration }) {
  const fps = 30;
  const totalFrames = Math.ceil((totalDuration*fps)/1000);
  

  const currentFrame = useCurrentFrame();
  return (
    <AbsoluteFill className="bg-black">
      {/* Image Sequence */}
      {images.map((image, index) => (
        <Sequence
          key={index}
          from={Math.ceil((image.startTime / 1000) * fps)}
          durationInFrames={Math.max(Math.ceil((image.duration / 1000) * fps),10)}
        >
          <Img
            src={image.objectUrl}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </Sequence>
      ))}
      {/* Subtitles */}
      <RemotionSubtitles
        transcript={transcript}
        currentFrame={currentFrame}
        fontSize={24}
        fontColor="#000000"
        textShadow={false}
        fps={30}
      />

      {/* Background Audio */}
      {audioUrl && <Audio src={audioUrl} />}
    </AbsoluteFill>
  );
}

export default RemotionVideo;
