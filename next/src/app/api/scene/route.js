import { NextResponse } from "next/server";
import prisma from "../../../../db/prisma_client.js";

export async function POST(req) {
    try {
      const {videoStoryProjectId, sceneOrder, description, narration, duration=0, startTime=0 } = await req.json(); 
      console.log("scene",videoStoryProjectId, sceneOrder, description, narration, duration, startTime);
      if ([videoStoryProjectId, sceneOrder, description, narration].includes(undefined)) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
      }

      //check if videoStoryProject exists
      const videoStoryProject = await prisma.videoStoryProject.findUnique({
        where: {
          id: videoStoryProjectId,
        },
      });
      if (!videoStoryProject) {
        return NextResponse.json({ error: "Video story project not found." }, { status: 404 });
      }

      const scene = await prisma.scene.create({
        data: {
          videoStoryProjectId,
          sceneOrder,
          description,
          narration,
          duration:Number(duration),
          startTime:Number(startTime),
        }
      });
      
      return NextResponse.json(scene,{status:201});
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }


  export async function PUT(req) {
    try {
      let { sceneId, updates } = await req.json();
      if (!sceneId || !updates) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
      }

      if(updates.duration) {
        updates.duration = Number(updates.duration);
      }
      if(updates.startTime) {
        updates.startTime = Number(updates.startTime);
      }

      const scene = await prisma.scene.update({
        where: {
          id: sceneId,
        },
        data: {
          ...updates
        }
      });
      return NextResponse.json(scene,{status:201});
     } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status:500});
      }
    }