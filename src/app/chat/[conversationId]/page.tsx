'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getMessages,
  sendMessage,
  markAsRead,
  pollMessages,
  startConversation,
  Message,
} from '@/lib/api/chat';
import { POLLING_INTERVALS } from '@/constants/chatConstants';
import { useChat } from '@/context/ChatContext';
import { useCall } from '@/context/CallContext';
import { useAuth } from '@/context/AuthContext';

// --- ICONS ---
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
  </svg>
);

export default function ChatConversationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { refreshUnreadCount, setActiveConversationId } = useChat();
  const { initiateCall } = useCall();
  const { user, isAuthLoading } = useAuth();

  const conversationIdParam = params.conversationId as string;
  const participantId = searchParams.get('participantId') || '';
  const participantName = searchParams.get('participantName') || 'Consultant';
  const participantAvatar = searchParams.get('participantAvatar') || '';
  const availabilityStatus = searchParams.get('availabilityStatus') || 'offWork';

  const isValidConversationId =
    conversationIdParam &&
    conversationIdParam !== '[conversationId]' &&
    conversationIdParam.length === 24;

  const [conversationId, setConversationId] = useState<string | null>(
    isValidConversationId ? conversationIdParam : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPollTimeRef = useRef<string>(new Date().toISOString());
  const processedMessageIds = useRef<Set<string>>(new Set());

  const getCurrentUserId = (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || user.userId || '';
      }
    } catch {}
    return '';
  };

  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    initializeChat();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (conversationId && conversationId.length === 24) {
      setActiveConversationId(conversationId);
      startPolling();
      markAsRead(conversationId);
    }
    return () => {
      setActiveConversationId(null);
      stopPolling();
    };
  }, [conversationId]);

  useEffect(() => {
    currentUserId.current = getCurrentUserId();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      let convId = isValidConversationId ? conversationIdParam : null;
      if (!convId && participantId) {
        const conversation = await startConversation(participantId);
        if (conversation) convId = conversation.id;
      }
      if (convId) {
        setConversationId(convId);
        await fetchMessages(convId, 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (convId: string, pageNum: number) => {
    if (!convId) return;
    const result = await getMessages(convId, pageNum, 50);
    const newMessages = result.messages || [];
    newMessages.forEach(m => processedMessageIds.current.add(m._id));
    pageNum === 1
      ? setMessages(newMessages)
      : setMessages(prev => [...newMessages, ...prev]);
    setHasMore(result.pagination.hasMore);
    setPage(pageNum);
    if (newMessages.length)
      lastPollTimeRef.current =
        newMessages[newMessages.length - 1].createdAt;
  };

  const startPolling = () => {
    if (pollIntervalRef.current) return;
    pollIntervalRef.current = setInterval(async () => {
      if (!conversationId) return;
      const result = await pollMessages(
        conversationId,
        lastPollTimeRef.current
      );
      const newMsgs =
        result.messages?.filter(
          m => !processedMessageIds.current.has(m._id)
        ) || [];
      if (newMsgs.length) {
        newMsgs.forEach(m => processedMessageIds.current.add(m._id));
        setMessages(prev => [...prev, ...newMsgs]);
        lastPollTimeRef.current = result.serverTime;
        markAsRead(conversationId);
        refreshUnreadCount();
      }
    }, POLLING_INTERVALS.CHAT_MESSAGES);
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = null;
  };

  const handleSend = async () => {
    if (!inputText.trim() || !conversationId || isSending) return;
    const text = inputText.trim();
    setInputText('');
    setIsSending(true);
    try {
      const msg = await sendMessage(conversationId, text, 'text');
      if (msg) {
        processedMessageIds.current.add(msg._id);
        setMessages(prev => [...prev, msg]);
        lastPollTimeRef.current = msg.createdAt;
      }
    } finally {
      setIsSending(false);
    }
  };

  const isOwnMessage = (msg: Message) => {
    if (!user?.userId) return false;
    const senderId =
      typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
    return String(senderId) === String(user.userId);
  };

  const getStatusColor = () =>
    availabilityStatus === 'onWork'
      ? 'bg-emerald-500'
      : availabilityStatus === 'busy'
      ? 'bg-yellow-500'
      : 'bg-gray-400';

  return (
    // FIX: Use fixed inset-0 and h-[100dvh] to lock viewport and prevent keyboard jiggle
    <div className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-gradient-to-br from-[#0b0b0b] to-[#141414] overflow-hidden">
      
      {/* HEADER - Removed sticky, now just part of the flex column */}
      <header className="shrink-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
          
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Back Button */}
            <button 
              onClick={() => router.back()} 
              className="text-xl text-white shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              ←
            </button>

            {/* User Profile */}
            <div
              onClick={() => router.push(`/experts/${participantId}`)}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
            >
              {/* FIX: Wrapper div to enforce circle shape and prevent squash */}
              <div className="relative w-[42px] h-[42px] shrink-0">
                <Image
                  src={
                    participantAvatar ||
                    'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                  }
                  alt=""
                  fill
                  sizes="42px"
                  className="rounded-full object-cover border border-white/10"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${getStatusColor()}`}
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold truncate group-hover:text-pink-500 transition-colors">
                  {participantName}
                </p>
                <p className="text-xs text-white/50 capitalize truncate">
                  {availabilityStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 ml-2">
            <button
              onClick={() =>
                initiateCall(
                  participantId,
                  'voice',
                  participantName,
                  participantAvatar
                )
              }
              className="p-3 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-200 border border-white/5 shrink-0"
              title="Voice Call"
            >
              <PhoneIcon />
            </button>

            <button
              onClick={() =>
                initiateCall(
                  participantId,
                  'video',
                  participantName,
                  participantAvatar
                )
              }
              className="relative group p-3 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:scale-110 transition-all duration-300 shrink-0"
              title="Video Call"
            >
              <span className="absolute -inset-1 rounded-full bg-pink-500 opacity-30 animate-ping group-hover:opacity-50"></span>
              <span className="relative z-10 block animate-[bounce_2s_infinite]">
                 <VideoIcon />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGES - Scrollable Area */}
      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 w-full overscroll-contain"
      >
        <div className="max-w-4xl mx-auto space-y-3 pb-4">
          {messages.map(msg => {
            const own = isOwnMessage(msg);
            if (msg.messageType === 'call_log') {
              return (
                <div key={msg._id} className="flex justify-center my-4">
                  <div className="text-xs px-4 py-2 rounded-full bg-white/10 text-white/60 flex items-center gap-2 backdrop-blur-sm border border-white/5">
                    <PhoneIcon /> {msg.content}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={msg._id}
                className={`flex ${own ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words shadow-sm ${
                    own
                      ? 'bg-pink-500 text-white rounded-br-md'
                      : 'bg-white/15 text-white rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT - Fixed at bottom of flex column */}
      <footer className="shrink-0 bg-black/70 backdrop-blur-xl border-t border-white/10 px-3 py-3 w-full">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            // FIX: Prevent iOS zoom on focus by ensuring font size is adequate (16px usually prevents zoom)
            // or by meta tag (handled in layout usually), here we ensure input styling is robust
            className="flex-1 min-w-0 rounded-full bg-white/10 px-5 py-3 text-white outline-none focus:bg-white/15 transition-colors placeholder:text-white/30"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 shrink-0 rounded-full bg-pink-500 text-white flex items-center justify-center hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:hover:bg-pink-500 shadow-lg shadow-pink-500/20"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}