import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function VideoStoryBlock({ project }) {
  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <Link href={`/workspace/videocraft/story/${project.id}`} className="block"> 
      <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-gray-800 hover:scale-105 hover:bg-gray-700 transition-all duration-300 shadow-lg group">
        <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg">
          {project.coverImage ? (
            <Image
            src={project.coverImage}
            alt={project.title}
            objectFit="cover"
            width={300}
            height={project.aspectRatio==='PORTRAIT' ? 200 : 300}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 200px, 250px"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-blue-400/20 rounded-lg">
            <ImageIcon className="w-1/3 h-1/3 text-blue-500 opacity-70" />
          </div>
          )}
        </div>
        
        <div className="flex flex-col items-start gap-2 w-full">
          <h3 className="text-lg font-bold text-white truncate w-full">{project.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2 h-10">
            {project.description?.length > 0 
              ? (project.description.length > 50 
                  ? project.description.slice(0, 50) + '...' 
                  : project.description)
              : 'No description available'}
          </p>
          <span className="text-xs text-gray-500">
            Created {formatTime(project.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}