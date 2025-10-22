"use client";
import React from 'react';
import Link from 'next/link';
import { UserButton } from '@stackframe/stack';
import { Sparkles } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group"
          >
            {/* Logo Icon with Gradient & Glow */}
            <div className="relative">
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Logo Container */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            
            {/* Text Logo - Enhanced Typography */}
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white tracking-tight">
                Edubot
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                .AI
              </span>
            </div>
          </Link>

          {/* Right Side - User Button with Enhanced Styling */}
          <div className="flex items-center space-x-4">
            {/* Credits Badge (Optional - You can add credit display here) */}
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300">Dashboard</span>
            </div>

            {/* User Button with Wrapper for Hover Effect */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              <div className="relative scale-100 hover:scale-105 transition-transform duration-200">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
