import { useDispatch, useSelector } from "react-redux";
import { setStoryOptions } from "@/app/lib/features/storyGeneration.slice";

export default function Step1Content(){
    const dispatch = useDispatch();
    const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);

    const tones = [
        "Illustration",
        "Funny",
        "Satire",
        "Dramatic",
        "Professional",
        "Casual",
        "Emotional",
        "Educational",
      ];

      const durations = [
        { label: "Select your video duration", value: "", default: true },
        { label: "15 seconds", value: 15 },
        { label: "30 seconds", value: 30 },
        { label: "1 minute", value: 60 },
        { label: "2 minutes", value: 120 },
        { label: "5 minutes", value: 300 },
      ];



    return(
    <div className="space-y-8 h-full">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Story Description</label>
        <textarea
          value={storyOptions.description}
          onInput={(e) =>{
            dispatch(setStoryOptions({ ...storyOptions, description: e.target.value }));
            }
          }
          className="w-full bg-gray-900 text-white h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 hover:shadow-md resize-none overflow-auto"
          placeholder="Let your creativity flow... Describe the story you want to bring to life"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-gray-300">Story Tone</label>
        <div className="flex flex-wrap gap-3">
          {tones.map((tone) => (
            <button
              key={tone}
              onClick={() => dispatch(setStoryOptions({ ...storyOptions, tone }))}
              className={`px-5 py-2.5 rounded-full border text-gray-300 hover:text-white hover:border-blue-500 transition-all duration-300 ${
                storyOptions.tone === tone ? "bg-blue-600" : "bg-gray-800"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">Video Length</label>
        <select
          value={storyOptions.duration}
          onChange={(e) =>
          (dispatch(setStoryOptions({ ...storyOptions, duration: e.target.value })))
          }
          className="w-full p-3 bg-gray-800 text-gray-300 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 hover:shadow-md"
        >
          {durations.map((duration) => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>
    </div>
)};