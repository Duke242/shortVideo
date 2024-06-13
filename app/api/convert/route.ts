import { NextApiRequest, NextApiResponse } from "next"

type DubbingDetails = {
  status: string
}

type DubbingResponse = {
  dubbing_id: string
}

const dubVideo = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.video || !req.body.outputLanguage) {
    res.status(400).json({ error: "Missing required fields" })
    return
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
      "xi-api-key": "b9e7199312abd7f1f3df885e211bc78d",
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

    res.status(200).json({ dubbingId: dubbing_id })
  } catch (error) {
    console.error("Error in dubVideo function:", error)
    res.status(500).json({ error: "Error in dubVideo function" })
  }

  console.log("Finished dubVideo function")
}

const getDubbingStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const dubbingId = req.query.id as string

  if (!dubbingId) {
    res.status(400).json({ error: "Missing dubbing ID" })
    return
  }

  console.log("Fetching dubbing details")

  const options = {
    method: "GET",
    headers: { "xi-api-key": "b9e7199312abd7f1f3df885e211bc78d" },
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
      res.status(200).json({ status: "completed", videoUrl })
    } else if (data.status === "error") {
      res.status(200).json({ status: "error" })
    } else {
      res.status(200).json({ status: "pending" })
    }
  } catch (error) {
    console.error("Error fetching dubbing details:", error)
    res.status(500).json({ error: "Error fetching dubbing details" })
  }
}

const getDubbedVideoUrl = async (dubbingId: string) => {
  console.log("Fetching dubbed video")

  const options = {
    method: "GET",
    headers: { "xi-api-key": "b9e7199312abd7f1f3df885e211bc78d" },
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    await dubVideo(req, res)
  } else if (req.method === "GET" && req.query.id) {
    await getDubbingStatus(req, res)
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
