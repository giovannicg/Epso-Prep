import React from 'react'
import { colors } from '../../utils/theme'

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: colors.background }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${colors.border}`, borderTopColor: colors.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default LoadingScreen
