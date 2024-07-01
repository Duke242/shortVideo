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
      <div className="overflow-x-hidden bg-gray-50">
        <header className="py-4 md:py-6">
          <div className="container px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <Link
                  href="#"
                  className="flex items-center gap-1 font-bold text-base text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
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

              <div className="flex lg:hidden">
                <button type="button" className="text-gray-900">
                  <span aria-hidden="true">
                    <svg
                      className="w-7 h-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="hidden lg:flex lg:ml-16 lg:items-center lg:justify-center lg:space-x-10 xl:space-x-16">
                <Link
                  href="#features"
                  className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Features
                </Link>

                <Link
                  href="#pricing"
                  className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Pricing
                </Link>

                <Link
                  href="#faq"
                  className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                >
                  FAQ
                </Link>
              </div>

              <div className="hidden lg:ml-auto lg:flex lg:items-center lg:space-x-10">
                <ButtonSignin
                  extraStyle="text-base bg-gray-200 hover:bg-gray-300 px-5 hover:scale-105 font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none focus:ring-1 focus:ring-offset-2"
                  text="Sign In"
                />
              </div>
            </div>
          </div>
        </header>
      </div>

      <section className="pt-12 bg-gray-50 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
              Convert your short form videos into different{" "}
              <span className="relative inline-flex sm:inline">
                <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
                <span className="relative"> languages </span>
              </span>
            </p>
            <p className="mt-8 text-base text-gray-500 font-inter text-lg">
              Easily translate and share your short-form videos across multiple
              platforms with a single click.
            </p>

            <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
              <ButtonSignin extraStyle="inline-flex mb-10 items-center justify-center w-full px-8 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-md font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" />
            </div>
          </div>
        </div>
        <div className="pb-12 bg-white min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6 mt-10 text-gray-700">
            Global Reach, Local Feel: See Our Dubbing In Action!
          </h2>
          <div className="w-full max-w-4xl px-4 mx-auto">
            <div className="relative pt-[56.25%]">
              {" "}
              {/* 16:9 Aspect Ratio */}
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src={`https://youtube.com/embed/${selectedLanguage.videoId}?rel=0`}
                title={`${selectedLanguage.name} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="flex justify-center mt-8 flex-wrap gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  selectedLanguage.code === lang.code
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                {lang.name}
              </button>
            ))}
            <span className="text-base text-gray-500 ml-2 my-auto">
              and many more languages!
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
