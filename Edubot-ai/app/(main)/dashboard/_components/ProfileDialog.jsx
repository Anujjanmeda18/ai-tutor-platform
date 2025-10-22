'use client';

import React, { useContext } from 'react';
import { userContext } from '@/app/AuthProvider';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Sparkles, Crown, Mail, TrendingDown, Loader2, X } from 'lucide-react';

const ProfileDialog = ({ isOpen, onClose, children }) => {
  const { userData } = useContext(userContext);
  const router = useRouter();
  
  const freshUserData = useQuery(
    api.users.GetUserById,
    userData?._id ? { id: userData._id } : "skip"
  );

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  const currentUserData = freshUserData || userData;
  const totalCredits = 50000;
  const remainingCredits = currentUserData?.credits || 0;
  const usedCredits = totalCredits - remainingCredits;
  const progressPercentage = (remainingCredits / totalCredits) * 100;

  // Loading state
  if (!currentUserData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 z-10">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-sm w-full z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        {/* Header with Avatar */}
        <div className="p-4 text-center">
          <div className="relative inline-block mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {currentUserData?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900"></div>
          </div>
          
          <h2 className="text-lg font-bold text-white mb-1">
            {currentUserData?.name || 'User'}
          </h2>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            {currentUserData?.email || 'user@example.com'}
          </p>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          {/* Credits Usage Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <h3 className="text-xs font-semibold text-white">Credits Balance</h3>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                remainingCredits > 10000 
                  ? 'bg-green-500/20 text-green-400' 
                  : remainingCredits > 5000 
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              {remainingCredits.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mb-2">
              of {totalCredits.toLocaleString()} total
            </p>
            
            {/* Progress Bar */}
            <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  remainingCredits > 10000 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : remainingCredits > 5000
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Usage Stats */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <TrendingDown className="w-3 h-3" />
                <span>Used: {usedCredits.toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500">
                ~{Math.floor(remainingCredits / 500)} sessions
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-lg mb-3">
            <span className="text-xs font-medium text-gray-300">Current Plan</span>
            <div className="flex items-center gap-1">
              {currentUserData?.subscriptionId ? (
                <>
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-500">Pro</span>
                </>
              ) : (
                <span className="text-xs text-gray-400">Free</span>
              )}
            </div>
          </div>

          {/* Upgrade Button - Compact */}
          {!currentUserData?.subscriptionId && (
            <button
              onClick={handleUpgrade}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro - $10/mo
            </button>
          )}

          {/* Low Credits Warning */}
          {remainingCredits < 5000 && !currentUserData?.subscriptionId && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center mt-3">
              <p className="text-xs text-red-400 font-medium">
                ⚠️ Low on credits!
              </p>
            </div>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default ProfileDialog;
