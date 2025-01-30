import React from "react";
import { Sequence, AbsoluteFill, Img, Audio,useCurrentFrame } from "remotion";
import RemotionSubtitles from "./RemotionSubtitles";

function RemotionVideo({ images, audioUrl,subtitleStyle,transcript,totalDuration }) {
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
            src={image.objectUrl || image.url}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </Sequence>
      ))}
      {/* Subtitles */}
      <RemotionSubtitles
        transcript={transcript}
        currentFrame={currentFrame}
        fontSize={subtitleStyle.fontSize || 24}
        fontColor={subtitleStyle.fontColor || "#000000"}
        fontFamily={subtitleStyle.fontFamily || "Arial"}
        textAlign={subtitleStyle.textAlign || "center"}
        bottom={subtitleStyle.bottom || 10}
        left={subtitleStyle.left || 50}
        textShadow={subtitleStyle.textShadow || false}
        fps={30}
      />

      {/* Background Audio */}
      {audioUrl && <Audio src={audioUrl} />}
    </AbsoluteFill>
  );
}

export default RemotionVideo;
