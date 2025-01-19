import { NextResponse } from "next/server";
import prisma from "../../../../db/prisma_client.js";
import { s3Client } from "../../../../aws/aws.config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const generateSignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  return await getSignedUrl(s3Client,command, { expiresIn: 3600 });
};

const fetchTranscript = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    const response = await s3Client.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
      });

    return await streamToString(response.Body);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return null;
  }
};

export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const userId = searchParams.get("userId");
    const storyId = searchParams.get("storyId");

    if (!userId || !storyId) {
      return NextResponse.json({ error: "userId and storyId are required" }, { status: 400 });
    }

    // Validate user existence
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the story and related data
    const story = await prisma.videoStoryProject.findUnique({
      where: { id: storyId },
      include: {
        scenes: {
          include: {
            assets: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Process assets
    for (const scene of story.scenes) {
      const folders = {
        images: [],
        audio: [],
        transcript: [],
      };

      for (const asset of scene.assets) {
        const signedUrl = await generateSignedUrl(asset.file.Key);
        asset.url = signedUrl;
        delete asset.file;

        if (asset.assetType === "DOCUMENT") {
          const transcriptJson = await fetchTranscript(asset.file.Key);
          asset.transcript = transcriptJson ? JSON.parse(transcriptJson) : null;
          folders.transcript.push(asset);
        } else if (asset.assetType === "IMAGE") {
          folders.images.push(asset);
        } else if (asset.assetType === "AUDIO") {
          folders.audio.push(asset);
        }
      }

      // Replace scene.assets with the organized folder structure
      scene.assets = folders;
    }

    return NextResponse.json({ story }, { status: 200 });
  } catch (error) {
    console.error("Error fetching video story:", error);
    return NextResponse.json({ error: "Failed to fetch video story: " + error.message }, { status: 500 });
  }
}

export async function POST(req) {
    try {
        const { storyOptions } = await req.json();
        const searchParams = new URL(req.url).searchParams;
        const userId = searchParams.get("userId");
        if(!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user)
            return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { description, tone, duration, narrator, animationTheme,aspectRatio} = storyOptions;
        if (!description || !tone || !duration || !narrator || !animationTheme) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const story = await prisma.videoStoryProject.create({
            data: {
                description,
                tone,
                duration:Number(duration),
                narrator,
                animationTheme,
                userId,
                aspectRatio,
                status:'DRAFT'
            },
        });
        return NextResponse.json(story, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to create story:"+error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        let { storyId, updates } = await req.json();
        if (!storyId || !updates) {
            return NextResponse.json({ error: "Story ID and Updates are required." }, { status: 400 });
        }
        //    check if story exists
        const existingStory = await prisma.videoStoryProject.findUnique({
                where: {
                    id: storyId,
                },
            });
        if (!existingStory)
            return NextResponse.json({ error: "Story not found." }, { status: 404 });

        if (updates.duration) {
            updates.duration = Number(updates.duration);
        }
        
        const story = await prisma.videoStoryProject.update({
            where: {
                id: storyId,
            },
            data: {
                ...updates
            },
        });
        return NextResponse.json(story, { status: 200 });
    }
    catch (error) {
        console.error("Error updating story status:", error);
        return NextResponse.json({ error: "Failed to update story status. Please try again." }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const storyId = searchParams.get("storyId");
        if (!storyId) {
            return NextResponse.json({ error: "Story ID is required." }, { status: 400 });
        }

        // delete all the assets of this story from aws
        const storyObjects = (await s3Client.send(new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: `ai/stories/${storyId}/`,
        })))?.Contents || [];

        for (const object of storyObjects) {
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: object.Key,
            }));
        }
        // delete the story from the database
        await prisma.videoStoryProject.delete({
            where: {
                id: storyId,
            },
        });

    }
    catch (error) {
        return NextResponse.json({ error: "Failed to delete story:"+error.message }, { status: 500 });
    }
}