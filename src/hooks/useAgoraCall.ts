// hooks/useAgoraCall.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraClient from '@/lib/agora/agoraClient';
import { startCallSession, endCallSession } from '@/lib/api/communication';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';

interface UseAgoraCallProps {
  consultantId: string;
  callType: 'voice' | 'video';
  userToken: string;
}

export function useAgoraCall({ consultantId, callType, userToken }: UseAgoraCallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [remoteUser, setRemoteUser] = useState<IAgoraRTCRemoteUser | null>(null);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [duration, setDuration] = useState(0);

  const agoraClientRef = useRef<AgoraClient | null>(null);
  const sessionIdRef = useRef<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeCall();

    return () => {
      cleanup();
    };
  }, []);

  const initializeCall = async () => {
    try {
      console.log('[Web Call] === INITIALIZING CALL ===');
      setCallStatus('Connecting...');

      // 1. Start session on backend (sends push to consultant)
      const response = await startCallSession(consultantId, callType, userToken);
      const { session } = response.data;
      sessionIdRef.current = session.id;

      console.log('[Web Call] Session created:', session.id);
      setCallStatus('Ringing...');

      // 2. Create Agora client
      const client = new AgoraClient();
      agoraClientRef.current = client;

      // 3. Setup event listeners
      client.onUserJoined((user) => {
        console.log('[Web Call] 🎉 Consultant joined! UID:', user.uid);
        setRemoteUser(user);
        setIsConnected(true);
        setCallStatus('Connected');

        // Play remote media
        if (callType === 'video') {
          client.playRemoteVideo(user, 'remote-video');
        }
        client.playRemoteAudio(user);

        // Start call timer
        timerRef.current = setInterval(() => {
          setDuration((prev) => prev + 1);
        }, 1000);
      });

      client.onUserLeft((user) => {
        console.log('[Web Call] 👋 Consultant left');
        setRemoteUser(null);
        setIsConnected(false);
        alert('Consultant ended the call');
      });

      // 4. Join channel and publish
      await client.init(
        {
          appId: AGORA_APP_ID,
          channel: session.channelName,
          token: session.rtcToken,
        },
        callType
      );

      // 5. Play local video if video call
      if (callType === 'video') {
        setTimeout(() => {
          client.playLocalVideo('local-video');
        }, 500);
      }

      console.log('[Web Call] ✅ Call initialized');
    } catch (error) {
      console.error('[Web Call] ❌ Init error:', error);
      setCallStatus('Failed to connect');
      alert('Failed to start call');
    }
  };

  const cleanup = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (agoraClientRef.current) {
      await agoraClientRef.current.leave();
    }
  };

  const toggleMute = async () => {
    if (!agoraClientRef.current) return;
    const newMuted = !isMuted;
    await agoraClientRef.current.toggleAudio(newMuted);
    setIsMuted(newMuted);
  };

  const toggleVideo = async () => {
    if (!agoraClientRef.current || callType !== 'video') return;
    const newEnabled = !isVideoEnabled;
    await agoraClientRef.current.toggleVideo(newEnabled);
    setIsVideoEnabled(newEnabled);
  };

  const endCall = async () => {
    try {
      if (sessionIdRef.current) {
        await endCallSession(sessionIdRef.current, userToken);
      }
    } catch (error) {
      console.error('[Web Call] End call error:', error);
    } finally {
      await cleanup();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    isConnected,
    isMuted,
    isVideoEnabled,
    remoteUser,
    callStatus,
    duration: formatDuration(duration),
    toggleMute,
    toggleVideo,
    endCall,
  };
}