import Link from "next/link"
import { getSEOTags } from "@/libs/seo"
import config from "@/config"

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
})

const TOS = () => {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`

Terms & Services

1. Introduction

Welcome to Dubify! By accessing or using our website, you agree to comply with and be bound by these Terms & Services. If you do not agree to these terms, please do not use our services.

2. Services Provided

Dubify allows you to dub your short-form videos into other languages and post them to other platforms with a click of a button.

3. User Data

We collect the following personal information:

Name
Email address
Payment information
We also collect non-personal data through web cookies. For more details, please refer to our Privacy Policy.

4. User Responsibilities

By using our services, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.

5. Prohibited Activities

You agree not to:

Use the service for any illegal purposes
Upload or share any content that infringes on the intellectual property rights of others
Attempt to interfere with the proper functioning of the website
6. Termination

We reserve the right to terminate or suspend your access to our services at our sole discretion, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

7. Governing Law

These Terms & Services are governed by and construed in accordance with the laws of the USA.

8. Updates to the Terms

We may update these Terms & Services from time to time. When we do, we will notify you via email. Please review the Terms periodically for any changes.

9. Contact Us

If you have any questions or concerns about these Terms & Services, please contact us at dubify@proton.me.

By using our website, you consent to the terms of these Terms & Services.

`}
        </pre>
      </div>
    </main>
  )
}

export default TOS
