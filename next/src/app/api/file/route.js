import { NextResponse } from "next/server";
import prisma from "../../../../db/prisma_client.js";
import { getCloudFrontSignedUrl, s3Client } from "../../../../aws/aws.config.js";
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    CopyObjectCommand
 } from "@aws-sdk/client-s3";

// Add this helper function to determine FILETYPE enum value
const getFileType = (mimeType) => {
  const typeMap = {
    'video/mp4': 'VIDEO_MP4',
    'video/webm': 'VIDEO_WEBM',
    'video/ogg': 'VIDEO_OGG',
    'video/mov': 'VIDEO_MOV',
    'video/avi': 'VIDEO_AVI',
    'image/jpeg': 'IMAGE_JPEG',
    'image/png': 'IMAGE_PNG',
    'image/gif': 'IMAGE_GIF',
    'image/svg+xml': 'IMAGE_SVG',
    'image/webp': 'IMAGE_WEBP',
    'image/tiff': 'IMAGE_TIFF',
    'image/bmp': 'IMAGE_BMP',
    'audio/mp3': 'AUDIO_MP3',
    'audio/wav': 'AUDIO_WAV',
    'audio/ogg': 'AUDIO_OGG',
    'audio/aac': 'AUDIO_AAC',
    'audio/m4a': 'AUDIO_M4A',
    'audio/flac': 'AUDIO_FLAC',
    'application/pdf': 'DOCUMENT_PDF',
    'text/plain': 'DOCUMENT_TXT',
    'application/x-subrip': 'DOCUMENT_SRT',
    'text/vtt': 'DOCUMENT_VTT',
    'application/json': 'DOCUMENT_JSON'
  };
  return typeMap[mimeType] || null;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const path = formData.get('path') || "/";
    const prompt = formData.get('prompt');
    console.log("Received Date:",{
      file,
      userId,
      path,
      prompt
    });
    

    if ((!file) || !userId) {
      return NextResponse.json(
        { error: "File and userId are required" },
        { status: 400 }
      );
    }

    // check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    console.log("User:", user);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Convert file to buffer for S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = getFileType(file.type);
    
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Generate unique S3 key
    const key = `users/${userId}${path}${Date.now()}-${file.name}`;

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type
    }));
    console.log('File uploaded to S3 successfully');

    // get signed url
    const signedUrl = getCloudFrontSignedUrl(key);

    // Create file record in database
    let data = {
      Key: key,
      Size: file.size,
      name: file.name,
      type: fileType,
      userId: userId,
      folderPath: path,
    } 
    console.log(data);
    if(prompt){
      data.prompt = prompt
    }
    let fileRecord = await prisma.file.create({
      data: data
    });
    fileRecord.url = signedUrl;
    fileRecord.filename = file.name;
    fileRecord.extension = file.name.split('.').pop();

    console.log('File uploaded successfully:', fileRecord);
    return NextResponse.json({message: 'File uploaded successfully',fileRecord},{status: 200});

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
      const fileKey = searchParams.get('fileKey');
  
      if (!userId || !fileKey) {
        return NextResponse.json(
          { error: "userId and fileKey are required" },
          { status: 400 }
        );
      }
  
      // Get file metadata from database
      const file = await prisma.file.findFirst({
        where: {
          Key: fileKey,
          userId: userId
        }
      });
  
      if (!file) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
      
      const signedUrl = getCloudFrontSignedUrl(fileKey);
  
      return NextResponse.json({
        ...file,
        url: signedUrl
      });
  
    } catch (error) {
      console.error('File retrieval error:', error);
      return NextResponse.json(
        { error: "Failed to retrieve file" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(req) {
    try {
      const data = await req.json();
      const { userId, fileKey, updates } = data;
  
      if (!userId || !fileKey) {
        return NextResponse.json(
          { error: "userId and fileKey are required" },
          { status: 400 }
        );
      }
  
      // Get existing file
      const existingFile = await prisma.file.findFirst({
        where: {
          Key: fileKey,
          userId: userId
        }
      });
  
      if (!existingFile) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
  
      const updatedFile = await prisma.file.update({
        where: {
          id: existingFile.id
        },
        data: updates
      });
  
      return NextResponse.json({"message": "File updated successfully",updatedFile},{status: 200});
  
    } catch (error) {
      console.error('File update error:', error);
      return NextResponse.json(
        { error: "Failed to update file" },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
      const fileKey = searchParams.get('fileKey');
  
      if (!userId || !fileKey) {
        return NextResponse.json(
          { error: "userId and fileKey are required" },
          { status: 400 }
        );
      }
  
      // Get file to check folder relationship
      const file = await prisma.file.findFirst({
        where: {
          Key: fileKey,
          userId: userId
        }
      });
  
      if (!file) {
        return NextResponse.json(
          { error: "File not found" },
          { status: 404 }
        );
      }
  
      // Delete from S3
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey
      }));
  
      // Delete from database
      await prisma.file.delete({
        where: {
          id: file.id
        }
      });
  
      return NextResponse.json({ message: "File deleted successfully" });
  
    } catch (error) {
      console.error('File deletion error:', error);
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }
  }