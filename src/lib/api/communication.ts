// lib/api/communication.ts
import axios from 'axios';

const API_BASE_URL = 'https://api.colio.in/api';

export interface SessionData {
  id: string;
  channelName: string;
  rtcToken: string;
  type: 'voice' | 'video';
}

export interface StartSessionResponse {
  ok: boolean;
  session: SessionData;
}

export async function startCallSession(
  consultantId: string,
  callType: 'voice' | 'video',
  token: string
): Promise<SessionData> {
  try {
    console.log('[API] Starting session...', { consultantId, callType });

    const response = await axios.post<StartSessionResponse>(
      `${API_BASE_URL}/communication/session/start`,
      { consultantId, type: callType },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('[API] Raw response:', response.data);

    // ✅ Backend returns: { ok: true, session: { id, channelName, rtcToken, type } }
    if (!response.data.ok || !response.data.session) {
      console.error('[API] ❌ Invalid response format:', response.data);
      throw new Error('Invalid response from server');
    }

    const session = response.data.session;

    console.log('[API] ✅ Session started:', {
      id: session.id,
      channelName: session.channelName,
      tokenLength: session.rtcToken?.length,
      type: session.type,
    });

    return session;
  } catch (error: any) {
    console.error('[API] ❌ Start session error:', error);
    if (error.response) {
      console.error('[API] Response status:', error.response.status);
      console.error('[API] Response data:', error.response.data);
    }
    throw error;
  }
}

export async function endCallSession(sessionId: string, token: string) {
  try {
    console.log('[API] Ending session:', sessionId);

    const response = await axios.post(
      `${API_BASE_URL}/communication/session/end`,
      { sessionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('[API] ✅ Session ended:', response.data);
  } catch (error: any) {
    console.error('[API] ❌ End session error:', error);
    throw error;
  }
}