import logo from "@/app/icon.png"
import Image from "next/image"
import Link from "next/link"

const ComponentName = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
            <span className="flex items-center gap-1 font-bold text-base text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
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
            </span>
            <p className="text-base leading-relaxed text-gray-600 mt-7">
              Dub your short-form videos into other languages and post to other
              platforms with a click of a button.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Company
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/pricing"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="/features"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Help
            </p>

            <ul className="mt-6 space-y-4">
              <li>
                <Link
                  href="/tos"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
              Subscribe to newsletter
            </p>

            <form action="#" method="POST" className="mt-6">
              <div>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center cursor-not-allowed justify-center px-6 py-4 mt-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:bg-blue-700"
                disabled
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">
          © Copyright 2024, All Rights Reserved by Dubify
        </p>
      </div>
    </section>
  )
}
export default ComponentName
