import { Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
 } from '@/components/ui/tabs'
import { Tab } from '@headlessui/react'
import React from 'react'

function Page() {
  return (
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
            Links to your video stories
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
  )
}

export default Page