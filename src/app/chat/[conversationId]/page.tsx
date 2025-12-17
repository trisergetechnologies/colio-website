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
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0b0b0b] to-[#141414]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="text-xl text-white">
            ←
          </button>

          <div
            onClick={() => router.push(`/experts/${participantId}`)}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="relative">
              <Image
                src={
                  participantAvatar ||
                  'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                }
                alt=""
                width={42}
                height={42}
                className="rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${getStatusColor()}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {participantName}
              </p>
              <p className="text-xs text-white/50 capitalize">
                {availabilityStatus}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                initiateCall(
                  participantId,
                  'voice',
                  participantName,
                  participantAvatar
                )
              }
              className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30"
            >
              📞
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
              className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30"
            >
              🎥
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <div className="max-w-4xl mx-auto space-y-3">
          {messages.map(msg => {
            const own = isOwnMessage(msg);
            if (msg.messageType === 'call_log') {
              return (
                <div key={msg._id} className="flex justify-center">
                  <div className="text-xs px-4 py-2 rounded-full bg-white/10 text-white/60">
                    📞 {msg.content}
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
                  className={`max-w-[85%] sm:max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
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

      {/* INPUT */}
      <footer className="sticky bottom-0 bg-black/70 backdrop-blur-xl border-t border-white/10 px-3 py-3">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Type a message…"
            className="flex-1 rounded-full bg-white/10 px-5 py-3 text-white outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}
