// page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/grid.svg')",
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(circle at center, black, transparent 80%)"
          }}
        />
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
            variants={fadeIn}
          >
            Media-Matrix
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8"
            variants={fadeIn}
          >
            Transform your creative vision with AI-powered media generation and editing. 
            Create stunning videos, images, and stories with cutting-edge artificial intelligence.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full text-lg"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Short Story Generation */}
      <section className="relative py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    AI Short Story Generation
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Generate engaging short-form video content powered by AI. Perfect for social media, 
                    marketing, or creative expression. Our AI understands context, style, and pacing to 
                    create compelling stories that resonate with your audience.
                  </p>
                  <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                    Try Story Generator
                  </Button>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-purple-500/30">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    src="/story-demo.mp4" 
                    poster="/story-thumbnail.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* AI Video Generation */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-black to-purple-900/20">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <Card className="bg-black/50 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-cyan-500/30">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    src="/video-demo.mp4" 
                    poster="/video-thumbnail.jpg"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Realistic AI Video Generation
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Create stunning, realistic videos with our advanced AI technology. 
                    From concept to final render, bring your ideas to life with 
                    high-quality AI-generated video content that looks professionally produced.
                  </p>
                  <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20">
                    Generate Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Transcription */}
      <section className="relative py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <Card className="bg-black/50 border-pink-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                    Video Transcription
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Convert your videos to text with high accuracy. Our AI transcription 
                    service handles multiple languages, accents, and technical terminology. 
                    Perfect for content creators, businesses, and educational institutions.
                  </p>
                  <Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500/20">
                    Start Transcribing
                  </Button>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-pink-500/30 p-6 bg-black/40">
                  <div className="space-y-4">
                    <div className="h-3 bg-pink-500/20 rounded w-3/4"></div>
                    <div className="h-3 bg-pink-500/20 rounded w-1/2"></div>
                    <div className="h-3 bg-pink-500/20 rounded w-5/6"></div>
                    <div className="h-3 bg-pink-500/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* AI Image Editing */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-purple-900/20 to-black">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <Card className="bg-black/50 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-green-500/30">
                    <img 
                      src="/image-edit-1.jpg" 
                      alt="AI Image Edit Example 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-green-500/30">
                    <img 
                      src="/image-edit-2.jpg" 
                      alt="AI Image Edit Example 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-green-500/30">
                    <img 
                      src="/image-edit-3.jpg" 
                      alt="AI Image Edit Example 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-green-500/30">
                    <img 
                      src="/image-edit-4.jpg" 
                      alt="AI Image Edit Example 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    AI Image Editing
                  </h2>
                  <p className="text-gray-300 text-lg mb-6">
                    Transform your images with powerful AI-assisted editing tools. 
                    Remove backgrounds, enhance quality, apply artistic styles, and 
                    more with just a few clicks. Perfect for photographers, designers, 
                    and content creators.
                  </p>
                  <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/20">
                    Edit Images
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Pricing Coming Soon
          </h2>
          <Card className="bg-black/50 border-purple-500/30 backdrop-blur-sm mt-8">
            <CardContent className="p-6">
              <p className="text-gray-300 text-lg mb-6">
                Media-Matrix is currently in development. All features are available as a demo 
                for users to try out. Sign up now to be notified when pricing plans are released 
                and get early access to new features!
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Join Waitlist
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}