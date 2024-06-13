import { NextApiRequest } from "next"
import { NextResponse } from "next/server"

type DubbingDetails = {
  status: string
}

type DubbingResponse = {
  dubbing_id: string
  target_lang: string
}

const getDubbingStatus = async (req: NextApiRequest) => {
  const dubbingId = req.query.id as string
  const targetLang = req.query.targetLang as string

  if (!dubbingId || !targetLang) {
    return NextResponse.json(
      { error: "Missing dubbing ID or target language" },
      { status: 400 }
    )
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
      const videoUrl = await getDubbedVideoUrl(dubbingId, targetLang)
      if (videoUrl) {
        return NextResponse.json(
          { status: "completed", videoUrl },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { status: "error", error: "Dubbed video not found" },
          { status: 404 }
        )
      }
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

const getDubbedVideoUrl = async (dubbingId: string, targetLang: string) => {
  console.log("Fetching dubbed video")

  const options = {
    method: "GET",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY },
  }

  const url = `https://api.elevenlabs.io/v1/dubbing/${dubbingId}/audio/${targetLang}`

  try {
    const response = await fetch(url, options)

    if (response.ok) {
      const videoBlob = await response.blob()
      const videoUrl = URL.createObjectURL(videoBlob)
      console.log("Dubbed Video URL:", videoUrl)
      return videoUrl
    } else if (response.status === 404) {
      console.error("Dubbed video not found")
      return null
    } else {
      console.error("Error fetching dubbed video:", response.statusText)
      throw new Error("Error fetching dubbed video")
    }
  } catch (error) {
    console.error("Error fetching dubbed video:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json()
    console.log("POST", requestBody)

    const videoUrl = requestBody.video as string
    const outputLanguage = requestBody.outputLanguage as string

    if (!videoUrl || !outputLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

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

    console.log("Sending POST request to initiate dubbing")
    const response = await fetch(
      "https://api.elevenlabs.io/v1/dubbing",
      options
    )
    const { dubbing_id }: DubbingResponse = await response.json()
    console.log(`Dubbing ID: ${dubbing_id}, Target Language: ${outputLanguage}`)

    return NextResponse.json(
      { dubbingId: dubbing_id, targetLang: outputLanguage },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in POST function:", error)
    return NextResponse.json(
      { error: "Error in POST function" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const dubbingId = searchParams.get("id")
  const targetLang = searchParams.get("targetLang")

  if (dubbingId && targetLang) {
    const apiReq: NextApiRequest = {
      method: "GET",
      query: { id: dubbingId, targetLang: targetLang },
    } as unknown as NextApiRequest

    return await getDubbingStatus(apiReq)
  } else {
    return NextResponse.json(
      { error: "Missing dubbing ID or target language" },
      { status: 400 }
    )
  }
}
