"use client"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { MdOutlineCancel, MdPlaylistAdd } from "react-icons/md"

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

interface QueueItem {
  videoUrl: string
  outputLanguage: string
  autoUpload: boolean
}

export default function VideoInput({ videos }: { videos: Video[] }) {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [autoUpload, setAutoUpload] = useState(false)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<
    number | null
  >(null)

  useEffect(() => {
    if (queue.length > 0 && !isProcessingQueue) {
      processQueue()
    }
  }, [queue, isProcessingQueue])

  const handleVideoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(event.target.value)
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

  const handleUploadToYouTube = async (
    videoUrlToUpload: string,
    language: string
  ) => {
    if (!videoUrlToUpload) {
      toast.error("No dubbed video available to upload.")
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch("/api/youtube/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: videoUrlToUpload,
          title: `Dubbed Video - ${language}`,
          language: language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload video to YouTube")
      }

      setIsUploading(false)
      toast.success(`Video successfully uploaded to YouTube!`)
    } catch (error) {
      console.error("Error uploading video:", error)
      setIsUploading(false)
      if (error instanceof Error) {
        toast.error(`Failed to upload video to YouTube: ${error.message}`)
      } else {
        toast.error("An unexpected error occurred during upload to YouTube")
      }
    }
  }

  const addToQueue = () => {
    if (!videoUrl) {
      toast.error("Please select a video or enter a video URL.")
      return
    }
    setQueue((prevQueue) => [
      ...prevQueue,
      { videoUrl, outputLanguage, autoUpload },
    ])
    toast.success("Video added to queue")
    setVideoUrl("")
  }

  const removeFromQueue = (index: number) => {
    if (index !== currentProcessingIndex) {
      setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index))
    }
  }

  const processQueue = async () => {
    if (queue.length === 0 || isProcessingQueue) {
      return
    }
    setIsProcessingQueue(true)

    while (queue.length > 0) {
      const item = queue[0]
      setCurrentProcessingIndex(0)
      try {
        const dubbedUrl = await handleConvertVideo(
          item.videoUrl,
          item.outputLanguage
        )
        if (dubbedUrl && item.autoUpload) {
          await handleUploadToYouTube(dubbedUrl, item.outputLanguage)
        }
        setQueue((prevQueue) => prevQueue.slice(1))
      } catch (error) {
        console.error("Error processing queue item:", error)

        if (error instanceof Error) {
          if (error.message.includes("limit reached")) {
            toast.error("You've reached your limit. Queue processing stopped.")
            setQueue([])
          } else {
            toast.error(`Error processing video: ${error.message}`)
            setQueue([])
          }
        } else {
          toast.error("An unexpected error occurred. Queue processing stopped.")
          setQueue([])
        }
      }
    }
    setIsProcessingQueue(false)
    setCurrentProcessingIndex(null)
    toast.success("Queue processing completed")
  }

  const handleConvertVideo = async (
    videoUrl: string,
    outputLang: string
  ): Promise<string | null> => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video: videoUrl,
          outputLanguage: outputLang,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to convert video")
      }

      const data = await response.json()
      const dubbingId = data.dubbingId

      const pollDubbingStatus = async (): Promise<string> => {
        const statusResponse = await fetch(
          `/api/convert?id=${dubbingId}&targetLang=${outputLang}`
        )
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json()
          throw new Error(errorData.error || "Failed to check dubbing status")
        }
        const statusData = await statusResponse.json()

        if (statusData.status === "completed") {
          setIsLoading(false)
          return statusData.preSignedUrl
        } else if (statusData.status === "error") {
          throw new Error("An error occurred while dubbing the video")
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000))
          return pollDubbingStatus()
        }
      }

      return await pollDubbingStatus()
    } catch (error) {
      setIsLoading(false)
      if (error instanceof Error) {
        throw error // Re-throw the error to be caught in processQueue
      } else {
        throw new Error("An unexpected error occurred during video conversion")
      }
    }
  }

  return (
    <div className="flex flex-col items-start">
      {queue.length > 0 && (
        <div className="mt-8 w-full mb-8">
          <h3 className="text-xl font-bold mb-4">Queue</h3>
          <p>
            This might take a while. Please queue all your videos and you can
            continue with other tasks, but do not close the page.
          </p>
          <ul className="space-y-2">
            {queue.map((item, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 rounded-md ${
                  index === currentProcessingIndex
                    ? "bg-yellow-100"
                    : "bg-gray-100"
                }`}
              >
                <span className="truncate flex-1 mr-2">{item.videoUrl}</span>
                <span className="text-sm text-gray-600 mr-2">
                  {item.outputLanguage}
                </span>
                <span className="text-sm text-gray-600 mr-2">
                  {item.autoUpload ? "Auto-upload" : "Manual upload"}
                </span>
                {index === currentProcessingIndex ? (
                  <span className="text-sm text-yellow-600 mr-2">
                    Processing...
                  </span>
                ) : (
                  <button
                    onClick={() => removeFromQueue(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdOutlineCancel />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">My YouTube Videos</h2>
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
            placeholder="Please enter the YouTube or TikTok video URL"
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
        <div className="w-full md:w-1/3 flex flex-col items-start">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="autoUpload"
              checked={autoUpload}
              onChange={(e) => setAutoUpload(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="autoUpload" className="text-sm text-gray-700">
              Auto-upload to YouTube
            </label>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-start">
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              onClick={addToQueue}
              disabled={!videoUrl}
            >
              <MdPlaylistAdd className="inline mr-2" />
              Add to Queue
            </button>
          </div>
        </div>
      </div>

      {showPopup && dubbedVideoUrl && (
        <DubbedVideoPopup
          videoUrl={dubbedVideoUrl}
          onClose={() => setShowPopup(false)}
          onUpload={() => handleUploadToYouTube(dubbedVideoUrl, outputLanguage)}
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
