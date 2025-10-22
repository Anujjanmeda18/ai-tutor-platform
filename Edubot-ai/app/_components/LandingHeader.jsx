"use client";
import React from "react";
import Link from "next/link";
import { useUser, UserButton } from "@stackframe/stack";
import { Sparkles, LogIn } from "lucide-react";

const LandingHeader = () => {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">Edubot</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                .AI
              </span>
            </div>
          </Link>

          {/* Navigation & Auth Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <div className="scale-95 hover:scale-100 transition-transform duration-200">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/handler/sign-in"
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>

                <Link href="/handler/sign-up">
                  <button className="relative group inline-flex items-center space-x-2 px-6 py-2.5 text-sm font-bold text-white overflow-hidden rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    {/* Animated Gradient Background - FIXED */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 transition-all duration-300 rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>

                    {/* Button Content */}
                    <Sparkles className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">Get Started Free</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
