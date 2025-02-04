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
    let {userId,folderPath="/",filename,type} = req.query;

    if(!userId)
        return res.status(400).json({error:"User ID is required"});

    if([filename,type].some(field => !field))
        return res.status(400).json({error:"All fields are required"});

    if(!validImageTypes.includes(type) && !validVideoTypes.includes(type))
        return res.status(400).json({error:"Invalid media type - only images and videos are allowed"});

    if(!folderPath.endsWith("/"))
        folderPath = folderPath + "/";

    const extension = type.substring(type.indexOf("/")+1);
    const key = (folderPath && folderPath.length>0) ? `users/${userId}${folderPath}${filename}-${Date.now()}.${extension}` : `${userId}/${filename}-${Date.now()}.${extension}`;
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

        let files = response.Contents ? response.Contents.filter(content => !content.Key.endsWith("/")) : [];
        for(let file of files){
            const getCommand = new GetObjectCommand({
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:file.Key
            });
            const fileURL = await getSignedUrl(s3Client,getCommand);
            file.url = fileURL;
            file.path = file.Key.substring((`users/${userId}`).length);
            file.filename = file.Key.substring(file.Key.lastIndexOf("/")+1);
            file.name = file.filename.substring(0,file.filename.lastIndexOf("."));
            file.extension = file.Key.substring(file.Key.lastIndexOf(".")+1);
        }
        const images = files ? files.filter(file => validImageTypes.includes(`image/${file.extension}`)) : [];
        const videos = files ? files.filter(file => validVideoTypes.includes(`video/${file.extension}`)) : [];

        return res.status(200).json({
            message:"Media fetched successfully",
            data:{
                images,
                videos
            }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

export const renameMedia = async (req,res) => {
    try {
        let {oldKey,newKey} = req.query;
        if(!oldKey)
            return res.status(400).json({error:"Old Key is required"});
        if(!newKey)
            return res.status(400).json({error:"New key is required"});

        const copyCommand = new CopyObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            CopySource:`${process.env.AWS_BUCKET_NAME}/${oldKey}`,
            Key:`${newKey}`
        });
        await s3Client.send(copyCommand);

        const deleteCommand = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${oldKey}`
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
        const {key} = req.query;
        if(!key)
            return res.status(400).json({error:"Key is required"});

        const deleteCommand = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${key}`
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
        let {key} = req.query;
        if(!key)
            return res.status(400).json({error:"Key is required"});
        if(!key.endsWith("/"))
            key = key + "/";

        const pathDataRetrievalCommand = new ListObjectsV2Command({
            Bucket:process.env.AWS_BUCKET_NAME,
            Prefix:key,
            Delimiter:"/"
        });

        const pathDataRetrievalResponse = await s3Client.send(pathDataRetrievalCommand);

        const files = pathDataRetrievalResponse.Contents || [];
        for(let file of files){
            const getCommand = new GetObjectCommand({
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:file.Key
            });
            const fileURL = await getSignedUrl(s3Client,getCommand);
            file.url = fileURL;
            file.path = file.Key.substring(file.Key.indexOf('/',file.Key.indexOf('/')+1)),
            file.filename = file.Key.substring(file.Key.lastIndexOf("/")+1);
            file.extension = file.Key.substring(file.Key.lastIndexOf(".")+1);
        };
        const videos = files ? files.filter(file => validVideoTypes.includes(`video/${file.extension}`)) : [];
        const images = files ? files.filter(file => validImageTypes.includes(`image/${file.extension}`)) : [];


        let folders = (pathDataRetrievalResponse.CommonPrefixes || [])?.map(folder => {
            const prefix = folder.Prefix;
            return {
                key:prefix,
                path:prefix.substring(prefix.indexOf('/',prefix.indexOf('/')+1)),
                name:prefix.substring(prefix.substring(0,prefix.length-1).lastIndexOf("/")+1),
                Size:0,
            }
        });
        
        let totalSize = 0;
        for(let file of files){
            totalSize += file.Size;
        }
        for(let folder of folders){
            const folderDataRetrievalCommand = new ListObjectsV2Command({
                Bucket:process.env.AWS_BUCKET_NAME,
                Prefix:folder.key,
            });
            const folderDataRetrievalResponse = await s3Client.send(folderDataRetrievalCommand);
            const folderFiles = folderDataRetrievalResponse.Contents || [];
            for(let file of folderFiles){
                folder.Size += file.Size;
            }
        }
        
        return res.status(200).json({
            message:"Contents fetched successfully",
            data:{
                folders,
                videos,
                images,
                totalSize,
                Key:key,
                name:key.substring(0,key.lastIndexOf("/")).substring(key.lastIndexOf("/")+1),
                path:key.substring(key.indexOf("/",key.indexOf("/")+1)),
                MaxKeys:pathDataRetrievalResponse.MaxKeys,
                IsTruncated:pathDataRetrievalResponse.IsTruncated,
                ContinuationToken:pathDataRetrievalResponse.ContinuationToken,
                NextContinuationToken:pathDataRetrievalResponse.NextContinuationToken,
                StartAfter:pathDataRetrievalResponse.StartAfter
            }});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error - "+error.message});
    }
}

// folder related functions - create, rename, delete
export const createFolder = async (req,res) => {
    try{
        let {key} = req.query;
        if(!key)
            return res.status(400).json({error:"Key is required"});
       if(!key.endsWith("/"))
            key = key + "/";
    
        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${key}`,
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
    let {oldKey,newKey} = req.query;
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
        Prefix:`${oldKey}`
    });
    const listResponse = await s3Client.send(listCommand);
    const objects = listResponse.Contents;

    for(let object of objects){
        const copyOptions ={
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`${newKey}${object.Key.substring((userId+oldKey).length)}`,
            CopySource:`${process.env.AWS_BUCKET_NAME}/${object.Key}`
        }
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
        let {key} = req.query;
        if(!key)
            return res.status(400).json({error:"Key is required"});
        if(!key.endsWith("/"))
            key = key + "/";

        const listCommand = new ListObjectsV2Command({
            Bucket:process.env.AWS_BUCKET_NAME,
            Prefix:`${key}`
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

