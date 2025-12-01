// components/call/ActiveCallModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';

import { endCallSession } from '@/lib/api/communication';
import { getToken } from '@/lib/utils/tokenHelper';
import { useCall } from '@/context/CallContext';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';

export default function ActiveCallModal() {
  const { callState, setCallStage, endCall, setError } = useCall();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [remoteUid, setRemoteUid] = useState<number>(0);

  const agoraClientRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const isCleaningUpRef = useRef(false); // ✅ Prevent multiple cleanups

  useEffect(() => {
    if (callState.stage === 'ringing' && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeAgora();
    }

    return () => {
      // ✅ Only cleanup if component unmounts AND call is actually ending
      if (callState.stage === 'ended') {
        cleanup();
      }
    };
  }, [callState.stage]);

  const initializeAgora = async () => {
    try {
      console.log('[ActiveCall] ========================================');
      console.log('[ActiveCall] Initializing Agora...');
      console.log('[ActiveCall] Channel:', callState.channelName);
      console.log('[ActiveCall] ========================================');

      const { default: AgoraClient } = await import('@/lib/agora/agoraClient');
      const client = new AgoraClient();
      agoraClientRef.current = client;

      // ✅ Setup event listeners BEFORE joining
      console.log('[ActiveCall] Setting up event listeners...');
      
      client.onUserJoined((user: any) => {
        console.log('[ActiveCall] ========================================');
        console.log('[ActiveCall] 🎉 CONSULTANT JOINED!');
        console.log('[ActiveCall] Remote UID:', user.uid);
        console.log('[ActiveCall] Has audio:', !!user.audioTrack);
        console.log('[ActiveCall] Has video:', !!user.videoTrack);
        console.log('[ActiveCall] ========================================');
        
        setRemoteUid(user.uid);
        setIsConnected(true);
        setCallStage('connected');

        // Play remote media
        if (callState.callType === 'video' && user.videoTrack) {
          setTimeout(() => {
            console.log('[ActiveCall] Playing remote video...');
            client.playRemoteVideo(user, 'remote-video');
          }, 200);
        }

        if (user.audioTrack) {
          console.log('[ActiveCall] Playing remote audio...');
          client.playRemoteAudio(user);
        }

        // ✅ Start timer only once
        if (!timerRef.current) {
          console.log('[ActiveCall] ✅ Starting call timer');
          timerRef.current = setInterval(() => {
            setDuration(prev => {
              const newDuration = prev + 1;
              if (newDuration % 10 === 0) {
                console.log('[ActiveCall] Call duration:', newDuration, 'seconds');
              }
              return newDuration;
            });
          }, 1000);
        }
      });

      client.onUserLeft((user: any) => {
        console.log('[ActiveCall] ========================================');
        console.log('[ActiveCall] 👋 CONSULTANT LEFT');
        console.log('[ActiveCall] Remote UID:', user.uid);
        console.log('[ActiveCall] ========================================');
        
        setRemoteUid(0);
        setIsConnected(false);
        
        // ✅ Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // ✅ Show alert and end call
        setTimeout(() => {
          alert('Call ended - Consultant left the call');
          handleEndCall();
        }, 500);
      });

      // ✅ Join Agora channel
      console.log('[ActiveCall] Joining channel...');
      const success = await client.init(
        {
          appId: AGORA_APP_ID,
          channel: callState.channelName!,
          token: callState.token!,
        },
        callState.callType!
      );

      if (!success) {
        throw new Error('Failed to join Agora channel');
      }

      console.log('[ActiveCall] ✅ Successfully joined channel');

      // ✅ Play local video preview (for video calls)
      if (callState.callType === 'video') {
        setTimeout(() => {
          console.log('[ActiveCall] Playing local video preview...');
          client.playLocalVideo('local-video');
        }, 500);
      }

      console.log('[ActiveCall] ========================================');
      console.log('[ActiveCall] ✅ Waiting for consultant to join...');
      console.log('[ActiveCall] ========================================');

    } catch (error: any) {
      console.error('[ActiveCall] ========================================');
      console.error('[ActiveCall] ❌ Initialization failed');
      console.error('[ActiveCall] Error:', error);
      console.error('[ActiveCall] ========================================');
      setError(error.message || 'Failed to connect to call');
    }
  };

  const cleanup = async () => {
    // ✅ Prevent multiple cleanup calls
    if (isCleaningUpRef.current) {
      console.log('[ActiveCall] ⚠️ Already cleaning up, skipping');
      return;
    }

    isCleaningUpRef.current = true;

    console.log('[ActiveCall] ========================================');
    console.log('[ActiveCall] Cleaning up...');
    console.log('[ActiveCall] ========================================');

    // ✅ Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('[ActiveCall] ✅ Timer stopped');
    }

    // ✅ Leave Agora channel
    if (agoraClientRef.current) {
      try {
        console.log('[ActiveCall] Leaving Agora channel...');
        await agoraClientRef.current.leave();
        console.log('[ActiveCall] ✅ Left Agora channel');
        agoraClientRef.current = null;
      } catch (error) {
        console.error('[ActiveCall] Cleanup error:', error);
      }
    }

    console.log('[ActiveCall] ========================================');
    console.log('[ActiveCall] ✅ Cleanup complete');
    console.log('[ActiveCall] ========================================');

    // Reset flag after delay
    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 1000);
  };

  const toggleMute = async () => {
    if (!agoraClientRef.current || !isConnected) return;
    const newMuted = !isMuted;
    await agoraClientRef.current.toggleAudio(newMuted);
    setIsMuted(newMuted);
    console.log('[ActiveCall] Mute:', newMuted);
  };

  const toggleVideo = async () => {
    if (!agoraClientRef.current || callState.callType !== 'video' || !isConnected) return;
    const newEnabled = !isVideoEnabled;
    await agoraClientRef.current.toggleVideo(newEnabled);
    setIsVideoEnabled(newEnabled);
    console.log('[ActiveCall] Video:', newEnabled);
  };

  const handleEndCall = async () => {
    // ✅ Prevent multiple end call triggers
    if (isCleaningUpRef.current) {
      console.log('[ActiveCall] ⚠️ Already ending call');
      return;
    }

    console.log('[ActiveCall] ========================================');
    console.log('[ActiveCall] User ending call...');
    console.log('[ActiveCall] Session ID:', callState.sessionId);
    console.log('[ActiveCall] Duration:', duration, 'seconds');
    console.log('[ActiveCall] ========================================');

    try {
      // ✅ 1. End session on backend FIRST
      const token = getToken();
      if (callState.sessionId && token) {
        console.log('[ActiveCall] Ending backend session...');
        await endCallSession(callState.sessionId, token);
        console.log('[ActiveCall] ✅ Backend session ended');
      }
    } catch (error) {
      console.error('[ActiveCall] ❌ End call API error:', error);
      // Continue cleanup even if API fails
    } finally {
      // ✅ 2. Cleanup Agora resources
      await cleanup();
      
      // ✅ 3. Clear call context (closes modal)
      console.log('[ActiveCall] Clearing call context...');
      endCall();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (callState.stage !== 'ringing' && callState.stage !== 'connected') return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.callContainer}>
        {/* Remote Video */}
        {callState.callType === 'video' ? (
          <div id="remote-video" style={styles.remoteVideo}>
            {!isConnected && (
              <div style={styles.waiting}>
                <div style={styles.avatar}>👤</div>
                <h2 style={styles.waitingText}>{callState.consultantName || 'Consultant'}</h2>
                <p style={styles.waitingSubtext}>Ringing...</p>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.voiceCall}>
            <div style={styles.avatar}>👤</div>
            <h2 style={styles.waitingText}>{callState.consultantName || 'Consultant'}</h2>
            <p style={styles.waitingSubtext}>
              {isConnected ? 'Voice call in progress' : 'Ringing...'}
            </p>
          </div>
        )}

        {/* Local Video Preview */}
        {callState.callType === 'video' && isVideoEnabled && (
          <div id="local-video" style={styles.localVideo}></div>
        )}

        {/* Status Bar */}
        <div style={styles.statusBar}>
          <p style={styles.statusText}>
            {isConnected ? '🟢 Connected' : '🟡 Ringing...'}
          </p>
          {isConnected && (
            <p style={styles.durationText}>{formatDuration(duration)}</p>
          )}
        </div>

        {/* Bottom Controls */}
        <div style={styles.controls}>
          <button 
            onClick={toggleMute} 
            style={{
              ...styles.button,
              backgroundColor: isMuted ? '#DC2626' : 'rgba(255, 255, 255, 0.3)',
              opacity: isConnected ? 1 : 0.5,
              cursor: isConnected ? 'pointer' : 'not-allowed',
            }}
            disabled={!isConnected}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>

          {callState.callType === 'video' && (
            <button 
              onClick={toggleVideo} 
              style={{
                ...styles.button,
                backgroundColor: !isVideoEnabled ? '#DC2626' : 'rgba(255, 255, 255, 0.3)',
                opacity: isConnected ? 1 : 0.5,
                cursor: isConnected ? 'pointer' : 'not-allowed',
              }}
              disabled={!isConnected}
              title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
            >
              {isVideoEnabled ? '📹' : '📷'}
            </button>
          )}

          <button 
            onClick={handleEndCall} 
            style={styles.endButton}
            title="End call"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10000,
  },
  callContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  voiceCall: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  waiting: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  avatar: {
    fontSize: '100px',
    marginBottom: '20px',
  },
  waitingText: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  waitingSubtext: {
    fontSize: '16px',
    opacity: 0.8,
  },
  localVideo: {
    position: 'absolute',
    top: '60px',
    right: '20px',
    width: '150px',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid #4CAF50',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '50px 20px 15px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    textAlign: 'center',
    zIndex: 5,
    backdropFilter: 'blur(10px)',
  },
  statusText: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  durationText: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  controls: {
    position: 'absolute',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '20px',
    zIndex: 5,
  },
  button: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '24px',
    transition: 'all 0.2s',
  },
  endButton: {
    width: '70px',
    height: '70px',
    borderRadius: '35px',
    backgroundColor: '#DC2626',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    transform: 'rotate(135deg)',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
  },
};