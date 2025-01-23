import React from 'react';
import { setStoryOptions } from '@/app/lib/features/storyGeneration.slice';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle } from 'lucide-react';

function Step4Content() {
    const dispatch = useDispatch();
    const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);
    const aspectRatios = [
        { id: 'PORTRAIT', label: 'Portrait', dimensions: '9:16', width: 'w-20', height: 'h-32' },
        { id: 'LANDSCAPE', label: 'Landscape', dimensions: '16:9', width: 'w-32', height: 'h-20' },
        { id: 'SQUARE', label: 'Square', dimensions: '1:1', width: 'w-24', height: 'h-24' }
    ];

    const handleAspectRatioSelect = (aspectRatio) => {
        dispatch(setStoryOptions({
            ...storyOptions,
            aspectRatio: aspectRatio
        }));
    };

    return (
        <div className='w-full bg-gray-800 rounded-xl p-8 h-full'>
            <div className='flex flex-col items-center justify-center h-full gap-8'>
                <h2 className='text-2xl font-bold text-white'>Select Aspect Ratio</h2>
                <div className="flex gap-8 w-full flex-wrap justify-center">
                    {aspectRatios.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => handleAspectRatioSelect(ratio.id)}
                            className="relative group"
                        >
                            <div className={`
                                flex flex-col items-center gap-4 p-4 
                                rounded-lg border-2 
                                ${storyOptions.aspectRatio === ratio.id 
                                    ? 'border-blue-500 bg-gray-700' 
                                    : 'border-gray-600 hover:border-gray-400 bg-gray-700'}
                                transition-all duration-200
                            `}>
                                <div className={`
                                    ${ratio.width} ${ratio.height}
                                    bg-gray-600 rounded-lg
                                    flex items-center justify-center
                                    relative
                                `}>
                                    {storyOptions.aspectRatio === ratio.id && (
                                        <CheckCircle 
                                            className="absolute text-blue-500" 
                                            size={24}
                                        />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-white">{ratio.label}</p>
                                    <p className="text-sm text-gray-400">{ratio.dimensions}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Step4Content;