import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Subscribe from "@/components/Subscribe"
import VideoInput from "@/components/VideoInput"
import ButtonAccount from "@/components/ButtonAccount"
import fetchUserChannelVideos from "@/libs/google"
import VideoDownload from "@/components/VideoDownload"
import MaintenancePage from "@/components/MaintenancePage"
import Link from "next/link"

export const dynamic = "force-dynamic"

// Define the Video type
interface Video {
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
}

export default async function Dashboard() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("has_access")
      .eq("id", session.user.id)

    if (profileError) {
      throw new Error(profileError.message)
    }

    console.log({ session })

    const userAccess = profiles[0].has_access

    if (userAccess) {
      let videos: Video[] = []
      try {
        videos = (await fetchUserChannelVideos(
          session.provider_token,
          session.provider_refresh_token
        )) as Video[]
      } catch (error) {
        console.error("Error fetching videos:", error.message)
        if (error.message.includes("exceeded your")) {
          videos = []
        } else {
          throw error
        }
      }

      return (
        <main className="min-h-screen p-8 pb-24 bg-gray-50">
          <header className="w-full flex justify-between items-center">
            <ButtonAccount />
            <Link
              href="/dubbed-videos"
              className="btn bg-gray-300 hover:bg-gray-400 hover:scale-105 text-md"
            >
              Dubbed Videos
            </Link>
          </header>
          <section>
            {/* <VideoInput videos={videos} /> */}
            <VideoDownload videos={videos} />
          </section>
        </main>
      )
    } else {
      return <Subscribe />
    }
  } catch (error) {
    console.error("Error in Dashboard:", error.message)
    return <MaintenancePage />
  }
}
