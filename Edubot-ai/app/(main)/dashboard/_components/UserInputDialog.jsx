'use client';

import React, { useContext, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { userContext } from '@/app/AuthProvider';

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
      avatar: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="12" fill="#FDE68A"/>
          <circle cx="28" cy="22" r="10" fill="#FBBF24"/>
          <ellipse cx="28" cy="38" rx="12" ry="8" fill="#F59E42"/>
          <ellipse cx="24" cy="20" rx="1.5" ry="2" fill="#fff"/>
          <ellipse cx="32" cy="20" rx="1.5" ry="2" fill="#fff"/>
          <path d="M24 28Q28 31 32 28" stroke="#fff" strokeWidth="2" fill="none"/>
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Sallie',
      avatar: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="12" fill="#BAE6FD"/>
          <circle cx="28" cy="22" r="10" fill="#38BDF8"/>
          <ellipse cx="28" cy="40" rx="13" ry="7" fill="#7DD3FC"/>
          <ellipse cx="25" cy="21" rx="1.5" ry="2" fill="#fff"/>
          <ellipse cx="31" cy="21" rx="1.5" ry="2" fill="#fff"/>
          <path d="M25 28Q28 30 31 28" stroke="#fff" strokeWidth="2" fill="none"/>
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Matthew',
      avatar: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect width="56" height="56" rx="12" fill="#C7D2FE"/>
          <circle cx="28" cy="22" r="10" fill="#6366F1"/>
          <ellipse cx="28" cy="40" rx="13" ry="7" fill="#818CF8"/>
          <ellipse cx="26" cy="21" rx="1.5" ry="2" fill="#fff"/>
          <ellipse cx="30" cy="21" rx="1.5" ry="2" fill="#fff"/>
          <rect x="25" y="28" width="6" height="2" rx="1" fill="#fff"/>
        </svg>
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!userData || !userData._id) {
      alert('User not logged in. Please sign in first.');
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
      setLoading(false);
      onClose();
      router.push(`/discussion-room/${result}`);
    } catch (e) {
      console.error('Error:', e);
      setLoading(false);
      alert('Could not create discussion room. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {featureTitle || 'Mock Interview'}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading user data...</p>
          </div>
        ) : !userData ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-4">Please sign in to continue</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Enter a topic to master your skills in {featureTitle || 'Mock Interview'}
            </p>
            
            <div className="mb-6">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter Topic"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                disabled={loading}
              />
            </div>
            
            <p className="text-sm text-gray-700 mb-4">
              Select your expert
            </p>
            
            <div className="flex gap-4 mb-6">
              {experts.map((expertItem) => (
                <div
                  key={expertItem.id}
                  onClick={() => !loading && setExpert(expertItem.name)}
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    expert === expertItem.name ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-lg overflow-hidden mb-2 border-2 ${
                    expert === expertItem.name ? 'border-blue-500' : 'border-transparent'
                  }`}>
                    {expertItem.avatar}
                  </div>
                  <span className="text-xs text-gray-700">{expertItem.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !topic || !expert}
                className={`px-6 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 ${
                  (loading || !topic || !expert) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading
                  </span>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default UserInputDialog;
