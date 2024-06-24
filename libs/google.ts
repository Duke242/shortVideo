import { google, youtube_v3 } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import fetch from "node-fetch"

interface VideoItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
    publishedAt: string
    channelTitle: string
    description: string
  }
  // Custom properties (not directly from YouTube API)
  duration?: string
  views?: string
  videoUrl?: string
  subscriber?: string
  isLive?: boolean
}

export default async function fetchUserChannelVideos(
  accessToken: string,
  refreshToken: string,
  maxResults: number = 25
): Promise<VideoItem[]> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("Google API key is not set")
  }

  const oauth2Client = new OAuth2Client()
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  const youtube: youtube_v3.Youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  })

  try {
    // Get channel ID
    const channelResponse: youtube_v3.Schema$ChannelListResponse = (
      await youtube.channels.list({
        part: ["id"],
        mine: true,
        key: apiKey,
      })
    ).data

    // console.log("Channel Response:", JSON.stringify(channelResponse, null, 2))

    const channelId: string | undefined = channelResponse.items?.[0].id

    if (!channelId) {
      throw new Error("Channel ID not found in the response")
    }

    console.log("Channel ID:", channelId)

    // Fetch channel videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${channelId}&maxResults=${maxResults}&key=${apiKey}`

    const videosResponse = await fetch(videosUrl)

    if (!videosResponse.ok) {
      throw new Error(`HTTP error! status: ${videosResponse.status}`)
    }

    const videosData = await videosResponse.json()

    // console.log("Videos Data:", JSON.stringify(videosData, null, 2))

    return videosData.items
  } catch (error) {
    console.error(
      "Error fetching user's channel videos:",
      (error as Error).message
    )
    throw error
  }
}
