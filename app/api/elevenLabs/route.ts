import { NextApiRequest } from "next"
import { NextResponse } from "next/server"

type DubbingDetails = {
  status: string
}

type DubbingResponse = {
  dubbing_id: string
}

const dubVideo = async (req: NextApiRequest) => {
  if (!req.body.video || !req.body.outputLanguage) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  const videoUrl = req.body.video as string
  const outputLanguage = req.body.outputLanguage as string

  console.log("Starting dubVideo function")

  const formData = new FormData()
  formData.append("mode", "automatic")
  formData.append("source_url", videoUrl)
  formData.append("target_lang", outputLanguage)
  formData.append("watermark", "true")

  const options = {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: formData,
  }

  try {
    console.log("Sending POST request to initiate dubbing")
    const response = await fetch(
      "https://api.elevenlabs.io/v1/dubbing",
      options
    )
    const { dubbing_id }: DubbingResponse = await response.json()
    console.log(`Dubbing ID: ${dubbing_id}, Target Language: ${outputLanguage}`)

    return NextResponse.json({ dubbingId: dubbing_id }, { status: 200 })
  } catch (error) {
    console.error("Error in dubVideo function:", error)
    return NextResponse.json(
      { error: "Error in dubVideo function" },
      { status: 500 }
    )
  }
}

const getDubbingStatus = async (req: NextApiRequest) => {
  const dubbingId = req.query.id as string

  if (!dubbingId) {
    return NextResponse.json({ error: "Missing dubbing ID" }, { status: 400 })
  }

  console.log("Fetching dubbing details")

  const options = {
    method: "GET",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/dubbing/${dubbingId}`,
      options
    )
    const data: DubbingDetails = await response.json()
    console.log("Dubbing Details:", data)

    if (data.status === "dubbed") {
      const videoUrl = await getDubbedVideoUrl(dubbingId)
      return NextResponse.json(
        { status: "completed", videoUrl },
        { status: 200 }
      )
    } else if (data.status === "error") {
      return NextResponse.json({ status: "error" }, { status: 200 })
    } else {
      return NextResponse.json({ status: "pending" }, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching dubbing details:", error)
    return NextResponse.json(
      { error: "Error fetching dubbing details" },
      { status: 500 }
    )
  }
}

const getDubbedVideoUrl = async (dubbingId: string) => {
  console.log("Fetching dubbed video")

  const options = {
    method: "GET",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
  }
  const url = `https://api.elevenlabs.io/v1/dubbing/${dubbingId}/audio`

  try {
    const response = await fetch(url, options)

    if (response.ok) {
      const videoBlob = await response.blob()
      const videoUrl = URL.createObjectURL(videoBlob)
      console.log("Dubbed Video URL:", videoUrl)
      return videoUrl
    } else {
      console.error("Error fetching dubbed video:", response.statusText)
      throw new Error("Error fetching dubbed video")
    }
  } catch (error) {
    console.error("Error fetching dubbed video:", error)
    throw error
  }
}

export async function POST(req: NextApiRequest) {
  return await dubVideo(req)
}

export async function GET(req: NextApiRequest) {
  if (req.query.id) {
    return await getDubbingStatus(req)
  } else {
    return NextResponse.json({ error: "Missing dubbing ID" }, { status: 400 })
  }
}
