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
  console.log("Starting fetchUserChannelVideos function")
  console.log(`Access Token (first 10 chars): ${accessToken.substring(0, 10)}...`)
  console.log(`Refresh Token (first 10 chars): ${refreshToken.substring(0, 10)}...`)
  console.log(`Max Results: ${maxResults}`)

  const apiKey = process.env.GOOGLE_API_KEY
  const clientId = process.env.GOOGLE_ID
  const clientSecret = process.env.GOOGLE_SECRET

  if (!apiKey || !clientId || !clientSecret) {
    console.error("Google API credentials are not set")
    throw new Error("Google API credentials are not set")
  }
  console.log(`API Key (first 10 chars): ${apiKey.substring(0, 10)}...`)

  const oauth2Client = new OAuth2Client(clientId, clientSecret)
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  console.log("OAuth2Client created and credentials set")

  const youtube: youtube_v3.Youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  })
  console.log("YouTube client created")

  try {
    // Attempt to refresh the token before making any requests
    const refreshedTokens = await oauth2Client.refreshAccessToken()
    const newAccessToken = refreshedTokens.credentials.access_token
    console.log("Token refreshed successfully")
    console.log(`New Access Token (first 10 chars): ${newAccessToken?.substring(0, 10)}...`)
    console.log({newAccessToken})
    // Update the YouTube client with the new access token
    youtube.context._options.auth = oauth2Client

    console.log("Attempting to fetch channel ID")
    const channelResponse: youtube_v3.Schema$ChannelListResponse = (
      await youtube.channels.list({
        part: ["id"],
        mine: true,
      })
    ).data
    // console.log("Channel response received:", JSON.stringify(channelResponse, null, 2))

    const channelId: string | undefined = channelResponse.items?.[0].id

    if (!channelId) {
      console.error("Channel ID not found in the response")
      throw new Error("Channel ID not found in the response")
    }
    console.log(`Channel ID found: ${channelId}`)

    const videosResponse = await youtube.search.list({
      part: ["snippet"],
      channelId: channelId,
      maxResults: maxResults,
      order: "date",
      type: ["video"],
    })
    // console.log("Videos response received:", JSON.stringify(videosResponse.data, null, 2))

    const filteredVideos = videosResponse.data.items?.filter(
      (item: any) => item.id?.kind === "youtube#video"
    ) as VideoItem[]
    console.log(`Filtered ${filteredVideos.length} video items`)

    return filteredVideos
  } catch (error) {
    console.error("Error in fetchUserChannelVideos:", error)
    console.error("Error details:", (error as Error).message)
    console.error("Error stack:", (error as Error).stack)
    throw error
  }
}