"use client";
import React, { useState, useEffect, use } from 'react';
import { PlayCircle, FileText, Edit, Loader2, Film, Settings, Volume2, Palette, Type, SparklesIcon, DownloadIcon } from 'lucide-react';
import StoryPlayer from '@/components/workspace/videocraft/story/StoryPlayer';
import StorySceneComponent from '@/components/workspace/videocraft/story/StorySceneComponent';
import RemotionSubtitleControls from '@/components/remotion/RemotionSubtitleControls';
import { useUser } from '@clerk/nextjs';
import { api } from '../../../../../../axios.config.js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

function Page({ params }) {
  const storyId = use(params).storyId;
  const { user } = useUser();
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtitleStyle, setSubtitleStyle] = useState({
    fontSize:24,
    fontColor:"#FFFFFF",
    textShadow:false,
    fontFamily:"Arial",
    textAlign:"center",
    bottom:10,
    left:50
  });

  useEffect(() => {
    if(user?.id) {
      api.get(`/api/videoStory?userId=${user.id}&storyId=${storyId}`)
        .then((response) => {
          setStoryData(response.data.story);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [storyId, user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium">Loading your story...</h3>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        {/* Scenes Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="h-screen overflow-y-auto bg-white border-r">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-3">
                <Film className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Scenes</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {storyData?.scenes?.map((scene) => (
                <StorySceneComponent key={scene.id} scene={scene} />
              ))}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle={true} />

        {/* Main Content Panel */}
        <ResizablePanel defaultSize={75}>
          <div className="flex flex-col h-screen overflow-y-auto gap-4 bg-gray-50">
            {/* Export option */}
            <span className='text-sm text-blue-500'>The export option will be available soon!</span>
            
            {/* Video Player Section */}
            <div className="flex flex-col p-6 pb-2 justify-center items-start">
              <div className="w-full max-w-3xl">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-6">
                    <StoryPlayer 
                      aspectRatio={storyData?.aspectRatio || 'PORTRAIT'} 
                      storyData={storyData}
                      subtitleStyle={subtitleStyle}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Editing Options Section */}
            <div className="border-t bg-white p-4">
              <Tabs defaultValue="subtitles" className="w-full">
                <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-4">
                  <TabsTrigger value="text">
                    <Type className="w-4 h-4 mr-2" />
                    Subtitles
                  </TabsTrigger>
                  <TabsTrigger value="animation">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Animation
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    <Palette className="w-4 h-4 mr-2" />
                    Style
                  </TabsTrigger>
                </TabsList>

             
                <TabsContent value="text" className="max-w-2xl mx-auto">
                  <RemotionSubtitleControls subtitleStyle={subtitleStyle} setSubtitleStyle={setSubtitleStyle} />
                </TabsContent>

                <TabsContent value="style" className="max-w-2xl mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Animation Style
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Palette className="w-4 h-4 mr-2" />
                      Color Theme
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}


export default Page;