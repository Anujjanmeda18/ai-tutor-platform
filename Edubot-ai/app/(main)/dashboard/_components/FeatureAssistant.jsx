"use client"
import React, { useState, useContext } from 'react';
import { useUser } from '@stackframe/stack';
import UserInputDialog from './UserInputDialog';
import ProfileDialog from './ProfileDialog';
import { userContext } from '@/app/AuthProvider';
import { BookOpen, MessageSquare, Mic, Languages, Brain, Sparkles, Crown } from 'lucide-react';

const FeatureAssistant = () => {
  const user = useUser();
  const { userData } = useContext(userContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  const features = [
    {
      id: 1,
      title: 'Topic Base Lecture',
      description: 'Learn from AI experts',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      hoverGlow: 'group-hover:shadow-blue-500/50'
    },
    {
      id: 2,
      title: 'Open-Ans Prep',
      description: 'Practice open questions',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      hoverGlow: 'group-hover:shadow-purple-500/50'
    },
    {
      id: 3,
      title: 'Mockup Interview',
      description: 'Real interview practice',
      icon: Mic,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      hoverGlow: 'group-hover:shadow-orange-500/50'
    },
    {
      id: 4,
      title: 'Learn Language',
      description: 'Master new languages',
      icon: Languages,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      hoverGlow: 'group-hover:shadow-green-500/50'
    },
    {
      id: 5,
      title: 'Meditation',
      description: 'Find inner peace',
      icon: Brain,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      hoverGlow: 'group-hover:shadow-indigo-500/50'
    }
  ];

  const handleFeatureClick = (featureTitle) => {
    setSelectedFeature(featureTitle);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-black py-8 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          {/* Welcome Text */}
          <div>
            {/* FIXED: Changed <p> to <div> to allow <span> inside */}
            <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              My Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome Back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user?.displayName || 'User'}
              </span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Choose a coaching mode to get started</p>
          </div>
          
          {/* Credits & Profile */}
          <div className="flex items-center gap-3">

            {/* Profile Button */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="relative group px-6 py-2.5 bg-gray-900 border border-gray-800 text-white rounded-full font-medium hover:bg-gray-800 hover:border-purple-500 transition-all duration-300 flex items-center gap-2 shadow-lg"
            >
              <Crown className="w-4 h-4 text-purple-400" />
              Profile
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleFeatureClick(feature.title)}
                className="group cursor-pointer"
              >
                <div className={`relative flex flex-col items-center p-6 bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300 hover:scale-105 ${feature.hoverGlow} shadow-lg hover:shadow-2xl`}>
                  {/* Animated Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                  
                  {/* Icon Container */}
                  <div className={`relative mb-4 p-4 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-base font-bold text-white text-center mb-1 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400 text-center relative z-10">
                    {feature.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`w-8 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <UserInputDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        featureTitle={selectedFeature}
      />
      
      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default FeatureAssistant;
