"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getToken, AIModel, AIModelFeedbackAndNotes } from "@/services/GlobalServices";
import { userContext } from "@/app/AuthProvider";
import { toast } from "sonner";
import { Mic, MicOff, Phone, PhoneOff, MessageSquare, Loader2, FileText, Check, Sparkles } from "lucide-react";

const EXPERT_AVATARS = {
  Joanna: {
    gradient: 'from-amber-400 to-orange-500',
    initial: 'J'
  },
  Sallie: {
    gradient: 'from-sky-400 to-blue-500',
    initial: 'S'
  },
  Matthew: {
    gradient: 'from-indigo-500 to-purple-600',
    initial: 'M'
  },
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
    }
  };

  const unmuteMicrophone = () => {
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(1, audioContext.current.currentTime);
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
          if (selectedVoice) break;
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

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          setTimeout(() => unmuteMicrophone(), 300);
          resolve();
        };
        utterance.onerror = (event) => {
          setIsSpeaking(false);
          unmuteMicrophone();
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
    totalAICharacters.current += greeting.length;

    try {
      await speakText(greeting, discussionRoomData.expertName);
    } catch (error) {
      // Silent fail
    }
  };

  const handleFinalTranscript = async (transcript) => {
    try {
      if (isProcessing.current) return;

      const lastUserMessage = conversationHistory.current[conversationHistory.current.length - 1];
      if (lastUserMessage?.role === "user" && lastUserMessage?.content === transcript) return;

      isProcessing.current = true;
      conversationHistory.current.push({ role: "user", content: transcript });
      setIsAIThinking(true);

      const aiResponse = await AIModel(
        discussionRoomData.coachingOption,
        discussionRoomData.topic,
        conversationHistory.current
      );

      totalAICharacters.current += aiResponse.length;
      conversationHistory.current.push({ role: "assistant", content: aiResponse });
      setMessages((prev) => [...prev, { role: "assistant", text: aiResponse, interim: false }]);
      setIsAIThinking(false);
      isProcessing.current = false;

      await speakText(aiResponse, discussionRoomData.expertName);
    } catch (error) {
      setIsAIThinking(false);
      isProcessing.current = false;
      
      let errorMessage = "Sorry, I'm having trouble responding. Please try again.";
      if (error.message?.includes('429') || error.message?.includes('RateLimit')) {
        errorMessage = "Rate limit reached. Please wait before continuing.";
      }
      
      setMessages((prev) => [...prev, { role: "assistant", text: errorMessage, interim: false }]);
      await speakText(errorMessage, discussionRoomData.expertName).catch(() => {});
    }
  };

  const generateFeedbackOrNotes = async () => {
    try {
      setIsGeneratingSummary(true);

      const summary = await AIModelFeedbackAndNotes(
        discussionRoomData.coachingOption,
        discussionRoomData.topic,
        conversationHistory.current
      );

      await updateSummary({ id: roomid, summary: summary });
      setSummaryGenerated(true);
      setIsGeneratingSummary(false);
      toast.success("Feedback generated successfully!");
    } catch (error) {
      setIsGeneratingSummary(false);
      toast.error("Failed to generate feedback");
    }
  };

  const connectToServer = async () => {
    try {
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

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      gainNode.current = audioContext.current.createGain();
      source.connect(gainNode.current);
      const destination = audioContext.current.createMediaStreamDestination();
      gainNode.current.connect(destination);
      micStream.current = destination.stream;

      mediaRecorder.current = new MediaRecorder(micStream.current, { mimeType: "audio/webm" });
      const apiKey = await getToken();
      const url = "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&language=en-IN&endpointing=500&smart_format=true";
      deepgramSocket.current = new WebSocket(url, ["token", apiKey]);

      deepgramSocket.current.onopen = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "inactive") {
          mediaRecorder.current.start(250);
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
                return [...filtered, { role: "user", text: currentTranscript.current.trim(), interim: false }];
              });
            } else {
              setMessages((prev) => {
                const filtered = prev.filter(msg => !(msg.role === "user" && msg.interim));
                return [...filtered, { role: "user", text: (currentTranscript.current + " " + transcript).trim(), interim: true }];
              });
            }

            silenceTimer.current = setTimeout(() => {
              const textToSend = currentTranscript.current.trim();
              if (textToSend && !isProcessing.current) {
                handleFinalTranscript(textToSend);
                currentTranscript.current = "";
              }
              silenceTimer.current = null;
            }, 4000);
          }
        } catch (err) {}
      };

      deepgramSocket.current.onerror = () => toast.error("Connection error");
      deepgramSocket.current.onclose = () => {
        if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
      };

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0 && deepgramSocket.current?.readyState === WebSocket.OPEN) {
          deepgramSocket.current.send(event.data);
        }
      };

      setIsConnected(true);
      
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const disconnectFromServer = async () => {
    try {
      stopSpeech();
      isProcessing.current = true;
      
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
      
      currentTranscript.current = "";
      
      if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }

      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }

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

      if (conversationHistory.current.length > 0) {
        await updateConversation({ id: roomid, conversation: conversationHistory.current });
      }

      // Deduct credits
      if (userData && totalAICharacters.current > 0) {
        const creditsUsed = totalAICharacters.current;
        const newCredits = Math.max(0, userData.credits - creditsUsed);
        
        await updateUserToken({ id: userData._id, credits: newCredits });
        setUserData({ ...userData, credits: newCredits });
        toast.success(`Session ended - ${creditsUsed} credits used`);
      }

      setIsConnected(false);
      setTimeout(() => { isProcessing.current = false; }, 500);
      
    } catch (err) {
      toast.error("Error ending session");
    }
  };

  if (!discussionRoomData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  const expertAvatar = EXPERT_AVATARS[expert] || EXPERT_AVATARS["Matthew"];

  return (
    <div className="min-h-screen bg-black py-6 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">
              {discussionRoomData.coachingOption}
            </h1>
            <p className="text-gray-500 text-sm">{discussionRoomData.topic}</p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-white">{userData?.credits || 0}</span>
            <span className="text-xs text-gray-500">credits</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Call Area */}
          <div className="lg:col-span-2 bg-gray-950 rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              
              {/* Expert Avatar */}
              <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${expertAvatar.gradient} flex items-center justify-center shadow-2xl mb-4 ${isSpeaking ? 'ring-4 ring-green-500 animate-pulse' : ''}`}>
                <span className="text-4xl text-white font-bold">{expertAvatar.initial}</span>
              </div>
              
              <h2 className="text-xl font-medium text-white mb-2">{expert}</h2>
              
              {/* Status */}
              {isAIThinking && (
                <p className="text-sm text-gray-400">Thinking...</p>
              )}
              {isSpeaking && (
                <p className="text-sm text-green-400">Speaking</p>
              )}
              {isConnected && !isAIThinking && !isSpeaking && (
                <p className="text-sm text-gray-500">Listening</p>
              )}
            </div>

            {/* Control Bar - Google Meet Style */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
              <div className="flex items-center justify-center gap-4">
                
                {/* Mic Toggle */}
                <button
                  className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all"
                  disabled
                >
                  <Mic className="w-5 h-5 text-white" />
                </button>

                {/* End/Start Call - Primary Action */}
                <button
                  className={`h-14 px-8 rounded-full font-medium transition-all flex items-center gap-2 ${
                    isConnected 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  onClick={isConnected ? disconnectFromServer : connectToServer}
                >
                  {isConnected ? (
                    <>
                      <PhoneOff className="w-5 h-5" />
                      End
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Join
                    </>
                  )}
                </button>

                {/* More Options */}
                {!isConnected && conversationHistory.current.length > 1 && !summaryGenerated && (
                  <button
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isGeneratingSummary 
                        ? "bg-gray-800 cursor-not-allowed" 
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    onClick={generateFeedbackOrNotes}
                    disabled={isGeneratingSummary}
                  >
                    {isGeneratingSummary ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
              </div>

              {summaryGenerated && (
                <p className="text-center text-green-400 text-sm mt-3 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Feedback generated
                </p>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="bg-gray-950 rounded-2xl p-4 flex flex-col max-h-[600px] lg:max-h-none">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h3 className="font-medium text-white">Live Transcript</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {messages.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-8">
                  Join the call to start
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`rounded-lg p-2.5 text-sm ${
                      msg.role === "user"
                        ? msg.interim 
                          ? "bg-gray-900/50 text-gray-500 italic"
                          : "bg-blue-500/10 text-blue-200 border border-blue-500/20"
                        : "bg-gray-900 text-gray-300"
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-60">
                      {msg.role === "user" ? "You" : expert}
                    </div>
                    {msg.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;
