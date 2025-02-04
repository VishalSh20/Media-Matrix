import { useEffect } from "react";

export default function AllAudio(){
    const [user, isLoaded] = useUser();
    const [audios , setAudios] = useState([]);
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(null);

    useEffect(()=>{
    if(isLoaded && user?.id){
            setLoading(true);
            setError(null);
            setAudios([]);
            const videoUrl = `/api/contents?userId=${user?.id}&all=true&type=audio` ;
            axios.get(videoUrl)
            .then((res)=>{
                const response = res.data;
                setAudios(response.audios);
            })
            .catch((err)=>{
                const errorMessage = err.response.data.message || "An error occurred while fetching videos"+err.message;
                setError(errorMessage);
            })
            .finally(()=>{
                setLoading(false);
            })
        }
    },[user,isLoaded]);

    
    return(
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold">All Audios</h1>
                <FileUploader accept="audio/*" path="/"/>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {error && <span className="text-sm text-red-500">{error}</span>}
            {!loading && !error && (
                <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <span className="text-sm text-gray-500">Total Audios: {audios.length}</span>
                    <AudioIcon className="w-4 h-4 text-emerald-500"/>
                </div>
                 <div className="flex flex-wrap gap-4">
                 {
                    audios.map((audio,index)=>{
                        return(
                            <audio src={audio.url} key={index} controls className="w-full max-w-xs"/>
                        )
                    })
                 }
                 </div>
                </div>
            )}
        </div>
    );

  
       
}