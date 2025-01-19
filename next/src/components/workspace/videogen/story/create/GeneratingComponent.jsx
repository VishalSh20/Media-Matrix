"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { stopGenerating } from "@/app/lib/features/storyGeneration.slice";
import { useRouter } from "next/navigation";

const GeneratingComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);
  const error = useSelector((state) => state.storyGeneration.error);

  React.useEffect(() => {
    if (error) {
      setTimeout(() => {
        router.push("/workspace/videogen/story/create");
      }, 1000);
    }
  }, [error, dispatch, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      {!error ? (
        <>
          <h2 className="text-3xl font-bold mb-4">Generating Your Story...</h2>
          <div className="mb-6">
            <p className="text-lg">
              <strong>Description:</strong> {storyOptions.description}
            </p>
            <p className="text-lg">
              <strong>Tone:</strong> {storyOptions.tone}
            </p>
            <p className="text-lg">
              <strong>Duration:</strong> {storyOptions.duration} seconds
            </p>
            <p className="text-lg">
              <strong>Aspect Ratio:</strong> {storyOptions.aspectRatio}
            </p>
          </div>
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Hang tight, we're bringing your story to life!</p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4 text-red-500">Error!</h2>
          <p className="text-lg mb-4">{error}</p>
          <p className="text-gray-400">Redirecting you to the first step...</p>
        </>
      )}
    </div>
  );
};

export default GeneratingComponent;
