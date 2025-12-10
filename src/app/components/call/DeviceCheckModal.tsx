// components/call/DeviceCheckModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { startCallSession } from '@/lib/api/communication';
import { getToken } from '@/lib/utils/tokenHelper';
import { useCall } from '@/context/CallContext';

const AGORA_APP_ID = '8b9ed38f29bb4b1bbc7958f5fda8b054';

export default function DeviceCheckModal() {
  const { callState, setCallStage, setSessionData, setError, endCall } = useCall();
  const [micStatus, setMicStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [isConnecting, setIsConnecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [sessionCreated, setSessionCreated] = useState(false); 

  useEffect(() => {
    if (callState.stage === 'preparing') {
      checkDevices();
    }

    return () => {
      stopPreview();
    };
  }, [callState.stage]);

  const checkDevices = async () => {
    console.log('[DeviceCheck] ========================================');
    console.log('[DeviceCheck] Checking devices...');
    console.log('[DeviceCheck] Call type:', callState.callType);
    console.log('[DeviceCheck] ========================================');

    // ✅ Check microphone
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('available');
      audioStream.getTracks().forEach(track => track.stop());
      console.log('[DeviceCheck] ✅ Microphone available');
    } catch (error) {
      console.error('[DeviceCheck] ❌ Microphone unavailable:', error);
      setMicStatus('unavailable');
    }

    // ✅ Check camera (only for video calls)
    if (callState.callType === 'video') {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStatus('available');
        
        // Show preview
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          streamRef.current = videoStream;
        }
        
        console.log('[DeviceCheck] ✅ Camera available');
      } catch (error) {
        console.error('[DeviceCheck] ❌ Camera unavailable:', error);
        setCameraStatus('unavailable');
      }
    } else {
      setCameraStatus('available'); // Not needed for voice calls
    }

    console.log('[DeviceCheck] ========================================');
    console.log('[DeviceCheck] Device check complete');
    console.log('[DeviceCheck] Mic:', micStatus === 'available' ? '✅' : '❌');
    console.log('[DeviceCheck] Camera:', cameraStatus === 'available' ? '✅' : '❌');
    console.log('[DeviceCheck] ========================================');
  };

  const stopPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      console.log('[DeviceCheck] ✅ Preview stopped');
    }
  };

  const handleContinue = async () => {

      if (sessionCreated) {
    console.log('[DeviceCheck] ⚠️ Session already created, ignoring');
    return;
  }

    // ✅ Allow call even if devices fail (can still hear/see consultant)
    if (callState.callType === 'video' && cameraStatus === 'unavailable') {
      const confirmContinue = window.confirm(
        'Camera not available. You will join without video but can still see and hear the consultant. Continue?'
      );
      if (!confirmContinue) return;
    }

    if (micStatus === 'unavailable') {
      const confirmContinue = window.confirm(
        'Microphone not available. You will join muted but can still see and hear the consultant. Continue?'
      );
      if (!confirmContinue) return;
    }

    setIsConnecting(true);
    setSessionCreated(true);

    try {
      stopPreview();

      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }

      console.log('[DeviceCheck] ========================================');
      console.log('[DeviceCheck] Starting backend session...');
      console.log('[DeviceCheck] Consultant ID:', callState.consultantId);
      console.log('[DeviceCheck] Call type:', callState.callType);
      console.log('[DeviceCheck] ========================================');

      // ✅ Start backend session
      const session = await startCallSession(
        callState.consultantId!,
        callState.callType!,
        token
      );

      console.log('[DeviceCheck] ========================================');
      console.log('[DeviceCheck] ✅ Backend session created');
      console.log('[DeviceCheck] Session ID:', session.id);
      console.log('[DeviceCheck] Channel:', session.channelName);
      console.log('[DeviceCheck] ========================================');

      // ✅ Update context with session data
      setSessionData(session.id, session.channelName, session.rtcToken);

    } catch (error: any) {
      console.error('[DeviceCheck] ========================================');
      console.error('[DeviceCheck] ❌ Error:', error);
      console.error('[DeviceCheck] ========================================');
      setError(error.message || 'Failed to start call');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    console.log('[DeviceCheck] User cancelled call');
    stopPreview();
    endCall();
  };

  if (callState.stage !== 'preparing') return null;

  // ✅ Check if all devices are working fine
  const allDevicesOk = micStatus === 'available' && cameraStatus === 'available';
  const hasDeviceIssues = micStatus === 'unavailable' || 
    (callState.callType === 'video' && cameraStatus === 'unavailable');

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {callState.callType === 'video' ? 'Video Call' : 'Voice Call'}
          </h2>
          <p style={styles.subtitle}>
            Calling {callState.consultantName || 'consultant'}
          </p>
        </div>

        {/* Video Preview (for video calls) */}
        {callState.callType === 'video' && (
          <div style={styles.videoPreview}>
            {cameraStatus === 'available' && streamRef.current ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={styles.video}
              />
            ) : cameraStatus === 'unavailable' ? (
              <div style={styles.noCamera}>
                <div style={styles.noCameraIcon}>📷</div>
                <p style={styles.noCameraText}>Camera not available</p>
              </div>
            ) : (
              <div style={styles.noCamera}>
                <div style={styles.loadingIcon}>⏳</div>
                <p style={styles.noCameraText}>Checking camera...</p>
              </div>
            )}
          </div>
        )}

        {/* ✅ Only show device status if there are issues */}
        {hasDeviceIssues && (
          <div style={styles.warning}>
            <p style={styles.warningTitle}>⚠️ Device Issues Detected</p>
            
            {micStatus === 'unavailable' && (
              <p style={styles.warningText}>
                • Microphone unavailable - You will join muted
              </p>
            )}
            
            {callState.callType === 'video' && cameraStatus === 'unavailable' && (
              <p style={styles.warningText}>
                • Camera unavailable - You will join without video
              </p>
            )}
            
            <p style={styles.warningSubtext}>
              You can still see and hear the consultant.
            </p>
          </div>
        )}

        {/* ✅ Show loading state while checking */}
        {(micStatus === 'checking' || cameraStatus === 'checking') && (
          <div style={styles.checkingStatus}>
            <p style={styles.checkingText}>🔍 Checking devices...</p>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button
            onClick={handleCancel}
            style={styles.cancelButton}
            disabled={isConnecting}
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            style={styles.continueButton}
            disabled={isConnecting || micStatus === 'checking' || cameraStatus === 'checking'}
          >
            {isConnecting ? 'Connecting...' : 'Continue'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    margin: 0,
  },
  videoPreview: {
    width: '100%',
    height: '300px',
    backgroundColor: '#000',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noCamera: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  noCameraIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  loadingIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    animation: 'pulse 1.5s infinite',
  },
  noCameraText: {
    fontSize: '14px',
    margin: 0,
  },
  checkingStatus: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  checkingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    margin: 0,
  },
  warning: {
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    border: '1px solid rgba(255, 165, 0, 0.3)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  warningTitle: {
    color: '#FFA500',
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px 0',
  },
  warningText: {
    color: '#FFA500',
    fontSize: '14px',
    margin: '4px 0',
  },
  warningSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    marginTop: '12px',
    marginBottom: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  continueButton: {
    flex: 1,
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};