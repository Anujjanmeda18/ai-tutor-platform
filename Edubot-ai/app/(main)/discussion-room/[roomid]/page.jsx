"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getToken, AIModel, AIModelFeedbackAndNotes } from "@/services/GlobalServices";
import { userContext } from "@/app/AuthProvider";

const EXPERT_AVATARS = {
  Joanna: (
    <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-yellow-100">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="28" r="16" fill="#FBBF24" />
        <ellipse cx="32" cy="50" rx="15" ry="7" fill="#F59E42" />
        <circle cx="28" cy="24" r="2" fill="#fff" />
        <circle cx="36" cy="24" r="2" fill="#fff" />
        <rect x="28" y="32" width="8" height="4" rx="2" fill="#fff" />
      </svg>
    </div>
  ),
  Sallie: (
    <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-blue-100">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="28" r="16" fill="#38BDF8" />
        <ellipse cx="32" cy="50" rx="15" ry="7" fill="#7DD3FC" />
        <circle cx="28" cy="24" r="2" fill="#fff" />
        <circle cx="36" cy="24" r="2" fill="#fff" />
        <rect x="28" y="32" width="8" height="4" rx="2" fill="#fff" />
      </svg>
    </div>
  ),
  Matthew: (
    <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-purple-100">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="28" r="16" fill="#6366F1" />
        <ellipse cx="32" cy="50" rx="15" ry="7" fill="#818CF8" />
        <circle cx="28" cy="24" r="2" fill="#fff" />
        <circle cx="36" cy="24" r="2" fill="#fff" />
        <rect x="28" y="32" width="8" height="4" rx="2" fill="#fff" />
      </svg>
    </div>
  ),
};

const EXPERT_VOICE_PROFILES = {
  "Joanna": {
    preferredVoices: ['Samantha', 'Victoria', 'Karen', 'Moira', 'Fiona', 'Veena'],
    rate: 0.95,
    pitch: 1.1,
    volume: 1.0
  },
  "Sallie": {
    preferredVoices: ['Samantha', 'Victoria', 'Karen', 'Moira', 'Veena'],
    rate: 0.9,
    pitch: 1.05,
    volume: 1.0
  },
  "Matthew": {
    preferredVoices: ['Alex', 'Daniel', 'Thomas', 'Ravi'],
    rate: 0.9,
    pitch: 0.9,
    volume: 1.0
  }
};

