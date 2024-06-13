import { NextApiRequest, NextApiResponse } from "next"
import Replicate from "replicate"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { language } = req.query

    if (typeof language !== "string") {
      res.status(400).json({ error: "Invalid parameters" })
      return
    }

    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
      })

      const input = {
        input_audio:
          "https://replicate.delivery/pbxt/JWSAJpKxUszI0scNYatExIXZX2rJ78UBilGXCTq4Ct9BDwTA/sample_input_2.mp3",
      }

      const output = await replicate.run(
        "cjwbw/seamless_communication:668a4fec05a887143e5fe8d45df25ec4c794dd43169b9a11562309b2d45873b0",
        { input }
      )
      console.log(output)
      res.status(200).json(output)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "An error occurred" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
