'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { ArrowLeft, FileText, MessageSquare, User, Clock, Loader2 } from 'lucide-react';

const ViewSummary = () => {
  const { roomid } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');
  
  const discussionRoom = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  if (discussionRoom === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          <p className="text-gray-400">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!discussionRoom) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Session not found</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isFeedback = discussionRoom.coachingOption === "Mockup Interview" || 
                     discussionRoom.coachingOption === "Open-Ans Prep";
  const showOnlyConversation = !isFeedback;

  const getCoachingStyle = () => {
    if (discussionRoom.coachingOption === "Mockup Interview") {
      return "bg-purple-500/10 border-purple-500/30 text-purple-400";
    } else if (discussionRoom.coachingOption === "Open-Ans Prep") {
      return "bg-blue-500/10 border-blue-500/30 text-blue-400";
    } else if (discussionRoom.coachingOption === "Topic Base Lecture") {
      return "bg-green-500/10 border-green-500/30 text-green-400";
    } else if (discussionRoom.coachingOption === "Learn Language") {
      return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    } else {
      return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        {/* Header Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCoachingStyle()}`}>
              {discussionRoom.coachingOption}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {moment(discussionRoom._creationTime).format('MMM DD, YYYY • h:mm A')}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">
            {discussionRoom.topic}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Expert: {discussionRoom.expertName}</span>
            </div>
            {discussionRoom.conversation && (
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{discussionRoom.conversation.length} messages</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs - Only for feedback sessions */}
        {!showOnlyConversation && (
          <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'summary'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                {isFeedback ? 'Feedback' : 'Notes'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('conversation')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'conversation'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversation
              </div>
            </button>
          </div>
        )}

        {/* Content Area */}
        {showOnlyConversation ? (
          /* Show only conversation for non-feedback sessions */
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              Session Conversation
            </h2>
            
            {discussionRoom.conversation && discussionRoom.conversation.length > 0 ? (
              <div className="space-y-4">
                {discussionRoom.conversation.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold opacity-80">
                          {message.role === 'user' ? 'You' : discussionRoom.expertName}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500">No conversation history available</p>
              </div>
            )}
          </div>
        ) : (
          /* Show tabs for feedback sessions */
          <>
            {activeTab === 'summary' ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Performance Feedback
                </h2>
                
                {discussionRoom.summary ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-200" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-300" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-gray-300 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-purple-400" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4" {...props} />,
                      }}
                    >
                      {discussionRoom.summary}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">No feedback available for this session</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  Full Conversation
                </h2>
                
                {discussionRoom.conversation && discussionRoom.conversation.length > 0 ? (
                  <div className="space-y-4">
                    {discussionRoom.conversation.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-xl p-4 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-800 text-gray-100 border border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold opacity-80">
                              {message.role === 'user' ? 'You' : discussionRoom.expertName}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500">No conversation history available</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSummary;
