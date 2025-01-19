"use client";

import React, { useState, useEffect , use} from 'react';
import { PlayCircle, FileText, Edit, Loader2, Film } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

function Page({ params }) {
  const storyId = use(params).storyId;
  const { user } = useUser();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching story data for storyId:", storyId);
    
    if(user?.id){
    axios.get(`/api/videoStory?userId=${user.id}&storyId=${storyId}`)
      .then((response) => {
        const data = response.data;
        console.log("Fetched story data:", data);
        setStoryData(data.story);
      })
      .catch((error) => {
        console.error("Error fetching story data:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [storyId, user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-700">Loading your story...</h3>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-white overflow-y-auto p-6 border-r border-gray-200 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Film className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Video Scenes
            </h2>
          </div>
          {storyData?.scenes?.map((scene) => (
            <SceneComponent key={scene.id} scene={scene} />
          ))}
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Edit className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Editor
            </h2>
          </div>
          <p className="text-gray-600">Craft your story with our intuitive editor...</p>
        </div>
      </div>
    </div>
  );
}

const SceneComponent = ({ scene }) => {
  const sceneLogo = scene.assets.images.find(img => img.order === 0);

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex gap-4 hover:bg-blue-50 transition-all duration-300 ease-in-out group cursor-pointer border border-gray-100">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <PlayCircle className="mr-2 text-blue-500 group-hover:text-blue-600" />
          Scene {scene.sceneOrder}
        </h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {scene.description}
        </p>
      </div>
      {sceneLogo && (
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={sceneLogo.url}
            alt={`Scene ${scene.sceneOrder} thumbnail`}
            className="w-full h-full object-cover rounded-lg shadow-sm transition transform group-hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
