import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useQuizStore } from '../store/quizStore'
import { computeScore } from '../utils/quizUtils'
import { colors, spacing, fontSize, radius } from '../utils/theme'

export default function QuizResultsScreen() {
  const navigate = useNavigate()
  const session = useQuizStore(s => s.activeSession)
  const clearSession = useQuizStore(s => s.clearSession)
  const recorded = useRef(false)

  if (!session) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: spacing.md }}>
        <p style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md }}>No hay resultados disponibles.</p>
        <button onClick={() => navigate('/')} style={{ backgroundColor: colors.primary, color: '#fff', borderRadius: 32, padding: `${spacing.md}px ${spacing.xl}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: 'pointer' }}>Volver</button>
      </div>
    )
  }

  const { correct, total, percentage } = computeScore(session)
  const attempts = Object.values(session.attempts)

  const scoreColor = percentage >= 70 ? colors.success : percentage >= 50 ? colors.accent : colors.error
  const scoreLabel = percentage >= 70 ? '¡Excelente!' : percentage >= 50 ? 'Bien' : 'Sigue practicando'

  function handleRetry() {
    const { category, language } = session!
    clearSession()
    navigate(`/quiz/${category}/${language}`, { replace: true })
  }

  function handleHome() {
    clearSession()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', backgroundColor: colors.background }}>
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: spacing.md, textAlign: 'center' }}>
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.xs }}>Resultados</p>
        <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Quiz completado</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: spacing.md }}>
        {/* Score circle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: `${spacing.xl}px 0`, marginBottom: spacing.md }}>
          <div style={{ width: 140, height: 140, borderRadius: 70, border: `8px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, backgroundColor: `${scoreColor}11` }}>
            <span style={{ fontSize: fontSize.xxxl, fontWeight: 800, color: scoreColor }}>{percentage}%</span>
            <span style={{ fontSize: fontSize.xs, color: colors.textMuted }}>puntuación</span>
          </div>
          <p style={{ fontSize: fontSize.xl, fontWeight: 700, color: scoreColor }}>{scoreLabel}</p>
          <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 }}>{correct} de {total} respuestas correctas</p>
        </div>

        {/* Breakdown summary */}
        <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.md }}>
          <div style={{ flex: 1, backgroundColor: colors.successLight, borderRadius: radius.full, padding: `6px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid rgba(22,163,74,0.25)` }}>
            <CheckCircle size={16} color={colors.successDark} />
            <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.successDark }}>{correct} correctas</span>
          </div>
          <div style={{ flex: 1, backgroundColor: colors.errorLight, borderRadius: radius.full, padding: `6px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid rgba(220,38,38,0.25)` }}>
            <XCircle size={16} color={colors.errorDark} />
            <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.errorDark }}>{total - correct} incorrectas</span>
          </div>
        </div>

        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}>Desglose</p>
        {attempts.map((item, index) => {
          const isCorrect = item.status === 'correct'
          return (
            <div key={item.questionId} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm}px`, borderRadius: radius.sm, marginBottom: 4, border: `1px solid ${isCorrect ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}`, backgroundColor: isCorrect ? '#F0FDF4' : '#FFF5F5' }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: isCorrect ? colors.successLight : colors.errorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: fontSize.xs, fontWeight: 800, color: isCorrect ? colors.successDark : colors.errorDark }}>{index + 1}</span>
              </div>
              {isCorrect ? <CheckCircle size={18} color={colors.success} /> : <XCircle size={18} color={colors.error} />}
              <span style={{ fontSize: fontSize.sm, color: isCorrect ? colors.successDark : colors.errorDark, flex: 1 }}>
                {isCorrect ? 'Correcta' : `Incorrecta — correcta: ${item.selectedKey ?? '—'}`}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ padding: spacing.md, paddingBottom: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.sm, backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}` }}>
        <button onClick={handleRetry} style={{ width: '100%', backgroundColor: colors.primary, color: '#fff', borderRadius: 32, padding: `${spacing.md}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: 'pointer', minHeight: 52 }}>Volver a practicar</button>
        <button onClick={handleHome} style={{ width: '100%', backgroundColor: 'transparent', color: colors.primary, borderRadius: 32, padding: `${spacing.md}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${colors.primary}`, minHeight: 52 }}>Ir al inicio</button>
      </div>
    </div>
  )
}
