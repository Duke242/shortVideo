import { NextApiRequest, NextApiResponse } from "next"
import Replicate from "replicate"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { text, speaker, language } = req.query

    if (
      typeof text !== "string" ||
      typeof speaker !== "string" ||
      typeof language !== "string"
    ) {
      res.status(400).json({ error: "Invalid parameters" })
      return
    }

    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      })

      const output = await replicate.run(
        "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        {
          input: {
            text,
            speaker,
            language,
            cleanup_voice: "true",
          },
        }
      )

      res.status(200).json(output)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "An error occurred" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
