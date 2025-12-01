// components/call/CallManager.tsx
'use client';

import DeviceCheckModal from './DeviceCheckModal';
import ActiveCallModal from './ActiveCallModal';
import { useCall } from '@/context/CallContext';

export default function CallManager() {
  const { callState } = useCall();

  // Show device check modal when preparing
  if (callState.stage === 'preparing') {
    return <DeviceCheckModal />;
  }

  // Show active call modal when ringing or connected
  if (callState.stage === 'ringing' || callState.stage === 'connected') {
    return <ActiveCallModal />;
  }

  // Show error modal if error exists
  if (callState.stage === 'ended' && callState.error) {
    return (
      <div style={styles.overlay}>
        <div style={styles.errorModal}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Call Failed</h2>
          <p style={styles.errorMessage}>{callState.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.errorButton}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  errorModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '32px',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid rgba(255, 0, 0, 0.3)',
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  errorTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 12px 0',
  },
  errorMessage: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    marginBottom: '24px',
  },
  errorButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};