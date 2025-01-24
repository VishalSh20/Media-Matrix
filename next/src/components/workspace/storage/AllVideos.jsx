import {useUser} from "@clerk/nextjs";
import {useState,useEffect} from "react";
import VideoBlock from "../VideoBlock.jsx";
import { VideoIcon , Loader2} from "lucide-react";
import {baseApi} from "../../../../axios.config.js";
import FileUploader from "../FileUploader.jsx";
import axios from "axios";

export default function AllVideos(){
    const {user,isLoaded} = useUser();
    const [videos,setVideos] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(isLoaded && user?.id){
            setLoading(true);
            setError(null);
            setVideos([]);
            const videoUrl = `/api/contents?userId=${user?.id}&all=true&type=video`;
            axios.get(videoUrl)
            .then((res)=>{
                const response = res.data;
                setVideos(response.videos);
            })
            .catch((err)=>{
                const errorMessage = err.response.data.message || "An error occurred while fetching videos"+err.message;
                setError(errorMessage);
            })
            .finally(()=>{
                setLoading(false);
            });
        }
    },[user,isLoaded]);

    return(
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">All Videos</h1>
                <FileUploader accept="video/*" path="/"/>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {error && <span className="text-sm text-red-500">{error}</span>}
            {!loading && !error && (
                <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <span className="text-sm text-gray-500">Total Videos: {videos.length}</span>
                    <VideoIcon className="w-4 h-4 text-emerald-500"/>
                </div>
                 <div className="flex flex-wrap gap-4">
                 {
                    videos.map((video,index)=>{
                        return(
                            <VideoBlock key={index} video={video} />
                        )
                    })
                 }
                 </div>
                </div>
            )}
        </div>
    );
}