// lib/utils/callHelpers.ts
'use client'
import { getToken } from './tokenHelper';

/**
 * Start a voice call with a consultant
 * Navigates to /call page with voice call parameters
 */
export function startVoiceCall(consultantId: string, router: any) {
  try {
    console.log('[Call Helper] Starting voice call to:', consultantId);
    
    const token = getToken();
    if (!token) {
      alert('Please login to make calls');
      return;
    }

    // Build URL with query params
    const callUrl = `/call?consultantId=${consultantId}&callType=voice&token=${encodeURIComponent(token)}`;
    
    console.log('[Call Helper] Routing to:', callUrl);
    router.push(callUrl);
  } catch (error) {
    console.error('[Call Helper] Voice call error:', error);
    alert('Failed to start voice call');
  }
}

/**
 * Start a video call with a consultant
 * Navigates to /call page with video call parameters
 */
export function startVideoCall(consultantId: string, router: any) {
  try {
    console.log('[Call Helper] Starting video call to:', consultantId);
    
    const token = getToken();
    if (!token) {
      alert('Please login to make calls');
      return;
    }

    // Build URL with query params
    const callUrl = `/call?consultantId=${consultantId}&callType=video&token=${encodeURIComponent(token)}`;
    
    console.log('[Call Helper] Routing to:', callUrl);
    router.push(callUrl);
  } catch (error) {
    console.error('[Call Helper] Video call error:', error);
    alert('Failed to start video call');
  }
}

/**
 * Start a chat with a consultant
 * Navigates to /chat page
 */
export function startChat(consultantId: string, router: any) {
  try {
    console.log('[Call Helper] Starting chat with:', consultantId);
    router.push(`/chat/${consultantId}`);
  } catch (error) {
    console.error('[Call Helper] Chat error:', error);
    alert('Failed to start chat');
  }
}