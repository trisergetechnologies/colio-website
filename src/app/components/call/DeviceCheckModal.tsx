// components/call/DeviceCheckModal.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { startCallSession } from '@/lib/api/communication';
import { getToken } from '@/lib/utils/tokenHelper';
import { useCall } from '@/context/CallContext';
import { useRouter } from 'next/navigation';

export default function DeviceCheckModal() {
  const { callState, setSessionData, setError, endCall } = useCall();
  const router = useRouter();
  
  // ============================================
  // STATE
  // ============================================
  
  const [micStatus, setMicStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [cameraStatus, setCameraStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);

  // ============================================
  // REFS
  // ============================================
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ============================================
  // EFFECTS
  // ============================================

  useEffect(() => {
    if (callState.stage === 'preparing') {
      checkDevices();
    }

    return () => {
      stopPreview();
    };
  }, [callState.stage]);

  // ============================================
  // DEVICE CHECK
  // ============================================

  const checkDevices = async () => {
    console.log('[DeviceCheck] ========================================');
    console.log('[DeviceCheck] Checking devices...');
    console.log('[DeviceCheck] Call type:', callState.callType);
    console.log('[DeviceCheck] ========================================');

    // Check microphone
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('available');
      audioStream.getTracks().forEach(track => track.stop());
      console.log('[DeviceCheck] ✅ Microphone available');
    } catch (error) {
      console.error('[DeviceCheck] ❌ Microphone unavailable:', error);
      setMicStatus('unavailable');
    }

    // Check camera (only for video calls)
    if (callState.callType === 'video') {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
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
      // Not needed for voice calls
      setCameraStatus('available');
    }

    console.log('[DeviceCheck] ========================================');
    console.log('[DeviceCheck] Device check complete');
    console.log('[DeviceCheck] ========================================');
  };

  const stopPreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      console.log('[DeviceCheck] ✅ Preview stopped');
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleContinue = async () => {
    // Prevent double session creation
    if (sessionCreated) {
      console.log('[DeviceCheck] ⚠️ Session already created, ignoring');
      return;
    }

    // Allow call even if devices fail - user can still see/hear consultant
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

      // Start backend session
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

      // Update context with session data -> moves to 'ringing' stage
      setSessionData(session.id, session.channelName, session.rtcToken);

    } catch (error: any) {
      console.error('[DeviceCheck] ========================================');
      console.error('[DeviceCheck] ❌ Error:', error);
      console.error('[DeviceCheck] ========================================');
      setSessionCreated(false);
      setError(error.response.data.error || 'Failed to start call');
      if(error.response.data.errorCode == 'INSUFFICIENT_BALANCE'){
        router.push('/recharge');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    console.log('[DeviceCheck] User cancelled call');
    stopPreview();
    endCall();
  };

  // ============================================
  // RENDER GUARD
  // ============================================

  if (callState.stage !== 'preparing') return null;

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isChecking = micStatus === 'checking' || cameraStatus === 'checking';
  const hasDeviceIssues = micStatus === 'unavailable' ||
    (callState.callType === 'video' && cameraStatus === 'unavailable');

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 w-[90%] max-w-[450px] border border-white/10">
        
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold mb-2">
            {callState.callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
          </h2>
          <p className="text-white/70 text-sm">
            Calling {callState.consultantName || 'consultant'}
          </p>
        </div>

        {/* ============================================ */}
        {/* VIDEO PREVIEW (Video calls only) */}
        {/* ============================================ */}
        
        {callState.callType === 'video' && (
          <div className="w-full h-[280px] bg-black rounded-2xl overflow-hidden mb-6">
            {cameraStatus === 'available' ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : cameraStatus === 'unavailable' ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                <span className="text-5xl mb-3">📷</span>
                <p className="text-sm">Camera not available</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
                <span className="text-5xl mb-3 animate-pulse">⏳</span>
                <p className="text-sm">Checking camera...</p>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* VOICE CALL AVATAR (Voice calls only) */}
        {/* ============================================ */}
        
        {callState.callType === 'voice' && (
          <div className="flex flex-col items-center py-10 mb-6">
            <div className="w-[100px] h-[100px] rounded-full border-[3px] border-pink-500/50 flex items-center justify-center mb-4">
              <div className="w-[80px] h-[80px] rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
            </div>
            <p className="text-white/70 text-base">Voice Call</p>
          </div>
        )}

        {/* ============================================ */}
        {/* DEVICE STATUS */}
        {/* ============================================ */}
        
        {!isChecking && !hasDeviceIssues && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-green-400 font-semibold text-sm">Devices Ready</p>
                <p className="text-white/60 text-xs mt-1">
                  {callState.callType === 'video' 
                    ? 'Camera and microphone are working' 
                    : 'Microphone is working'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* DEVICE ISSUES WARNING */}
        {/* ============================================ */}
        
        {hasDeviceIssues && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <p className="text-orange-400 font-semibold text-sm mb-3">
              ⚠️ Device Issues Detected
            </p>

            {micStatus === 'unavailable' && (
              <p className="text-orange-400 text-sm mb-1">
                • Microphone unavailable - You will join muted
              </p>
            )}

            {callState.callType === 'video' && cameraStatus === 'unavailable' && (
              <p className="text-orange-400 text-sm mb-1">
                • Camera unavailable - You will join without video
              </p>
            )}

            <p className="text-white/60 text-xs mt-3">
              You can still see and hear the consultant.
            </p>
          </div>
        )}

        {/* ============================================ */}
        {/* CHECKING STATUS */}
        {/* ============================================ */}
        
        {isChecking && (
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
            <p className="text-white/80 text-sm">🔍 Checking devices...</p>
          </div>
        )}

        {/* ============================================ */}
        {/* ACTION BUTTONS */}
        {/* ============================================ */}
        
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={isConnecting}
            className={`flex-1 py-4 rounded-xl border border-white/20 bg-transparent text-white font-semibold text-base transition-colors ${
              isConnecting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-white/10 cursor-pointer'
            }`}
          >
            Cancel
          </button>
          
          <button
            onClick={handleContinue}
            disabled={isConnecting || isChecking}
            className={`flex-1 py-4 rounded-xl border-none bg-pink-500 text-white font-semibold text-base transition-colors ${
              isConnecting || isChecking 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-pink-600 cursor-pointer'
            }`}
          >
            {isConnecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Connecting...
              </span>
            ) : (
              'Start Call'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}