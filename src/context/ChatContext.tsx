// context/ChatContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { getUnreadCount } from '@/lib/api/chat';
import { getToken } from '@/lib/utils/tokenHelper';

// ============================================
// TYPES
// ============================================

interface ChatContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function ChatProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch unread count
  const refreshUnreadCount = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('[ChatContext] Error fetching unread count:', error);
    }
  }, []);

  // Poll for unread count every 30 seconds
  useEffect(() => {
    refreshUnreadCount();
    
    pollIntervalRef.current = setInterval(() => {
      refreshUnreadCount();
    }, 30000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [refreshUnreadCount]);

  return (
    <ChatContext.Provider value={{
      unreadCount,
      refreshUnreadCount,
      activeConversationId,
      setActiveConversationId,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}

export default ChatContext;