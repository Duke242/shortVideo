import { NextApiRequest } from "next"
import { NextResponse } from "next/server"
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import crypto from "crypto"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

type DubbingDetails = {
  status: string
}

type DubbingResponse = {
  dubbing_id: string
  target_lang: string
}

const uploadDubbedVideoToS3 = async (videoData: Buffer) => {
  const uniqueId = crypto.randomUUID()
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uniqueId}.mp4`,
    Body: videoData,
    ContentType: "video/mp4",
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    console.log("Dubbed video uploaded to S3")

    const command = new GetObjectCommand(params)
    const preSignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    })
    console.log("Pre-signed URL:", preSignedUrl)
    return preSignedUrl
  } catch (error) {
    console.error("Error uploading dubbed video to S3:", error)
    throw error
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
      const targetLang = req.query.targetLang as string

      if (!targetLang) {
        return NextResponse.json(
          { error: "Missing target language" },
          { status: 400 }
        )
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/dubbing/${dubbingId}/audio/${targetLang}`,
        options
      )

      if (response.ok) {
        const videoData = await response.arrayBuffer()
        const preSignedUrl = await uploadDubbedVideoToS3(Buffer.from(videoData))
        return NextResponse.json(
          { status: "completed", preSignedUrl },
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
