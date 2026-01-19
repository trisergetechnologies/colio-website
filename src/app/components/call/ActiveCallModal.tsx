'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { endCallSession } from '@/lib/api/communication';
import { getToken } from '@/lib/utils/tokenHelper';
import { useCall } from '@/context/CallContext';
import axios from 'axios';
import {
  getInCallMessages,
  sendInCallMessage,
  sendCallEmoji,
  pollCallEmojis,
  Message,
} from '@/lib/api/chat';
import { CALL_EMOJIS, POLLING_INTERVALS } from '@/constants/chatConstants';
import { useAuth } from '@/context/AuthContext';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.colio.in/api';

// ============================================
// TYPES
// ============================================

interface FloatingNotification {
  id: number;
  type: 'emoji' | 'message';
  content: string;
  isOwn: boolean;
  senderName?: string;
}

// ============================================
// ICONS (WhatsApp Style)
// ============================================

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
);

const MicOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17l1-1C15.98 10.2 16 10.1 16 10h2c0-3.53-2.61-6.43-6-6.92V3.08C12 3.03 12 3 12 3c-.03 0-.05.01-.08.01V1.3L10.2 3.01l.01.01-1.62 1.62C7.94 5.3 7.5 6.11 7.23 7H9c.2-.95.84-1.74 1.7-2.17l3.28 3.28v2.06zM12 14c.26 0 .5-.05.73-.12l6.56 6.56 1.41-1.41L2.81 2.81 1.39 4.22l5.72 5.72C7.05 10.32 7 10.66 7 11H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c1.37-.2 2.63-.78 3.69-1.62l-1.47-1.47c-.6.38-1.32.65-2.22.84V14z" />
  </svg>
);

// ============================================
// COMPONENT
// ============================================

export default function ActiveCallModal() {
  const { callState, setCallStage, endCall, setError } = useCall();
  const {user} = useAuth();

  // ============================================
  // HELPER: ROBUST USER ID FETCHING
  // This logic is inspired by your RN code's "user?.userId" check
  // ============================================
  const getCurrentUserId = (): string => {
    if (typeof window === 'undefined') return '';
    return user?.userId || '';
  };

  // ============================================
  // STATE
  // ============================================

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [remoteUid, setRemoteUid] = useState<number>(0);

  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [floatingNotifications, setFloatingNotifications] =
    useState<FloatingNotification[]>([]);

  // ============================================
  // REFS
  // ============================================

  const agoraClientRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  const notificationIdRef = useRef(0);
  const emojiPollRef = useRef<NodeJS.Timeout | null>(null);
  const chatPollRef = useRef<NodeJS.Timeout | null>(null);
  const lastEmojiPollTimeRef = useRef<number>(Date.now());
  const lastChatPollTimeRef = useRef<string>(new Date().toISOString());
  const processedMessageIds = useRef<Set<string>>(new Set());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentUserIdRef = useRef<string>('');

  // 🔔 RINGTONE REFS
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const isRingtonePlayingRef = useRef(false);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    // Set user ID immediately on mount
    currentUserIdRef.current = getCurrentUserId();
  }, []);

