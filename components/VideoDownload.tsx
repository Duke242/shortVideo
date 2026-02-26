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

const statusConfig = {
  waiting: {
    label: "Waiting",
    classes: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
  },
  processing: {
    label: "Processing",
    classes: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400 animate-pulse",
  },
  completed: {
    label: "Completed",
    classes: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-400",
  },
  error: {
    label: "Error",
    classes: "bg-red-50 text-red-700",
    dot: "bg-red-400",
  },
}

export default function VideoDownload({ videos }: { videos: Video[] }) {
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState("en")
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

  const addToQueue = () => {
    if (!videoUrl) {
      toast.error("Please select a video or enter a video URL.")
      return
    }
    setQueue((prevQueue) => [
      ...prevQueue,
      { videoUrl, outputLanguage, status: "waiting" },
    ])
    setVideoUrl("")
  }

  const removeFromQueue = (index: number) => {
    if (queue[index].status !== "processing") {
      setQueue((prevQueue) => prevQueue.filter((_, i) => i !== index))
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
    <div className="flex flex-col">
      {queue.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Dubbing Queue
            </h3>
            <span className="text-sm text-gray-500">
              {queue.filter((i) => i.status === "completed").length}/{queue.length} completed
            </span>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
            <p className="text-sm text-blue-700">
              Processing may take a few minutes per video. Feel free to queue
              more videos, but please keep this page open.
            </p>
          </div>
          <div className="space-y-2">
            {queue.map((item, index) => {
              const status = statusConfig[item.status]
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
                    <span className="text-sm text-gray-700 truncate">
                      {item.videoUrl}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase shrink-0">
                    {item.outputLanguage}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.classes}`}
                  >
                    {status.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.status === "completed" && item.dubbedVideoUrl && (
                      <button
                        onClick={() =>
                          handleDownload(
                            item.dubbedVideoUrl!,
                            `dubbed-video-${item.outputLanguage}.mp4`
                          )
                        }
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <MdFileDownload className="w-4 h-4" />
                        Download
                      </button>
                    )}
                    {item.status === "error" && (
                      <button
                        onClick={() => retryConversion(index)}
                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <MdRefresh className="w-4 h-4" />
                      </button>
                    )}
                    {(item.status === "waiting" || item.status === "error") && (
                      <button
                        onClick={() => removeFromQueue(index)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <MdOutlineCancel className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          TikTok Videos
        </h3>
        <p className="text-sm text-gray-500">
          TikTok videos won&apos;t appear below, but you can paste any TikTok
          URL in the input field to dub it.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your YouTube Shorts
        </h2>
        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-10">
            {videos.map((video: Video) => (
              <div
                key={video.id.videoId}
                className={`group relative bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  videoUrl ===
                  `https://www.youtube.com/watch?v=${video.id.videoId}`
                    ? "border-blue-500 shadow-lg shadow-blue-100 ring-2 ring-blue-500/20"
                    : "border-transparent hover:border-gray-200"
                }`}
                onClick={() => handleVideoSelect(video.id.videoId)}
              >
                <div className="relative">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full aspect-video object-cover"
                  />
                  {videoUrl ===
                    `https://www.youtube.com/watch?v=${video.id.videoId}` && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="white"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">
                    {video.snippet.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10 text-center">
            <p className="font-medium text-gray-700">
              No YouTube Shorts available
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You can still enter a video URL manually below.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-end gap-3">
            <div className="w-full md:flex-1">
              <label
                htmlFor="videoUrl"
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Video URL
              </label>
              <input
                type="text"
                id="videoUrl"
                className="block w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder="Paste a YouTube or TikTok video URL"
              />
            </div>
            <div className="w-full md:w-48">
              <label
                htmlFor="outputLanguage"
                className="block text-xs font-medium text-gray-500 mb-1.5"
              >
                Output Language
              </label>
              <select
                id="outputLanguage"
                className="block w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none appearance-none"
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
            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30"
              onClick={addToQueue}
              disabled={!videoUrl}
            >
              <MdPlaylistAdd className="w-5 h-5" />
              Add to Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
