import prisma from "../../../../db/prisma_client.js";
import { s3Client } from "../../../../aws/aws.config.js";
import { CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function PUT(req,res) {
    try {
        const {userId,folderPath,newName} = req.body;
        if(!userId && !folderPath && !newName) {
            return res.status(400).json({error:"All fields are required"});
        }
        
        const folderKey = `users/${userId}${folderPath}`;
        const newfolderKey = folderKey.split("/").slice(0,-1).join("/")+"/"+newName+'/';
        const newFolderPath = folderPath.split("/").slice(0,-1).join("/")+"/"+newName+'/';

        //here copy all the files from old folder to new folderkey in s3 bucket
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: folderKey
        });
        const listResponse = await s3Client.send(listCommand);
        const objects = listResponse.Contents;
        
        for(let object of objects) {
            // Copy each object to new location
            const copyOptions = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${newfolderKey}${object.Key.substring(folderKey.length)}`,
                CopySource: `${process.env.AWS_BUCKET_NAME}/${object.Key}`
            };
            const copyCommand = new CopyObjectCommand(copyOptions);
            await s3Client.send(copyCommand);
        
            // Delete original object
            const deleteOptions = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: object.Key
            };
            const deleteCommand = new DeleteObjectCommand(deleteOptions);
            await s3Client.send(deleteCommand);
        }

        await prisma.file.updateMany({
            where:{
                folderPath:{
                    startsWith:folderPath
                },
                userId:userId
            },
            data:{
                folderPath:newFolderPath
            }
        });

        return NextResponse.json({message:"Folder renamed successfully"});

    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Error in renaming folder"+error.message},{status:500});
    }
}


export async function DELETE(req,res) {
    try {
        const searchParams = new URL(req.url).searchParams;
        const userId= searchParams.get('userId');
        const folderPath= searchParams.get('folderPath');
        if(!userId && !folderPath) {
            return NextResponse.json({error:"All fields are required"},{status:400});
        }

        const folderKey = `users/${userId}${folderPath}`;
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: folderKey
        });
        const listResponse = await s3Client.send(listCommand);
        const objects = listResponse.Contents;
        for(let object of objects) { 
            // Delete each from s3 bucket
            const deleteOptions = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: object.Key
            };
            const deleteCommand = new DeleteObjectCommand(deleteOptions);
            await s3Client.send(deleteCommand);
        }
        
        // Delete each from prisma
        await prisma.file.deleteMany({
            where:{
                folderPath:{
                    startsWith:folderPath
                },
                userId:userId
                }}
        );
        return NextResponse.json({message:"Folder deleted successfully"},{status:200});
    }
    catch(error) {
        console.log(error);
        return NextResponse.json({error:"Error in deleting folder: "+error.message},{status:500});
    }
}

export async function POST(req) {
    try {
        const { userId, path, name } = await req.json();
        
        if (!userId || !path || !name) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        let folderKey = `users/${userId}${path}${name}`;
        if (!folderKey.endsWith("/")) {
            folderKey += "/";
        }

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: folderKey,
            Body: Buffer.from("")
        });

        await s3Client.send(command);
        
        return NextResponse.json({ message: "Folder created successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating folder: " + error.message }, { status: 500 });
    }
}
