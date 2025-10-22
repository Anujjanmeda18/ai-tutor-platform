'use client';

import React, { useContext, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { userContext } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { MessageSquare, Mic, User, Clock, ArrowRight, FileText, Search, ChevronDown, ChevronUp } from 'lucide-react';

const Feedback = () => {
  const { userData } = useContext(userContext);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  
  const discussionRooms = useQuery(
    api.DiscussionRoom.GetAllDiscussionRoom,
    userData?._id ? { uid: userData._id } : "skip"
  );

  const feedbackRooms = discussionRooms?.filter(room => 
    (room.coachingOption === "Mockup Interview" || room.coachingOption === "Open-Ans Prep") 
    && room.summary
  );

  // Filter by search query
  const filteredRooms = feedbackRooms?.filter(room => 
    room.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.coachingOption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewFeedback = (roomId) => {
    router.push(`/view-summary/${roomId}`);
  };

  const getCoachingStyle = (option) => {
    if (option === "Mockup Interview") {
      return {
        gradient: "from-purple-500 to-pink-500",
        bgGradient: "from-purple-500/10 to-pink-500/10",
        textColor: "text-purple-400",
        icon: Mic,
        hoverGlow: "group-hover:shadow-purple-500/50"
      };
    } else {
      return {
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/10 to-cyan-500/10",
        textColor: "text-blue-400",
        icon: MessageSquare,
        hoverGlow: "group-hover:shadow-blue-500/50"
      };
    }
  };

  if (!userData) {
    return (
      <div className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Your Feedback
          </h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-gray-400">Please sign in to view feedback</p>
          </div>
        </div>
      </div>
    );
  }

  if (discussionRooms === undefined) {
    return (
      <div className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Your Feedback
          </h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-400">Loading feedback...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!feedbackRooms || feedbackRooms.length === 0) {
    return (
      <div className="py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Your Feedback
          </h2>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">No Feedback Yet</p>
              <p className="text-gray-600 text-sm">Complete interviews or prep sessions to receive AI feedback</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-black pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Collapsible Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <FileText className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Your Feedback</h2>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <span className="px-4 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-400">
            {feedbackRooms.length} {feedbackRooms.length === 1 ? 'Report' : 'Reports'}
          </span>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <>
            {/* Search Bar */}
            {feedbackRooms.length > 0 && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Grid Layout */}
            {filteredRooms && filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map((room) => {
                  const style = getCoachingStyle(room.coachingOption);
                  const Icon = style.icon;
                  
                  return (
                    <div 
                      key={room._id} 
                      onClick={() => handleViewFeedback(room._id)}
                      className={`group relative cursor-pointer bg-gradient-to-br ${style.bgGradient} backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105 ${style.hoverGlow} shadow-lg hover:shadow-2xl`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-br ${style.gradient} rounded-xl shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {moment(room._creationTime).fromNow()}
                        </div>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 min-h-[56px]">
                        {room.topic}
                      </h3>

                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 ${style.textColor} bg-gray-900/50 border border-gray-800`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${style.gradient}`}></div>
                        {room.coachingOption}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          <span className="truncate">{room.expertName}</span>
                        </div>
                        {room.conversation && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                            <span>{room.conversation.length} messages</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">Feedback Available</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                          View Feedback
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transform group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No feedback found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
