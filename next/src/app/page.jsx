// pages/index.js
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const stats = [
    { icon: "👥", count: "30+ million", label: "Active Users" },
    { icon: "📱", count: "100+ million", label: "Downloads" },
    { icon: "💬", count: "63+ thousand", label: "Discord Members" }
  ]

  const pricingPlans = [
    {
      name: "Basic",
      price: "883",
      description: "Essential tools for individual creators starting their AI journey.",
      tokens: "18K tokens/year",
      features: [
        "~3600 Generations/year",
        "General Commercial Terms",
        "Image Generations Visibility: Public",
        "4 concurrent Generations"
      ]
    },
    {
      name: "Standard",
      price: "1,750",
      description: "Enhanced features for creators seeking more flexibility and support",
      tokens: "60K tokens/year",
      features: [
        "~12000 Generations/year",
        "General Commercial Terms",
        "Image Generation Visibility: Public",
        "8 concurrent Generations"
      ]
    },
    {
      name: "Professional",
      price: "3,516",
      description: "Advanced tools and privacy for professionals maximizing productivity.",
      tokens: "180K tokens/year",
      isPopular: true,
      features: [
        "~36000 Generations/year",
        "All styles and models",
        "General Commercial Terms",
        "Image Generation Visibility: Private",
        "12 Concurrent Generations",
        "Priority Support"
      ]
    },
    {
      name: "Unlimited",
      price: "7,039",
      description: "Unlimited access and top-tier tools for high-demand creators and teams.",
      tokens: "480K tokens/year",
      features: [
        "Unlimited Realtime Generations",
        "~96000 Generations/year",
        "All styles and models",
        "General Commercial Terms",
        "Image Generation Visibility: Private",
        "16 Concurrent Generations"
      ]
    }
  ]

  const footerLinks = {
    Features: [
      "AI Image Generator",
      "AI Logo Generator",
      "AI Headshot Generator",
      "AI Animal Generator",
      "AI Anime Generator"
    ],
    Tools: [
      "Text to Image",
      "Creative Enhance",
      "AI Video",
      "Image Remix"
    ],
    Company: [
      "API",
      "Affiliate Program",
      "Contact Us"
    ],
    ImagineArt: [
      "Blogs",
      "Community",
      "Our Tools",
      "Mobile App"
    ],
    Legal: [
      "Privacy Policy",
      "Terms & Conditions"
    ]
  }

  return (
    <>
      <Head>
        <title>Media Matrix - AI Art Generator</title>
        <meta name="description" content="Create AI Art and turn your imaginations into reality" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <nav className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
            <span className="text-xl font-bold">Media Matrix</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="hover:text-gray-300">Blog</Link>
            <Link href="/tools" className="hover:text-gray-300">Tools</Link>
            <Link href="/community" className="hover:text-gray-300">Community</Link>
            <Link href="/affiliate" className="hover:text-gray-300">Affiliate</Link>
            <Link href="/api" className="hover:text-gray-300">API</Link>
            <Link href="/creators" className="hover:text-gray-300">Creators</Link>
            <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800">Sign in</button>
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">Launch App</button>
          </div>
        </nav>

        <main>
          <section className="px-4 py-16 text-center">
            <h1 className="text-6xl font-bold mb-6">Media Matrix Art Generator</h1>
            <p className="text-xl text-gray-400 mb-8">Create AI Art and turn your imaginations into reality with Media Matrix's AI Art Generator and produce stunning visuals to cover up your artistic thoughts.</p>
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input type="text" placeholder="A magi" className="w-full px-6 py-4 bg-gray-900 rounded-full text-white" />
                <button className="absolute right-2 top-2 px-6 py-2 bg-purple-600 rounded-full flex items-center gap-2 hover:bg-purple-700">
                  Create
                  <span className="w-5 h-5">✨</span>
                </button>
              </div>
            </div>
          </section>

          <section className="flex justify-center gap-16 py-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </section>

          <section className="px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Get Started with Media Matrix</h2>
              <div className="flex items-center justify-center gap-4 mb-8">
                <button className="px-4 py-2 bg-gray-800 rounded-full">Monthly</button>
                <button className="px-4 py-2 bg-white text-black rounded-full">
                  Yearly
                  <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-sm rounded-full">30% OFF</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`p-6 rounded-xl ${plan.isPopular ? 'bg-white text-black' : 'bg-gray-900'}`}>
                  <div className="mb-4">
                    {plan.isPopular && <span className="px-3 py-1 bg-black text-white text-sm rounded-full">Best Value</span>}
                    <h3 className="text-2xl font-bold mt-2">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-500">/month</span>
                    <div className="text-sm text-gray-500">Billed yearly</div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">{plan.tokens}</div>
                  <button className={`w-full py-2 rounded-lg ${plan.isPopular ? 'bg-black text-white' : 'bg-gray-800'} hover:opacity-90`}>
                    Get Started
                  </button>
                  <div className="mt-6">
                    <div className="text-sm mb-4">What's included</div>
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-sm mb-2">
                        <span>✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-800 px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                  <span className="text-xl font-bold">Media Matrix</span>
                </Link>
                <p className="text-gray-400">Endless Possibilities. Just Imagine.</p>
              </div>
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-bold mb-4">{category}</h3>
                  <div className="space-y-2">
                    {links.map((link, index) => (
                      <Link key={index} href="#" className="block text-gray-400 hover:text-white">
                        {link}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
              <div className="flex gap-6 mb-4 md:mb-0">
                {['facebook', 'instagram', 'reddit', 'discord'].map((social) => (
                  <Link key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="w-6 h-6 block">●</span>
                  </Link>
                ))}
              </div>
              <div className="text-gray-400">© 2025 V & M All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}