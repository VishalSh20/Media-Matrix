"use client"
import { Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
 } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoStoryProjectsListing from '@/components/projects/VideoStoryProjects/VideoStoryProjectsListing';
import { Loader2, Loader2Icon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function Page() {
   const { user } = useUser();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [storyProjects, setStoryProjects] = useState([]);
   
    useEffect(()=>{
        if(user?.id){
        setLoading(true);
        setError(null);
        axios.get(`/api/projects/videoStory?userId=${user?.id}`)
        .then((storyRes)=>{
            setStoryProjects(storyRes.data?.data?.projects);
        })
        .catch(err=>{
            setError(err.message);
        })
        .finally(()=>{
            setLoading(false);
        })
    }
    },[user])

  return (
    <>
    {
        (loading) 
        ?
        <div className="flex justify-center items-center h-screen w-full text-blue-400">
           <Loader2 shapeRendering={"geometricPrecision"} className="animate-spin" />
        </div>
        :
        error ?
        <div className="flex justify-center items-center h-screen w-full text-red-400">
        {error}
        </div>
        :
        <div className='flex flex-col w-full gap-4 px-8 py-4 items-center justify-start text-white'>
        <div className="flex flex-col gap-4 w-full text-gray-400">
            <h1 className='text-4xl'>Projects</h1>
        </div>
        <Tabs defaultValue="video-story" className='w-full'>
            <TabsList className='flex gap-4 w-fit'>
                <TabsTrigger value="video-story">VideoStory</TabsTrigger>
                <TabsTrigger value="video-scene">VideoScene</TabsTrigger>
                <TabsTrigger value="editing">Editing</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="video-story">
                <VideoStoryProjectsListing projects={storyProjects} />
            </TabsContent>
            <TabsContent value="video-scene">
                Links to your video scenes
            </TabsContent>
            <TabsContent value="editing">
                Links to your video editing projects
            </TabsContent>
            <TabsContent value="audio">
                Links to your audio projects
            </TabsContent>
        </Tabs>
        </div>
    }
    </>
  )
}

export default Page