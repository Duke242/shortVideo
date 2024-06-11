import Image from "next/image"
import ButtonSignin from "./ButtonSignin"
import image from "@/app/frames.png"
import bg from "@/app/bg.png"

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bg.src})` }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 bg-blue-500 pb-4">
            Quickly convert a short video into other languages.
          </h1>
          <p className="text-2xl text-gray-500">
            Reach global audiences in a click.
          </p>
        </div>
        <ButtonSignin extraStyle="btn btn-wide bg-[#87D8F5] hover:bg-[#2fbbee] mx-auto" />
        <div className="w- h-1/2 relative hidden md:block bg-base-100 rounded-lg">
          {/* <div className="absolute inset-0 bg-[#87D8F5] filter blur-3xl opacity-50 rounded-lg"></div> */}
        </div>
      </div>
    </section>
  )
}

export default Hero
