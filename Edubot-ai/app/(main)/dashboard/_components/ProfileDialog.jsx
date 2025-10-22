'use client';

import React, { useContext } from 'react';
import { userContext } from '@/app/AuthProvider';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

const ProfileDialog = ({ isOpen, onClose, children }) => {
  const { userData } = useContext(userContext);
  const router = useRouter();
  
  // ✅ Fetch fresh user data from DB
  const freshUserData = useQuery(
    api.users.GetUserById,
    userData?._id ? { id: userData._id } : "skip"
  );

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  // Use fresh data from DB if available, otherwise use context
  const currentUserData = freshUserData || userData;
  const totalCredits = 50000; // ✅ Changed to 50,000
  const remainingCredits = currentUserData?.credits || 0;
  const usedCredits = totalCredits - remainingCredits;
  const progressPercentage = (remainingCredits / totalCredits) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header - Simple with Avatar */}
        <div className="p-6 pb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
            {currentUserData?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {currentUserData?.name || 'User'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentUserData?.email || 'user@example.com'}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Token Usage Section */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Token Usage</h3>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {remainingCredits.toLocaleString()}/{totalCredits.toLocaleString()}
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Current Plan Section */}
          <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-4">
            <span className="text-sm font-semibold text-gray-900">Current Plan</span>
            <span className="text-sm text-gray-600">
              {currentUserData?.subscriptionId ? 'Pro Plan' : 'Free Plan'}
            </span>
          </div>

          {/* Upgrade Card */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Pro Plan</h4>
              <p className="text-xs text-gray-600">50,000 Tokens</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">$10</span>
              <span className="text-sm text-gray-600">/Month</span>
            </div>
          </div>

          {/* Upgrade Button */}
          {!currentUserData?.subscriptionId && (
            <button
              onClick={handleUpgrade}
              className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default ProfileDialog;
