import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import Replicate from "replicate"

const openai = new OpenAI()

export default async function handler(req: NextRequest) {
  if (req.method === "POST") {
    const formData = await req.formData()
    const audioFile = formData.get("file") as File
    const speaker = formData.get("speaker") as string
    const language = formData.get("language") as string

    console.log("Received request with:", audioFile, speaker, language)

    if (!audioFile || !speaker || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word"],
      })

      console.log("Transcription result:", transcription)

      const transcriptionText = transcription.text

      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      })

      const output = await replicate.run(
        "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        {
          input: {
            text: transcriptionText,
            speaker,
            language,
            cleanup_voice: "true",
          },
        }
      )

      console.log("Replicate output:", output)

      return NextResponse.json({ transcription: transcriptionText, output })
    } catch (error) {
      console.error("Error generating transcription or audio:", error)
      return NextResponse.json({ error: "An error occurred" }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  }
}
