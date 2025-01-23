"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { stopGenerating } from "@/app/lib/features/storyGeneration.slice";;

const GeneratingComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);
  const error = useSelector((state) => state.storyGeneration.error);

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        router.push("/workspace/videocraft/story/create");
      }, 1000);
    }
  }, [error, dispatch, router]);

  const handleStopAndReload = () => {
    dispatch(stopGenerating());
    router.refresh(); // Reloads the current page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      {!error ? (
        <div className="w-full max-w-2xl p-8 space-y-6 rounded-xl bg-gray-800/50 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20">
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Generating Your Story...
          </h2>

          <div className="grid-cols-8 p-4">
          <p className="text-sm text-gray-400 text-wrap bg-gray-700/50 p-4 rounded-lg col-span-6">
            Your video is being generated. You can wait or refresh the page at any time. 
            Your video will still be available in the "Projects" section even if you leave or refresh.
          </p>
          <button
            onClick={handleStopAndReload}
            className="mt-6 px-6 py-3 rounded-lg bg-indigo-400 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all duration-300"
          >
            Reset
          </button>
          </div>

          <div className="space-y-4 p-6 rounded-lg bg-gray-900/50">
            {Object.entries(storyOptions).map(([key, value]) => (
              <div
                key={key}
                className="group flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-700/50"
              >
                <span className="font-semibold text-indigo-400 group-hover:text-indigo-300">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="text-gray-300 group-hover:text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="loader w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 italic animate-pulse">
              Hang tight, we're bringing your story to life!
            </p>
          </div>

        </div>
      ) : (
        <div className="p-8 rounded-xl bg-red-900/20 backdrop-blur-sm transition-all duration-300">
          <h2 className="text-4xl font-bold mb-4 text-red-400">Error!</h2>
          <p className="text-lg mb-4 text-red-200">{error}</p>
          <p className="text-gray-400 animate-pulse">
            Redirecting you to the first step...
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratingComponent;
