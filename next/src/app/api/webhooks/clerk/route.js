import { Webhook } from 'svix'
import { headers } from 'next/headers'
import prisma from '../../../../../db/prisma_client.js';
import { NextResponse } from 'next/server';

async function registerUser(data){
  try {
    const {id,first_name,last_name,username,image_url,email_addresses,external_accounts} = data;
    if(!id)
      return new NextResponse.json({message:"Id is required"},{status:400});

    if(email_addresses.length === 0)
      return new NextResponse.json({message:"Email is required"},{status:400});

    const email = email_addresses[0].email_address;

    const user = await prisma.user.create({
      data:{
        id,
        name:(first_name ? first_name : "") + (last_name ? last_name : ""),
        username,
        email
      }
    });

    return NextResponse.json({message:"User created successfully",user:user},{status:200});

  } catch (error) {
      console.log(error);
      return  NextResponse.json({message:error.message||"Error in user creation"},{status:500});
  }
 
}


async function updateUser(data) {
  try {
    const {id,first_name,last_name,username,image_url,email_addresses,external_accounts} = data;
    if(!id)
      return new NextResponse.json({message:"Id is required"},{status:400});

    if(email_addresses.length === 0)
      return new NextResponse.json({message:"Email is required"},{status:400});

    const email = email_addresses[0].email_address;
    const user = await prisma.user.update({
      where:{id},
      data:{
        name:(first_name ? first_name : "") + (last_name ? last_name : ""),
        username,
        email,
        imageurl:image_url||"",
      }
    });

    return NextResponse.json({message:"user updated successfully",user:user},{status:200});

  } catch (error) {
      console.log(error);
      return  NextResponse.json({message:error.message||"Error in user updation"},{status:500});
  }

}

async function deleteUser(data) {
  try {
    const { id } = data;
    
    if (!id) {
      return NextResponse.json({ message: "Id is required for deletion" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User does not exist" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message || "Error occurred while deleting user" }, { status: 500 });
  }
}


export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt=null;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return NextResponse({message:'Error occured'}, {
      status: 400,
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const eventType = evt.type
  if(eventType === "user.created")
    return registerUser(payload.data);
  else if(eventType === "user.updated")
    return updateUser(payload.data);
  else if(eventType === "user.deleted")
    return deleteUser(payload.data);

  return NextResponse({message:"Invalid webhook request"}, { status: 500 });
}