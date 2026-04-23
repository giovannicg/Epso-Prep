import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Lock } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'

export default function PracticeScreen() {
  const navigate = useNavigate()
  const vStats = useProgressStore(s => s.statsByCategory.verbal_reasoning)
  const nStats = useProgressStore(s => s.statsByCategory.numerical_reasoning)

  const vAccuracy = vStats.totalAttempted > 0 ? Math.round((vStats.totalCorrect / vStats.totalAttempted) * 100) : null
  const nAccuracy = nStats.totalAttempted > 0 ? Math.round((nStats.totalCorrect / nStats.totalAttempted) * 100) : null

  function statsRow(sessions: number, accuracy: number | null, attempted: number) {
    return accuracy != null ? (
      <div style={{ display: 'flex', marginBottom: spacing.md }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.primary }}>{sessions}</p>
          <p style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Sesiones</p>
        </div>
        <div style={{ width: 1, backgroundColor: colors.border }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.primary }}>{accuracy}%</p>
          <p style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Precisión</p>
        </div>
        <div style={{ width: 1, backgroundColor: colors.border }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.primary }}>{attempted}</p>
          <p style={{ fontSize: fontSize.xs, color: colors.textMuted }}>Preguntas</p>
        </div>
      </div>
    ) : (
      <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.md }}>Aún no has practicado este test</p>
    )
  }

  function PracticeCard({ title, desc, icon, onStart, accuracy, attempted, sessions }: { title: string; desc: string; icon: React.ReactNode; onStart: () => void; accuracy: number | null; attempted: number; sessions: number }) {
    return (
      <div style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, border: `1px solid ${colors.border}`, ...shadow.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
          <div style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primarySurface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(3,105,161,0.12)`, flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textPrimary }}>{title}</p>
            <p style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{desc}</p>
          </div>
          <span style={{ backgroundColor: colors.successLight, color: colors.successDark, fontSize: fontSize.xs, fontWeight: 700, padding: '3px 8px', borderRadius: radius.full, border: `1px solid rgba(22,163,74,0.25)` }}>Disponible</span>
        </div>
        {statsRow(sessions, accuracy, attempted)}
        <button onClick={onStart} style={{ width: '100%', backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.md}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: 'pointer' }}>
          Iniciar práctica
        </button>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, backgroundColor: colors.background }}>
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: spacing.md, paddingBottom: spacing.lg }}>
        <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Práctica</h1>
        <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>Elige un test para comenzar</p>
      </div>
      <div style={{ padding: spacing.md }}>
        <PracticeCard title="Razonamiento Verbal" desc="10 preguntas · Español · AST/ES" icon={<BookOpen size={24} color={colors.primary} />} onStart={() => navigate('/quiz/verbal_reasoning/es')} accuracy={vAccuracy} attempted={vStats.totalAttempted} sessions={vStats.sessionsCompleted} />
        <PracticeCard title="Razonamiento Numérico" desc="3 preguntas · Español · AST/ES" icon={<Calculator size={24} color={colors.primary} />} onStart={() => navigate('/quiz/numerical_reasoning/es')} accuracy={nAccuracy} attempted={nStats.totalAttempted} sessions={nStats.sessionsCompleted} />
        {['Razonamiento Abstracto', 'Juicio Situacional'].map(name => (
          <div key={name} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm, border: `1px solid ${colors.border}`, opacity: 0.45, display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <div style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} color={colors.textMuted} />
            </div>
            <div>
              <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textMuted }}>{name}</p>
              <p style={{ fontSize: fontSize.sm, color: colors.textMuted }}>Próximamente</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
