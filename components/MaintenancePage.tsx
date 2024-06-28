"use client"
import React from "react"
import ButtonAccount from "@/components/ButtonAccount"

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center">
          <ButtonAccount />
        </div>

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Maintenance in Progress
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re sorry, we are currently experiencing technical
            difficulties.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Our team is working hard to resolve the issue. Please check back
            later.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenancePage
