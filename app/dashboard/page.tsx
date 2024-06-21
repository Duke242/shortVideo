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

    const { data: profiles, error: profileError } = await supabase
      .from("profiles") // Specify the type of data expected
      .select("has_access")
      .eq("id", session.user.id)

    if (profileError) {
      throw new Error(profileError.message)
    }

    const userAccess = profiles[0].has_access

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
