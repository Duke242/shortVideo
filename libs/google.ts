'use server'
import { google, youtube_v3 } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import fetch from "node-fetch"
import { createClient } from "@supabase/supabase-js"

interface VideoItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: { url: string; width: number; height: number }
      medium: { url: string; width: number; height: number }
      high: { url: string; width: number; height: number }
    }
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
}

export default async function fetchUserChannelVideos(
  accessToken: string,
  refreshToken: string,
  maxResults: number = 25
): Promise<VideoItem[]> {


  const apiKey = process.env.GOOGLE_API_KEY
  const clientId = process.env.GOOGLE_ID
  const clientSecret = process.env.GOOGLE_SECRET

  if (!apiKey || !clientId || !clientSecret) {
    console.error("Google API credentials are not set")
    throw new Error("Google API credentials are not set")
  }


  const oauth2Client = new OAuth2Client(clientId, clientSecret)
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })


  const youtube: youtube_v3.Youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  })


  try {
    // Attempt to refresh the token before making any requests
    const refreshedTokens = await oauth2Client.refreshAccessToken()
    const newAccessToken = refreshedTokens.credentials.access_token
    // Update the YouTube client with the new access token
    youtube.context._options.auth = oauth2Client

    const channelResponse: youtube_v3.Schema$ChannelListResponse = (
      await youtube.channels.list({
        part: ["id"],
        mine: true,
      })
    ).data


    const channelId: string | undefined = channelResponse.items?.[0].id

    if (!channelId) {
      console.error("Channel ID not found in the response")
      throw new Error("Channel ID not found in the response")
    }


    const videosResponse = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      maxResults: maxResults,
      order: "date",
      type: ["video"],
    })


    const filteredVideos = videosResponse.data.items?.filter(
      (item: any) => item.id?.kind === "youtube#video"
    ) as VideoItem[]


    return filteredVideos
  } catch (error) {
    console.error("Error in fetchUserChannelVideos:", error)
    throw error
  }
}