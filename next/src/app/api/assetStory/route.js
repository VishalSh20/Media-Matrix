import { NextResponse } from 'next/server';
import prisma from '../../../../db/prisma_client.js';

export async function POST(req) {
  try {
    const { fileId, storyId,duration=0,startTime=0 } = await req.json();
    if ([fileId, storyId].includes(undefined)) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    //check if file exists
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    //check if scene exists
    const story = await prisma.videoStoryProject.findUnique({
      where: {
        id: storyId,
      },
    });
    if (!story) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }
    
    const assetType = file.type.substring(0,file.type.indexOf('_'));
    const assetStory = await prisma.assetStory.create({
      data: {
         storyId,
         fileId,
         duration:Number(duration),
         startTime:Number(startTime),
         assetType
      },
    });
    return NextResponse.json(assetStory, { status: 201 });
}catch (error) {
    console.error('Error creating assetScene:', error);
    return NextResponse.json({ error: 'Failed to create assetScene' }, { status: 500 });
  }
}
