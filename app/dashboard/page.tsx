import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Subscribe from "@/components/Subscribe"
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

    const userAccess = profiles[0].has_access

    if (userAccess) {
      let videos: Video[] = []
      try {
        videos = (await fetchUserChannelVideos(
          session.provider_token,
          session.provider_refresh_token
        )) as Video[]
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error("Error fetching videos:", message)
        if (message.includes("exceeded your")) {
          videos = []
        } else {
          throw error
        }
      }

      return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">Dubify</span>
                <span className="hidden sm:inline text-sm text-gray-400">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dubbed-videos"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                  </svg>
                  Dubbed Videos
                </Link>
                <ButtonAccount />
              </div>
            </div>
          </header>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
            <VideoDownload videos={videos} />
          </section>
        </main>
      )
    } else {
      return <Subscribe />
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Error in Dashboard:", message)
    return <MaintenancePage />
  }
}
