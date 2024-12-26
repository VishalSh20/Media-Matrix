import { useState,useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { baseApi } from "../../../../axios.config.js";
import { FolderOpenIcon, ImageIcon, Loader2 } from "lucide-react";
import FolderBlock from "../FolderBlock.jsx";
import ImageBlock from "../ImageBlock.jsx";

function AllContentBrief() {
   const {user,isLoaded} = useUser();
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState(null);
   const [content,setContent] = useState({images:[],videos:[],folders:[]});

    // first, we fetch two things- all the media and all the root folders
    useEffect(() => {
        const fetchContent = () => {
            if (isLoaded && user.id) {
                setLoading(true);
                setError(null);
                setContent({images: [], videos: [], folders: []});
                Promise.all([
                    baseApi.get(`${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/media?userId=${user?.id}`),
                    baseApi.get(`${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/contents?key=users/${user?.id}/`)
                ])
                .then(([mediaRes, folderRes]) => {
                    setContent({
                        images: mediaRes.data.data.images,
                        videos: mediaRes.data.data.videos,
                        folders: folderRes.data.data.folders
                    });
                })
                .catch((err) => {
                    const errorMessage = err.response?.data?.message || `An error occurred: ${err.message}`;
                    setError(errorMessage);
                })
                .finally(() => {
                    setLoading(false);
                });
            }
        };

        fetchContent();
    }, [user, isLoaded]);

  return (
    <div>
        {loading && <Loader2 className="w-6 h-6 animate-spin"/>}
        {error
         ?
         <p className="text-red-500">{error}</p>
            :
            <div className="flex flex-col gap-4 p-4 w-full">
                {/* folders */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 p-2">
                    <h2 className="text-lg font-semibold">Folders</h2>
                    <p className="text-sm text-gray-500">Total Folders: {content.folders.length}</p>
                    <FolderOpenIcon className="w-4 h-4 text-emerald-500"/>
                    </div>
                    {
                        content.folders.length>0 ?
                        <div className="flex flex-wrap gap-4">
                            {
                                content.folders.map((folder,index)=>(
                                    <FolderBlock
                                    key={index}
                                    folder={folder}
                                    />
                                ))
                            }
                        </div>
                        :
                        <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">Your folders will appear here</p>
                    }
                </div>
                
                {/* images */}
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 p-2">
                    <h2 className="text-lg font-semibold">Images</h2>
                    <p className="text-sm text-gray-500">Total Images: {content.images.length}</p>
                    <ImageIcon className="w-4 h-4 text-emerald-500"/>
                    </div>
                    {
                        content.images.length>0 ?
                        <div className="flex flex-wrap gap-4">
                            {
                                content.images.map((image,index)=>(
                                    <ImageBlock
                                    key={index}
                                    image={image}
                                    />
                                ))
                            }
                        </div>
                        :
                        <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded-md">Your images will appear here</p>
                    }
                </div>
            </div>
        }
        
    </div>
  )
}

export default AllContentBrief