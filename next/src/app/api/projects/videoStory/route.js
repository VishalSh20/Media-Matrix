import { NextResponse } from "next/server";
import prisma from "../../../../../db/prisma_client.js";
import { getCloudFrontSignedUrl } from "../../../../../aws/aws.config.js";

export async function GET(req,res){
    try {
        const searchParams = new URL(req.url).searchParams;
        const userId = searchParams.get("userId");
        const page = searchParams.get("page") || 1;
        const limit = searchParams.get("limit") || 10;
        const sort = searchParams.get("sort") || "createdAt";
        const order = searchParams.get("order") || "desc";

        if(!userId){
            return NextResponse.json({
                message: "User ID is required",
                status: 400
            });
        }

        console.log("Validating user existence...");
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if(!user){
            return NextResponse.json({
                message: "User not found",
                status: 404
            });
        }
        console.log("User validated successfully.");

        console.log("Fetching projects...");
        const projects = await prisma.videoStoryProject.findMany({
            where:{
                userId: userId
            },
            include:{
                scenes:true
            }
            ,
            orderBy:{
                [sort]: order
            },
            skip: (page - 1) * limit,
            take: limit
        });
        console.log("Projects fetched successfully.");

        for(let project of projects){
            project.totalScenes = project.scenes.length;
            project.title = project.description.slice(0, 20);
        }

        console.log("Getting cover images of projects...");
        for(const project of projects){
            if(project.scenes.length > 0){
                // get the scene details
                const sceneId = project.scenes[0].id;
                console.log("Getting scene details for sceneId:", sceneId);
                const scene = await prisma.scene.findFirst({
                    where:{
                        id: sceneId
                    },
                    include:{
                        assets:{
                            where:{
                                assetType: "IMAGE"
                            },
                            include:{
                                file:true
                            },
                            take:1
                        }
                    }
                });
                if(scene && scene.assets.length > 0){
                    project.coverImage = getCloudFrontSignedUrl(scene.assets[0].file.Key);
                }else{
                    project.coverImage = null;
                }

            }else{
                project.coverImage = null;
            }
        }

        const totalProjects = await prisma.videoStoryProject.count({
            where:{
                userId: userId
            }
        });
        
        const data = {
            projects,
            page: page,
            limit: limit,
            projectsFetched: projects.length,
            totalProjects,
            totalPages: Math.ceil(projects.length / limit)
        };
        return NextResponse.json({
            message: "Projects fetched successfully",
            status: 200,
            data: data
        });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({
            message: "Error fetching projects: "+error.message,
            status: 500
        });
    }
}