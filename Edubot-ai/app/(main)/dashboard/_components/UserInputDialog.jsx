'use client';

import React, { useContext, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { userContext } from '@/app/AuthProvider';
import { toast } from 'sonner';
import { X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const UserInputDialog = ({ isOpen, onClose, featureTitle, children }) => {
  const [topic, setTopic] = useState('');
  const [expert, setExpert] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userData, isLoading } = useContext(userContext);

  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

  const experts = [
    {
      id: 1,
      name: 'Joanna',
      gradient: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-100',
    },
    {
      id: 2,
      name: 'Sallie',
      gradient: 'from-sky-400 to-blue-500',
      bgColor: 'bg-sky-100',
    },
    {
      id: 3,
      name: 'Matthew',
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  // Dynamic placeholders based on coaching mode
  const getPlaceholder = () => {
    switch(featureTitle) {
      case 'Topic Base Lecture':
        return 'e.g., JavaScript Promises, React Hooks, Data Structures...';
      case 'Open-Ans Prep':
        return 'e.g., Behavioral questions, technical concepts, problem-solving...';
      case 'Mockup Interview':
        return 'e.g., Software Engineer, Product Manager, Data Analyst...';
      case 'Learn Language':
        return 'e.g., Spanish basics, French conversation, Japanese grammar...';
      case 'Meditation':
        return 'e.g., Stress relief, mindfulness, breathing techniques...';
      default:
        return 'Enter your topic here...';
    }
  };

  // Dynamic label based on coaching mode
  const getLabel = () => {
    switch(featureTitle) {
      case 'Topic Base Lecture':
        return 'What would you like to learn?';
      case 'Open-Ans Prep':
        return 'What topic would you like to practice?';
      case 'Mockup Interview':
        return 'What role are you interviewing for?';
      case 'Learn Language':
        return 'Which language or topic?';
      case 'Meditation':
        return 'What would you like to focus on?';
      default:
        return 'Enter your topic';
    }
  };

  const handleSubmit = async () => {
    if (!userData || !userData._id) {
      toast.error('Please sign in to continue');
      return;
    }

    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (!expert) {
      toast.error('Please select an expert');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await createDiscussionRoom({
        topic,
        coachingOption: featureTitle,
        expertName: expert,
        uid: userData._id
      });
      
      toast.success('Session created! Loading your room...');
      router.push(`/discussion-room/${result}`);
      
    } catch (e) {
      setLoading(false);
      toast.error('Failed to create session. Please try again.');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTopic('');
      setExpert('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const isFormValid = topic.trim() && expert;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${loading ? 'pointer-events-none' : ''}`}
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-white font-bold text-lg mb-1">Creating Your Session</p>
                <p className="text-gray-400 text-sm mb-2">Preparing your AI coaching room...</p>
                <p className="text-gray-500 text-xs">This may take a moment, please wait</p>
              </div>
              {/* Progress Dots */}
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Header Gradient */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className={`absolute top-6 right-6 text-gray-400 hover:text-white transition-colors ${loading ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              {featureTitle || 'Start Session'}
            </h2>
            <p className="text-gray-400 text-sm">
              Configure your coaching session to begin learning
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Loading user data...</p>
            </div>
          ) : !userData ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Please sign in to continue</p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Topic Input - Dynamic placeholder */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {getLabel()}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder:text-gray-500"
                  rows="3"
                  disabled={loading}
                />
              </div>
              
              {/* Expert Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Choose your AI coach
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                  {experts.map((expertItem) => (
                    <div
                      key={expertItem.id}
                      onClick={() => !loading && setExpert(expertItem.name)}
                      className={`relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        expert === expertItem.name 
                          ? 'bg-gray-800 border-2 border-purple-500 scale-105' 
                          : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:scale-102'
                      } ${loading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      {/* Expert Avatar */}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${expertItem.gradient} flex items-center justify-center mb-2 shadow-lg`}>
                        <span className="text-2xl text-white font-bold">
                          {expertItem.name[0]}
                        </span>
                      </div>
                      
                      {/* Expert Name */}
                      <span className="text-sm font-medium text-white">{expertItem.name}</span>
                      
                      {/* Selected Indicator */}
                      {expert === expertItem.name && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-purple-500/50' 
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading Room...
                    </>
                  ) : (
                    <>
                      Start Session
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Validation Helper Text */}
              {!isFormValid && !loading && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Please fill in all fields to continue
                </p>
              )}
            </>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserInputDialog;
