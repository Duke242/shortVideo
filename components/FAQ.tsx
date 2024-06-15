"use client"
import React, { useState } from "react"

interface FaqItem {
  question: string
  answer: string
  open: boolean
}

const Faq: React.FC = () => {
  const [faq, setFaq] = useState<FaqItem[]>([
    {
      question: "What do I get exactly?",
      answer:
        "Dub your short-form videos into other languages and post to other platforms with a click of a button.",
      open: false,
    },
    {
      question: "Is it a subscription?",
      answer: "Yes, choose a plan above.",
      open: false,
    },
    {
      question: "How can I reach to support?",
      answer: "Contact us at https://x.com/_Moe3301",
      open: false,
    },
  ])

  const toggleFaq = (index: number) => {
    setFaq(
      faq.map((item, i) => {
        if (i === index) {
          item.open = !item.open
        } else {
          item.open = false
        }

        return item
      })
    )
  }

  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24" id="faq">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {faq.map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                onClick={() => toggleFaq(index)}
              >
                <span className="flex text-lg font-semibold text-black">
                  {" "}
                  {item.question}{" "}
                </span>

                <svg
                  className={`w-6 h-6 text-gray-400 ${
                    item.open ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`${
                  item.open ? "block" : "hidden"
                } px-4 pb-5 sm:px-6 sm:pb-6`}
              >
                <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
