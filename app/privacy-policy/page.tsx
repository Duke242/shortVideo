import Link from "next/link"
import { getSEOTags } from "@/libs/seo"
import config from "@/config"

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
})

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <div className="font-sans leading-relaxed max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Privacy Policy
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            1. Introduction
          </h2>
          <p className="mb-4">
            Welcome to Dubify! We are committed to protecting your privacy and
            ensuring that your personal information is handled in a safe and
            responsible manner. This Privacy Policy outlines how we collect,
            use, and protect your data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            2. Information We Collect
          </h2>
          <h3 className="text-xl font-semibold text-gray-600 mt-4 mb-2">
            Personal Data
          </h3>
          <p className="mb-2">
            We collect the following personal information when you use our
            services:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Payment information</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-600 mt-4 mb-2">
            Non-Personal Data
          </h3>
          <p className="mb-4">
            We also collect non-personal data through web cookies to enhance
            your user experience.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            3. Purpose of Data Collection
          </h2>
          <p className="mb-2">
            We use your personal data for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To process your orders and provide our services</li>
            <li>
              To communicate with you regarding your account or transactions
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            4. Data Sharing
          </h2>
          <p className="mb-4">
            We value your privacy and do not share your personal data with any
            other parties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            5. Google Data Usage
          </h2>
          <p className="mb-4">
            Google data is only read to allow users to view their videos and
            upload dubbed videos.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            6. Google API Services User Data Policy
          </h2>
          <p className="mb-4">
            Dubify&apos;s use and transfer to any other app of information
            received from Google APIs will adhere to{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            7. Children&apos;s Privacy
          </h2>
          <p className="mb-4">
            Dubify does not knowingly collect any personal data from children.
            If we become aware that a child has provided us with personal
            information, we will take steps to delete such information.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            8. Updates to This Privacy Policy
          </h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. When we do, we
            will notify you via email. Please review the Privacy Policy
            periodically for any changes.
          </p>

          <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
            9. Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions or concerns about our Privacy Policy,
            please contact us at{" "}
            <a
              href="https://x.com/_Moe3301"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://x.com/_Moe3301
            </a>
            .
          </p>

          <p className="mt-6 text-sm text-gray-600">
            By using our website, you consent to the terms of this Privacy
            Policy.
          </p>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy
