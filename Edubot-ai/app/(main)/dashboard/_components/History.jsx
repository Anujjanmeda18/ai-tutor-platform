'use client';

import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { userContext } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import moment from 'moment';

const History = () => {
  const { userData } = useContext(userContext);
  const router = useRouter();
  
  const discussionRooms = useQuery(
    api.DiscussionRoom.GetAllDiscussionRoom,
    userData?._id ? { uid: userData._id } : "skip"
  );

  // Filter other sessions (Topic Lecture, Language, Meditation)
  const historyRooms = discussionRooms?.filter(room => 
    room.coachingOption !== "Mockup Interview" && 
    room.coachingOption !== "Open-Ans Prep"
  );

  const handleViewHistory = (roomId) => {
    router.push(`/view-summary/${roomId}`);
  };

  // Get icon and color for each coaching option
  const getCoachingStyle = (option) => {
    switch(option) {
      case "Topic Base Lecture":
        return {
          color: "bg-green-100 text-green-700",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )
        };
      case "Learn Language":
        return {
          color: "bg-orange-100 text-orange-700",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          )
        };
      case "Meditation":
        return {
          color: "bg-indigo-100 text-indigo-700",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: null
        };
    }
  };

  if (!userData) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Sessions</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">Please sign in to view history</p>
          </div>
        </div>
      </div>
    );
  }

  if (discussionRooms === undefined) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Sessions</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!historyRooms || historyRooms.length === 0) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Previous Sessions</h2>
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              <p className="text-gray-500 text-sm">
                You don't have any previous sessions
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Start a Topic Lecture, Language Learning, or Meditation session
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
          Your Previous Sessions ({historyRooms.length})
        </h2>
        
        <div className="grid gap-4">
          {historyRooms.map((room) => {
            const style = getCoachingStyle(room.coachingOption);
            
            return (
              <div 
                key={room._id} 
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer p-6"
                onClick={() => handleViewHistory(room._id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${style.color}`}>
                        {style.icon}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default History;
