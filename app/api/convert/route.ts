import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import Replicate from "replicate"

const openai = new OpenAI()

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const formData = await req.formData()
    const video = formData.get("video") as File
    const audioFile = formData.get("audio") as File
    const outputLanguage = formData.get("outputLanguage") as string
    const inputLanguage = formData.get("inputLanguage") as string
    var translationText

    console.log("Received request with:", audioFile, outputLanguage)

    if (!audioFile || !outputLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const transcriptionOnly = inputLanguage === outputLanguage

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: video,
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word"],
        temperature: 0.2,
      })

      console.log("Transcription result:", transcription)

      const transcriptionText = transcription.text
      let textForSpeech = transcriptionText

      if (!transcriptionOnly) {
        const translation = await openai.audio.translations.create({
          file: video,
          model: "whisper-1",
          prompt: "Please translate this short form video for the user",
          temperature: 0.2,
        })
        translationText = translation.text
        textForSpeech = translationText
      }

      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      })

      const output = await replicate.run(
        "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        {
          input: {
            text: textForSpeech,
            speaker: audioFile,
            outputLanguage,
            cleanup_voice: true,
          },
        }
      )

      console.log("Replicate output:", output)

      return NextResponse.json({
        transcription: transcriptionText,
        translation: translationText,
        output,
      })
    } catch (error) {
      console.error("Error generating transcription or audio:", error)
      return NextResponse.json({ error: "An error occurred" }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  }
}