// ✅ POLL SESSION STATUS - Handles: Decline, Missed, Auto-End (balance depleted)
useEffect(() => {
  // Poll during ringing (for decline/missed) AND connected (for auto-end)
  if (callState.stage !== 'ringing' && callState.stage !== 'connected') return;
  if (!callState.sessionId) return;

  const pollSessionStatus = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(
        `${API_BASE_URL}/session/${callState.sessionId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const { status, autoEnded } = response.data.data;
        console.log(response.data);

        if (status === 'ended') {
          // Determine the reason for ending
          if (autoEnded) {
            console.log('[ActiveCall] 💰 Call auto-ended - balance depleted');
            // Optionally show a message to user
            setError('Call ended - insufficient balance');
          } else if (callState.stage === 'ringing') {
            console.log('[ActiveCall] 📞 Call was declined/missed by consultant');
          } else {
            console.log('[ActiveCall] 📞 Call ended by other party');
          }

          // Stop ringtone if playing
          if (ringtoneRef.current && isRingtonePlayingRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
            isRingtonePlayingRef.current = false;
          }

          // Cleanup and end
          await cleanup();
          endCall();
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('[ActiveCall] 📞 Session not found - ending call');
        await cleanup();
        endCall();
      } else {
        console.error('[ActiveCall] Session poll error:', error);
      }
    }
  };

  // Poll interval: 2s during ringing, 5s during connected (less aggressive)
  const interval = callState.stage === 'ringing' ? 2000 : 5000;
  const pollInterval = setInterval(pollSessionStatus, interval);

  // Check immediately on mount
  pollSessionStatus();

  return () => clearInterval(pollInterval);
}, [callState.stage, callState.sessionId]);

  // 🔔 RINGTONE SETUP
  useEffect(() => {
    const audio = new Audio('/ringing.mp3');
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'auto';
    
    audio.addEventListener('canplay', () => {
      console.log('[ActiveCall] 🔔 Ringtone ready to play');
    });

    ringtoneRef.current = audio;

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.src = '';
        ringtoneRef.current = null;
      }
    };
  }, []);

  // 🔔 PLAY RINGTONE WHEN RINGING
  useEffect(() => {
    const playRingtone = async () => {
      if (callState.stage === 'ringing' && ringtoneRef.current && !isRingtonePlayingRef.current) {
        try {
          await ringtoneRef.current.play();
          isRingtonePlayingRef.current = true;
        } catch (error: any) {
          console.error('[ActiveCall] 🔔 Ringtone play failed:', error);
          
          if (error.name === 'NotAllowedError') {
            const handleInteraction = async () => {
              try {
                if (ringtoneRef.current && callState.stage === 'ringing') {
                  await ringtoneRef.current.play();
                  isRingtonePlayingRef.current = true;
                }
              } catch (e) {
                console.error('[ActiveCall] 🔔 Still failed:', e);
              }
              document.removeEventListener('click', handleInteraction);
            };
            document.addEventListener('click', handleInteraction, { once: true });
          }
        }
      }
    };

    playRingtone();
  }, [callState.stage]);

  // 🔔 STOP RINGTONE WHEN CONNECTED
  useEffect(() => {
    if (isConnected && ringtoneRef.current && isRingtonePlayingRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      isRingtonePlayingRef.current = false;
    }
  }, [isConnected]);

  useEffect(() => {
    if (callState.stage === 'ringing' && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAgora();
    }

    return () => {
      if (callState.stage === 'ended') cleanup();
    };
  }, [callState.stage]);

  useEffect(() => {
    if (isConnected && callState.sessionId) {
      startEmojiPolling();
      startChatPolling();
      fetchChatMessages();
    }

    return () => {
      emojiPollRef.current && clearInterval(emojiPollRef.current);
      chatPollRef.current && clearInterval(chatPollRef.current);
    };
  }, [isConnected, callState.sessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, showChat]); // Scroll when chat opens too

  // ============================================
  // AGORA INITIALIZATION
  // ============================================

  const initializeAgora = async () => {
    try {
      const { default: AgoraClient } = await import("@/lib/agora/agoraClient");
      const client = new AgoraClient();
      agoraClientRef.current = client;

      client.onUserJoined((user: any) => {
        if (ringtoneRef.current && isRingtonePlayingRef.current) {
          ringtoneRef.current.pause();
          ringtoneRef.current.currentTime = 0;
          isRingtonePlayingRef.current = false;
        }

        setRemoteUid(user.uid);
        setIsConnected(true);
        setCallStage("connected");

        if (callState.callType === "video" && user.videoTrack) {
          setTimeout(() => {
            client.playRemoteVideo(user, "remote-video");
          }, 200);
        }

        if (user.audioTrack) {
          client.playRemoteAudio(user);
        }

        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setDuration((d) => d + 1);
          }, 1000);
        }
      });

      client.onUserLeft(() => {
        handleEndCall();
      });

      // ✅ NEW: Handle being kicked from channel (balance depleted)
      client.onConnectionStateChange((curState, prevState, reason) => {
        console.log(
          "[ActiveCall] Connection state:",
          prevState,
          "->",
          curState,
          "Reason:",
          reason,
        );

        // Handle being kicked by backend (balance depleted)
        if (curState === "DISCONNECTED" && reason === "BANNED_BY_SERVER") {
          console.log("[ActiveCall] ⛔ Kicked from channel - balance depleted");
          setError("Call ended - insufficient balance");

          // Stop ringtone if playing
          if (ringtoneRef.current && isRingtonePlayingRef.current) {
            ringtoneRef.current.pause();
            ringtoneRef.current.currentTime = 0;
            isRingtonePlayingRef.current = false;
          }

          // Cleanup and end
          cleanup().then(() => {
            endCall();
          });
        }

        // Handle other disconnection reasons
        if (curState === "DISCONNECTED" && reason !== "LEAVE") {
          console.log("[ActiveCall] 🔌 Disconnected unexpectedly");
          handleEndCall();
        }
      });

      const success = await client.init(
        {
          appId: AGORA_APP_ID,
          channel: callState.channelName!,
          token: callState.token!,
        },
        callState.callType!,
      );

      if (!success) throw new Error("Failed to join Agora");

      if (callState.callType === "video") {
        setTimeout(() => {
          client.playLocalVideo("local-video");
        }, 500);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect to call');
    }
  };

  // ============================================
  // CLEANUP
  // ============================================

  const cleanup = async () => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      isRingtonePlayingRef.current = false;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    emojiPollRef.current && clearInterval(emojiPollRef.current);
    chatPollRef.current && clearInterval(chatPollRef.current);

    if (agoraClientRef.current) {
      await agoraClientRef.current.leave();
      agoraClientRef.current = null;
    }

    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 1000);
  };

  // ============================================
  // FLOATING NOTIFICATIONS
  // ============================================

  const showFloatingNotification = useCallback(
    (
      type: 'emoji' | 'message',
      content: string,
      isOwn: boolean,
      senderName?: string
    ) => {
      const id = notificationIdRef.current++;
      setFloatingNotifications((prev) => [
        ...prev,
        { id, type, content, isOwn, senderName },
      ]);

      setTimeout(() => {
        setFloatingNotifications((prev) =>
          prev.filter((n) => n.id !== id)
        );
      }, type === 'message' ? 3500 : 2500);
    },
    []
  );

  // ============================================
  // EMOJI & CHAT FUNCTIONS
  // ============================================

  const startEmojiPolling = () => {
    if (emojiPollRef.current) return;
    lastEmojiPollTimeRef.current = Date.now();

    emojiPollRef.current = setInterval(async () => {
      if (!callState.sessionId) return;
      try {
        const result = await pollCallEmojis(callState.sessionId, lastEmojiPollTimeRef.current);
        if (result.emojis?.length > 0) {
          const consultantEmojis = result.emojis.filter(e => e.senderType === 'consultant');
          consultantEmojis.forEach(e => {
            showFloatingNotification('emoji', e.emoji, false);
          });
        }
        lastEmojiPollTimeRef.current = result.serverTime;
      } catch (error) {
        console.error('[ActiveCall] Emoji poll error:', error);
      }
    }, POLLING_INTERVALS.IN_CALL_EMOJIS);
  };

  const handleSendEmoji = async (emoji: string) => {
    showFloatingNotification('emoji', emoji, true);
    if (callState.sessionId) {
      try {
        await sendCallEmoji(callState.sessionId, emoji);
      } catch (error) {
        console.error('[ActiveCall] Send emoji error:', error);
      }
    }
  };

  const fetchChatMessages = async () => {
    if (!callState.sessionId) return;
    try {
      const result = await getInCallMessages(callState.sessionId);
      const messages = result.messages || [];
      setChatMessages(messages);
      messages.forEach(m => processedMessageIds.current.add(m._id));
      lastChatPollTimeRef.current = result.serverTime;
    } catch (error) {
      console.error('[ActiveCall] Fetch chat error:', error);
    }
  };

  const startChatPolling = () => {
    if (chatPollRef.current) return;
    chatPollRef.current = setInterval(async () => {
      if (!callState.sessionId) return;
      try {
        const result = await getInCallMessages(callState.sessionId, lastChatPollTimeRef.current);
        if (result.messages?.length > 0) {
          result.messages.forEach(msg => {
            if (!processedMessageIds.current.has(msg._id)) {
              processedMessageIds.current.add(msg._id);
              setChatMessages(prev => [...prev, msg]);
              if (!isOwnMessage(msg)) {
                showFloatingNotification('message', msg.content, false, callState.consultantName || 'Consultant');
              }
            }
          });
          lastChatPollTimeRef.current = result.serverTime;
        }
      } catch (error) {
        console.error('[ActiveCall] Chat poll error:', error);
      }
    }, POLLING_INTERVALS.IN_CALL_MESSAGES);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !callState.sessionId || isSendingMessage) return;
    const content = chatInput.trim();
    setChatInput('');
    setIsSendingMessage(true);

    try {
      const result = await sendInCallMessage(callState.sessionId, content, 'text');
      if (result?.message) {
        processedMessageIds.current.add(result.message._id);
        setChatMessages(prev => [...prev, result.message]);
        // Note: No notification needed for own message inside chat panel
        // showFloatingNotification('message', content, true); 
      }
    } catch (error) {
      console.error('[ActiveCall] Send message error:', error);
      setChatInput(content);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // ============================================
  // HELPER: MESSAGE OWNERSHIP CHECK
  // Inspired by your RN code: checks object ID or string ID
  // ============================================
  const isOwnMessage = (message: Message): boolean => {
    const currentUserId = currentUserIdRef.current;
    console.log('currentUserId', currentUserId);
    if (!currentUserId) return false;

    // Handle case where sender is an object (populated) or just a string ID
    const senderId = typeof message.sender === 'object'
      ? (message.sender._id?.toString() || '')
      : message.sender?.toString() || '';
      
    return currentUserId === senderId;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ============================================
  // CALL CONTROLS
  // ============================================

  const toggleMute = async () => {
    if (!agoraClientRef.current || !isConnected) return;
    const newMuted = !isMuted;
    await agoraClientRef.current.toggleAudio(newMuted);
    setIsMuted(newMuted);
  };

  const handleEndCall = async () => {
    if (isCleaningUpRef.current) return;
    try {
      const token = getToken();
      if (callState.sessionId && token) {
        await endCallSession(callState.sessionId, token);
      }
    } catch (error) {
      console.error('[ActiveCall] ❌ End call API error:', error);
    } finally {
      await cleanup();
      endCall();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callState.stage !== 'ringing' && callState.stage !== 'connected') return null;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="fixed inset-0 bg-black z-[10000]">
      {/* 🌈 COLORFUL GRADIENT BACKGROUND */}
      <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
        
        {/* REMOTE VIDEO / VOICE BACKGROUND */}
        {callState.callType === 'video' ? (
          <div id="remote-video" className="w-full h-full bg-black/20 backdrop-blur-sm">
            {!isConnected && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                {/* Pulsing Avatar */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25"></div>
                  <div className="w-[140px] h-[140px] rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md z-10 relative shadow-xl">
                    <span className="text-6xl">👤</span>
                  </div>
                </div>
                <h2 className="text-white text-3xl font-bold mb-2 drop-shadow-md">
                  {callState.consultantName || 'Consultant'}
                </h2>
                <p className="text-white/90 text-lg font-medium animate-pulse">Ringing...</p>
              </div>
            )}
          </div>
        ) : (
          // AUDIO CALL UI
          <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="relative mb-10">
               {/* Pulsing rings for active call */}
               {isConnected && (
                 <>
                  <div className="absolute inset-0 -m-4 border border-white/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                  <div className="absolute inset-0 -m-8 border border-white/10 rounded-full animate-[ping_4s_linear_infinite_1s]"></div>
                 </>
               )}
              
              <div className="w-[160px] h-[160px] rounded-full border-4 border-white/50 flex items-center justify-center bg-white/20 backdrop-blur-lg shadow-2xl relative z-10">
                <span className="text-7xl">👤</span>
              </div>
            </div>

            <h2 className="text-white text-3xl font-bold mb-3 drop-shadow-lg tracking-wide">
              {callState.consultantName || 'Consultant'}
            </h2>
            
            {!isConnected && (
                <p className="text-white/80 font-medium tracking-wider animate-pulse mt-2">Connecting...</p>
            )}
          </div>
        )}

        {/* LOCAL VIDEO PREVIEW (PiP) */}
        {callState.callType === 'video' && isVideoEnabled && (
          <div 
            id="local-video" 
            className="absolute top-24 right-5 w-[120px] h-[160px] rounded-2xl overflow-hidden border-2 border-white/40 z-10 shadow-2xl bg-black/50 backdrop-blur-sm"
          />
        )}

        {/* FLOATING NOTIFICATIONS */}
        {floatingNotifications.map(({ id, type, content, isOwn, senderName }) => (
          <div
            key={id}
            className={`absolute bottom-[220px] z-[100] pointer-events-none animate-float-up ${
              isOwn ? 'right-10' : 'left-10'
            }`}
          >
            {type === 'emoji' ? (
              <span className="text-6xl drop-shadow-lg">{content}</span>
            ) : (
              <div className="max-w-[250px] bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-xl border border-white/40">
                {!isOwn && senderName && (
                  <span className="block text-xs font-bold text-indigo-600 mb-1">
                    {senderName}
                  </span>
                )}
                <span className="text-base text-gray-900 font-medium leading-snug">
                  {content}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* TOP STATUS BAR - UPDATED: IN CALL + TIMER */}
        <div className="absolute top-6 left-0 right-0 z-[20] flex justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3 shadow-lg">
             {/* Recording Dot */}
             <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
             
             {/* Text */}
             <span className="text-white/90 text-sm font-semibold tracking-wide">
               {isConnected ? 'In Call' : 'Connecting'}
             </span>
             
             {/* Separator */}
             <div className="w-[1px] h-4 bg-white/20" />
             
             {/* Timer */}
             <span className="text-white font-mono text-sm tracking-widest min-w-[45px]">
               {isConnected ? formatDuration(duration) : '--:--'}
             </span>
          </div>
        </div>

        {/* CHAT PANEL - FIXED SIDE BY SIDE */}
        {showChat && (
          <div className="absolute bottom-[220px] left-5 right-5 max-w-[300px] max-h-[300px] bg-white/10 rounded-3xl overflow-hidden z-20 flex flex-col backdrop-blur-xl border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-white/5">
              <span className="text-white text-lg font-bold tracking-wide">Messages</span>
              <button 
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 max-h-[250px] flex flex-col gap-3"
            >
              {chatMessages.length === 0 ? (
                <div className="text-white/50 text-center py-10 italic">
                  Start the conversation...
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isOwn = isOwnMessage(msg);
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col max-w-[85%] ${isOwn ? 'items-end self-end' : 'items-start self-start'}`}
                    >
                      {/* Name Label */}
                      <span className="text-xs text-white/70 mb-1 px-1 font-medium">
                          {isOwn ? 'You' : (callState.consultantName || 'Consultant')}
                      </span>

                      <div
                        className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                          isOwn 
                            ? 'bg-purple-600 text-white rounded-br-none' // Your message
                            : 'bg-white/20 backdrop-blur-md rounded-bl-none text-white border border-white/10' // Their message
                        }`}
                      >
                        <span className="text-[15px] leading-relaxed break-words font-medium">
                          {msg.content}
                        </span>
                        <div className={`text-[10px] mt-1 font-medium text-right ${isOwn ? 'text-white/70' : 'text-white/50'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-3 p-4 border-t border-white/10 bg-black/20">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 bg-white/10 border border-white/10 rounded-full px-5 py-3 text-white text-sm outline-none placeholder:text-white/40 focus:bg-white/20 focus:border-white/30 transition-all shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isSendingMessage}
                className={`w-11 h-11 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center transition-all shadow-lg ${
                  !chatInput.trim() || isSendingMessage 
                    ? 'opacity-50 grayscale cursor-not-allowed' 
                    : 'opacity-100 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-white text-lg ml-0.5">➤</span>
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM CONTROLS - FLOATING DOCK STYLE */}
        <div className="absolute bottom-8 left-0 right-0 z-[20] flex flex-col items-center gap-5">
          
          {/* 1. Chat & Emojis Row (Floating above dock) */}
          <div className="flex justify-center items-center gap-3 px-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all border shadow-lg backdrop-blur-md ${
                showChat 
                  ? 'bg-white text-purple-600 border-white' 
                  : 'bg-black/30 text-white border-white/10 hover:bg-black/50'
              }`}
            >
              💬
            </button>
            
            {CALL_EMOJIS.slice(0, 4).map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleSendEmoji(emoji)}
                className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* 2. Main Action Pill (The Dock) */}
          <div className="flex items-center gap-6 px-8 py-3 bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
            
            {/* WHATSAPP STYLE MUTE BUTTON */}
            <button
              onClick={toggleMute}
              disabled={!isConnected}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${
                isMuted 
                  ? 'bg-white text-gray-900' // Muted: White bg, dark icon
                  : 'bg-white/10 text-white hover:bg-white/20' // Unmuted: Glass bg, white icon
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </button>

            {/* END CALL BUTTON */}
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-3xl shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <span className="rotate-[135deg] text-white">📞</span>
            </button>

          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* GLOBAL STYLES FOR ANIMATIONS */}
      {/* ============================================ */}
      
      <style jsx global>{`
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          10% { opacity: 1; transform: translateY(-20px) scale(1.1); }
          85% { opacity: 1; transform: translateY(-180px) scale(1); }
          100% { opacity: 0; transform: translateY(-200px) scale(0.9); }
        }
        
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
        }

        @keyframes gradient-xy {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .animate-gradient-xy {
            background-size: 200% 200%;
            animation: gradient-xy 15s ease infinite;
        }
        
        #remote-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        #local-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}