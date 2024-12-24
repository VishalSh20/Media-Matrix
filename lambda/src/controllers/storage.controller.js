import { GetObjectCommand,PutObjectCommand,DeleteObjectCommand,CopyObjectCommand ,ListObjectsV2Command} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../config.js";

const validImageTypes = [
    "image/jpeg",  
    "image/jpg",   
    "image/png",   
    "image/gif",   
    "image/webp", 
    "image/bmp",   
    "image/tiff",
    "image/svg+xml" 
  ];

const validVideoTypes = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm"
];


// media related functions - upload, get all, rename, delete
export async function getMediaUploadURL(req,res){
    try{
    let {userId,folderKey="/",filename,type} = req.query;

    if(!userId)
        return res.status(400).json({error:"User ID is required"});

    if([filename,size,type].some(field => !field))
        return res.status(400).json({error:"All fields are required"});

    if(!validImageTypes.includes(type) && !validVideoTypes.includes(type))
        return res.status(400).json({error:"Invalid media type - only images and videos are allowed"});

    if(!folderKey.endsWith("/"))
        folderKey = folderKey + "/";

    const extension = type.substring(type.indexOf("/")+1);
    const key = (folderKey && folderKey.length>0) ? `users/${userId}${folderKey}${filename}-${Date.now()}.${extension}` : `${userId}/${filename}-${Date.now()}.${extension}`;
    console.log(key);
    const command = new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:key,
        ContentType:type,
    });
    const postingURL = await getSignedUrl(s3Client,command);
    res.status(200).json({url:postingURL,key:key});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

