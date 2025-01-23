import { useDispatch, useSelector } from "react-redux";
import { setStoryOptions } from "@/app/lib/features/storyGeneration.slice";
import Image from "next/image";

export default function Step3Content() {
  const dispatch = useDispatch();
  const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);

  const themes = [
    "realistic",
    "abstract",
    "anime",
    "futuristic",
    "cartoonic",
    "fantasy",
    "modern art",
    "colorful",
    "vintage",
  ].map((theme) => ({
    id: theme,
    name: theme.substring(0, 1).toUpperCase() + theme.slice(1),
    image: `/assets/videoGeneration/story/themeImages/${theme}.png`,
  }));

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Visual Theme</h2>
        <p className="text-gray-400">Choose the perfect style for your AI-generated visuals</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() =>
              dispatch(setStoryOptions({ ...storyOptions, animationTheme: theme.id }))
            }
            className={`relative cursor-pointer group rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105
            ${
              storyOptions.animationTheme === theme.id
                ? "ring-4 ring-blue-500 shadow-xl"
                : "hover:shadow-lg"
            }`}
          >
            <Image
              src={theme.image}
              alt={theme.name}
              width={200} // Adjusted size
              height={150} // Adjusted size
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="bg-gray-800 py-2 text-center">
              <span className="text-white font-medium">{theme.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
