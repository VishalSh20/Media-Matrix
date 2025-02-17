"use client"
import { useState } from "react";
import Image from "next/image";
import { SearchIcon, RefreshCw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { clearImageGenerationState, generateImagesStart, generateImagesSuccess, generateImagesFailure, setSelectedTheme, setPrompt } from "@/app/lib/features/textImageGeneration.slice.jsx";
import { useUser } from "@clerk/nextjs";
import { toast, Toaster } from "react-hot-toast";
import ImageBlock from "@/components/workspace/ImageBlock";
import { api } from "../../../../axios.config.js";
import { invokeLambda } from "../../../../aws/aws.config.js";
import { useRouter } from "next/navigation";

export default function Page() {
    const dispatch = useDispatch();
    const {user} = useUser();
    const router = useRouter();
    const prompt = useSelector((state) => state.textImageGeneration.prompt);
    const selectedTheme = useSelector((state) => state.textImageGeneration.selectedTheme);
    const generatedImages = useSelector((state) => state.textImageGeneration.generatedImages);
    const isGenerating = useSelector((state) => state.textImageGeneration.isGenerating);
    const themes = ["Abstract", "Cartoonic", "Anime", "Fantasy", "Vintage", "Futuristic", "Modern Art", "Dark", "Colorful"];

    const handleGenerateImageWithText = async (e) => {
        e.preventDefault();
        if (!prompt) return;
        
        dispatch(generateImagesStart());
        try {
                const payload = {
                    path: '/generate/image',
                    httpMethod: 'POST',
                    body: JSON.stringify({
                        prompt,
                        userId: user.id,
                        animationTheme: selectedTheme
                    })
                }
          
            const response = await invokeLambda(process.env.NEXT_PUBLIC_LAMBDA_BACKEND_NAME,payload);
            console.log(response);
            const result = JSON.parse(response);
            
            // The Lambda response will include statusCode and body
            if (result.statusCode === 200) {
                const uploadedImages = JSON.parse(result.body)?.images;
                dispatch(generateImagesSuccess(uploadedImages));
            } else {
                throw new Error(result.body || 'Failed to generate images');
            }}
            catch(err){
                console.log("Error generating images:", err);
                dispatch(generateImagesFailure("Image generation failed."));
                toast.error("Image generation failed due to technical issues!");
            }
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto mt-8 bg-inherit">
            <h1 className="text-4xl font-bold mb-4">Generate Images from Text</h1>
            <p className="text-lg text-gray-600 mb-8">
                Transform your imagination into stunning visuals in seconds. Choose from unique themes 
                to bring your ideas to life with AI-powered image generation.
            </p>

            {isGenerating && (
                <div className="flex justify-center items-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {generatedImages.length > 0 && (
                <>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => router.refresh()}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-100"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Clear</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                        {generatedImages.map((image, index) => (
                            <ImageBlock key={index} image={image} showDescription={false}/>
                        ))}
                    </div>
                </>
            )}

            <form onSubmit={handleGenerateImageWithText}>
                <div className="flex gap-4 my-6 w-full items-center justify-center">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => dispatch(setPrompt(e.target.value))}
                        placeholder="Describe the image you want to create..."
                        className="w-[90%] p-4 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isGenerating}
                    />
                    <button
                        className={`flex items-center justify-center p-2 h-fit rounded-full ${
                            isGenerating 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-all duration-100`}
                        type="submit"
                        disabled={isGenerating}
                    >
                        <SearchIcon className="h-6 w-6 rounded-full" />
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
                {themes.map((theme) => (
                    <button
                        key={theme}
                        onClick={() => dispatch(setSelectedTheme(theme === selectedTheme ? "" : theme))}
                        className={`relative h-24 rounded-lg overflow-hidden group hover:ring-1 hover:ring-blue-500 hover:scale-110 transition-all duration-100 ${
                            selectedTheme === theme ? 'ring-2 ring-blue-500' : ''
                        }`}
                        disabled={isGenerating}
                    >
                        <Image
                            src={`/assets/imageGeneration/${theme.toLowerCase()}.png`}
                            layout="fill"
                            objectFit="cover"
                            alt={`${theme} theme`}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 flex items-end justify-center">
                            <span className="text-white font-medium pb-2">{theme}</span>
                        </div>
                    </button>
                ))}
            </div>

            <Toaster/>
        </div>
    );  
}