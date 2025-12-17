// app/(private)/chat/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getConversations, Conversation } from '@/lib/api/chat';
import { useChat } from '@/context/ChatContext';
import { useCall } from '@/context/CallContext';

export default function ChatListPage() {
  const router = useRouter();
  const { refreshUnreadCount } = useChat();
  const { initiateCall } = useCall();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch conversations
  const fetchConversations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await getConversations();
      setConversations(data);
      refreshUnreadCount();
    } catch (error) {
      console.error('[ChatList] Error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [refreshUnreadCount]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Format time
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get last message preview
  const getPreview = (conv: Conversation) => {
    const msg = conv.lastMessage;
    if (!msg?.content) return 'No messages yet';
    if (msg.messageType === 'call_log') return `📞 ${msg.content}`;
    return msg.content.length > 35 ? msg.content.substring(0, 35) + '...' : msg.content;
  };

  // Availability color
  const getStatusColor = (status?: string | null) => {
    switch (status) {
      case 'onWork': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Navigate to conversation
  const openConversation = (conv: Conversation) => {
    const params = new URLSearchParams({
      participantId: conv.participant.id,
      participantName: conv.participant.name,
      participantAvatar: conv.participant.avatar || '',
      availabilityStatus: conv.participant.availabilityStatus || 'offWork',
    });
    router.push(`/chat/${conv.id}?${params.toString()}`);
  };

  // Handle calls
  const handleVoiceCall = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    initiateCall(conv.participant.id, 'voice', conv.participant.name, conv.participant.avatar);
  };

  const handleVideoCall = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    initiateCall(conv.participant.id, 'video', conv.participant.name, conv.participant.avatar);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <button
            onClick={() => fetchConversations(true)}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-48 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <span className="text-7xl mb-6 opacity-30">💬</span>
            <h2 className="text-xl font-bold text-white mb-2">No conversations yet</h2>
            <p className="text-white/60 mb-6">Start chatting with consultants from the Experts page</p>
            <button
              onClick={() => router.push('/experts')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Experts
            </button>
          </div>
        ) : (
          // Conversation list
          <div className="divide-y divide-white/10">
            {conversations.map((conv) => {
              const hasUnread = conv.unreadCount > 0;
              return (
                <div
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className="flex items-center gap-4 py-4 px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Image
                      src={conv.participant.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                      alt={conv.participant.name}
                      width={56}
                      height={56}
                      className="rounded-full object-cover bg-white/10"
                    />
                    <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F0F0F] ${getStatusColor(conv.participant.availabilityStatus)}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-white truncate ${hasUnread ? 'font-bold' : 'font-medium'}`}>
                        {conv.participant.name}
                      </span>
                      <span className={`text-xs ${hasUnread ? 'text-pink-500' : 'text-white/50'}`}>
                        {formatTime(conv.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${hasUnread ? 'text-white/90 font-medium' : 'text-white/60'}`}>
                        {getPreview(conv)}
                      </span>
                      {hasUnread && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-pink-500 rounded-full">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call buttons (visible on hover) */}
                  <div className="hidden group-hover:flex items-center gap-2">
                    <button
                      onClick={(e) => handleVoiceCall(e, conv)}
                      className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                      title="Voice Call"
                    >
                      <span className="text-green-400">📞</span>
                    </button>
                    <button
                      onClick={(e) => handleVideoCall(e, conv)}
                      className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors"
                      title="Video Call"
                    >
                      <span className="text-green-400">📹</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}