import { NextResponse } from "next/server";
import { renderMediaOnLambda,getFunctions } from "@remotion/lambda";

export const POST = async (req) => {
  const { images, audioUrl, transcript, subtitleStyle, totalDuration } = await req.json();
  try {
 
    return NextResponse.json({ output:"rendered" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}