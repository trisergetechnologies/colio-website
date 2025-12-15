// components/call/CallManager.tsx
'use client';

import { useCall } from '@/context/CallContext';
import DeviceCheckModal from './DeviceCheckModal';
import ActiveCallModal from './ActiveCallModal';

export default function CallManager() {
  const { callState, endCall } = useCall();

  // ============================================
  // DEVICE CHECK STAGE
  // ============================================
  
  if (callState.stage === 'preparing') {
    return <DeviceCheckModal />;
  }

  // ============================================
  // ACTIVE CALL STAGE (Ringing or Connected)
  // ============================================
  
  if (callState.stage === 'ringing' || callState.stage === 'connected') {
    return <ActiveCallModal />;
  }

  // ============================================
  // ERROR STAGE
  // ============================================
  
  if (callState.stage === 'ended' && callState.error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 w-[90%] max-w-[400px] text-center border border-red-500/30">
          {/* Error Icon */}
          <div className="text-6xl mb-4">⚠️</div>
          
          {/* Error Title */}
          <h2 className="text-white text-2xl font-bold mb-3">
            Call Failed
          </h2>
          
          {/* Error Message */}
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            {callState.error}
          </p>
          
          {/* Close Button */}
          <button
            onClick={() => endCall()}
            className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-base transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // IDLE - NO MODAL
  // ============================================
  
  return null;
}