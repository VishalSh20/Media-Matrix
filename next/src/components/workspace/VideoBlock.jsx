import React, { useState, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoBlock({ videos }) {
    const [currentVideo, setCurrentVideo] = useState(null);
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    const handleVideoClick = (video) => {
        setCurrentVideo(video);
        if (playerRef.current) {
            playerRef.current.dispose(); // Dispose of the previous player instance
        }
        // Initialize video.js player
        playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: true,
            preload: 'auto',
            sources: [{
                src: video.url,
                type: 'video/mp4' // Adjust the type according to your video format
            }]
        });
    };

    return (
        <div className="video-block">
            <h1 className="text-2xl font-bold mb-4">Video Gallery</h1>
            <div className="flex flex-wrap gap-4">
                {videos.map((video) => (
                    <div key={video.id} className="video-thumbnail cursor-pointer" onClick={() => handleVideoClick(video)}>
                        <div className="group p-1 rounded-md w-60 h-60 items-center justify-center flex hover:scale-105 transition-all duration-200" style={{
                            backgroundImage: `url(${video.thumbnailUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}>
                            <span className="text-white">Play Video</span>
                        </div>
                        <h2 className="text-lg text-white font-bold">{video.name}</h2>
                        <p className="text-xs text-gray-500">{(video.size / 1000).toFixed(2)} KB</p>
                    </div>
                ))}
            </div>
            {currentVideo && (
                <div className="video-player mt-4">
                    <h2 className="text-xl font-bold">{currentVideo.name}</h2>
                    <div data-vjs-player>
                        <video ref={videoRef} className="video-js vjs-default-skin" />
                    </div>
                </div>
            )}
        </div>
    );
}