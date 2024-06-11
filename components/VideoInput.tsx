"use client"
import { useState } from "react"
import toast from "react-hot-toast"

export default function VideoInput() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [transcription, setTranscription] = useState("")

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && isAcceptedFormat(file.type)) {
      setSelectedVideo(file)
    } else {
      toast(
        "Please select a valid audio file (flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm)."
      )
    }
  }

  const isAcceptedFormat = (mimeType: string) => {
    const acceptedFormats = [
      "audio/flac",
      "audio/mpeg",
      "audio/mp4",
      "audio/mpga",
      "audio/m4a",
      "audio/ogg",
      "audio/wav",
      "audio/webm",
      "video/mp4",
    ]
    return acceptedFormats.includes(mimeType)
  }

  const handleRemoveVideo = () => {
    setSelectedVideo(null)
  }

  const handleConvertVideo = async () => {
    if (selectedVideo) {
      setIsLoading(true)
      try {
        const formData = new FormData()
        formData.append("file", selectedVideo)
        console.log({ selectedVideo })

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setTranscription(data.transcription)
        } else {
          console.error("Error generating transcription:", response.statusText)
        }
      } catch (error) {
        console.error("Error generating transcription:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-96 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
        <input
          type="file"
          accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
          id="video-input"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleVideoChange}
        />
        <label
          htmlFor="video-input"
          className="flex flex-col items-center justify-center w-full h-full text-center cursor-pointer"
        >
          {selectedVideo ? (
            <video
              src={URL.createObjectURL(selectedVideo)}
              className="w-full h-full rounded-md"
              controls
            />
          ) : (
            <>
              <svg
                className="w-16 h-16 mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg text-gray-600">
                Drag and drop or click to select a file
              </span>
              <span className="text-sm text-gray-400">
                Accepted file formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg,
                wav, or webm
              </span>
            </>
          )}
        </label>
        {selectedVideo && (
          <button
            className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={handleRemoveVideo}
          >
            Remove
          </button>
        )}
      </div>
      <button
        className={`mt-4 px-6 py-3 rounded-md ${
          selectedVideo && !isLoading
            ? "bg-blue-500 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={handleConvertVideo}
        disabled={!selectedVideo || isLoading}
      >
        {isLoading ? "Converting..." : "Convert"}
      </button>
      {transcription && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  )
}
