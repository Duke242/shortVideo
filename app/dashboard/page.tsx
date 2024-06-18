import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Subscribe from "@/components/Subscribe"
import VideoInput from "@/components/VideoInput"
import axios from "axios"
import ButtonAccount from "@/components/ButtonAccount"

export const dynamic = "force-dynamic"

export default async function Dashboard() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const fetchVideos = async () => {
      try {
        const { data: videos } = await axios.get(
          "https://gist.githubusercontent.com/poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json"
        )
        return videos
      } catch (error) {
        console.error("Error fetching videos:", error.message)
        throw error
      }
    }

    const videos = await fetchVideos()

    const userAccess = true
    if (userAccess) {
      return (
        <main className="min-h-screen p-8 pb-24 bg-gray-50">
          <header className="max-w-xl mr-auto space-y-8 flex align-center">
            <ButtonAccount />
          </header>
          <section className="">
            <VideoInput videos={videos} />
          </section>
        </main>
      )
    } else {
      return <Subscribe />
    }
  } catch (error) {
    console.error("Error in Dashboard:", error.message)
    return <Subscribe />
  }
}
