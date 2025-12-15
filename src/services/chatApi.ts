// lib/api/chat.ts
import axios from 'axios';
import { getToken } from '@/lib/utils/tokenHelper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.colio.in/api';

// ============================================
// TYPES
// ============================================

export interface MessageSender {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: MessageSender;
  receiver: string;
  content: string;
  messageType: 'text' | 'emoji' | 'call_log';
  createdAt: string;
}

export interface CallEmoji {
  emoji: string;
  senderId: string;
  senderType: 'customer' | 'consultant';
  timestamp: number;
}

// ============================================
// HELPER
// ============================================

const getAuthHeaders = () => {
  const token = getToken();
  return { Authorization: `Bearer ${token}` };
};

// ============================================
// IN-CALL CHAT APIs
// ============================================

/**
 * Send message during active call
 */
export const sendInCallMessage = async (
  sessionId: string,
  content: string,
  messageType: 'text' | 'emoji' = 'text'
): Promise<{ message: Message; conversationId: string } | null> => {
  try {
    const headers = getAuthHeaders();
    const res = await axios.post(
      `${API_BASE_URL}/chat/call/${sessionId}/message`,
      { content, messageType },
      { headers }
    );

    if (res.data.success) {
      return {
        message: res.data.data.message,
        conversationId: res.data.data.conversationId
      };
    }
    return null;
  } catch (error) {
    console.error('[chatApi] sendInCallMessage error:', error);
    return null;
  }
};

/**
 * Get messages for active call session
 */
export const getInCallMessages = async (
  sessionId: string,
  since?: string
): Promise<{ messages: Message[]; serverTime: string }> => {
  try {
    const headers = getAuthHeaders();
    const res = await axios.get(
      `${API_BASE_URL}/chat/call/${sessionId}/messages`,
      {
        headers,
        params: since ? { since } : {}
      }
    );

    if (res.data.success) {
      return {
        messages: res.data.data.messages,
        serverTime: res.data.data.serverTime
      };
    }
    return { messages: [], serverTime: new Date().toISOString() };
  } catch (error) {
    console.error('[chatApi] getInCallMessages error:', error);
    return { messages: [], serverTime: new Date().toISOString() };
  }
};

/**
 * Send emoji reaction during call
 */
export const sendCallEmoji = async (
  sessionId: string,
  emoji: string
): Promise<CallEmoji | null> => {
  try {
    const headers = getAuthHeaders();
    const res = await axios.post(
      `${API_BASE_URL}/chat/call/${sessionId}/emoji`,
      { emoji },
      { headers }
    );

    if (res.data.success) {
      return res.data.data.emoji;
    }
    return null;
  } catch (error) {
    console.error('[chatApi] sendCallEmoji error:', error);
    return null;
  }
};

/**
 * Poll for emoji reactions during call
 */
export const pollCallEmojis = async (
  sessionId: string,
  since?: number
): Promise<{ emojis: CallEmoji[]; serverTime: number }> => {
  try {
    const headers = getAuthHeaders();
    const res = await axios.get(
      `${API_BASE_URL}/chat/call/${sessionId}/emoji/poll`,
      {
        headers,
        params: since ? { since } : {}
      }
    );

    if (res.data.success) {
      return {
        emojis: res.data.data.emojis,
        serverTime: res.data.data.serverTime
      };
    }
    return { emojis: [], serverTime: Date.now() };
  } catch (error) {
    console.error('[chatApi] pollCallEmojis error:', error);
    return { emojis: [], serverTime: Date.now() };
  }
};