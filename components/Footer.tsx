import logo from "@/app/icon.png"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-12">
          <div className="col-span-2 lg:pr-8">
            <span className="flex items-center gap-1 font-bold text-base text-gray-900">
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
                  href="#pricing"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
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
              <li>
                <Link
                  href="/contact"
                  className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-gray-600">
          &copy; 2025 Dubify. All Rights Reserved.
        </p>
      </div>
    </section>
  )
}
export default Footer
