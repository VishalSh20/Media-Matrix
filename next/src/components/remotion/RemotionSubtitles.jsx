import React, { useMemo } from 'react';
import { 
 fontClasses,fontStyles
} from "../../font.config.js"; // Adjust path as needed

// Mapping of font names to their corresponding classes
const FONT_MAP = {
  'Inter': fontClasses.inter,
  'Roboto': fontClasses.roboto,
  'Open Sans': fontClasses.openSans,
  'Lato': fontClasses.lato,
  'Montserrat': fontClasses.montserrat,
  'Poppins': fontClasses.poppins,
  'Nunito': fontClasses.nunito,
  'Source Sans 3': fontClasses.sourceSans,
  'Merriweather': fontClasses.merriweather,
  'Noto Sans': fontClasses.notoSans,
  'Quicksand': fontClasses.quicksand,
  'Work Sans': fontClasses.workSans,
  'Raleway': fontClasses.raleway,
  'Ubuntu': fontClasses.ubuntu,
  'Fira Sans': fontClasses.firaSans,  // Fallback for system fonts
  'Arial': 'font-sans',
  'Helvetica': 'font-sans',
  'Times New Roman': 'font-serif',
  'Courier New': 'font-mono',
  // Add other system fonts as needed
};

const RemotionSubtitles = ({
  transcript,
  currentFrame,
  fontSize = 24,
  fontColor = "#000000",
  textShadow = false,
  fontFamily = "Arial",
  textAlign = "center",
  bottom = 10,
  left = 50,
  fps = 30
}) => {
  const currentTimeMs = (currentFrame / fps) * 1000;
  const currentText = useMemo(() => {
    if (!transcript || transcript.length === 0) return "";
    const visibleWords = transcript.filter(
      item => currentTimeMs >= item.start && currentTimeMs <= item.end
    );

    const sortedWords = visibleWords.sort((a, b) => a.start - b.start);
    
    return sortedWords.map(item => item.text).join(' ');
  }, [transcript, currentTimeMs]);

  // Get the appropriate font class, with a fallback
  const fontClass = FONT_MAP[fontFamily] || FONT_MAP['Arial'];

  const subtitleStyle = {
    fontSize: `${fontSize}px`,
    color: fontColor,
    textAlign: `${textAlign}`,
    fontFamily: fontFamily, // Keep original fontFamily for CSS
    padding: '0.5em 1em',
    width: '100%',
    position: 'absolute',
    bottom: `${bottom}%`,
    left: `${left}%`,
    transform: 'translateX(-50%)',
    textShadow: textShadow 
      ? '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)'
      : 'none',
    borderRadius: '4px',
    maxWidth: '90%',
    margin: '0 auto',
    lineHeight: 1.4,
    fontWeight: 500,
    zIndex: 1000,
    transition: 'opacity 0.2s ease-in-out',
    opacity: currentText ? 1 : 0,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap'
  };

  return (
    <div 
      className={fontClass} 
      style={subtitleStyle}
    >
      {currentText}
    </div>
  );
};

export default RemotionSubtitles;