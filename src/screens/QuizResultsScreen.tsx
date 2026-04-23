import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react'
import { useQuizStore } from '../store/quizStore'
import { computeScore } from '../utils/quizUtils'
import { getQuestionById } from '../data/questions'
import { colors, spacing, fontSize, radius } from '../utils/theme'

export default function QuizResultsScreen() {
  const navigate = useNavigate()
  const session = useQuizStore(s => s.activeSession)
  const clearSession = useQuizStore(s => s.clearSession)
  const recorded = useRef(false)

  if (!session) {
    return (
      <div className="quiz-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md }}>No hay resultados disponibles.</p>
        <button onClick={() => navigate('/')} style={{ backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px ${spacing.xl}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer' }}>Volver al inicio</button>
      </div>
    )
  }

  const { correct, total, percentage } = computeScore(session)
  const attempts = Object.values(session.attempts)

  const scoreColor = percentage >= 70 ? colors.success : percentage >= 50 ? colors.primaryDark : colors.error
  const scoreLabel = percentage >= 70 ? '¡Excelente resultado!' : percentage >= 50 ? 'Buen trabajo' : 'Sigue practicando'

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
    <div className="quiz-shell">
      {/* Top bar */}
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: `${spacing.md}px ${spacing.xl}px`, textAlign: 'center', flexShrink: 0 }}>
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Resultados</p>
        <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: colors.textPrimary }}>Quiz completado</h1>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        <div className="quiz-body">
          {/* Score hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl, padding: `${spacing.xl}px`, backgroundColor: colors.surface, borderRadius: radius.lg, border: `1px solid ${colors.border}`, marginBottom: spacing.lg }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, border: `6px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: `${scoreColor}11` }}>
              <span style={{ fontSize: fontSize.xxxl, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{percentage}%</span>
              <span style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>puntuación</span>
            </div>
            <div>
              <p style={{ fontSize: fontSize.xl, fontWeight: 700, color: scoreColor, marginBottom: spacing.xs }}>{scoreLabel}</p>
              <p style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md }}>{correct} de {total} respuestas correctas</p>
              <div style={{ display: 'flex', gap: spacing.sm }}>
                <div style={{ backgroundColor: colors.successLight, borderRadius: radius.full, padding: `5px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid rgba(22,163,74,0.25)` }}>
                  <CheckCircle size={14} color={colors.successDark} />
                  <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.successDark }}>{correct} correctas</span>
                </div>
                <div style={{ backgroundColor: colors.errorLight, borderRadius: radius.full, padding: `5px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid rgba(220,38,38,0.25)` }}>
                  <XCircle size={14} color={colors.errorDark} />
                  <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.errorDark }}>{total - correct} incorrectas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}>Desglose de respuestas</p>
          <div style={{ backgroundColor: colors.surface, borderRadius: radius.lg, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
            {attempts.map((item, index) => {
              const isCorrect = item.status === 'correct'
              const question = getQuestionById(item.questionId)
              return (
                <div key={item.questionId} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, padding: `${spacing.sm + 2}px ${spacing.md}px`, borderTop: index > 0 ? `1px solid ${colors.border}` : 'none', backgroundColor: isCorrect ? '#F0FDF4' : '#FFF5F5' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: isCorrect ? colors.successLight : colors.errorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: fontSize.xs, fontWeight: 800, color: isCorrect ? colors.successDark : colors.errorDark }}>{index + 1}</span>
                  </div>
                  {isCorrect ? <CheckCircle size={16} color={colors.success} /> : <XCircle size={16} color={colors.error} />}
                  <span style={{ fontSize: fontSize.sm, color: isCorrect ? colors.successDark : colors.errorDark, flex: 1 }}>
                    {isCorrect ? 'Correcta' : `Incorrecta — correcta: ${question?.correctKey ?? '—'}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}`, flexShrink: 0, padding: `${spacing.md}px ${spacing.xl}px` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', gap: spacing.md }}>
          <button onClick={handleRetry} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
            <RotateCcw size={16} />
            Volver a practicar
          </button>
          <button onClick={handleHome} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: 'transparent', color: colors.primary, borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${colors.primary}`, minHeight: 48 }}>
            <Home size={16} />
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
