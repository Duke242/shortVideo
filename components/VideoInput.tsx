"use client"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

export default function VideoInput() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [speaker, setSpeaker] = useState<File | null>(null)
  const [language, setLanguage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

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

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && isAcceptedFormat(file.type)) {
      setSelectedVideo(file)
    } else {
      toast.error(
        "Please select a valid audio file (flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm)."
      )
    }
  }

  const handleRemoveVideo = () => {
    setSelectedVideo(null)
  }

  const handleConvertVideo = async () => {
    if (selectedVideo && speaker && language && recordedAudioURL) {
      setIsLoading(true)
      try {
        const formData = new FormData()
        formData.append("file", selectedVideo)
        formData.append("speaker", speaker)
        formData.append("language", language)
        console.log({ selectedVideo, speaker, language })

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
        } else {
          console.error("Error generating transcription:", response.statusText)
        }
      } catch (error) {
        console.error("Error generating transcription:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error("Please fill in all the required fields.")
    }
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data)
      })

      mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks, { type: "audio/mpeg" })
        const file = new File([blob], "recorded_audio.mp3", {
          type: "audio/mpeg",
        })
        setSpeaker(file)
        setRecordedAudioURL(URL.createObjectURL(blob))
        setIsRecording(false)
      })

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast.error("Failed to start recording.")
    }
  }

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const handleSpeakerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "audio/mpeg") {
      setSpeaker(file)
    } else {
      toast.error("Please select a valid MP3 file.")
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
      <div className="mt-4 w-fit mr-auto">
        <label
          htmlFor="speaker"
          className="block text-sm font-medium text-gray-700"
        >
          Speaker
        </label>
        <div className="mt-1">
          <input
            type="file"
            accept=".mp3"
            id="speaker"
            className="sr-only"
            onChange={handleSpeakerChange}
          />
          <label
            htmlFor="speaker"
            className="block w-full p-2 rounded-md border-gray-300 border shadow-sm focus-within:border-blue-500 focus-within:ring-blue-500 sm:text-sm"
          >
            {speaker ? (
              <span>{speaker.name}</span>
            ) : (
              <span className="text-gray-500">
                Select an MP3 file or record your voice
              </span>
            )}
          </label>
          {!isRecording ? (
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-md bg-blue-500 text-white"
              onClick={handleStartRecording}
            >
              Record Voice
            </button>
          ) : (
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-md bg-red-500 text-white"
              onClick={handleStopRecording}
            >
              Stop Recording
            </button>
          )}
          {recordedAudioURL && (
            <div className="mt-2">
              <audio src={recordedAudioURL} controls />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 w-full">
        <label
          htmlFor="language"
          className="block text-sm font-medium text-gray-700"
        >
          Language
        </label>
        <select
          id="language"
          className="mt-1 block w-fit p-2 rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Select a language</option>
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
        className={`mt-4 px-6 py-3 rounded-md ${
          selectedVideo && speaker && language && !isLoading
            ? "bg-blue-500 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        onClick={handleConvertVideo}
        disabled={!selectedVideo || !speaker || !language || isLoading}
      >
        {isLoading ? "Converting..." : "Convert"}
      </button>
    </div>
  )
}
