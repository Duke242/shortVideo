import axios from "axios"
import FormData from "form-data" // Import FormData from appropriate library

const languageCodes = ["en", "fr", "es"] // Example array of valid language codes

export interface ElevenLabDubRequest {
  url: string
  target_lang: string
  highest_resolution?: boolean
  num_speakers?: number
  start_time?: number
  end_time?: number
  source_lang?: string
}

export interface ElevenLabsDubResponse {
  dubbing_id: string
  expected_duration: string
}

export async function dubbing({
  url,
  target_lang,
  source_lang = "auto",
  end_time,
  start_time,
  highest_resolution = true,
  num_speakers = 0,
}: ElevenLabDubRequest): Promise<ElevenLabsDubResponse> {
  if (!languageCodes.includes(target_lang)) {
    throw new Error("Invalid Language Code")
  }

  try {
    const formData = new FormData()
    formData.append("source_url", url)
    formData.append("target_lang", target_lang)
    formData.append("mode", "automatic")
    formData.append("highest_resolution", highest_resolution ? "true" : "false")
    formData.append("num_speakers", num_speakers.toString())
    formData.append("source_lang", source_lang)

    const response = await axios.post(
      `${process.env.API_URL}/dubbing`,
      formData,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          ...formData.getHeaders(), // Ensure correct headers are set for FormData
        },
      }
    )

    return response.data as ElevenLabsDubResponse
  } catch (error) {
    console.error("Error during dubbing request:", error)
    // Handle error logging or throw a custom error
    throw new Error("Failed to perform dubbing request")
  }
}
