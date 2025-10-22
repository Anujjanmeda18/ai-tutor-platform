'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

const ViewSummary = () => {
  const { roomid } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('summary');
  
  const discussionRoom = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });

  if (discussionRoom === undefined) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!discussionRoom) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">Session not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFeedback = discussionRoom.coachingOption === "Mockup Interview" || 
                     discussionRoom.coachingOption === "Open-Ans Prep";
  
  // For non-feedback sessions, show only conversation (no summary tab)
  const showOnlyConversation = !isFeedback;

  return (
    <div className="py-6 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isFeedback
                  ? discussionRoom.coachingOption === "Mockup Interview"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                  : discussionRoom.coachingOption === "Topic Base Lecture"
                    ? "bg-green-100 text-green-700"
                    : discussionRoom.coachingOption === "Learn Language"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-indigo-100 text-indigo-700"
              }`}>
                {discussionRoom.coachingOption}
              </span>
              <span className="text-xs text-gray-500">
                {moment(discussionRoom._creationTime).format('MMM DD, YYYY • h:mm A')}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {discussionRoom.topic}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Expert: {discussionRoom.expertName}
              </span>
              {discussionRoom.conversation && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {discussionRoom.conversation.length} messages
                </span>
              )}
            </div>
          </div>

          {/* Only show tabs if session has feedback/summary */}
          {!showOnlyConversation && (
            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {isFeedback ? 'Feedback' : 'Notes'}
              </button>
              <button
                onClick={() => setActiveTab('conversation')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'conversation'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Conversation
              </button>
            </div>
          )}
        </div>

        {/* For non-feedback: Show only conversation */}
        {showOnlyConversation ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
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
                      className={`max-w-[75%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === 'user' ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                          </svg>
                        )}
                        <span className="text-xs font-semibold opacity-90">
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
              <div className="text-center py-8">
                <svg 
                  className="w-16 h-16 text-gray-300 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 text-sm">No conversation history available</p>
              </div>
            )}
          </div>
        ) : (
          /* For feedback sessions: Show tabs */
          <>
            {activeTab === 'summary' ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Performance Feedback
                </h2>
                
                {discussionRoom.summary ? (
                  <div className="prose prose-slate max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />,
                        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800" {...props} />,
                        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4" {...props} />,
                      }}
                    >
                      {discussionRoom.summary}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No feedback available for this session</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
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
                          className={`max-w-[75%] rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.role === 'user' ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                              </svg>
                            )}
                            <span className="text-xs font-semibold opacity-90">
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
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No conversation history available</p>
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
