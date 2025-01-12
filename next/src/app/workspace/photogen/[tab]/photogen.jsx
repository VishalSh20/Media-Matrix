"use client"
import { useState } from 'react';

function PhotoGen() {
    const [prompt, setPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateImage = async () => {
        if (!prompt) return;
        
        setIsLoading(true);
        try {
            // This is a placeholder API call - replace with your actual image generation API
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            
            const data = await response.json();
            setGeneratedImages(prev => [...prev, data.imageUrl]);
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-8">
            <h1 className="text-3xl font-bold">AI Image Generator</h1>
            
            {/* Prompt Input Section */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleGenerateImage}
                        disabled={isLoading || !prompt}
                        className={`px-6 py-3 rounded-lg text-white ${
                            isLoading || !prompt 
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {isLoading ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>
            </div>

            {/* Generated Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={imageUrl}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <a
                                href={imageUrl}
                                download
                                className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PhotoGen;
