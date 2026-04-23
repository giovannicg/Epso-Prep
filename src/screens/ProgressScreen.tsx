import React from 'react'
import { useProgressStore } from '../store/progressStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'
import { BookOpen, Calculator, Shapes, Users, Trash2 } from 'lucide-react'
import type { ExamCategory } from '../types'

const CATEGORY_NAMES: Record<ExamCategory, string> = {
  verbal_reasoning: 'Razonamiento Verbal',
  numerical_reasoning: 'Razonamiento Numérico',
  abstract_reasoning: 'Razonamiento Abstracto',
  situational_judgement: 'Juicio Situacional',
}

const CATEGORIES: { key: ExamCategory; title: string; icon: React.ReactNode }[] = [
  { key: 'verbal_reasoning', title: 'Razonamiento Verbal', icon: <BookOpen size={18} color={colors.primary} /> },
  { key: 'numerical_reasoning', title: 'Razonamiento Numérico', icon: <Calculator size={18} color={colors.primary} /> },
  { key: 'abstract_reasoning', title: 'Razonamiento Abstracto', icon: <Shapes size={18} color={colors.textMuted} /> },
  { key: 'situational_judgement', title: 'Juicio Situacional', icon: <Users size={18} color={colors.textMuted} /> },
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
    if (window.confirm('¿Estás seguro de que quieres borrar todo tu progreso?')) resetProgress()
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: `${spacing.lg}px ${spacing.xl * 2}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Progreso</h1>
          <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 }}>Tu historial de práctica</p>
        </div>
        <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, padding: `${spacing.xs + 2}px ${spacing.sm}px`, borderRadius: radius.md, backgroundColor: colors.errorLight, cursor: 'pointer' }}>
          <Trash2 size={14} color={colors.error} />
          <span style={{ fontSize: fontSize.sm, color: colors.error, fontWeight: 600 }}>Restablecer</span>
        </button>
      </div>

      <div className="content-wrap">
        {/* Overall stats */}
        {totalSessions > 0 && (
          <>
            <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}>Resumen global</p>
            <div className="stats-grid" style={{ marginBottom: spacing.xl }}>
              {[
                { value: totalSessions, label: 'Sesiones completadas', color: colors.primary },
                { value: `${overallAccuracy ?? 0}%`, label: 'Precisión global', color: overallAccuracy != null && overallAccuracy >= 60 ? colors.success : colors.error },
                { value: totalAttempted, label: 'Preguntas respondidas', color: colors.primary },
              ].map(({ value, label, color }) => (
                <div key={label} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, border: `1px solid ${colors.border}`, textAlign: 'center', ...shadow.sm }}>
                  <p style={{ fontSize: fontSize.xxxl, fontWeight: 800, color }}>{value}</p>
                  <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs }}>{label}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Per-category */}
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}>Por categoría</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md, marginBottom: spacing.xl }}>
          {CATEGORIES.map(({ key, title, icon }) => {
            const stats = statsByCategory[key]
            const accuracy = stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : null
            return (
              <div key={key} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, border: `1px solid ${colors.border}`, ...shadow.sm }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                  {icon}
                  <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textPrimary }}>{title}</p>
                </div>
                {stats.sessionsCompleted === 0 ? (
                  <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' }}>Sin sesiones completadas</p>
                ) : (
                  <div style={{ display: 'flex', gap: spacing.lg }}>
                    {[{ v: stats.sessionsCompleted, l: 'Sesiones' }, { v: `${accuracy ?? 0}%`, l: 'Precisión' }, { v: `${stats.totalCorrect}/${stats.totalAttempted}`, l: 'Correctas' }].map(({ v, l }) => (
                      <div key={l}>
                        <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: colors.primary }}>{v}</p>
                        <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Recent sessions */}
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}>Sesiones recientes</p>
        {recentSessions.length === 0 ? (
          <p style={{ fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', padding: spacing.xl }}>No hay sesiones recientes</p>
        ) : (
          <div style={{ backgroundColor: colors.surface, borderRadius: radius.lg, border: `1px solid ${colors.border}`, overflow: 'hidden', ...shadow.sm }}>
            {recentSessions.map((session, i) => (
              <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${spacing.sm + 4}px ${spacing.md}px`, borderTop: i > 0 ? `1px solid ${colors.border}` : 'none' }}>
                <div>
                  <p style={{ fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: 600 }}>{CATEGORY_NAMES[session.category]}</p>
                  <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>{session.correctAnswers} / {session.totalQuestions} correctas</p>
                </div>
                <span style={{ fontSize: fontSize.lg, fontWeight: 800, color: session.score >= 60 ? colors.success : colors.error }}>{session.score}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
