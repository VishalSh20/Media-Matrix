import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Player } from "@remotion/player";
import RemotionVideo from "@/components/remotion/RemotionVideo";
import { aspectRatioToHeight, aspectRatioToWidth } from "@/constants";

function StoryPlayer({ aspectRatio, storyData, subtitleStyle }) {
  const [state, setState] = useState({
    isLoading: true,
    loadingProgress: 0,
    error: null,
    preloadedImages: [],
    audioUrl: ""
  });

  // Calculate responsive dimensions
  const dimensions = useMemo(() => {
    const baseWidth = aspectRatioToWidth[aspectRatio];
    const baseHeight = aspectRatioToHeight[aspectRatio];
    const ratio = baseHeight / baseWidth;
    
    // Get container width (max 800px for portrait, 1024px for landscape)
    const maxWidth = aspectRatio === 'PORTRAIT' ? 400 : 512;
    const containerWidth = Math.min(window.innerWidth * 0.8, maxWidth);
    const containerHeight = containerWidth * ratio;

    return {
      width: containerWidth,
      height: containerHeight,
      durationInFrames: Math.ceil((storyData?.duration || 0) / 1000 * 30)
    };
  }, [aspectRatio, storyData?.duration]);

  // Memoize images array to prevent unnecessary recreations
  const images = useMemo(() => {
    if (!storyData?.scenes) return [];
    return storyData.scenes
      .sort((a, b) => a.sceneOrder - b.sceneOrder)
      .flatMap(scene => 
        scene.images.sort((a, b) => a.startTime - b.startTime)
      );
  }, [storyData?.scenes]);

  // Preload single image
  const preloadImage = useCallback(async (image) => {
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error(`Failed to load image: ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      return { ...image, objectUrl };
    } catch (error) {
      console.error(`Error loading image ${image.url}:`, error);
      return { ...image, error: true };
    }
  }, []);

  // Load assets in sequence to prevent overwhelming the browser
  const loadAssetsSequentially = useCallback(async () => {
    try {
      const totalImages = images.length;
      const loadedImages = [];
      
      // Load images sequentially
      for (let i = 0; i < images.length; i++) {
        const loadedImage = await preloadImage(images[i]);
        loadedImages.push(loadedImage);
        
        // Update progress
        setState(prev => ({
          ...prev,
          loadingProgress: ((i + 1) / totalImages) * 100,
          preloadedImages: loadedImages
        }));
      }

      // Set audio URL if available
      const audioUrl = storyData.audios?.[0]?.url || "";

      setState(prev => ({
        ...prev,
        isLoading: false,
        loadingProgress: 100,
        audioUrl
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to load media"
      }));
    }
  }, [images, storyData?.audios, preloadImage]);

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true, loadingProgress: 0 }));
    loadAssetsSequentially();

    return () => {
      // Cleanup function to revoke object URLs
      state.preloadedImages.forEach(image => {
        if (image.objectUrl) {
          URL.revokeObjectURL(image.objectUrl);
        }
      });
    };
  }, [loadAssetsSequentially]);

  
  if (state.error) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-50 rounded-lg flex items-center justify-center">
        <p className="text-red-500">{state.error}</p>
      </div>
    );
  }

  if (state.isLoading) {
    return (
      <div className="w-full aspect-[1/2] bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${state.loadingProgress}%` }}
          />
        </div>
        <p className="mt-4 text-gray-600">
          Loading media... {Math.round(state.loadingProgress)}%
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div 
        className="relative w-full h-fit p-4"
        style={{ 
          maxWidth: dimensions.width,
          aspectRatio: aspectRatio === 'PORTRAIT' ? '3/4' : '16/9'
        }}
      >
        <Player
          component={RemotionVideo}
          durationInFrames={dimensions.durationInFrames}
          compositionWidth={Math.ceil(dimensions.width)}
          compositionHeight={Math.ceil(dimensions.height)}
          fps={30}
          controls
          inputProps={{
            images: state.preloadedImages,
            audioUrl: state.audioUrl,
            subtitleStyle,
            transcript: storyData.transcripts?.[0]?.transcript,
            totalDuration: storyData.duration
          }}
          className="w-full h-full shadow-lg rounded-lg border border-gray-200"
        />
      </div>
    </div>
  );
}

export default StoryPlayer;