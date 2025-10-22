"use client"
import React from 'react'
import Link from 'next/link'
import { Mail, Linkedin, Github, Twitter, Sparkles } from 'lucide-react'


function Footer() {
  const currentYear = new Date().getFullYear()


  return (
    <footer className="w-full border-t border-gray-800 bg-black px-6 pt-12 text-gray-400 md:px-16 lg:px-24 xl:px-32">
      <div className="flex w-full flex-col justify-between gap-10 border-b border-gray-800 pb-8 md:flex-row">
        {/* Brand Section */}
        <div className="md:max-w-96">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline">
              <h2 className="text-2xl font-bold text-white">
                Edubot
              </h2>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                .AI
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Master your interview skills with AI-powered mock interviews. 
            Get instant feedback, track your progress, and land your dream job 
            with confidence. Prepare smarter, not harder.
          </p>
          
          {/* Social Links */}
          <div className="mt-6 flex items-center gap-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-purple-400"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-purple-400"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-purple-400"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>


        {/* Links and Newsletter Section */}
        <div className="flex flex-1 flex-col items-start justify-end gap-10 md:flex-row md:gap-20">
          {/* Quick Links */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 transition-colors hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 transition-colors hover:text-purple-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-gray-400 transition-colors hover:text-purple-400">
                  Practice Interviews
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 transition-colors hover:text-purple-400">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>


          {/* Resources */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 transition-colors hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors hover:text-purple-400">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 transition-colors hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 transition-colors hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>


          {/* Newsletter */}
          <div className="md:max-w-xs">
            <h3 className="mb-5 font-semibold text-white">
              Stay Updated
            </h3>
            <div className="space-y-3 text-sm">
              <p className="leading-relaxed text-gray-400">
                Get interview tips, AI insights, and success stories delivered to your inbox weekly.
              </p>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <input
                  className="h-10 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 text-sm text-white outline-none ring-purple-500 placeholder:text-gray-500 focus:ring-2"
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                />
                <button className="h-10 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 px-6 text-sm font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs md:flex-row md:text-sm">
        <p className="text-center text-gray-500 md:text-left">
          Copyright © {currentYear} Edubot.AI. All rights reserved.
        </p>
        
        {/* Developer Credit */}
        <p className="flex items-center gap-2 text-center">
          <span className="text-gray-500">Developed with</span>
          <span className="text-red-500">❤️</span>
          <span className="text-gray-500">by</span>
          <a 
            href="https://github.com/anujjanmeda" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-purple-400 transition-colors hover:text-blue-400"
          >
            Anuj Kumar Janmeda
          </a>
        </p>
      </div>
    </footer>
  )
}


export default Footer