export const getAllMedia = async (req,res) => {
    try {
        const {userId} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  

        const listOptions = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Prefix:`users/${userId}/`
        };
        const command = new ListObjectsV2Command(listOptions);
        const response = await s3Client.send(command);

        let files = response.Contents?.filter(content => !content.Key.endsWith("/")) || [];
        let folders = response.Contents?.filter(content => content.Key.endsWith("/")).map((folder)=>{
            return {
                key:folder.Key,
                name:folder.Key.substring(folder.Key.lastIndexOf("/")+1),
            }
        }) || [];
        
        for(let file of files){
            const getCommand = new GetObjectCommand({
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:file.Key
            });
            const fileURL = await getSignedUrl(s3Client,getCommand);
            file.url = fileURL;
            file.filename = file.Key.substring(file.Key.lastIndexOf("/")+1);
            file.extension = file.Key.substring(file.Key.lastIndexOf(".")+1);
        }
        const images = files.filter(file => validImageTypes.includes(`image/${file.extension}`));
        const videos = files.filter(file => validVideoTypes.includes(`video/${file.extension}`));

        return res.status(200).json({
            message:"Media fetched successfully",
            data:{
                images,
                videos,
                folders
            }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

export const renameMedia = async (req,res) => {
    try {
        let {userId,oldKey,newKey} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  
        if(!oldKey)
            return res.status(400).json({error:"Old Key is required"});
        if(!newKey)
            return res.status(400).json({error:"New key is required"});

        const copyCommand = new CopyObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            CopySource:`${process.env.AWS_BUCKET_NAME}/users/${userId}${oldKey}`,
            Key:`users/${userId}${newKey}`
        });
        await s3Client.send(copyCommand);

        const deleteCommand = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`users/${userId}${oldKey}`
        });
        await s3Client.send(deleteCommand);
        return res.status(200).json({message:"Media renamed successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

export const deleteMedia = async (req,res) => {
    try {
        const {userId,key} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  
        if(!key)
            return res.status(400).json({error:"Key is required"});

        const deleteCommand = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`users/${userId}${key}`
        });
        await s3Client.send(deleteCommand);
        return res.status(200).json({message:"Media deleted successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

// getting all contents at a given path
export const getContentList = async (req,res) => {
    try {
        let {userId,key} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  
        if(!key)
            return res.status(400).json({error:"Key is required"});
        if(!key.endsWith("/"))
            key = key + "/";

        const listOptions = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Prefix:`users/${userId}${key}`,
            Delimiter:"/"
        };
        const command = new ListObjectsV2Command(listOptions);
        const response = await s3Client.send(command);
        const folders = response.CommonPrefixes?.map(prefix => prefix.Prefix.substring((userId+key).length)) || [];
        let files = response.Contents?.filter(content => !content.Key.endsWith("/")) || [];
        for(let file of files){
            const getCommand = new GetObjectCommand({
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:file.Key
            });
            const fileURL = await getSignedUrl(s3Client,getCommand);
            file.url = fileURL;
            file.filename = file.Key.substring(file.Key.lastIndexOf("/")+1);
            file.extension = file.Key.substring(file.Key.lastIndexOf(".")+1);
        }

        return res.status(200).json({
            message:"Contents fetched successfully",
            data:{
                folders,
                files,
                KeyCount:response.KeyCount,
                MaxKeys:response.MaxKeys,
                IsTruncated:response.IsTruncated,
                ContinuationToken:response.ContinuationToken,
                NextContinuationToken:response.NextContinuationToken,
                StartAfter:response.StartAfter
            }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

// folder related functions - create, rename, delete
export const createFolder = async (req,res) => {
    try{
        let {userId,key} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  
        if(!key)
            return res.status(400).json({error:"Key is required"});
       if(!key.endsWith("/"))
            key = key + "/";
    
        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`users/${userId}${key}`,
            Body:Buffer.from("")
        });
        await s3Client.send(command);
        return res.status(200).json({message:"Folder created successfully"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

export const renameFolder = async (req,res) => {
    try{
    let {userId,oldKey,newKey} = req.query;
    if(!userId)
        return res.status(400).json({error:"User ID is required"});  
    if(!oldKey)
        return res.status(400).json({error:"Old Key is required"});
    if(!newKey)
        return res.status(400).json({error:"New key is required"});

    if(!oldKey.endsWith("/"))
        oldKey = oldKey + "/";
    if(!newKey.endsWith("/"))
        newKey = newKey + "/";

    const listCommand = new ListObjectsV2Command({
        Bucket:process.env.AWS_BUCKET_NAME,
        Prefix:`users/${userId}${oldKey}`
    });
    const listResponse = await s3Client.send(listCommand);
    console.log(listResponse);
    const objects = listResponse.Contents;

    for(let object of objects){
        const copyOptions ={
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`users/${userId}${newKey}${object.Key.substring((userId+oldKey).length)}`,
            CopySource:`${process.env.AWS_BUCKET_NAME}/users/${userId}${oldKey}`
        }
        console.log(copyOptions);
        const copyCommand = new CopyObjectCommand(copyOptions);
        await s3Client.send(copyCommand);

        const deleteOptions = {
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${object.Key}`
        };
        console.log(deleteOptions);

        const deleteCommand = new DeleteObjectCommand(deleteOptions);
        await s3Client.send(deleteCommand);    
    }
    
        return res.status(200).json({message:"Folder renamed successfully"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

export const deleteFolder = async (req,res) => {
    try {
        let {userId,key} = req.query;
        if(!userId)
            return res.status(400).json({error:"User ID is required"});  
        if(!key)
            return res.status(400).json({error:"Key is required"});
        if(!key.endsWith("/"))
            key = key + "/";

        const listCommand = new ListObjectsV2Command({
            Bucket:process.env.AWS_BUCKET_NAME,
            Prefix:`users/${userId}${key}`
        });
        const listResponse = await s3Client.send(listCommand);
        console.log(listResponse);
        const objects = listResponse.Contents;
        for(let object of objects){
            const deleteOptions = {
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:`${object.Key}`
            };
            const deleteCommand = new DeleteObjectCommand(deleteOptions);
            await s3Client.send(deleteCommand);
        }
        return res.status(200).json({message:"Folder deleted successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}   

