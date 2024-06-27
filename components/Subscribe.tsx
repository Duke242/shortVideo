import config from "@/config"
import ButtonAccount from "./ButtonAccount"
import ButtonCheckout from "./ButtonCheckout"

const Subscribe = () => {
  return (
    <main className="min-h-screen p-8 pb-24">
      <header>
        <ButtonAccount />
      </header>
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Subscribe to get access:
        </h1>
        <ButtonCheckout
          priceId={config.stripe.plans[0].priceId}
          extraStyling="bg-green-400 hover:bg-green-500"
        />
        {/* <p className="text-md text-gray-400 mt-4 text-center">
          If you are subscribed, you might need to log out and back in to access
          features.
        </p> */}
      </section>
    </main>
  )
}

export default Subscribe
