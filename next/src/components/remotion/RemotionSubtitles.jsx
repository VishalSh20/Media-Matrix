import React, { useMemo } from 'react';

const RemotionSubtitles = ({
  transcript,
  currentFrame,
  fontSize = 24,
  fontColor = "#000000",
  textShadow = false,
  fps = 30
}) => {
  const currentTimeMs = (currentFrame / fps) * 1000;
  const currentText = useMemo(() => {
    if (!transcript || transcript.length === 0) return "";
    const visibleWords = transcript.filter(
      item => currentTimeMs >= item.start && currentTimeMs <= item.end
    );

    // Sort by start time to maintain proper word order
    const sortedWords = visibleWords.sort((a, b) => a.start - b.start);
    
    // Return the combined text
    return sortedWords.map(item => item.text).join(" ");
  }, [transcript, currentTimeMs]);

  // Style configuration
  const subtitleStyle = {
    fontSize: `${fontSize}px`,
    color: fontColor,
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '0.5em 1em',
    width: '100%',
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    textShadow: textShadow 
      ? '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)'
      : 'none',
    // Add a subtle background to improve readability
    // backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '4px',
    maxWidth: '90%',
    margin: '0 auto',
    lineHeight: 1.4,
    fontWeight: 500,
    // Ensure text is always on top
    zIndex: 1000,
    // Add animation for smooth text changes
    transition: 'opacity 0.2s ease-in-out',
    opacity: currentText ? 1 : 0,
    // Ensure proper text wrapping
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  };

  // Debug information (optional, remove in production)
  const debugInfo = {
    frame: currentFrame,
    timeMs: Math.round(currentTimeMs),
    wordsCount: transcript?.length || 0
  };

  // console.log('Subtitle Debug:', debugInfo);

  return (
    <div style={subtitleStyle}>
      {currentText}
    </div>
  );
};

export default RemotionSubtitles;