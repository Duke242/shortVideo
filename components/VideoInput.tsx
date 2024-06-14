"use client"
import React, { useState } from "react"
import toast from "react-hot-toast"

export default function VideoInput() {
  const [videoUrl, setVideoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [dubbingStatus, setDubbingStatus] = useState<string | null>(null)
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState<string | null>(null)

  const handleVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value)
  }

  const handleConvertVideo = async () => {
    if (!videoUrl) {
      toast.error("Please enter a video URL.")
      return
    }

    setIsLoading(true)
    console.log(JSON.stringify({ videoUrl, outputLanguage: outputLanguage }))
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
          } else if (statusData.status === "error") {
            setDubbingStatus("error")
            toast.error(
              "An error occurred while dubbing the video. Please try again."
            )
          } else {
            // Continue polling if the dubbing is still in progress
            setTimeout(pollDubbingStatus, 5000)
          }
        }
        pollDubbingStatus()
      } else {
        console.error("Error initiating dubbing:", response.statusText)
        toast.error(
          "An error occurred while initiating the dubbing process. Please try again."
        )
      }
    } catch (error) {
      console.error("Error initiating dubbing:", error)
      toast.error(
        "An error occurred while initiating the dubbing process. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start">
      <div className="w-full">
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
      <div className="mt-4 w-full">
        <label
          htmlFor="outputLanguage"
          className="block text-sm font-medium text-gray-700"
        >
          Output Language
        </label>
        <select
          id="outputLanguage"
          className="mt-1 block w-fit p-2 rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
      <button
        className={`mt-4 px-6 py-3 rounded-md w-fit mx-auto ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white cursor-pointer"
        }`}
        onClick={handleConvertVideo}
        disabled={isLoading}
      >
        {isLoading ? "Dubbing..." : "Dub Video"}
      </button>
      {dubbingStatus === "pending" && (
        <p className="mt-4 text-gray-500">Dubbing in progress...</p>
      )}
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
