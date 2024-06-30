"use client"
import React, { useState, ChangeEvent, FormEvent } from "react"
import Link from "next/link"

interface FormData {
  name: string
  email: string
  phone: string
  additional_info: string
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    additional_info: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch("/api/contactForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      setSubmitMessage(result.message)
      setFormData({ name: "", email: "", phone: "", additional_info: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage("An error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6">Contact Form</h1>
      <p className="mb-4">
        Need more from our service? We're here to help. Fill out this form and
        we'll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="additional_info" className="block mb-1">
            Additional Information (Optional)
          </label>
          <textarea
            id="additional_info"
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
            placeholder="Please provide any additional details about your increased usage needs..."
            rows={5}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {submitMessage && (
        <p
          className={`mt-4 ${
            submitMessage.includes("error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {submitMessage}
        </p>
      )}
    </div>
  )
}

export default ContactPage
