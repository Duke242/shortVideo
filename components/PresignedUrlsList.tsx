"use client"

import React, { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MdFileDownload } from "react-icons/md"
import { SupabaseClient } from "@supabase/supabase-js"

interface PresignedUrl {
  id: string
  user_id: string
  video_url: string
  presigned_url: string
  created_at: string
  expires_at: string
}

const PresignedUrlsList: React.FC = () => {
  const [presignedUrls, setPresignedUrls] = useState<PresignedUrl[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const supabase: SupabaseClient = createClientComponentClient()

  useEffect(() => {
    const fetchPresignedUrls = async () => {
      try {
        setIsLoading(true)
        const now = new Date().toISOString()

        const { data, error } = await supabase
          .from("presigned_urls")
          .select("*")
          .gte("expires_at", now)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        setPresignedUrls(data as PresignedUrl[])
        console.log({ setPresignedUrls })
      } catch (err) {
        setError("Error fetching presigned URLs. Please try again later.")
        console.error("Error fetching presigned URLs:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPresignedUrls()
  }, [supabase])

  const handleDownload = async (
    url: string,
    filename: string
  ): Promise<void> => {
    try {
      console.log({ url })
      const response = await fetch(url)
      if (!response.ok) throw new Error("Network response was not ok")
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download the file. Please try again.")
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading your dubbed videos...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="mt-8">
      {presignedUrls.length === 0 ? (
        <p className="text-center">No active dubbed videos available.</p>
      ) : (
        <ul className="space-y-4">
          {presignedUrls.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow"
            >
              <div className="flex-1 mr-4">
                {/* <h3 className="font-semibold truncate">{item.video_url}</h3> */}
                <p className="text-sm text-gray-500">
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() =>
                  handleDownload(item.presigned_url, `dubbed-video.mp4`)
                }
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <MdFileDownload className="mr-2" />
                Download
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PresignedUrlsList
