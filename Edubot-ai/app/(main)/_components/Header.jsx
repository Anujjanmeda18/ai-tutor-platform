import React from 'react';
import Link from 'next/link';
import { UserButton } from '@stackframe/stack';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center">
              {/* Logo Circle with Robot Icon */}
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="8" width="12" height="10" rx="1.5" fill="white"/>
                  <circle cx="9" cy="11" r="1" fill="#3B82F6"/>
                  <circle cx="15" cy="11" r="1" fill="#3B82F6"/>
                  <rect x="10" y="14" width="4" height="1" rx="0.5" fill="#3B82F6"/>
                  <line x1="12" y1="8" x2="12" y2="5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="4" r="1" fill="white"/>
                </svg>
              </div>
              
              {/* Text Logo */}
              <span className="ml-3 text-xl font-bold text-gray-900">
                Edubot<span className="text-blue-500">.AI</span>
              </span>
            </div>
          </Link>

          {/* User Profile Button */}
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
