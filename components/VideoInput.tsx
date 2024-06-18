"use client"
import React, { useState } from "react"
import toast from "react-hot-toast"

interface Video {
  id: string
  title: string
  thumbnailUrl: string
  duration: string
  uploadTime: string
  views: string
  author: string
  videoUrl: string
  description: string
  subscriber: string
  isLive: boolean
}

export default function VideoInput({ videos }: { videos: Video[] }) {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [dubbingStatus, setDubbingStatus] = useState<string | null>(null)
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState<string | null>(null)

  const handleVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVideoUrl = event.target.value
    setVideoUrl(newVideoUrl)
  }

  const handleVideoSelect = (selectedVideoUrl: string) => {
    if (selectedVideoUrl === videoUrl) {
      setVideoUrl("")
    } else {
      setVideoUrl(selectedVideoUrl)
    }
  }

  const handleConvertVideo = async () => {
    if (!videoUrl) {
      toast.error("Please select a video or enter a video URL.")
      return
    }

    setIsLoading(true)
    console.log(
      JSON.stringify({
        videoUrl: videoUrl,
        outputLanguage: outputLanguage,
      })
    )
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: videoUrl,
          outputLanguage: outputLanguage,
        }),
      })

      if (response.ok) {
        console.log("success")
        const data = await response.json()
        const dubbingId = data.dubbingId
        setDubbingStatus("pending")

        // Start polling for dubbing status
        const pollDubbingStatus = async () => {
          const statusResponse = await fetch(
            `/api/convert?id=${dubbingId}&targetLang=${outputLanguage}`
          )
          const statusData = await statusResponse.json()
          console.log({ statusData })
          if (statusData.status === "completed") {
            setDubbingStatus("completed")
            setDubbedVideoUrl(statusData.preSignedUrl)
            setIsLoading(false)
          } else if (statusData.status === "error") {
            setDubbingStatus("error")
            toast.error(
              "An error occurred while dubbing the video. Please try again."
            )
            setIsLoading(false)
          } else {
            // Continue polling if the dubbing is still in progress
            setTimeout(pollDubbingStatus, 5000)
          }
        }
        pollDubbingStatus()
      } else {
        const errorData = await response.json()
        toast.error(errorData.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error initiating dubbing:", error)
      toast.error(
        "An error occurred while initiating the dubbing process. Please try again."
      )
      setIsLoading(false)
    }
  }
  // const videos: [] = []
  return (
    <div className="flex flex-col items-start">
      {/* Render the videos */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Videos</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10">
          {videos?.map((video: Video) => (
            <div
              key={video.id}
              className={`bg-white shadow-md rounded-md overflow-hidden cursor-pointer ${
                videoUrl === video.videoUrl
                  ? "ring-4 ring-blue-500 scale-105 transition"
                  : ""
              }`}
              onClick={() => handleVideoSelect(video.videoUrl)}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Fixed bottom container */}
      <div className="fixed items-center flex flex-col md:flex-row bottom-0 left-0 right-0 p-4 md:px-10 bg-gray-200 rounded-t-2xl shadow-md z-10">
        <div className="w-full md:w-1/3 mb-4 md:mr-4">
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            className="mt-1 block w-full p-2 rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            placeholder="Enter the video URL"
          />
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mr-4">
          <label
            htmlFor="outputLanguage"
            className="block text-sm font-medium text-gray-700"
          >
            Output Language
          </label>
          <select
            id="outputLanguage"
            className="mt-1 block w-full p-2 rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="pl">Polish</option>
            <option value="tr">Turkish</option>
            <option value="ru">Russian</option>
            <option value="nl">Dutch</option>
            <option value="cs">Czech</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
            <option value="hu">Hungarian</option>
            <option value="ko">Korean</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        <div className="relative inline-flex group w-full md:w-1/3">
          <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
          <button
            className={`relative inline-flex items-center justify-center w-full px-6 py-3 md:px-8 md:py-3 mt-2 text-sm md:text-md font-semibold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:scale-105 whitespace-nowrap
    ${
      isLoading
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-500 text-white cursor-pointer"
    }`}
            onClick={handleConvertVideo}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs mr-1"></span>
                Dubbing...
              </>
            ) : (
              "Dub Video"
            )}
          </button>
        </div>
      </div>
      {dubbingStatus === "completed" && dubbedVideoUrl && (
        <div className="mt-4">
          <p className="text-green-500">Dubbing completed!</p>
          <video
            src={dubbedVideoUrl}
            className="mt-2 w-full rounded-md"
            controls
          />
        </div>
      )}
    </div>
  )
}
