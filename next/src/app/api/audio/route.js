import { NextResponse } from "next/server";
import { pollyClient } from "../../../../aws/aws.config.js";
import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export async function GET(req) {

  const searchParams = new URL(req.url).searchParams;
  const text = searchParams.get("text");
  const narrator = searchParams.get("narrator");
  if (!text || !narrator) {
    return NextResponse.json({ error: "Both 'text' and 'narrator' are required." }, { status: 400 });
  }

  try {
    const command = new SynthesizeSpeechCommand({
      Text: text,
      VoiceId: narrator, 
      OutputFormat: "mp3",
    });

    // Execute Polly Command
    const response = await pollyClient.send(command);

    // Stream MP3 Response
    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="${narrator}.mp3"`,
    });

    return new NextResponse(response.AudioStream, { headers, status: 200 });
  } catch (error) {
    console.error("Error generating voice:", error);
    return NextResponse.json({ error: "Failed to generate voice. Please try again." }, { status: 500 });
  }
}
