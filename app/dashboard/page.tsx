import ButtonAccount from "@/components/ButtonAccount"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Subscribe from "@/components/Subscribe"
import VideoInput from "@/components/VideoInput"
export const dynamic = "force-dynamic"

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server component which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
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

    console.log({ session })

    // const { data: profiles, error: profileError } = await supabase
    //   .from("profiles")
    //   .select("has_access")
    //   .eq("id", session.user.id)

    // if (profileError) {
    //   throw new Error(profileError.message)
    // }
    // const { data: words, error } = await supabase
    //   .from("words")
    //   .select("*")
    //   .eq("creator_id", session.user.id)

    // if (error) {
    //   console.error("Error fetching words:", error.message)
    //   return null
    // }

    // interface Word {
    //   id: string
    //   word: string
    //   definition: string
    // }

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
            <VideoInput />
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
