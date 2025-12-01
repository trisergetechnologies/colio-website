// lib/utils/callHelpers.ts

import { useCall } from "@/context/CallContext";


// For use in components
export function useCallHelpers() {
  const { initiateCall } = useCall();

  const startVoiceCall = (consultantId: string, name?: string, avatar?: string) => {
    initiateCall(consultantId, 'voice', name, avatar);
  };

  const startVideoCall = (consultantId: string, name?: string, avatar?: string) => {
    initiateCall(consultantId, 'video', name, avatar);
  };

  return { startVoiceCall, startVideoCall };
}