// lib/agora/agoraClient.ts
'use client';

import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

export interface AgoraClientConfig {
  appId: string;
  channel: string;
  token: string;
  uid?: number | null;
}

const isClient = typeof window !== 'undefined';

export class AgoraClient {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;

  constructor() {
    if (isClient) {
      this.client = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8' 
      });
      console.log('[Agora] Client created');
    }
  }

  async init(config: AgoraClientConfig, callType: 'voice' | 'video') {
    if (!this.client || !isClient) {
      console.error('[Agora] Cannot init - not in browser environment');
      return false;
    }

    console.log('[Agora] Initializing...', {
      channel: config.channel,
      callType,
      tokenLength: config.token.length,
    });

    try {
      // 1. Join channel with UID 0 (auto-assign)
      const uid = await this.client.join(
        config.appId,
        config.channel,
        config.token,
        0 // ✅ Use 0 to let Agora auto-assign UID
      );
      console.log('[Agora] ✅ Joined channel. My UID:', uid);

      // 2. Create local audio track
      console.log('[Agora] Creating microphone track...');
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      console.log('[Agora] ✅ Microphone track created');

      // 3. Create local video track if video call
      if (callType === 'video') {
        console.log('[Agora] Creating camera track...');
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        console.log('[Agora] ✅ Camera track created');
      }

      // 4. Publish tracks
      const tracks = callType === 'video' 
        ? [this.localAudioTrack, this.localVideoTrack!]
        : [this.localAudioTrack];

      console.log('[Agora] Publishing tracks...');
      await this.client.publish(tracks);
      console.log('[Agora] ✅ Tracks published');

      return true;
    } catch (error) {
      console.error('[Agora] ❌ Init error:', error);
      throw error;
    }
  }

  onUserJoined(callback: (user: IAgoraRTCRemoteUser) => void) {
    if (!this.client) return;
    
    this.client.on('user-published', async (user, mediaType) => {
      console.log('[Agora] 👤 User published:', user.uid, 'MediaType:', mediaType);
      
      try {
        await this.client!.subscribe(user, mediaType);
        console.log('[Agora] ✅ Subscribed to user:', user.uid, mediaType);
        callback(user);
      } catch (error) {
        console.error('[Agora] ❌ Subscribe error:', error);
      }
    });
  }

  onUserLeft(callback: (user: IAgoraRTCRemoteUser) => void) {
    if (!this.client) return;
    this.client.on('user-unpublished', (user, mediaType) => {
      console.log('[Agora] 👋 User unpublished:', user.uid, mediaType);
      callback(user);
    });
  }

  // ✅ NEW: Handle connection state changes (including being kicked)
  onConnectionStateChange(callback: (curState: string, prevState: string, reason?: string) => void) {
    if (!this.client) return;
    
    this.client.on('connection-state-change', (curState, prevState, reason) => {
      console.log('[Agora] 🔄 Connection state:', prevState, '->', curState, 'Reason:', reason);
      
      // Handle being kicked from channel (banned by server)
      if (curState === 'DISCONNECTED' && reason === 'BANNED BY SERVER') {
        console.log('[Agora] ⛔ Kicked from channel by server (balance depleted)');
      }
      
      callback(curState, prevState, reason);
    });
  }

  playRemoteVideo(user: IAgoraRTCRemoteUser, elementId: string) {
    if (user.videoTrack && isClient) {
      console.log('[Agora] Playing remote video in:', elementId);
      user.videoTrack.play(elementId);
    }
  }

  playRemoteAudio(user: IAgoraRTCRemoteUser) {
    if (user.audioTrack && isClient) {
      console.log('[Agora] Playing remote audio');
      user.audioTrack.play();
    }
  }

  playLocalVideo(elementId: string) {
    if (this.localVideoTrack && isClient) {
      console.log('[Agora] Playing local video in:', elementId);
      this.localVideoTrack.play(elementId);
    }
  }

  async toggleAudio(muted: boolean) {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setEnabled(!muted);
      console.log('[Agora] Audio:', muted ? 'muted' : 'unmuted');
    }
  }

  async toggleVideo(enabled: boolean) {
    if (this.localVideoTrack) {
      await this.localVideoTrack.setEnabled(enabled);
      console.log('[Agora] Video:', enabled ? 'enabled' : 'disabled');
    }
  }

  async leave() {
    console.log('[Agora] Leaving channel...');

    if (this.localAudioTrack) {
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    if (this.localVideoTrack) {
      this.localVideoTrack.close();
      this.localVideoTrack = null;
    }

    if (this.client) {
      await this.client.leave();
      console.log('[Agora] ✅ Left channel');
    }
  }
}

export default AgoraClient;