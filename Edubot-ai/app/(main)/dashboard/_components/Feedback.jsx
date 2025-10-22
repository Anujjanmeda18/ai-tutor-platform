'use client';

import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { userContext } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import moment from 'moment';

const Feedback = () => {
  const { userData } = useContext(userContext);
  const router = useRouter();
  
  const discussionRooms = useQuery(
    api.DiscussionRoom.GetAllDiscussionRoom,
    userData?._id ? { uid: userData._id } : "skip"
  );

  // Filter only Mock Interview and Open-Ans Prep with summaries
  const feedbackRooms = discussionRooms?.filter(room => 
    (room.coachingOption === "Mockup Interview" || room.coachingOption === "Open-Ans Prep") 
    && room.summary
  );

  const handleViewFeedback = (roomId) => {
    router.push(`/view-summary/${roomId}`);
  };

  if (!userData) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">Please sign in to view feedback</p>
          </div>
        </div>
      </div>
    );
  }

  if (discussionRooms === undefined) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!feedbackRooms || feedbackRooms.length === 0) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                />
              </svg>
              <p className="text-gray-500 text-sm">
                You don't have any feedback yet
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Complete Mock Interviews or Open-Ans Prep sessions to get feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Feedback ({feedbackRooms.length})
        </h2>
        
        <div className="grid gap-4">
          {feedbackRooms.map((room) => (
            <div 
              key={room._id} 
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer p-6"
              onClick={() => handleViewFeedback(room._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.coachingOption === "Mockup Interview" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {room.coachingOption}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moment(room._creationTime).fromNow()}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {room.topic}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {room.expertName}
                    </span>
                    {room.conversation && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {room.conversation.length} messages
                      </span>
                    )}
                  </div>
                </div>
                
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
