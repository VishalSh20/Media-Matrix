import React from 'react';
import { PlayCircle, Clock, Timer } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const StorySceneComponent = ({ scene }) => {
  const sceneLogo = scene.images.find(img => img.order === 0);
  
  // Format milliseconds to minutes:seconds
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`scene-${scene.sceneOrder}`}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex w-full gap-3 py-2">
            {sceneLogo && (
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={sceneLogo.url}
                  alt={`Scene ${scene.sceneOrder} thumbnail`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 flex items-center">
                <PlayCircle className="w-4 h-4 mr-2 text-blue-500" />
                Scene {scene.sceneOrder + 1}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {scene.description}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent>
          <div className="pl-24 space-y-4">
            {/* Timing Information */}
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Start: {formatTime(scene.startTime)}
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                Duration: {formatTime(scene.duration)}
              </div>
            </div>
            
            {/* Narration */}
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">{scene.narration}</p>
            </div>
            
            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-4">
              {scene.images
                .map((img, index) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={img.url}
                      alt={`Scene ${scene.sceneOrder} image ${img.order}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default StorySceneComponent;