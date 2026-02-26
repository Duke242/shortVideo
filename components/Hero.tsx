"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import ButtonSignin from "./ButtonSignin"
import logo from "@/app/icon.png"

const languages = [
  { code: "en", name: "English", videoId: "dkXdknIpI1g" },
  { code: "es", name: "Español", videoId: "Z45dglcqGxc" },
  { code: "de", name: "Deutsch", videoId: "nvYEAGxBeZg" },
  { code: "zh", name: "中文", videoId: "PjeJGzXNz18" },
  { code: "hi", name: "हिन्दी", videoId: "-TMqXcJfEaU" },
  { code: "ja", name: "日本語", videoId: "SLrm6gXCDqQ" },
]

const Hero = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  return (
    <>
      <div className="overflow-x-hidden bg-gradient-to-b from-white to-gray-50">
        <header className="py-4 md:py-6">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <Link
                  href="#"
                  className="flex items-center gap-2 font-bold text-gray-900 transition-all duration-200 hover:opacity-80"
                >
                  <Image
                    src={logo}
                    className="w-8"
                    placeholder="blur"
                    priority={true}
                    width={32}
                    height={32}
                    alt="Logo"
                  />
                  <span className="text-2xl text-gray-900">Dubify</span>
                </Link>
              </div>

              <div className="hidden lg:flex lg:items-center lg:gap-10">
                <Link
                  href="#features"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#faq"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </div>

              <div className="hidden lg:flex lg:items-center">
                <ButtonSignin
                  extraStyle="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                  text="Sign In"
                />
              </div>
            </div>
          </div>
        </header>
      </div>

      <section className="pt-16 pb-12 bg-gradient-to-b from-gray-50 to-white sm:pt-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-tight tracking-tight">
              Convert your short form videos into different{" "}
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-transparent">
                  languages
                </span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
              Easily translate and share your short-form videos across multiple
              platforms with a single click.
            </p>

            <div className="mt-10">
              <ButtonSignin extraStyle="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        <div
          className="pb-16 bg-white flex flex-col items-center justify-center"
          id="videos"
        >
          <h2 className="text-2xl font-semibold text-center mb-8 mt-20 text-gray-800">
            Global Reach, Local Feel: See Our Dubbing In Action
          </h2>
          <div className="w-full max-w-4xl px-4 mx-auto">
            <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://youtube.com/embed/${selectedLanguage.videoId}?rel=0`}
                title={`${selectedLanguage.name} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="flex justify-center mt-8 flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  selectedLanguage.code === lang.code
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {lang.name}
              </button>
            ))}
            <span className="text-sm text-gray-400 ml-2 my-auto">
              +30 more languages
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
