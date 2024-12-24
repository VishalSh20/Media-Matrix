"use client"
import { useState,useEffect } from 'react';
import {useUser} from "@clerk/nextjs";
import {baseApi} from "../../../../axios.config.js";
import ErrorComponent from '@/components/workspace/ErrorComponent';

function Page() {
    const allTabs = ["All","Folders","Images","Videos","Audio"];
    const [selectedTab, setSelectedTab] = useState("All");
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [images,setImages] = useState([]);
    const [folders,setFolders] = useState([]);
    const [videos,setVideos] = useState([]);
    const [audios,setAudios] = useState([]);
    const {user,isLoaded} = useUser();

    // first grabbing all the files from the backend
    useEffect(() => {
        if(isLoaded && user?.id){
            const requestUrl = `${process.env.NEXT_PUBLIC_LAMBDA_BACKEND_URL}/storage/media?userId=${user.id}`;
            baseApi.get(requestUrl)
                .then((res) => {
                    console.log("Success response:", res.data);
                    setImages(res.data.images);
                    setVideos(res.data.videos);
                    setAudios(res.data.audios);
                    setFolders(res.data.folders);
                    setLoading(false);
                })
                .catch((err) => {
                    const errorMessage = err.response ? err.response.data.message : err.message;
                    setError(errorMessage);
                });
        }
    },[isLoaded,user]);

  return (
    <div className="flex flex-col gap-4 p-8">
        <header className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-blue-600 p-4 rounded-lg">
            <h1 className="text-2xl font-bold text-white shadow-md shadow-black">My Storage</h1>
            <img src="https://mediamatrix-vm.s3.eu-north-1.amazonaws.com/projectAssets/images/flames.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIA3C6FMGU6NKVO7XP2%2F20241224%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20241224T114813Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECQaCmV1LW5vcnRoLTEiRjBEAiBKt4OHbMwojgAFPv8MoFmrvU3GA59h53tXJJk9O7vSSAIgGfLyqpsaN62dYfr6erFYsgs3lbNhlVfgrCpjHyZlbroq%2BgII7f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw3NjIyMzM3NjMxMzIiDFCLpO83AwcNdRpmCCrOAlSPSoSvM1zkOhvP8WZifpqXgR%2FrPCmxvKIqH1N7ZWnJcKsbaqm9cxdy3m95Gw1VLqEHqp86r35%2BxQYUuFc67W2CjzmlFq5KbiMBoslka6VR%2BgXdeNkutXXftbAb7o5vM990KffVtAFsGBjAkMKKIPGJnfUnUxEwCu%2F4keSK8QRC%2BOPr3syN0eRG2K9Hdy2HqjlzVYi6X9Gcp8z%2B8wQ8b3a4ODS6CiVV1KJAeVzAFRrz2QDBWtciM%2BgjFb5IjG9oYImdsILRlq9bIT2NSWk6IvigxEj7YPMMzgMCkIZM76zZM8LOFmsYIZJRXV976lemZ4D3xukPsokm8MV1pxXwX0QP%2BtfaF6%2FGrLrS08ZY55YN4UkOajlBPXeYw5ce1HwbU03lk9xTP44euwBIB%2BwN1PnSgmPZs74VO5XNLkvAvZeQUdUWPs9WBSn8xfuFr%2Bkwxb2quwY6nwGlYz%2FnXvIp633k1yb8BRkno7k3BBNN%2BmlHePlqWlVry4ca6LXZozz4keOPfmp5NYko57ZZ8mqsyZkLNr9PvVspAxEdEBmLlv5082Nj2tgsI1GMRi1Yl6X8cdLmRAydZsZI789b44nEwIJpvBVmsS1BvTHzAGQLrNT8ee0DBKI7ZaEAY0X4MfFBJVkHf%2BBsnwhC%2BZT2FhvIWheN4E2SFgs%3D&X-Amz-Signature=e7b0792ac90f83ece3083faca181e98cc03f64a2a51b466bb0f04fdd2918590c&X-Amz-SignedHeaders=host&x-id=GetObject"
             alt="Folder Image" 
             width={40}
            height={40} />
        </header>

        {
            error
            ?
            <ErrorComponent message="Something went wrong while fetching your files" submessage={error}/>
            :

        <main className='flex flex-col gap-4 p-4 w-full'>
            {/* filter section */}
            <div className="flex justify-between items-center filter-section">
                {/* leaving this empty for now */}
            </div>

            {/* tab selector */
            <div className="flex gap-4 items-center tab-selector">
                {
                    allTabs.map((tab) => (
                        <button key={tab} className={`${selectedTab === tab ? "bg-blue-500 outline-1 outline-purple-500 text-white" : "bg-gray-300 text-gray-800"} px-4 py-2 rounded-md`} onClick={() => setSelectedTab(tab)}>{tab}</button>
                    ))
                }
            </div>}

            {/* content section */}
            <div className="flex flex-col gap-4">
                
            </div>

        </main>
        }
    </div>

  )
}

export default Page