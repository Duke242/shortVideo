import { google } from "googleapis"
import { OAuth2Client } from "google-auth-library"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import fetch from "node-fetch"

export async function POST(req: NextRequest) {
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
      return NextResponse.json(
        { error: "Missing OAuth tokens" },
        { status: 401 }
      )
    }

    const oauth2Client = new OAuth2Client()
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    const youtube = google.youtube({ version: "v3", auth: oauth2Client })

    const { videoUrl, title, description, tags, language } = await req.json()

    if (!videoUrl) {
      return NextResponse.json(
        { error: "No video URL provided" },
        { status: 400 }
      )
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
          description: "#Shorts",
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
      { error: "Failed to upload video" },
      { status: 500 }
    )
  }
}