const DiscussionRoom = () => {
  const { roomid } = useParams();
  const router = useRouter();
  const { userData, setUserData } = useContext(userContext);
  const discussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
  const [expert, setExpert] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  
  const mediaRecorder = useRef(null);
  const deepgramSocket = useRef(null);
  const mediaStream = useRef(null);
  const conversationHistory = useRef([]);
  const silenceTimer = useRef(null);
  const currentTranscript = useRef("");
  const isProcessing = useRef(false);
  const keepAliveInterval = useRef(null);
  const voicesLoaded = useRef(false);
  const greetingSent = useRef(false);
  const totalAICharacters = useRef(0);
  
  const updateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const updateSummary = useMutation(api.DiscussionRoom.UpdateSummary);
  const updateUserToken = useMutation(api.users.UpdateUserToken);
  
  const audioContext = useRef(null);
  const gainNode = useRef(null);
  const micStream = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          voicesLoaded.current = true;
          console.log("✅ Voices loaded:", voices.length);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    if (discussionRoomData && discussionRoomData.expertName && !greetingSent.current) {
      setExpert(discussionRoomData.expertName);
      sendAIGreeting();
      greetingSent.current = true;
    }
    
    return () => {
      disconnectFromServer();
      stopSpeech();
    };
    // eslint-disable-next-line
  }, [discussionRoomData?.expertName]);

  const muteMicrophone = () => {
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
      console.log("🔇 Microphone muted");
    }
  };

  const unmuteMicrophone = () => {
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(1, audioContext.current.currentTime);
      console.log("🔊 Microphone unmuted");
    }
  };

  const speakText = (text, expertName) => {
    return new Promise((resolve, reject) => {
      if (!text || text.trim() === "") {
        resolve();
        return;
      }

      muteMicrophone();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      let voices = window.speechSynthesis.getVoices();
      
      if (voices.length === 0 && !voicesLoaded.current) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          voicesLoaded.current = true;
          setVoiceAndSpeak();
        };
      } else {
        setVoiceAndSpeak();
      }

      function setVoiceAndSpeak() {
        voices = window.speechSynthesis.getVoices();

        const profile = EXPERT_VOICE_PROFILES[expertName] || EXPERT_VOICE_PROFILES["Matthew"];
        let selectedVoice = null;

        for (const preferredName of profile.preferredVoices) {
          selectedVoice = voices.find(voice => voice.name.includes(preferredName));
          if (selectedVoice) {
            console.log(`🔊 Using ${expertName}'s voice:`, selectedVoice.name);
            break;
          }
        }

        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.includes('en-IN'));
        }

        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.lang = 'en-IN';
        utterance.rate = profile.rate;
        utterance.pitch = profile.pitch;
        utterance.volume = profile.volume;

        utterance.onstart = () => {
          setIsSpeaking(true);
          console.log("🔊 Speech started");
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setTimeout(() => {
            unmuteMicrophone();
          }, 300);
          console.log("✅ Speech finished");
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          unmuteMicrophone();
          console.error("❌ Speech error:", event.error);
          reject(event.error);
        };

        window.speechSynthesis.speak(utterance);
      }
    });
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      unmuteMicrophone();
      console.log("🛑 Speech stopped");
    }
  };

  const sendAIGreeting = async () => {
    if (!discussionRoomData || greetingSent.current) return;

    const greetings = {
      "Topic Base Lecture": `Welcome! I'm ${discussionRoomData.expertName || 'your instructor'} and today's lecture is on ${discussionRoomData.topic || 'the subject'}. We'll explore key concepts, practical applications, and answer any questions you have. Are you ready to begin?`,
      
      "Open-Ans Prep": `Hello! I'm ${discussionRoomData.expertName || 'your prep coach'}. Today we'll practice answering open-ended questions about ${discussionRoomData.topic || 'various topics'}. I'll ask you questions and help you structure clear, comprehensive answers. Let's start - tell me what you know about this subject.`,
      
      "Mockup Interview": `Good morning! I'm ${discussionRoomData.expertName || 'your interviewer'} and I'll be conducting your interview today for a position related to ${discussionRoomData.topic || 'this field'}. Let's begin - please tell me about yourself and your experience.`,
      
      "Learn Language": `Hello! I'm ${discussionRoomData.expertName || 'your language teacher'}. Welcome to your ${discussionRoomData.topic || 'language'} learning session! We'll start with basics and practice together. Let's begin with a simple greeting - try saying hello in the language!`,
      
      "Meditation": `Welcome. I'm ${discussionRoomData.expertName || 'your guide'}. Find a comfortable position, close your eyes if you wish, and let's begin our meditation journey together. Take a slow, deep breath in through your nose... hold for three... and gently release through your mouth.`,
    };

    const greeting = greetings[discussionRoomData.coachingOption] || greetings["Topic Base Lecture"];
    
    setMessages([{ role: "assistant", text: greeting, interim: false }]);
    conversationHistory.current = [{ role: "assistant", content: greeting }];

    // Count greeting characters
    totalAICharacters.current += greeting.length;

    try {
      await speakText(greeting, discussionRoomData.expertName);
    } catch (error) {
      console.error("Error speaking greeting:", error);
    }
  };

  const handleFinalTranscript = async (transcript) => {
    try {
      if (isProcessing.current) {
        console.log("⏳ AI already processing, skipping...");
        return;
      }

      const lastUserMessage = conversationHistory.current[conversationHistory.current.length - 1];
      if (lastUserMessage?.role === "user" && lastUserMessage?.content === transcript) {
        console.log("⚠️ Duplicate message detected, skipping");
        return;
      }

      isProcessing.current = true;
      conversationHistory.current.push({
        role: "user",
        content: transcript,
      });

      setIsAIThinking(true);
      console.log("🤖 Calling AI with:", transcript);

      const aiResponse = await AIModel(
        discussionRoomData.coachingOption,
        discussionRoomData.topic,
        conversationHistory.current
      );

      // Count AI response characters
      totalAICharacters.current += aiResponse.length;
      console.log(`📊 Total AI characters: ${totalAICharacters.current}`);

      conversationHistory.current.push({
        role: "assistant",
        content: aiResponse,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: aiResponse, interim: false },
      ]);

      setIsAIThinking(false);
      isProcessing.current = false;

      try {
        await speakText(aiResponse, discussionRoomData.expertName);
      } catch (error) {
        console.error("Error speaking response:", error);
      }

    } catch (error) {
      console.error("Error getting AI response:", error);
      setIsAIThinking(false);
      isProcessing.current = false;
      
      let errorMessage = "Sorry, I'm having trouble responding. Please try again.";
      if (error.message?.includes('429') || error.message?.includes('RateLimit')) {
        errorMessage = "Rate limit reached. Please wait 10 seconds before continuing.";
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: errorMessage, interim: false },
      ]);

      try {
        await speakText(errorMessage, discussionRoomData.expertName);
      } catch (err) {
        console.error("Error speaking error message:", err);
      }
    }
  };

  const generateFeedbackOrNotes = async () => {
    try {
      setIsGeneratingSummary(true);
      console.log("🤖 Generating feedback/notes...");

      const summary = await AIModelFeedbackAndNotes(
        discussionRoomData.coachingOption,
        discussionRoomData.topic,
        conversationHistory.current
      );

      await updateSummary({
        id: roomid,
        summary: summary
      });

      setSummaryGenerated(true);
      setIsGeneratingSummary(false);
      console.log("✅ Feedback/Notes generated and saved");
      
      alert("Feedback/Notes generated successfully!");
    } catch (error) {
      console.error("❌ Error generating feedback/notes:", error);
      setIsGeneratingSummary(false);
      alert("Failed to generate feedback/notes. Please try again.");
    }
  };

  const connectToServer = async () => {
    try {
      console.log("🔵 Starting connection to Deepgram...");
      
      setSummaryGenerated(false);
      totalAICharacters.current = 0;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        } 
      });
      
      mediaStream.current = stream;
      console.log("✅ Microphone access granted");

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      
      gainNode.current = audioContext.current.createGain();
      source.connect(gainNode.current);
      
      const destination = audioContext.current.createMediaStreamDestination();
      gainNode.current.connect(destination);
      
      micStream.current = destination.stream;

      mediaRecorder.current = new MediaRecorder(micStream.current, {
        mimeType: "audio/webm",
      });

      const apiKey = await getToken();
      console.log("✅ Deepgram API key received");

      const url = "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&language=en-IN&endpointing=500&smart_format=true";
      deepgramSocket.current = new WebSocket(url, ["token", apiKey]);

      deepgramSocket.current.onopen = () => {
        console.log("✅ Deepgram WebSocket connected");
        
        if (mediaRecorder.current && mediaRecorder.current.state === "inactive") {
          mediaRecorder.current.start(250);
          console.log("✅ Recording started");
        }

        keepAliveInterval.current = setInterval(() => {
          if (deepgramSocket.current?.readyState === WebSocket.OPEN) {
            deepgramSocket.current.send(JSON.stringify({ type: "KeepAlive" }));
          }
        }, 5000);
      };

      deepgramSocket.current.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          const transcript = data.channel?.alternatives?.[0]?.transcript;
          
          if (transcript && transcript.trim()) {
            console.log("📝 Transcript:", transcript, "| Final:", data.is_final);
            
            if (silenceTimer.current) {
              clearTimeout(silenceTimer.current);
              silenceTimer.current = null;
            }

            if (data.is_final) {
              const newText = transcript.trim();
              if (!currentTranscript.current.includes(newText)) {
                currentTranscript.current += (currentTranscript.current ? " " : "") + newText;
              }
              
              setMessages((prev) => {
                const filtered = prev.filter(msg => !(msg.role === "user" && msg.interim));
                return [...filtered, { 
                  role: "user", 
                  text: currentTranscript.current.trim(), 
                  interim: false 
                }];
              });
            } else {
              setMessages((prev) => {
                const filtered = prev.filter(msg => !(msg.role === "user" && msg.interim));
                return [...filtered, { 
                  role: "user", 
                  text: (currentTranscript.current + " " + transcript).trim(), 
                  interim: true 
                }];
              });
            }

            silenceTimer.current = setTimeout(() => {
              const textToSend = currentTranscript.current.trim();
              
              if (textToSend && !isProcessing.current) {
                console.log("🤫 Silence detected - Calling AI");
                handleFinalTranscript(textToSend);
                currentTranscript.current = "";
              }
              silenceTimer.current = null;
            }, 4000);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      deepgramSocket.current.onerror = (error) => {
        console.error("❌ Deepgram WebSocket error:", error);
      };

      deepgramSocket.current.onclose = (event) => {
        console.log("🔴 Deepgram WebSocket closed:", event.code);
        if (keepAliveInterval.current) {
          clearInterval(keepAliveInterval.current);
        }
      };

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && deepgramSocket.current?.readyState === WebSocket.OPEN) {
          deepgramSocket.current.send(event.data);
        }
      };

      mediaRecorder.current.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event.error);
      };

      setIsConnected(true);
      console.log("✅ Setup complete");
      
    } catch (err) {
      console.error("❌ Connection error:", err);
      alert("Failed to connect: " + err.message);
    }
  };

  const disconnectFromServer = async () => {
    try {
      console.log("🔵 Disconnecting...");
      
      stopSpeech();
      isProcessing.current = true;
      
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }

      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
        keepAliveInterval.current = null;
      }

      currentTranscript.current = "";
      
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }

      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }

      gainNode.current = null;
      micStream.current = null;

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
      }

      if (deepgramSocket.current) {
        if (deepgramSocket.current.readyState === WebSocket.OPEN) {
          deepgramSocket.current.close();
        }
        deepgramSocket.current = null;
      }

      try {
        if (conversationHistory.current.length > 0) {
          await updateConversation({
            id: roomid,
            conversation: conversationHistory.current
          });
          console.log("✅ Conversation saved to database");
        }
      } catch (error) {
        console.error("❌ Error saving conversation:", error);
      }

      // Deduct credits: 1 credit = 1 character
      if (userData && totalAICharacters.current > 0) {
        const creditsUsed = totalAICharacters.current;
        const newCredits = Math.max(0, userData.credits - creditsUsed);
        
        try {
          await updateUserToken({
            id: userData._id,
            credits: newCredits
          });
          setUserData({ ...userData, credits: newCredits });
          console.log(`💰 Credits deducted: ${creditsUsed} (${totalAICharacters.current} chars)`);
          console.log(`💰 Remaining credits: ${newCredits}`);
          
          alert(`Session ended!\nCredits used: ${creditsUsed}\nRemaining: ${newCredits}`);
        } catch (error) {
          console.error("❌ Error updating credits:", error);
        }
      }

      setIsConnected(false);
      
      setTimeout(() => {
        isProcessing.current = false;
      }, 500);
      
      console.log("✅ Disconnected successfully");
    } catch (err) {
      console.error("❌ Disconnect error:", err);
    }
  };

  if (!discussionRoomData) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-gray-500 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex gap-8 px-12 py-10 max-w-6xl mx-auto">
      <div className="flex-1 bg-[#F8FAFC] rounded-2xl shadow-lg flex flex-col items-center justify-center py-8 relative min-h-[425px]">
        <div className="absolute top-6 left-6 text-xl font-bold text-gray-800">
          {discussionRoomData.coachingOption || "Mockup Interview"}
          <div className="text-sm font-normal text-gray-600 mt-1">
            Topic: {discussionRoomData.topic || "General"}
          </div>
        </div>

        <div className="absolute top-6 right-6 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-sm font-semibold text-yellow-800">
          💰 {userData?.credits || 0} Credits
        </div>

        <div className="flex flex-col items-center mt-8 mb-2">
          {expert && EXPERT_AVATARS[expert]}
          <span className="mt-4 text-lg font-semibold text-gray-900">{expert}</span>
          {isAIThinking && (
            <span className="mt-2 text-sm text-blue-600 animate-pulse">Thinking...</span>
          )}
          {isSpeaking && (
            <span className="mt-2 text-sm text-green-600 animate-pulse">🔊 Speaking...</span>
          )}
        </div>

        <button
          className={`mt-10 mb-2 px-6 py-3 rounded-xl font-medium text-lg shadow transition ${
            isConnected ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={isConnected ? disconnectFromServer : connectToServer}
        >
          {isConnected ? "End Call" : "Start Call"}
        </button>

        {!isConnected && conversationHistory.current.length > 1 && !summaryGenerated && (
          <button
            className={`mt-3 px-6 py-3 rounded-xl font-medium text-lg shadow transition ${
              isGeneratingSummary 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={generateFeedbackOrNotes}
            disabled={isGeneratingSummary}
          >
            {isGeneratingSummary ? (
              <span className="animate-pulse">⏳ Generating...</span>
            ) : (
              <>
                {discussionRoomData.coachingOption === "Mockup Interview" || 
                 discussionRoomData.coachingOption === "Open-Ans Prep" 
                  ? "📝 Generate Feedback" 
                  : "📝 Generate Notes"}
              </>
            )}
          </button>
        )}

        {summaryGenerated && (
          <div className="mt-3 px-4 py-2 bg-green-100 border border-green-400 rounded-lg text-green-800 text-sm">
            ✅ {discussionRoomData.coachingOption === "Mockup Interview" || 
                discussionRoomData.coachingOption === "Open-Ans Prep" 
                  ? "Feedback" 
                  : "Notes"} generated successfully!
          </div>
        )}

        {isSpeaking && (
          <button
            className="mt-3 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 text-sm"
            onClick={stopSpeech}
          >
            🛑 Stop Speaking
          </button>
        )}

        <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-lg font-bold text-teal-700 shadow">
          S
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg min-w-[260px] max-w-xs flex flex-col py-7 px-8">
        <span className="font-bold text-lg text-blue-600 mb-4">Live Conversation</span>
        <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`rounded-md p-2 break-words text-sm ${
                msg.role === "user"
                  ? msg.interim 
                    ? "bg-gray-100 italic text-gray-700 ml-4"
                    : "bg-blue-50 text-gray-900 ml-4"
                  : "bg-green-50 text-gray-900 mr-4"
              }`}
            >
              <div className="font-semibold text-xs mb-1">
                {msg.role === "user" ? "You" : expert || "AI"}
              </div>
              {msg.text}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">
              Click "Start Call" to begin...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
