// contexts/CallContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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

  const initiateCall = useCallback((
    consultantId: string, 
    callType: CallType,
    consultantName?: string,
    consultantAvatar?: string
  ) => {
    console.log('[CallContext] Initiating call:', { consultantId, callType });
    setCallState({
      ...initialCallState,
      stage: 'preparing',
      consultantId,
      callType,
      consultantName,
      consultantAvatar,
    });
  }, []);

  const endCall = useCallback(() => {
    console.log('[CallContext] Ending call');
    setCallState(initialCallState);
  }, []);

  const setCallStage = useCallback((stage: CallStage) => {
    setCallState(prev => ({ ...prev, stage }));
  }, []);

  const setSessionData = useCallback((sessionId: string, channelName: string, token: string) => {
    setCallState(prev => ({
      ...prev,
      sessionId,
      channelName,
      token,
      stage: 'ringing',
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setCallState(prev => ({ ...prev, error, stage: 'ended' }));
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