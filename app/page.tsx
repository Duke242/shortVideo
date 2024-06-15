import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Pricing from "@/components/Pricing"
import FAQ from "@/components/FAQ"
import Footer from "@/components/Footer"
import Features from "@/components/Features"

export default function Page() {
  return (
    <>
      {/* <header>
        <Header />
      </header> */}
      <main>
        <Hero />
        {/* <WithWithout /> */}
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  )
}
