"use client"
import React, { useState, useContext } from 'react';
import { useUser } from '@stackframe/stack';
import UserInputDialog from './UserInputDialog';
import ProfileDialog from './ProfileDialog';
import { userContext } from '@/app/AuthProvider';

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
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="15" width="44" height="30" rx="2" fill="#E0E7FF"/>
          <rect x="15" y="20" width="34" height="20" fill="#8B5CF6"/>
          <circle cx="32" cy="50" r="3" fill="#8B5CF6"/>
          <path d="M32 47 L28 30 L36 30 Z" fill="#E0E7FF"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Open-Ans Prep',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="20" fill="#DBEAFE"/>
          <rect x="24" y="26" width="16" height="2" rx="1" fill="#3B82F6"/>
          <rect x="24" y="31" width="12" height="2" rx="1" fill="#3B82F6"/>
          <rect x="24" y="36" width="14" height="2" rx="1" fill="#3B82F6"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Mockup Interview',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="25" r="8" fill="#FED7AA"/>
          <path d="M20 45 Q32 38 44 45 L44 50 L20 50 Z" fill="#FB923C"/>
          <circle cx="28" cy="24" r="1.5" fill="#1F2937"/>
          <circle cx="36" cy="24" r="1.5" fill="#1F2937"/>
          <path d="M28 28 Q32 30 36 28" stroke="#1F2937" strokeWidth="1.5" fill="none"/>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Learn Language',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="18" width="40" height="28" rx="2" fill="#DBEAFE"/>
          <circle cx="25" cy="28" r="4" fill="#3B82F6"/>
          <circle cx="39" cy="28" r="4" fill="#3B82F6"/>
          <path d="M18 38 Q25 42 32 38 Q39 42 46 38" stroke="#3B82F6" strokeWidth="2" fill="none"/>
        </svg>
      )
    },
    {
      id: 5,
      title: 'Meditation',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="28" r="6" fill="#C7D2FE"/>
          <path d="M32 34 L26 42 L32 40 L38 42 Z" fill="#6366F1"/>
          <path d="M20 42 Q32 48 44 42" stroke="#6366F1" strokeWidth="2" fill="none"/>
          <circle cx="28" cy="27" r="1" fill="#1F2937"/>
          <circle cx="36" cy="27" r="1" fill="#1F2937"/>
        </svg>
      )
    }
  ];

  const handleFeatureClick = (featureTitle) => {
    setSelectedFeature(featureTitle);
    setIsDialogOpen(true);
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">My Workspace</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, {user?.displayName || 'User'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            <span className="font-semibold text-yellow-800">
              {userData?.credits?.toLocaleString() || 0}
            </span>
          </div>
          
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.title)}
            className="group cursor-pointer"
          >
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200">
              <div className="mb-3">
                {feature.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">
                {feature.title}
              </h3>
            </div>
          </div>
        ))}
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
