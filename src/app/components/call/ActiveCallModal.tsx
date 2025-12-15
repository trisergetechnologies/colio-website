// components/call/ActiveCallModal.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { endCallSession } from '@/lib/api/communication';
import { getToken } from '@/lib/utils/tokenHelper';
import { useCall } from '@/context/CallContext';
import {
  getInCallMessages,
  sendInCallMessage,
  sendCallEmoji,
  pollCallEmojis,
  Message,
} from '@/lib/api/chat';
import { CALL_EMOJIS, POLLING_INTERVALS } from '@/constants/chatConstants';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';

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
// COMPONENT
// ============================================

export default function ActiveCallModal() {
  const { callState, setCallStage, endCall, setError } = useCall();

  // Get current user ID from localStorage
  const getCurrentUserId = (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || '';
      }
    } catch (e) {
      console.error('[ActiveCall] Error getting user ID:', e);
    }
    return '';
  };

  // ============================================
  // STATE
  // ============================================

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [remoteUid, setRemoteUid] = useState<number>(0);

  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Floating notifications
  const [floatingNotifications, setFloatingNotifications] = useState<FloatingNotification[]>([]);

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

  // ============================================
  // EFFECTS
  // ============================================

  // Get user ID on mount
  useEffect(() => {
    currentUserIdRef.current = getCurrentUserId();
  }, []);

  // Initialize call
  useEffect(() => {
    if (callState.stage === 'ringing' && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAgora();
    }

    return () => {
      if (callState.stage === 'ended') {
        cleanup();
      }
    };
  }, [callState.stage]);

  // Start polling when connected
  useEffect(() => {
    if (isConnected && callState.sessionId) {
      console.log('[ActiveCall] ✅ Connected - Starting polling');
      startEmojiPolling();
      startChatPolling();
      fetchChatMessages();
    }

    return () => {
      if (emojiPollRef.current) clearInterval(emojiPollRef.current);
      if (chatPollRef.current) clearInterval(chatPollRef.current);
    };
  }, [isConnected, callState.sessionId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ============================================
  // AGORA INITIALIZATION
  // ============================================

  const initializeAgora = async () => {
    try {
      console.log('[ActiveCall] ========================================');
      console.log('[ActiveCall] Initializing Agora...');
      console.log('[ActiveCall] Channel:', callState.channelName);
      console.log('[ActiveCall] Session ID:', callState.sessionId);
      console.log('[ActiveCall] ========================================');

      const { default: AgoraClient } = await import('@/lib/agora/agoraClient');
      const client = new AgoraClient();
      agoraClientRef.current = client;

      // Event: Consultant joined
      client.onUserJoined((user: any) => {
        console.log('[ActiveCall] 🎉 Consultant joined! UID:', user.uid);

        setRemoteUid(user.uid);
        setIsConnected(true);
        setCallStage('connected');

        // Play remote video
        if (callState.callType === 'video' && user.videoTrack) {
          setTimeout(() => {
            console.log('[ActiveCall] Playing remote video...');
            client.playRemoteVideo(user, 'remote-video');
          }, 200);
        }

        // Play remote audio
        if (user.audioTrack) {
          console.log('[ActiveCall] Playing remote audio...');
          client.playRemoteAudio(user);
        }

        // Start call timer
        if (!timerRef.current) {
          console.log('[ActiveCall] ⏱️ Starting call timer');
          timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
          }, 1000);
        }
      });

      // Event: Consultant left
      client.onUserLeft((user: any) => {
        console.log('[ActiveCall] 👋 Consultant left');
        setRemoteUid(0);
        setIsConnected(false);

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        setTimeout(() => {
          alert('Call ended - Consultant left the call');
          handleEndCall();
        }, 500);
      });

      // Join channel
      const success = await client.init(
        {
          appId: AGORA_APP_ID,
          channel: callState.channelName!,
          token: callState.token!,
        },
        callState.callType!
      );

      if (!success) {
        throw new Error('Failed to join Agora channel');
      }

      console.log('[ActiveCall] ✅ Successfully joined channel');

      // Play local video preview
      if (callState.callType === 'video') {
        setTimeout(() => {
          console.log('[ActiveCall] Playing local video preview...');
          client.playLocalVideo('local-video');
        }, 500);
      }

    } catch (error: any) {
      console.error('[ActiveCall] ❌ Initialization failed:', error);
      setError(error.message || 'Failed to connect to call');
    }
  };

  // ============================================
  // CLEANUP
  // ============================================

  const cleanup = async () => {
    if (isCleaningUpRef.current) {
      console.log('[ActiveCall] ⚠️ Already cleaning up, skipping');
      return;
    }

    isCleaningUpRef.current = true;
    console.log('[ActiveCall] 🧹 Cleaning up...');

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop polling
    if (emojiPollRef.current) {
      clearInterval(emojiPollRef.current);
      emojiPollRef.current = null;
    }

    if (chatPollRef.current) {
      clearInterval(chatPollRef.current);
      chatPollRef.current = null;
    }

    // Leave Agora
    if (agoraClientRef.current) {
      try {
        await agoraClientRef.current.leave();
        agoraClientRef.current = null;
      } catch (error) {
        console.error('[ActiveCall] Cleanup error:', error);
      }
    }

    console.log('[ActiveCall] ✅ Cleanup complete');

    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 1000);
  };

  // ============================================
  // FLOATING NOTIFICATIONS
  // ============================================

  const showFloatingNotification = useCallback((
    type: 'emoji' | 'message',
    content: string,
    isOwn: boolean,
    senderName?: string
  ) => {
    const id = notificationIdRef.current++;

    setFloatingNotifications(prev => [...prev, {
      id,
      type,
      content,
      isOwn,
      senderName
    }]);

    // Auto-remove after animation
    setTimeout(() => {
      setFloatingNotifications(prev => prev.filter(n => n.id !== id));
    }, type === 'message' ? 3500 : 2500);
  }, []);

  // ============================================
  // EMOJI FUNCTIONS
  // ============================================

  const startEmojiPolling = () => {
    if (emojiPollRef.current) return;

    console.log('[ActiveCall] 🎭 Starting emoji polling');
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
    // Show own emoji immediately
    showFloatingNotification('emoji', emoji, true);

    if (callState.sessionId) {
      try {
        await sendCallEmoji(callState.sessionId, emoji);
        console.log('[ActiveCall] 🎭 Emoji sent:', emoji);
      } catch (error) {
        console.error('[ActiveCall] Send emoji error:', error);
      }
    }
  };

  // ============================================
  // CHAT FUNCTIONS
  // ============================================

  const fetchChatMessages = async () => {
    if (!callState.sessionId) return;

    try {
      console.log('[ActiveCall] 💬 Fetching initial chat messages');
      const result = await getInCallMessages(callState.sessionId);
      const messages = result.messages || [];
      setChatMessages(messages);
      messages.forEach(m => processedMessageIds.current.add(m._id));
      lastChatPollTimeRef.current = result.serverTime;
      console.log('[ActiveCall] 💬 Loaded', messages.length, 'messages');
    } catch (error) {
      console.error('[ActiveCall] Fetch chat error:', error);
    }
  };

  const startChatPolling = () => {
    if (chatPollRef.current) return;

    console.log('[ActiveCall] 💬 Starting chat polling');

    chatPollRef.current = setInterval(async () => {
      if (!callState.sessionId) return;

      try {
        const result = await getInCallMessages(callState.sessionId, lastChatPollTimeRef.current);

        if (result.messages?.length > 0) {
          result.messages.forEach(msg => {
            if (!processedMessageIds.current.has(msg._id)) {
              processedMessageIds.current.add(msg._id);
              setChatMessages(prev => [...prev, msg]);

              // Show floating notification for incoming messages
              const isOwn = isOwnMessage(msg);
              if (!isOwn) {
                showFloatingNotification(
                  'message',
                  msg.content,
                  false,
                  callState.consultantName || 'Consultant'
                );
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
        showFloatingNotification('message', content, true);
        console.log('[ActiveCall] 💬 Message sent');
      }
    } catch (error) {
      console.error('[ActiveCall] Send message error:', error);
      setChatInput(content); // Restore input on error
    } finally {
      setIsSendingMessage(false);
    }
  };

  const isOwnMessage = (message: Message): boolean => {
    const currentUserId = currentUserIdRef.current;
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
    console.log('[ActiveCall] 🎤 Mute:', newMuted);
  };

  const toggleVideo = async () => {
    if (!agoraClientRef.current || callState.callType !== 'video' || !isConnected) return;
    const newEnabled = !isVideoEnabled;
    await agoraClientRef.current.toggleVideo(newEnabled);
    setIsVideoEnabled(newEnabled);
    console.log('[ActiveCall] 📹 Video:', newEnabled);
  };

  const handleEndCall = async () => {
    if (isCleaningUpRef.current) {
      console.log('[ActiveCall] ⚠️ Already ending call');
      return;
    }

    console.log('[ActiveCall] 📞 User ending call...');

    try {
      const token = getToken();
      if (callState.sessionId && token) {
        console.log('[ActiveCall] Ending backend session...');
        await endCallSession(callState.sessionId, token);
        console.log('[ActiveCall] ✅ Backend session ended');
      }
    } catch (error) {
      console.error('[ActiveCall] ❌ End call API error:', error);
    } finally {
      await cleanup();
      endCall();
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // RENDER GUARD
  // ============================================

  if (callState.stage !== 'ringing' && callState.stage !== 'connected') return null;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="fixed inset-0 bg-black z-[10000]">
      <div className="relative w-full h-full bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        
        {/* ============================================ */}
        {/* REMOTE VIDEO / VOICE BACKGROUND */}
        {/* ============================================ */}
        
        {callState.callType === 'video' ? (
          <div id="remote-video" className="w-full h-full bg-black">
            {!isConnected && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                <div className="w-[140px] h-[140px] rounded-full border-[3px] border-pink-500/50 flex items-center justify-center mb-5">
                  <div className="w-[120px] h-[120px] rounded-full bg-white/15 flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                </div>
                <h2 className="text-white text-2xl font-bold mb-2">
                  {callState.consultantName || 'Consultant'}
                </h2>
                <p className="text-white/70 text-base">Ringing...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[140px] h-[140px] rounded-full border-[3px] border-pink-500/50 flex items-center justify-center mb-5">
              <div className="w-[120px] h-[120px] rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              {callState.consultantName || 'Consultant'}
            </h2>
            <p className="text-white/70 text-base">
              {isConnected ? 'Connected' : 'Ringing...'}
            </p>
            {isConnected && (
              <p className="text-pink-500 text-lg font-semibold mt-2">
                {formatDuration(duration)}
              </p>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* LOCAL VIDEO PREVIEW (PiP) */}
        {/* ============================================ */}
        
        {callState.callType === 'video' && isVideoEnabled && (
          <div 
            id="local-video" 
            className="absolute top-24 right-5 w-[120px] h-[160px] rounded-xl overflow-hidden border-2 border-white/30 z-10 shadow-lg bg-black"
          />
        )}

        {/* ============================================ */}
        {/* FLOATING NOTIFICATIONS (Emojis + Messages) */}
        {/* ============================================ */}
        
        {floatingNotifications.map(({ id, type, content, isOwn, senderName }) => (
          <div
            key={id}
            className={`absolute bottom-[220px] z-[100] pointer-events-none animate-float-up ${
              isOwn ? 'right-10' : 'left-10'
            }`}
          >
            {type === 'emoji' ? (
              <span className="text-5xl">{content}</span>
            ) : (
              <div className="max-w-[250px] bg-white/95 rounded-2xl px-4 py-3 shadow-lg">
                {!isOwn && senderName && (
                  <span className="block text-xs font-semibold text-pink-500 mb-1">
                    {senderName}
                  </span>
                )}
                <span className="text-sm text-gray-900 leading-snug">
                  {content}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* ============================================ */}
        {/* TOP STATUS BAR */}
        {/* ============================================ */}
        
        <div className="absolute top-0 left-0 right-0 p-5 bg-black/40 flex flex-col items-center z-[5]">
          <div className="flex items-center gap-2 mb-1">
            <span 
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`} 
            />
            <span className="text-white text-base font-semibold">
              {isConnected ? 'Connected' : 'Ringing...'}
            </span>
          </div>
          {isConnected && (
            <p className="text-white/70 text-sm">{formatDuration(duration)}</p>
          )}
        </div>

        {/* ============================================ */}
        {/* CHAT PANEL */}
        {/* ============================================ */}
        
        {showChat && (
          <div className="absolute bottom-[200px] left-5 right-5 max-w-[400px] max-h-[350px] bg-[rgba(20,20,30,0.95)] rounded-2xl overflow-hidden z-20 flex flex-col backdrop-blur-lg border border-white/10">
            {/* Chat Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
              <span className="text-white text-base font-semibold">Chat</span>
              <button 
                onClick={() => setShowChat(false)}
                className="text-white text-lg px-2 py-1 hover:bg-white/10 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 max-h-[200px] space-y-2"
            >
              {chatMessages.length === 0 ? (
                <div className="text-white/40 text-center py-8">
                  No messages yet
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isOwn = isOwnMessage(msg);
                  return (
                    <div
                      key={msg._id}
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl flex flex-col ${
                        isOwn 
                          ? 'ml-auto bg-pink-500 rounded-br-sm' 
                          : 'mr-auto bg-white/15 rounded-bl-sm'
                      }`}
                    >
                      <span className="text-white text-sm break-words">
                        {msg.content}
                      </span>
                      <span className="text-white/60 text-[10px] mt-1 self-end">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-3 p-3 border-t border-white/10">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 bg-white/10 border-none rounded-full px-4 py-2.5 text-white text-sm outline-none placeholder:text-white/40 focus:bg-white/15 transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isSendingMessage}
                className={`w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center transition-opacity ${
                  !chatInput.trim() || isSendingMessage 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'opacity-100 hover:bg-pink-600 cursor-pointer'
                }`}
              >
                <span className="text-white text-base">➤</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* BOTTOM CONTROLS */}
        {/* ============================================ */}
        
        <div className="absolute bottom-0 left-0 right-0 px-5 pt-5 pb-10 bg-black/60 z-[5]">
          {/* Emoji Row */}
          <div className="flex justify-center gap-3 mb-5">
            {/* Chat Toggle Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-colors ${
                showChat 
                  ? 'bg-pink-500' 
                  : 'bg-white/15 hover:bg-white/25'
              }`}
              title="Chat"
            >
              💬
            </button>
            
            {/* Emoji Buttons */}
            {CALL_EMOJIS.slice(0, 5).map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleSendEmoji(emoji)}
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-xl transition-colors"
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Main Controls Row */}
          <div className="flex justify-center items-center gap-4">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              disabled={!isConnected}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                isMuted 
                  ? 'bg-red-500' 
                  : 'bg-white/20 hover:bg-white/30'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            {/* Video Toggle Button (Video calls only) */}
            {callState.callType === 'video' && (
              <button
                onClick={toggleVideo}
                disabled={!isConnected}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                  !isVideoEnabled 
                    ? 'bg-red-500' 
                    : 'bg-white/20 hover:bg-white/30'
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {isVideoEnabled ? '📹' : '📷'}
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="w-[68px] h-[68px] rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-3xl shadow-lg shadow-red-500/40 transition-colors cursor-pointer"
              title="End call"
            >
              <span className="rotate-[135deg] inline-block">📞</span>
            </button>

            {/* Speaker Button (Visual only on web) */}
            <button
              className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl cursor-default"
              title="Speaker"
            >
              🔊
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* GLOBAL STYLES FOR ANIMATIONS */}
      {/* ============================================ */}
      
      <style jsx global>{`
        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.8);
          }
          10% {
            opacity: 1;
            transform: translateY(-20px) scale(1.1);
          }
          85% {
            opacity: 1;
            transform: translateY(-180px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) scale(0.9);
          }
        }
        
        .animate-float-up {
          animation: float-up 3s ease-out forwards;
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