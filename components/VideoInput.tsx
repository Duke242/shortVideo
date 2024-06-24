"use client"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { MdOutlineCancel } from "react-icons/md"

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

export default function VideoInput({ videos }: { videos: Video[] }) {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [dubbingStatus, setDubbingStatus] = useState<string | null>(null)
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVideoUrl = event.target.value
    setVideoUrl(newVideoUrl)
  }

  const handleVideoSelect = (selectedVideoId: string) => {
    const selectedVideo = videos.find(
      (video) => video.id.videoId === selectedVideoId
    )
    if (selectedVideo) {
      const newVideoUrl = `https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`
      setVideoUrl(newVideoUrl === videoUrl ? "" : newVideoUrl)
    }
  }

  const handleConvertVideo = async () => {
    if (!videoUrl) {
      toast.error("Please select a video or enter a video URL.")
      return
    }

    setIsLoading(true)
    console.log(
      JSON.stringify({ videoUrl: videoUrl, outputLanguage: outputLanguage })
    )

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video: videoUrl,
          outputLanguage: outputLanguage,
        }),
      })

      if (response.ok) {
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
            setShowPopup(true)
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

  const handleUploadToYouTube = async () => {
    if (!dubbedVideoUrl) {
      toast.error("No dubbed video available to upload.")
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch("/api/youtube/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: dubbedVideoUrl,
          title: `Dubbed`,
          // description: 'description',
          // tags: ["dubbed", outputLanguage],
          language: outputLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload video to YouTube")
      }

      // const { videoId } = await response.json()

      setIsUploading(false)
      setShowPopup(false)
      toast.success(`Video successfully uploaded to YouTube!`)
    } catch (error) {
      console.error("Error uploading video:", error)
      setIsUploading(false)
      toast.error("Failed to upload video to YouTube. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-start">
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Videos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-10">
          {videos?.map((video: Video) => (
            <div
              key={video.id.videoId}
              className={`bg-white shadow-md rounded-md overflow-hidden cursor-pointer ${
                videoUrl ===
                `https://www.youtube.com/watch?v=${video.id.videoId}`
                  ? "ring-4 ring-blue-500 scale-105 transition"
                  : ""
              }`}
              onClick={() => handleVideoSelect(video.id.videoId)}
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-semibold truncate">
                  {video.snippet.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

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
            <option value="ar">Arabic</option>
            <option value="bg">Bulgarian</option>
            <option value="zh">Chinese</option>
            <option value="hr">Croatian</option>
            <option value="cs">Czech</option>
            <option value="da">Danish</option>
            <option value="nl">Dutch</option>
            <option value="en">English</option>
            <option value="fil">Filipino</option>
            <option value="fi">Finnish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="el">Greek</option>
            <option value="hi">Hindi</option>
            <option value="hu">Hungarian</option>
            <option value="id">Indonesian</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="ms">Malay</option>
            <option value="pl">Polish</option>
            <option value="pt">Portuguese</option>
            <option value="ro">Romanian</option>
            <option value="ru">Russian</option>
            <option value="sk">Slovak</option>
            <option value="es">Spanish</option>
            <option value="sv">Swedish</option>
            <option value="ta">Tamil</option>
            <option value="tr">Turkish</option>
            <option value="uk">Ukrainian</option>
          </select>
        </div>
        <div className="relative inline-flex group w-full md:w-1/3">
          <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
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

      {showPopup && dubbedVideoUrl && (
        <DubbedVideoPopup
          videoUrl={dubbedVideoUrl}
          onClose={() => setShowPopup(false)}
          onUpload={handleUploadToYouTube}
          isUploading={isUploading}
        />
      )}
    </div>
  )
}

interface DubbedVideoPopupProps {
  videoUrl: string
  onClose: () => void
  onUpload: () => void
  isUploading: boolean
}

const DubbedVideoPopup: React.FC<DubbedVideoPopupProps> = ({
  videoUrl,
  onClose,
  onUpload,
  isUploading,
}) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="fixed inset-0 bg-black opacity-50"></div>
    <div className="bg-white rounded-md p-6 pt-3 z-10 relative max-w-3/4">
      <button
        className="flex ml-auto rounded-full mb-2 hover:scale-105 transition"
        onClick={onClose}
      >
        <MdOutlineCancel size={40} color="#e61630" />
      </button>
      <video src={videoUrl} className="w-full rounded-md" controls />
      <div className="mt-4 flex justify-end">
        <div className="relative inline-flex group w-full">
          <button
            onClick={onUpload}
            className={`flex mx-auto ${
              isUploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-700"
            } text-white font-bold py-2 px-14 rounded transition`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload to YouTube"}
          </button>
        </div>
      </div>
    </div>
  </div>
)
