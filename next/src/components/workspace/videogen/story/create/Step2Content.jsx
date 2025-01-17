import { useSelector, useDispatch } from "react-redux";
import { setStoryOptions } from "@/app/lib/features/storyGeneration.slice";
import { Volume2 } from "lucide-react";
import { useState, useRef , useEffect} from "react";

export default function Step2Content() {
  const dispatch = useDispatch();
  const storyOptions = useSelector((state) => state.storyGeneration.storyOptions);

  const [playingAudio, setPlayingAudio] = useState(null); // Tracks the currently playing audio
  const audioRefs = useRef({}); // Stores refs for all audio elements

  const voices = [
    { id: "joanna", name: "Joanna (Female)", preview: "/assets/videoGeneration/story/voices/joanna.mp3" },
    { id: "matthew", name: "Matthew (Male)", preview: "/assets/videoGeneration/story/voices/matthew.mp3" },
    { id: "salli", name: "Salli (Female)", preview: "/assets/videoGeneration/story/voices/salli.mp3" },
    { id: "joey", name: "Joey (Male)", preview: "/assets/videoGeneration/story/voices/joey.mp3" },
  ];

  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.addEventListener("ended",handleAudioEnded);
      }
    });

    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.removeEventListener("ended", handleAudioEnded);
        }
      });
    };
  }, []);

  const handleAudioEnded = () => {
    setPlayingAudio(null);
  };

  const handleAudioToggle = (id) => {
    const currentAudio = audioRefs.current[id];

    if (playingAudio && playingAudio !== id) {
      // Pause currently playing audio
      audioRefs.current[playingAudio]?.pause();
      audioRefs.current[playingAudio].currentTime = 0;
      setPlayingAudio(null);
    }

    if (currentAudio) {
      if (playingAudio === id) {
        // Stop the currently playing audio
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setPlayingAudio(null);
      } else {
        // Play the selected audio
        currentAudio.play();
        setPlayingAudio(id);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Choose Your Narrator</h2>
        <p className="text-gray-400">Select the perfect voice for your story</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {voices.map((voice) => (
          <div
            key={voice.id}
            onClick={() => dispatch(setStoryOptions({ narrator: voice.id }))}
            className={`p-5 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105
              ${storyOptions.narrator === voice.id ? "border-blue-500 bg-blue-800 shadow-md" : "hover:bg-gray-800"}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{voice.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleAudioToggle(voice.id);
                }}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  playingAudio === voice.id ? "bg-gradient-to-br from-blue-400 to-indigo-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-blue-600"
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <audio
              ref={(el) => (audioRefs.current[voice.id] = el)}
              className="hidden"
            >
              <source src={voice.preview} type="audio/mpeg" />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
