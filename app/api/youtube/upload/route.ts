import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import fetch from "node-fetch"

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY
  const clientId = process.env.GOOGLE_ID
  const clientSecret = process.env.GOOGLE_SECRET

  if (!apiKey || !clientId || !clientSecret) {
    console.error("Google API credentials are not set")
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
  }

  try {
    // Get the session from Supabase
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const accessToken = session.provider_token
    const refreshToken = session.provider_refresh_token

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Missing OAuth tokens" }, { status: 401 })
    }

    const oauth2Client = new OAuth2Client(clientId, clientSecret)
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    // Refresh the token before creating the YouTube client
    const refreshedTokens = await oauth2Client.refreshAccessToken()
    const newAccessToken = refreshedTokens.credentials.access_token

    const youtube = google.youtube({ 
      version: "v3", 
      auth: oauth2Client 
    })

    const { videoUrl, title, description, tags, language } = await req.json()

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 })
    }

    // Fetch the video
    const videoResponse = await fetch(videoUrl)
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`)
    }

    const contentType = videoResponse.headers.get("content-type") || "video/mp4"

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description: description || "#Shorts",
          tags,
          defaultLanguage: language,
          defaultAudioLanguage: language,
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: videoResponse.body,
        mimeType: contentType,
      },
    })

    return NextResponse.json({ videoId: response.data.id }, { status: 200 })
  } catch (error) {
    console.error("Error uploading video:", error)
    return NextResponse.json(
      { error: "Failed to upload video", details: (error as Error).message },
      { status: 500 }
    )
  }
}