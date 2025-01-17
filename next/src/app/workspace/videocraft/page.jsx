import React from 'react';
import { Video, Clapperboard, Crown } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Carve Your Ideas To Videos With AI</h1>
        <p className="text-gray-600">Transform your creative vision into stunning videos using AI technology</p>
      </div>

      <div className="flex flex-row gap-8 max-w-6xl mx-auto ">
        {/* Story Creation Section */}
        <Link href={"/workspace/videocraft/story/create"} className="flex-1 rounded-lg cursor-pointer border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-400 to-purple-400 hover:from-purple-400 hover:to-blue-400"> 
        <div >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Clapperboard className="h-8 w-8" />
              <h2 className="text-xl font-bold">Create Stories</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Create engaging video stories by combining AI-generated clips. Perfect for:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Content Series
              </li>
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Short Films
              </li>
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Social Media Stories
              </li>
            </ul>
          </div>
        </div>
        </Link>

        {/* Scene Generation Section */}
        <Link href={"/workspace/videocraft/scene-generation"} className="flex-1 rounded-lg border cursor-pointer border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-400 to-yellow-300 hover:from-yellow-300 hover:to-orange-400">
        <div >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold">Premium Scene Generation</h2>
                <span className="text-sm bg-black/5 px-2 py-1 rounded">Advanced AI Model</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Generate high-quality, precise video scenes in 6-15 seconds using advanced AI technology.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Advanced Scene Control
              </li>
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Realistic Output
              </li>
              <li className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Quick Generation Time
              </li>
            </ul>
          </div>
        </div>
        </Link>

      </div>
    </div>
  );
};

export default Page;