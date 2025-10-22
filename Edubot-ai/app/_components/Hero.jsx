"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, MessageSquare, Languages, Brain } from 'lucide-react'
import Link from 'next/link'

export const Hero = () => {
  const features = [
    { icon: MessageSquare, text: "Mock Interviews" },
    { icon: BookOpen, text: "Expert Tutoring" },
    { icon: Languages, text: "Language Practice" },
    { icon: Brain, text: "Guided Meditation" }
  ]

  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden bg-black">
      {/* Dark Animated Grid Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-600 opacity-30 blur-[120px]"></div>
        <div className="absolute left-1/4 bottom-0 -z-10 m-auto h-[250px] w-[250px] rounded-full bg-blue-600 opacity-20 blur-[100px]"></div>
      </div>

      {/* Decorative Side Borders */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-gray-800/80">
        <motion.div 
          className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent"
          animate={{ y: [0, 400, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-gray-800/80">
        <motion.div 
          className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent"
          animate={{ y: [0, 400, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      <div className="px-4 pb-12 pt-8 md:pb-16 md:pt-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 backdrop-blur-sm"
        >
          <Sparkles size={16} className="text-purple-400" />
          <span>AI-Powered Voice Learning Platform</span>
        </motion.div>

        {/* Main Heading */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold text-white md:text-5xl lg:text-7xl">
          {"Master Any Skill with"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          <motion.span
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.4,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {" "}AI Voice Coaching
          </motion.span>
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-2xl py-6 text-center text-base font-normal text-gray-400 md:text-lg"
        >
          Practice interviews, learn new topics, master languages, and find inner peace—all through 
          real-time voice conversations with AI experts. Your personal coach is always ready.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="relative z-10 mx-auto mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
              className="flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-300 shadow-lg backdrop-blur-sm"
            >
              <feature.icon size={16} className="text-purple-400" />
              {feature.text}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="group relative w-60 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
              <span className="relative z-10">Start Learning Free</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </button>
          </Link>

          <button className="w-60 transform rounded-lg border-2 border-gray-700 bg-gray-900/50 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:bg-gray-800/70 hover:shadow-lg">
            See How It Works
          </button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { value: "50K+", label: "Credits Available" },
            { value: "5", label: "Learning Modes" },
            { value: "24/7", label: "AI Availability" }
          ].map((stat, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent md:text-3xl">
                {stat.value}
              </span>
              <span className="text-sm text-gray-500">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
