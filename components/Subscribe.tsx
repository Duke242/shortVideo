import config from "@/config"
import ButtonAccount from "./ButtonAccount"
import ButtonCheckout from "./ButtonCheckout"

const Subscribe = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Dubify</span>
          <ButtonAccount />
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Choose your plan
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Subscribe to start dubbing your videos
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.priceId}
              className={`relative w-full max-w-sm bg-white rounded-2xl border p-8 flex flex-col ${
                plan.isFeatured
                  ? "border-gray-900 shadow-xl shadow-gray-200/50 scale-105"
                  : "border-gray-200"
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </p>
                {plan.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.description}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-6">
                {plan.priceAnchor && (
                  <span className="text-lg text-gray-400 line-through">
                    ${plan.priceAnchor}
                  </span>
                )}
                <span className="text-5xl font-bold text-gray-900 tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>

              {plan.features && (
                <ul className="mt-8 space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-green-500 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8">
                <ButtonCheckout priceId={plan.priceId} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Subscribe
