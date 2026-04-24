import React from 'react'
import { useUserStore, USER_PROFILES, type UserId } from '../../store/userStore'
import { useProgressStore } from '../../store/progressStore'
import { colors, spacing, fontSize, radius } from '../../utils/theme'

interface Props {
  onSelect: (userId: UserId) => void
  onClose: () => void
}

export function UserPickerModal({ onSelect, onClose }: Props) {
  const activeUser = useUserStore(s => s.activeUser)

  function handlePick(userId: UserId) {
    useUserStore.getState().setActiveUser(userId)
    useProgressStore.getState().loadForUser(userId)
    onSelect(userId)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: spacing.md }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(15,23,42,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, textAlign: 'center', marginBottom: spacing.xs }}>
          Antes de empezar
        </p>
        <h2 style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.lg }}>
          ¿Quién va a practicar?
        </h2>

        <div style={{ display: 'flex', gap: spacing.md }}>
          {(Object.entries(USER_PROFILES) as [UserId, typeof USER_PROFILES[UserId]][]).map(([id, profile]) => {
            const isSelected = activeUser === id
            return (
              <button
                key={id}
                onClick={() => handlePick(id)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm,
                  padding: spacing.lg, borderRadius: radius.md, cursor: 'pointer',
                  border: `2px solid ${isSelected ? profile.color : colors.border}`,
                  backgroundColor: isSelected ? profile.bg : colors.surfaceAlt,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: profile.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: fontSize.xl, fontWeight: 800, color: '#fff' }}>{profile.initials}</span>
                </div>
                <span style={{ fontSize: fontSize.lg, fontWeight: 700, color: isSelected ? profile.color : colors.textPrimary }}>
                  {profile.name}
                </span>
                {isSelected && (
                  <span style={{ fontSize: fontSize.xs, fontWeight: 600, color: profile.color }}>Seleccionado ✓</span>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: spacing.md, padding: `${spacing.sm}px`, fontSize: fontSize.sm, color: colors.textMuted, cursor: 'pointer', textAlign: 'center' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
