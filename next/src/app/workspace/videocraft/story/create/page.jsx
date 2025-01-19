"use client";
import React, { useState, useRef, use, useEffect} from "react";
import { ChevronRight, ChevronLeft, Volume2, Wand2 } from "lucide-react";
import Step1Content from "@/components/workspace/videogen/story/create/Step1Content";
import Step2Content from "@/components/workspace/videogen/story/create/Step2Content";
import Step3Content from "@/components/workspace/videogen/story/create/Step3Content";
import Step4Content from "@/components/workspace/videogen/story/create/Step4Content";
import { useSelector,useDispatch } from "react-redux";
import {startGenerating,stopGenerating} from "@/app/lib/features/storyGeneration.slice";
import { generateVideoStoryAssets } from "@/app/utils/video_story_generation.utils";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {user} = useUser();
  const dispatch = useDispatch();
  const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);
  const isGenerating = useSelector((state) => state.storyGeneration.isGenerating);
  const handleStoryGeneration = async()=>{
    try {
      dispatch(startGenerating());
      const res = await generateVideoStoryAssets(storyOptions,user.id);
      const storyId = res.storyId;
      setTimeout(() => {
        router.push(`/workspace/videogen/story/${storyId}`);
      }, 1000);
    } catch (error) {
      console.error("Error generating story:", error.message);
      dispatch(stopGenerating(error.message));
    }
  }

  const handleNext = () => {
    if(currentStep === 4){
      handleStoryGeneration();
    }
    else
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }
  const handlePrev = () =>{ 
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3,4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform ${
              currentStep === step
                ? "bg-blue-500 text-white scale-110"
                : currentStep > step
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`w-20 h-1 transition-all duration-500 ${
                currentStep > step ? "bg-green-500" : "bg-gray-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-200 flex items-center justify-center gap-3">
          <Wand2 className="w-8 h-8 text-blue-500" />
          Create Your Story
        </h1>
        <p className="text-gray-400 text-lg">Transform your ideas into captivating videos</p>
      </div>
      <StepIndicator />
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg">
        {isGenerating && <GeneratingComponent />}
        {!isGenerating && currentStep === 1 && <Step1Content />}
        {!isGenerating && currentStep ===2 && <Step2Content />}
        {!isGenerating && currentStep ===3 && <Step3Content />}
        {!isGenerating && currentStep ===4 && <Step4Content />}
        {
          !isGenerating &&
        <div className="flex justify-between mt-12">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={
              (currentStep===1 && (!storyOptions.description || !storyOptions.tone || !storyOptions.duration)) ||
              (currentStep===2 && !storyOptions.narrator) ||
              (currentStep===3 && !storyOptions.animationTheme) ||
              (currentStep===4 && !storyOptions.aspectRatio)
            }
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-300"
          >
            {currentStep === 4 ? "Create Story" : "Next"}
            {currentStep !== 4 && <ChevronRight className="w-5 h-5 ml-2" />}
          </button>
        </div> 
        }
      </div>
    </div>
  );
};

export default Page;
