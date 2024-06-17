import ButtonAccount from "@/components/ButtonAccount"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Subscribe from "@/components/Subscribe"
import VideoInput from "@/components/VideoInput"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query"
import axios from "axios"
export const dynamic = "force-dynamic"

export default async function Dashboard() {
  interface Profile {
    has_access: boolean
    // Add other properties as needed
  }
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
        // console.log({ videos })
        return videos
      } catch (error) {
        console.error("Error fetching videos:", error.message)
        return null
      }
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
      queryKey: ["videos"],
      queryFn: fetchVideos,
    })

    const dehydratedState = dehydrate(queryClient)

    // const { data: profiles, error: error } = await supabase
    //   .from("profiles")
    //   .select("has_access")
    //   .eq("id", session.user.id)

    // const userAccess = profiles[0].has_access
    const userAccess = true
    if (userAccess) {
      return (
        <main className="min-h-screen p-8 pb-24 bg-gray-50">
          <header className="max-w-xl mr-auto space-y-8 flex align-center">
            <ButtonAccount />
          </header>
          <section className="mt-8">
            <label
              htmlFor="video-input"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Select a short video:
            </label>
            <HydrationBoundary state={dehydratedState}>
              <VideoInput />
            </HydrationBoundary>
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
