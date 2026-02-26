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
      question: "How can I reach support?",
      answer: "Contact us at dubify@proton.me",
      open: false,
    },
  ])

  const toggleFaq = (index: number) => {
    setFaq(
      faq.map((item, i) => ({
        ...item,
        open: i === index ? !item.open : false,
      }))
    )
  }

  return (
    <section className="py-16 bg-gray-50 sm:py-20 lg:py-28" id="faq">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto mt-10 space-y-4 md:mt-16">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-6 py-5"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-base font-semibold text-gray-900">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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
                className={`grid transition-all duration-200 ${
                  item.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
