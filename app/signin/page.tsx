"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Provider } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import config from "@/config"
import logo from "@/app/icon.png"

export default function Login() {
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSignup = async (
    e: React.MouseEvent,
    options: {
      type: string
      provider?: Provider
    }
  ) => {
    e?.preventDefault()
    setIsLoading(true)

    try {
      const { type, provider } = options
      const redirectURL = window.location.origin + "/api/auth/callback"

      if (type === "oauth") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
            scopes:
              "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload",
          },
        })
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      data-theme={config.colors.theme}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src={logo}
              className="w-10"
              placeholder="blur"
              priority={true}
              width={40}
              height={40}
              alt="Logo"
            />
            <span className="text-2xl font-bold text-gray-900">Dubify</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-500">
            Sign in to start dubbing your videos
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          <button
            className="w-full flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            onClick={(e) =>
              handleSignup(e, { type: "oauth", provider: "google" })
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{" "}
            <Link href="/tos" className="text-blue-500 hover:text-blue-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-500 hover:text-blue-600"
            >
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
