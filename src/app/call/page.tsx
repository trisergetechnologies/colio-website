// app/call/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState, useRef } from 'react';
import { startCallSession, endCallSession } from '@/lib/api/communication';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';

function CallScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const consultantId = searchParams.get('consultantId') || '';
  const callType = (searchParams.get('callType') || 'voice') as 'voice' | 'video';
  const userToken = searchParams.get('token') || '';

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [duration, setDuration] = useState(0);
  const [remoteUid, setRemoteUid] = useState<number>(0);

  const agoraClientRef = useRef<any>(null);
  const sessionIdRef = useRef<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false); // ✅ Prevent double initialization
  const isCleaningUpRef = useRef(false); // ✅ Prevent multiple cleanups

  useEffect(() => {
    // ✅ Prevent double initialization (React StrictMode issue)
    if (isInitializedRef.current) {
      console.log('[Web Call] ⚠️ Already initialized, skipping');
      return;
    }

    isInitializedRef.current = true;
    initializeCall();

    return () => {
      // ✅ Cleanup on unmount
      cleanup();
    };
  }, []); // ✅ Empty deps - only run once

  const initializeCall = async () => {
    try {
      console.log('[Web Call] ========================================');
      console.log('[Web Call] === INITIALIZING CALL ===');
      console.log('[Web Call] Consultant ID:', consultantId);
      console.log('[Web Call] Call Type:', callType);
      console.log('[Web Call] ========================================');
      
      if (!consultantId || !userToken) {
        throw new Error('Missing consultantId or token');
      }

      setCallStatus('Connecting...');

      // ✅ 1. Start backend session
      console.log('[Web Call] Step 1: Creating session on backend...');
      const session = await startCallSession(consultantId, callType, userToken);
      
      sessionIdRef.current = session.id;
      console.log('[Web Call] ✅ Backend session created');
      console.log('[Web Call]    Session ID:', session.id);
      console.log('[Web Call]    Channel:', session.channelName);

      setCallStatus('Ringing...');

      // ✅ 2. Import and create Agora client
      console.log('[Web Call] Step 2: Creating Agora client...');
      const { default: AgoraClient } = await import('@/lib/agora/agoraClient');
      const client = new AgoraClient();
      agoraClientRef.current = client;

      // ✅ 3. Setup event listeners
      console.log('[Web Call] Step 3: Setting up event listeners...');
      
      client.onUserJoined((user: any) => {
        console.log('[Web Call] ========================================');
        console.log('[Web Call] 🎉 CONSULTANT JOINED!');
        console.log('[Web Call]    Remote UID:', user.uid);
        console.log('[Web Call]    Has audio:', !!user.audioTrack);
        console.log('[Web Call]    Has video:', !!user.videoTrack);
        console.log('[Web Call] ========================================');
        
        setRemoteUid(user.uid);
        setIsConnected(true);
        setCallStatus('Connected');

        // Play remote media
        if (callType === 'video' && user.videoTrack) {
          setTimeout(() => {
            console.log('[Web Call] Playing remote video...');
            client.playRemoteVideo(user, 'remote-video');
          }, 200);
        }
        
        if (user.audioTrack) {
          console.log('[Web Call] Playing remote audio...');
          client.playRemoteAudio(user);
        }

        // Start call duration timer
        if (!timerRef.current) {
          timerRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
          }, 1000);
        }
      });

      client.onUserLeft((user: any) => {
        console.log('[Web Call] ========================================');
        console.log('[Web Call] 👋 CONSULTANT LEFT');
        console.log('[Web Call] ========================================');
        
        setRemoteUid(0);
        setIsConnected(false);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setTimeout(() => {
          alert('Call ended - Consultant left');
          handleEndCall();
        }, 500);
      });

      // ✅ 4. Join Agora channel
      console.log('[Web Call] Step 4: Joining Agora channel...');
      const success = await client.init(
        {
          appId: AGORA_APP_ID,
          channel: session.channelName,
          token: session.rtcToken,
        },
        callType
      );

      if (!success) {
        throw new Error('Failed to join Agora channel');
      }

      console.log('[Web Call] ✅ Successfully joined Agora channel');

      // ✅ 5. Play local video preview
      if (callType === 'video') {
        setTimeout(() => {
          console.log('[Web Call] Step 5: Playing local video preview...');
          client.playLocalVideo('local-video');
        }, 500);
      }

      console.log('[Web Call] ========================================');
      console.log('[Web Call] ✅ CALL INITIALIZATION COMPLETE');
      console.log('[Web Call] Waiting for consultant to join...');
      console.log('[Web Call] ========================================');
      
    } catch (error: any) {
      console.error('[Web Call] ========================================');
      console.error('[Web Call] ❌ INITIALIZATION FAILED');
      console.error('[Web Call] Error:', error);
      console.error('[Web Call] ========================================');
      
      setCallStatus('Failed to connect');
      
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert('Failed to start call: ' + errorMessage);
      
      // Cleanup and go back
      await cleanup();
      setTimeout(() => {
        router.push('/experts');
      }, 1000);
    }
  };

  const cleanup = async () => {
    // ✅ Prevent multiple cleanup calls
    if (isCleaningUpRef.current) {
      console.log('[Web Call] ⚠️ Already cleaning up, skipping');
      return;
    }

    isCleaningUpRef.current = true;

    console.log('[Web Call] ========================================');
    console.log('[Web Call] === CLEANUP STARTED ===');
    console.log('[Web Call] ========================================');
    
    // ✅ 1. Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log('[Web Call] ✅ Timer stopped');
    }

    // ✅ 2. Leave Agora channel and release resources
    if (agoraClientRef.current) {
      try {
        console.log('[Web Call] Leaving Agora channel...');
        await agoraClientRef.current.leave();
        console.log('[Web Call] ✅ Left Agora channel');
        agoraClientRef.current = null;
      } catch (error) {
        console.error('[Web Call] ❌ Cleanup error:', error);
      }
    }

    console.log('[Web Call] ========================================');
    console.log('[Web Call] ✅ CLEANUP COMPLETE');
    console.log('[Web Call] ========================================');

    // Reset cleanup flag after a delay
    setTimeout(() => {
      isCleaningUpRef.current = false;
    }, 1000);
  };

  const toggleMute = async () => {
    if (!agoraClientRef.current || !isConnected) return;
    const newMuted = !isMuted;
    await agoraClientRef.current.toggleAudio(newMuted);
    setIsMuted(newMuted);
  };

  const toggleVideo = async () => {
    if (!agoraClientRef.current || callType !== 'video' || !isConnected) return;
    const newEnabled = !isVideoEnabled;
    await agoraClientRef.current.toggleVideo(newEnabled);
    setIsVideoEnabled(newEnabled);
  };

  const handleEndCall = async () => {
    // ✅ Prevent multiple end call triggers
    if (isCleaningUpRef.current) {
      console.log('[Web Call] ⚠️ Already ending call, skipping');
      return;
    }

    console.log('[Web Call] ========================================');
    console.log('[Web Call] === USER ENDING CALL ===');
    console.log('[Web Call] Session ID:', sessionIdRef.current);
    console.log('[Web Call] ========================================');
    
    try {
      // ✅ 1. End session on backend
      if (sessionIdRef.current && userToken) {
        console.log('[Web Call] Ending session on backend...');
        await endCallSession(sessionIdRef.current, userToken);
        console.log('[Web Call] ✅ Backend session ended');
      }
    } catch (error) {
      console.error('[Web Call] ❌ End call API error:', error);
      // Continue cleanup even if API fails
    } finally {
      // ✅ 2. Cleanup Agora resources
      await cleanup();
      
      // ✅ 3. Navigate back
      console.log('[Web Call] Navigating back to experts list...');
      router.push('/experts');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* Remote Video */}
      {callType === 'video' ? (
        <div id="remote-video" style={styles.remoteVideo}>
          {!isConnected && (
            <div style={styles.waitingScreen}>
              <div style={styles.avatar}>👤</div>
              <h2 style={styles.statusText}>{callStatus}</h2>
              <p style={styles.subText}>
                {callStatus === 'Ringing...' ? 'Calling consultant...' : 'Connecting...'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.voiceBackground}>
          <div style={styles.avatar}>👤</div>
          <h2 style={styles.statusText}>{callStatus}</h2>
          {isConnected && <p style={styles.subText}>Voice call in progress</p>}
        </div>
      )}

      {/* Local Video Preview */}
      {callType === 'video' && isVideoEnabled && (
        <div id="local-video" style={styles.localVideo}></div>
      )}

      {/* Top Status Bar */}
      <div style={styles.topBar}>
        <p style={styles.statusSmall}>
          {isConnected ? '🟢 Connected' : '🟡 ' + callStatus}
        </p>
        {isConnected && (
          <>
            <p style={styles.durationText}>{formatDuration(duration)}</p>
            {remoteUid > 0 && (
              <p style={styles.uidText}>Remote UID: {remoteUid}</p>
            )}
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div style={styles.controls}>
        <button
          onClick={toggleMute}
          disabled={!isConnected}
          style={{
            ...styles.button,
            backgroundColor: isMuted ? '#DC2626' : 'rgba(255, 255, 255, 0.3)',
            opacity: isConnected ? 1 : 0.5,
            cursor: isConnected ? 'pointer' : 'not-allowed',
          }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        {callType === 'video' && (
          <button
            onClick={toggleVideo}
            disabled={!isConnected}
            style={{
              ...styles.button,
              backgroundColor: !isVideoEnabled ? '#DC2626' : 'rgba(255, 255, 255, 0.3)',
              opacity: isConnected ? 1 : 0.5,
              cursor: isConnected ? 'pointer' : 'not-allowed',
            }}
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
  );
}

export default function CallPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#000',
        color: 'white',
        fontSize: '20px',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ fontSize: '48px' }}>📞</div>
        <div>Loading call...</div>
      </div>
    }>
      <CallScreen />
    </Suspense>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  voiceBackground: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  avatar: {
    fontSize: '100px',
    marginBottom: '20px',
  },
  statusText: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '50px 20px 15px',
    background: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    zIndex: 5,
    backdropFilter: 'blur(10px)',
  },
  statusSmall: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    marginBottom: '4px',
  },
  durationText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px',
    fontWeight: '600',
    margin: '4px 0',
  },
  uidText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '11px',
    margin: '4px 0 0 0',
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
    transition: 'all 0.2s',
  },
};