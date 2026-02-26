import config from "@/config"
import ButtonCheckout from "./ButtonCheckout"
import Link from "next/link"

const Pricing = () => {
  return (
    <section className="py-16 bg-white sm:py-20 lg:py-28" id="pricing">
      <div className="px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl tracking-tight">
            Expand your audience and boost your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              income
            </span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6">
          {config.stripe.plans.map((plan) => (
            <div
              key={plan.priceId}
              className={`relative w-full max-w-sm rounded-2xl border p-8 flex flex-col transition-all duration-200 hover:shadow-lg ${
                plan.isFeatured
                  ? "border-gray-900 shadow-xl shadow-gray-200/50 bg-white scale-105"
                  : "border-gray-200 bg-gray-50 hover:bg-white"
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start">
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

        <p className="text-center mt-10 text-gray-500">
          Need even more power?{" "}
          <Link
            href="/contact"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Pricing
