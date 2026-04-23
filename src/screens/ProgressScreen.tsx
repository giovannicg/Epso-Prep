import React from 'react'
import { useProgressStore } from '../store/progressStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'
import { BookOpen, Calculator, Shapes, Users } from 'lucide-react'
import type { ExamCategory } from '../types'

const CATEGORIES: { key: ExamCategory; title: string; icon: React.ReactNode }[] = [
  { key: 'verbal_reasoning', title: 'Razonamiento Verbal', icon: <BookOpen size={20} color={colors.primary} /> },
  { key: 'numerical_reasoning', title: 'Razonamiento Numérico', icon: <Calculator size={20} color={colors.primary} /> },
  { key: 'abstract_reasoning', title: 'Razonamiento Abstracto', icon: <Shapes size={20} color={colors.primary} /> },
  { key: 'situational_judgement', title: 'Juicio Situacional', icon: <Users size={20} color={colors.primary} /> },
]

export default function ProgressScreen() {
  const statsByCategory = useProgressStore(s => s.statsByCategory)
  const recentSessions = useProgressStore(s => s.recentSessions)
  const resetProgress = useProgressStore(s => s.resetProgress)

  const totalSessions = Object.values(statsByCategory).reduce((sum, s) => sum + s.sessionsCompleted, 0)
  const totalCorrect = Object.values(statsByCategory).reduce((sum, s) => sum + s.totalCorrect, 0)
  const totalAttempted = Object.values(statsByCategory).reduce((sum, s) => sum + s.totalAttempted, 0)
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null

  function handleReset() {
    if (window.confirm('¿Estás seguro de que quieres borrar todo tu progreso?')) {
      resetProgress()
    }
  }

  return (
    <div style={{ flex: 1, backgroundColor: colors.background }}>
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: spacing.md, paddingBottom: spacing.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Progreso</h1>
          <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 }}>Tu historial de práctica</p>
        </div>
        <button onClick={handleReset} style={{ padding: `${spacing.xs}px ${spacing.sm}px`, borderRadius: radius.sm, backgroundColor: colors.errorLight, cursor: 'pointer' }}>
          <span style={{ fontSize: fontSize.sm, color: colors.error, fontWeight: 600 }}>Restablecer</span>
        </button>
      </div>

      {totalSessions > 0 && (
        <div style={{ backgroundColor: colors.primary, display: 'flex', padding: `${spacing.md}px 0`, borderBottom: `1px solid ${colors.primaryDark}`, ...shadow.sm }}>
          {[{ value: totalSessions, label: 'Sesiones' }, { value: `${overallAccuracy}%`, label: 'Precisión' }, { value: totalAttempted, label: 'Preguntas' }].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: '#fff' }}>{item.value}</p>
                <p style={{ fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      <div style={{ padding: spacing.md, overflowY: 'auto' }}>
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}>Por categoría</p>
        {CATEGORIES.map(({ key, title, icon }) => {
          const stats = statsByCategory[key]
          const accuracy = stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : null
          return (
            <div key={key} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, border: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                {icon}
                <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textPrimary }}>{title}</p>
              </div>
              {stats.sessionsCompleted === 0 ? (
                <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' }}>Sin sesiones completadas</p>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {[{ v: stats.sessionsCompleted, l: 'Sesiones' }, { v: `${accuracy ?? 0}%`, l: 'Precisión' }, { v: `${stats.totalCorrect}/${stats.totalAttempted}`, l: 'Correctas' }].map(({ v, l }) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: fontSize.lg, fontWeight: 800, color: colors.primary }}>{v}</p>
                      <p style={{ fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 }}>{l}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm, marginTop: spacing.lg }}>Sesiones recientes</p>
        {recentSessions.length === 0 ? (
          <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', padding: spacing.lg }}>No hay sesiones recientes</p>
        ) : (
          recentSessions.map(session => (
            <div key={session.id} style={{ backgroundColor: colors.surface, borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.xs, border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 600 }}>{session.category.replace('_', ' ')}</p>
              <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: session.score >= 60 ? colors.success : colors.error }}>{session.score}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
