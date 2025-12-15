// constants/chatConstants.ts

/**
 * Emojis available during video/voice calls
 */
export const CALL_EMOJIS = [
  '❤️',
  '👍',
  '😂',
  '🎉',
  '🔥',
  '😍',
  '👋',
  '🙏',
  '😊',
  '💯'
];

/**
 * Message types supported in chat
 */
export const MESSAGE_TYPES = {
  TEXT: 'text',
  EMOJI: 'emoji',
  CALL_LOG: 'call_log'
} as const;

/**
 * Call log statuses
 */
export const CALL_LOG_STATUS = {
  COMPLETED: 'completed',
  MISSED: 'missed',
  DECLINED: 'declined',
  BUSY: 'busy',
  NO_ANSWER: 'no_answer'
} as const;

/**
 * Polling intervals (in milliseconds)
 */
export const POLLING_INTERVALS = {
  CHAT_MESSAGES: 3000,
  IN_CALL_MESSAGES: 2000,
  IN_CALL_EMOJIS: 1000
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100
};

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type CallLogStatus = typeof CALL_LOG_STATUS[keyof typeof CALL_LOG_STATUS];