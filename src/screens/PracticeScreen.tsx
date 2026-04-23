import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Lock, Play } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'

export default function PracticeScreen() {
  const navigate = useNavigate()
  const vStats = useProgressStore(s => s.statsByCategory.verbal_reasoning)
  const nStats = useProgressStore(s => s.statsByCategory.numerical_reasoning)

  const vAccuracy = vStats.totalAttempted > 0 ? Math.round((vStats.totalCorrect / vStats.totalAttempted) * 100) : null
  const nAccuracy = nStats.totalAttempted > 0 ? Math.round((nStats.totalCorrect / nStats.totalAttempted) * 100) : null

  function StatsRow({ sessions, accuracy, attempted }: { sessions: number; accuracy: number | null; attempted: number }) {
    if (accuracy == null) return (
      <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.md }}>Aún no has practicado este test</p>
    )
    return (
      <div style={{ display: 'flex', gap: 1, backgroundColor: colors.border, borderRadius: radius.md, overflow: 'hidden', marginBottom: spacing.md }}>
        {[{ v: sessions, l: 'Sesiones' }, { v: `${accuracy}%`, l: 'Precisión' }, { v: attempted, l: 'Preguntas' }].map(({ v, l }) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', padding: `${spacing.sm}px`, backgroundColor: colors.surfaceAlt }}>
            <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.primary }}>{v}</p>
            <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{l}</p>
          </div>
        ))}
      </div>
    )
  }

  function PracticeCard({ title, desc, icon, onStart, accuracy, attempted, sessions }: {
    title: string; desc: string; icon: React.ReactNode; onStart: () => void
    accuracy: number | null; attempted: number; sessions: number
  }) {
    return (
      <div style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', ...shadow.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
          <div style={{ width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.primarySurface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(3,105,161,0.12)`, flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary }}>{title}</p>
            <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>{desc}</p>
          </div>
          <span style={{ backgroundColor: colors.successLight, color: colors.successDark, fontSize: fontSize.xs, fontWeight: 700, padding: '4px 10px', borderRadius: radius.full, border: `1px solid rgba(22,163,74,0.25)`, flexShrink: 0 }}>
            Disponible
          </span>
        </div>
        <StatsRow sessions={sessions} accuracy={accuracy} attempted={attempted} />
        <button onClick={onStart} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, width: '100%', backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
          <Play size={16} />
          Iniciar práctica
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: `${spacing.lg}px ${spacing.xl * 2}px` }}>
        <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Práctica</h1>
        <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 }}>Elige un test para comenzar a practicar</p>
      </div>

      <div className="content-wrap">
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}>Tests disponibles</p>
        <div className="practice-grid">
          <PracticeCard title="Razonamiento Verbal" desc="10 preguntas · Español · AST/ES" icon={<BookOpen size={24} color={colors.primary} />} onStart={() => navigate('/quiz/verbal_reasoning/es')} accuracy={vAccuracy} attempted={vStats.totalAttempted} sessions={vStats.sessionsCompleted} />
          <PracticeCard title="Razonamiento Numérico" desc="3 preguntas · Español · AST/ES" icon={<Calculator size={24} color={colors.primary} />} onStart={() => navigate('/quiz/numerical_reasoning/es')} accuracy={nAccuracy} attempted={nStats.totalAttempted} sessions={nStats.sessionsCompleted} />
        </div>

        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md, marginTop: spacing.xl }}>Próximamente</p>
        <div className="practice-grid">
          {['Razonamiento Abstracto', 'Juicio Situacional'].map(name => (
            <div key={name} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, border: `1px solid ${colors.border}`, opacity: 0.45, display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <div style={{ width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Lock size={22} color={colors.textMuted} />
              </div>
              <div>
                <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textMuted }}>{name}</p>
                <p style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 }}>En desarrollo</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
