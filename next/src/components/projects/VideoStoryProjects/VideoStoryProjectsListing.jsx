"use client"
import React from 'react';
import VideoStoryBlock from './VideoStoryBlock';

export default function VideoStoryProjectsListing({ projects }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {projects?.map((project) => (
        <div key={project.id} className="w-[300px]">
          <VideoStoryBlock project={project} />
        </div>
      ))}
    </div>
  );
}
