import { NextResponse } from 'next/server';
import prisma from '../../../../db/prisma_client.js';

export async function POST(req) {
  try {
    const { fileId, sceneId,order,duration=0,startTime=0 } = await req.json();
    if ([fileId, sceneId,order].includes(undefined)) {
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
    const scene = await prisma.scene.findUnique({
      where: {
        id: sceneId,
      },
    });
    if (!scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }
    
    const assetType = file.type.substring(0,file.type.indexOf('_'));
    const assetScene = await prisma.assetScene.create({
      data: {
         sceneId,
         fileId,
         order,
         duration:Number(duration),
         startTime:Number(startTime),
         assetType
      },
    });
    return NextResponse.json(assetScene, { status: 201 });
}catch (error) {
    console.error('Error creating assetScene:', error);
    return NextResponse.json({ error: 'Failed to create assetScene' }, { status: 500 });
  }
}
