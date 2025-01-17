import { NextResponse } from "next/server";
import prisma from "../../../../db/prisma_client.js";
import {s3Client} from "../../../../aws/aws.config.js";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(req){
    try{
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const path = searchParams.get('path') || "/";
        const all = searchParams.get('all') || false;

        let files = await prisma.file.findMany({
            where: {
                userId: userId,
                folderPath:{
                    startsWith:path
                }
            }
        });

        let totalSize = 0;
        for(let file of files){
            file.filename = file.Key.split("/").pop();
            file.path = file.folderPath+file.filename;
            file.extension = file.Key.split(".").pop();
            totalSize+=file.Size;
        }

        let images = [], videos = [] , audios = [];
        images = files.filter(file => file.type.startsWith('IMAGE'));
        videos = files.filter(file => file.type.startsWith('VIDEO'));
        audios = files.filter(file => file.type.startsWith('AUDIO'));

        if(!all){
            images = images.filter(image => image.folderPath === path);
            videos = videos.filter(video => video.folderPath === path);
            audios = audios.filter(audio => audio.folderPath === path);
        }

        for(let image of images){
            const url = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: image.Key
            }),{expiresIn:64800});
            image.url = url;
        }

        for(let video of videos){
            const url = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: video.Key
            }),{expiresIn:64800});
            video.url = url;
        }

        for(let audio of audios){
            const url = await getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: audio.Key
            }),{expiresIn:64800});
            audio.url = url;
        }

        const listingResponse = (await s3Client.send(new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: `users/${userId}${path}`,
            Delimiter: "/"
        })));
        console.log(listingResponse);
        let folders = (listingResponse.CommonPrefixes || []).map(folder => ({
            name: folder.Prefix.substring(folder.Prefix.substring(0, folder.Prefix.length-1).lastIndexOf("/")+1),
            Key: folder.Prefix,
            path: folder.Prefix.replace(`users/${userId}`,''),
            Size: 0
        }));

        for(let folder of folders){
            for(let file of files){
                if(file.Key.startsWith(folder.Key)){
                    folder.Size += file.Size;
                }
            }
        }

        return NextResponse.json({
            totalSize,
            path,
            images,
            videos,
            audios,
            folders
        });
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch contents: "+error.message },
            { status: 500 }
        );

    }

}