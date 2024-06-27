"use client"
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import {
  MdOutlineCancel,
  MdPlaylistAdd,
  MdFileDownload,
  MdRefresh,
} from "react-icons/md"

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
  dubbedVideoUrl?: string
  status: "waiting" | "processing" | "completed" | "error"
}

const initialQueue: QueueItem[] = [
  {
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    outputLanguage: "es",
    status: "waiting",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=uHgt8giw1LY",
    outputLanguage: "fr",
    status: "processing",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    outputLanguage: "ja",
    status: "completed",

    dubbedVideoUrl: "https://example.com/dubbed-video-3.mp4",
  },
  {
    videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    outputLanguage: "de",
    status: "error",
  },
]

export default function VideoDownload({ videos }: { videos: Video[] }) {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
  const [queue, setQueue] = useState<QueueItem[]>(initialQueue)
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

  const addToQueue = () => {
    if (!videoUrl) {
      toast.error("Please select a video or enter a video URL.")
      return
    }
    setQueue((prevQueue) => [
      ...prevQueue,
      { videoUrl, outputLanguage, status: "waiting" },
    ])
    toast.success("Video added to queue")
    setVideoUrl("")
  }

  const removeFromQueue = (index: number) => {
    if (queue[index].status !== "processing") {
      setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index))
      toast.success("Video removed from queue")
    } else {
      toast.error("Cannot remove a video that is currently processing")
    }
  }

  const retryConversion = (index: number) => {
    if (queue[index].status === "error") {
      setQueue((prevQueue) =>
        prevQueue.map((item, i) =>
          i === index ? { ...item, status: "waiting" } : item
        )
      )
      toast.success("Video queued for retry")
      if (!isProcessingQueue) {
        processQueue()
      }
    }
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to download the video. Please try again.")
    }
  }

  const processQueue = async () => {
    if (queue.length === 0 || isProcessingQueue) {
      return
    }
    setIsProcessingQueue(true)

    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status !== "waiting") continue

      setCurrentProcessingIndex(i)
      setQueue((prevQueue) =>
        prevQueue.map((item, index) =>
          index === i ? { ...item, status: "processing" } : item
        )
      )

      try {
        const dubbedUrl = await handleConvertVideo(
          queue[i].videoUrl,
          queue[i].outputLanguage
        )
        if (dubbedUrl) {
          setQueue((prevQueue) =>
            prevQueue.map((item, index) =>
              index === i
                ? { ...item, dubbedVideoUrl: dubbedUrl, status: "completed" }
                : item
            )
          )
          toast.success(`Video dubbed successfully!`)
        }
      } catch (error) {
        console.error("Error processing queue item:", error)
        setQueue((prevQueue) =>
          prevQueue.map((item, index) =>
            index === i ? { ...item, status: "error" } : item
          )
        )
        if (error instanceof Error) {
          if (error.message.includes("limit reached")) {
            toast.error("You've reached your limit. Queue processing stopped.")
            break
          } else {
            toast.error(`Error processing video ${i + 1}: ${error.message}`)
          }
        } else {
          toast.error(`An unexpected error occurred processing video ${i + 1}.`)
        }
      }
    }

    setIsProcessingQueue(false)
    setCurrentProcessingIndex(null)
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
        throw error
      } else {
        throw new Error("An unexpected error occurred during video conversion")
      }
    }
  }

  return (
    <div className="flex flex-col items-start p-4">
      {queue.length > 0 && (
        <div className="w-full mb-8">
          <h3 className="text-xl font-bold mb-4">Queue</h3>
          <ul className="space-y-2">
            {queue.map((item, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-2 rounded-md ${
                  item.status === "processing"
                    ? "bg-yellow-100"
                    : item.status === "completed"
                    ? "bg-green-100"
                    : item.status === "error"
                    ? "bg-red-100"
                    : "bg-gray-100"
                }`}
              >
                <span className="truncate flex-1 mr-2">{item.videoUrl}</span>
                <span className="text-sm text-gray-600 mr-2">
                  {item.outputLanguage}
                </span>
                {item.status === "processing" && (
                  <span className="text-sm text-yellow-600 mr-2">
                    Processing...
                  </span>
                )}
                {item.status === "completed" && item.dubbedVideoUrl && (
                  <button
                    onClick={() =>
                      handleDownload(
                        item.dubbedVideoUrl!,
                        `dubbed-video-${item.outputLanguage}.mp4`
                      )
                    }
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <MdFileDownload className="inline mr-1" />
                    Download
                  </button>
                )}
                {item.status === "error" && (
                  <button
                    onClick={() => retryConversion(index)}
                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                  >
                    <MdRefresh className="inline mr-1" />
                    Retry
                  </button>
                )}
                {(item.status === "waiting" || item.status === "error") && (
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

      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-300 pb-2">
          YouTube Shorts
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-10">
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
        <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-4">
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
        <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-4">
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
  )
}
