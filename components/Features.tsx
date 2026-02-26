const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
        />
      </svg>
    ),
    title: "More Views",
    description:
      "Expand to new languages and reach a global audience. More languages means more discoverability and organic growth.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-purple-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
        />
      </svg>
    ),
    title: "High-Quality Translation",
    description:
      "AI-powered dubbing preserves your voice's tone and emotion. Your message stays clear, accurate, and natural in every language.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-emerald-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    title: "Fast & Easy",
    description:
      "Paste a link, pick a language, and get your dubbed video in minutes. No editing skills required — we handle everything.",
  },
]

const Features = () => {
  return (
    <section className="py-16 bg-white sm:py-20 lg:py-28" id="features">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Why Dubify
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl tracking-tight">
            Everything you need to go global
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Translate your content and grow your audience worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 sm:mt-16 md:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Features
