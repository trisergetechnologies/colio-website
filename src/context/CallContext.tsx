// contexts/CallContext.tsx - FIXED VERSION
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

export type CallType = 'voice' | 'video';
export type CallStage = 'idle' | 'preparing' | 'ringing' | 'connected' | 'ended';

export interface CallState {
  stage: CallStage;
  consultantId: string | null;
  consultantName?: string;
  consultantAvatar?: string;
  callType: CallType | null;
  sessionId: string | null;
  channelName: string | null;
  token: string | null;
  error: string | null;
}

interface CallContextType {
  callState: CallState;
  initiateCall: (consultantId: string, callType: CallType, consultantName?: string, consultantAvatar?: string) => void;
  endCall: () => void;
  setCallStage: (stage: CallStage) => void;
  setSessionData: (sessionId: string, channelName: string, token: string) => void;
  setError: (error: string) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

const initialCallState: CallState = {
  stage: 'idle',
  consultantId: null,
  callType: null,
  sessionId: null,
  channelName: null,
  token: null,
  error: null,
};

export function CallProvider({ children }: { children: ReactNode }) {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  const initiatingRef = useRef(false); // ✅ Add guard flag
  const lastCallTimestampRef = useRef(0); // ✅ Add timestamp guard

  const initiateCall = useCallback((
    consultantId: string, 
    callType: CallType,
    consultantName?: string,
    consultantAvatar?: string
  ) => {
    const now = Date.now();
    
    // ✅ 1. Prevent rapid double calls (within 2 seconds)
    if (now - lastCallTimestampRef.current < 2000) {
      console.log('[CallContext] ⚠️ Call initiated too quickly, ignoring');
      return;
    }

    // ✅ 2. Prevent if already initiating
    if (initiatingRef.current) {
      console.log('[CallContext] ⚠️ Already initiating call, ignoring');
      return;
    }

    // ✅ 3. Prevent if already in active call
    if (callState.stage !== 'idle') {
      console.log('[CallContext] ⚠️ Already in call (stage:', callState.stage + '), ignoring');
      return;
    }

    // ✅ Set guards
    initiatingRef.current = true;
    lastCallTimestampRef.current = now;

    console.log('[CallContext] ========================================');
    console.log('[CallContext] ✅ Initiating call');
    console.log('[CallContext] Consultant ID:', consultantId);
    console.log('[CallContext] Call type:', callType);
    console.log('[CallContext] ========================================');

    setCallState({
      ...initialCallState,
      stage: 'preparing',
      consultantId,
      callType,
      consultantName,
      consultantAvatar,
    });

    // ✅ Reset initiating flag after a delay
    setTimeout(() => {
      initiatingRef.current = false;
    }, 3000);
  }, [callState.stage]);

  const endCall = useCallback(() => {
    console.log('[CallContext] ========================================');
    console.log('[CallContext] Ending call');
    console.log('[CallContext] Previous stage:', callState.stage);
    console.log('[CallContext] ========================================');
    
    setCallState(initialCallState);
    initiatingRef.current = false; // ✅ Reset guard
    lastCallTimestampRef.current = 0; // ✅ Reset timestamp
  }, [callState.stage]);

  const setCallStage = useCallback((stage: CallStage) => {
    console.log('[CallContext] Stage change:', callState.stage, '→', stage);
    setCallState(prev => ({ ...prev, stage }));
  }, [callState.stage]);

  const setSessionData = useCallback((sessionId: string, channelName: string, token: string) => {
    console.log('[CallContext] ========================================');
    console.log('[CallContext] Session data received');
    console.log('[CallContext] Session ID:', sessionId);
    console.log('[CallContext] Channel:', channelName);
    console.log('[CallContext] ========================================');
    
    setCallState(prev => ({
      ...prev,
      sessionId,
      channelName,
      token,
      stage: 'ringing',
    }));
  }, []);

  const setError = useCallback((error: string) => {
    console.log('[CallContext] ❌ Error:', error);
    setCallState(prev => ({ ...prev, error, stage: 'ended' }));
    initiatingRef.current = false; // ✅ Reset guard on error
  }, []);

  return (
    <CallContext.Provider value={{
      callState,
      initiateCall,
      endCall,
      setCallStage,
      setSessionData,
      setError,
    }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallProvider');
  }
  return context;
}