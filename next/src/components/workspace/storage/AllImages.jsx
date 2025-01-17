import {useUser} from "@clerk/nextjs";
import {useState,useEffect} from "react";
import ImageBlock from "../ImageBlock.jsx";
import { ImageIcon , Loader2} from "lucide-react";
import {baseApi} from "../../../../axios.config.js";
import FileUploader from "../FileUploader.jsx";
import axios from "axios";

export default function AllImages(){
    const {user,isLoaded} = useUser();
    const [images,setImages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(isLoaded && user?.id){
            setLoading(true);
            setError(null);
            setImages([]);
            const imageUrl = `/api/contents?userId=${user?.id}&all=true`;
            axios.get(imageUrl)
            .then((res)=>{
                const response = res.data;
                setImages(response.images);
            })
            .catch((err)=>{
                const errorMessage = err.response.data.message || "An error occurred while fetching images"+err.message;
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
                <h1 className="text-2xl font-bold">All Images</h1>
                <FileUploader accept="image/*" path="/"/>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {error && <span className="text-sm text-red-500">{error}</span>}
            {!loading && !error && (
                <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <span className="text-sm text-gray-500">Total Images: {images.length}</span>
                    <ImageIcon className="w-4 h-4 text-emerald-500"/>
                </div>
                 <div className="flex flex-wrap gap-4">
                 {
                     images.map((image,index)=>(
                         <ImageBlock key={index} image={image}/>
                        ))
                    }
                </div>
                </div>
            )}
        </div>
    )
}