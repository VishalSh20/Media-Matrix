import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import VideoViewerModal from "./VideoViewerModal";
import { FullscreenIcon, PlayCircle } from "lucide-react";

VideoBlock.propTypes = {
    video: PropTypes.object.isRequired,
    showDescription: PropTypes.bool,
};

export default function VideoBlock({ video, showDescription = true }) {
    const router = useRouter();
    const name = video.name;
    const clippedName = name?.length > 20 ? name.substring(0, 20) + "..." : name;
    const [isOpen, setIsOpen] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        // Generate thumbnail from video
        const generateThumbnail = async () => {
            try {
                const video = document.createElement('video');
                video.crossOrigin = "anonymous";
                video.src = video.url;
                
                await new Promise((resolve) => {
                    video.addEventListener('loadedmetadata', () => {
                        // Seek to 1 second or video duration if less than 1 second
                        video.currentTime = Math.min(1, video.duration);
                    });
                    
                    video.addEventListener('seeked', resolve);
                });

                // Create canvas and draw video frame
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const thumbnailUrl = canvas.toDataURL();
                setThumbnail(thumbnailUrl);
            } catch (error) {
                console.error('Error generating thumbnail:', error);
                setThumbnail(null);
            }
        };

        generateThumbnail();
    }, [video.url]);

    return (
        <div className="flex flex-col p-2 gap-2 rounded-md cursor-pointer">
            <div 
                className="group p-1 rounded-md w-60 h-60 items-center justify-center flex hover:scale-105 transition-all duration-200 bg-gray-900 relative"
                style={thumbnail ? {
                    backgroundImage: `url(${thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                } : {}}
                onClick={() => setIsOpen(true)}
            >
                {/* Semi-transparent overlay */}
                <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center">
                    {/* Play button - always visible but more prominent on hover */}
                    <PlayCircle 
                        className="w-12 h-12 text-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200"
                    />
                    <FullscreenIcon 
                        className="absolute top-2 right-2 w-6 h-6 text-white opacity-0 group-hover:opacity-75 transition-all duration-200"
                    />
                </div>
            </div>
            <div 
                className={"flex flex-col gap-2"}
                hidden={!showDescription}
            >
                <h2 className="text-lg text-white font-bold">{clippedName}</h2>
                <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{(video?.Size/1000).toFixed(2)} KB</p>
                    {video?.duration && (
                        <p className="text-xs text-gray-500">
                            {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                        </p>
                    )}
                </div>
            </div>
            <VideoViewerModal 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
                videoPrompt={video}
            />
        </div>
    );
}