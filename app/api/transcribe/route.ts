import { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI()

export async function POST(request: NextRequest) {
  const file = await request.formData()
  const audioFile = file.get("file") as File

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  })

  return new Response(JSON.stringify({ transcription: transcription.text }))
}
