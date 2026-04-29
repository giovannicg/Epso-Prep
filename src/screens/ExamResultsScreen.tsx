import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'

const SECTION_LABELS: Record<string, string> = {
  verbal_reasoning: 'Razonamiento Verbal',
  numerical_reasoning: 'Razonamiento Numérico',
  eu_knowledge: 'Conocimiento UE',
}

export default function ExamResultsScreen() {
  const navigate = useNavigate()
  const session = useExamStore(s => s.session)
  const clearExam = useExamStore(s => s.clearExam)

  if (!session) {
    return (
      <div className="quiz-shell" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.md }}>No hay resultados disponibles.</p>
        <button onClick={() => navigate('/')} style={{ backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px ${spacing.xl}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer' }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  const sectionResults = session.sections.map(section => {
    const total = section.questionIds.length
    const answered = Object.keys(section.attempts).length
    const correct = Object.values(section.attempts).filter(a => a.status === 'correct').length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    return { category: section.category, correct, total, skipped: total - answered, percentage }
  })

  const totalCorrect = sectionResults.reduce((sum, s) => sum + s.correct, 0)
  const totalQuestions = sectionResults.reduce((sum, s) => sum + s.total, 0)
  const totalPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  const scoreColor = totalPct >= 70 ? colors.success : totalPct >= 50 ? colors.primaryDark : colors.error
  const scoreLabel = totalPct >= 70 ? '¡Excelente resultado!' : totalPct >= 50 ? 'Buen trabajo' : 'Sigue practicando'

  function handleHome() { clearExam(); navigate('/') }
  function handleRetry() { clearExam(); navigate(`/exam/${session!.language}`, { replace: true }) }

  return (
    <div className="quiz-shell">
      <div style={{ backgroundColor: colors.euBlue, padding: `${spacing.lg}px ${spacing.xl}px`, flexShrink: 0, textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: spacing.sm, justifyContent: 'center' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ fontSize: 10, color: colors.euGold }}>★</span>
          ))}
        </div>
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
          Examen completado
        </p>
        <h1 style={{ fontSize: fontSize.xxl, fontWeight: 800, color: '#fff' }}>Resultados</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        <div className="quiz-body">
          {/* Overall score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xl, padding: `${spacing.xl}px`, backgroundColor: colors.surface, borderRadius: radius.lg, border: `1px solid ${colors.border}`, marginBottom: spacing.lg, ...shadow.md }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, border: `6px solid ${scoreColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: `${scoreColor}18` }}>
              <span style={{ fontSize: fontSize.xxxl, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{totalPct}%</span>
              <span style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>total</span>
            </div>
            <div>
              <p style={{ fontSize: fontSize.xl, fontWeight: 700, color: scoreColor, marginBottom: spacing.xs }}>{scoreLabel}</p>
              <p style={{ fontSize: fontSize.md, color: colors.textSecondary, marginBottom: spacing.sm }}>
                {totalCorrect} de {totalQuestions} respuestas correctas
              </p>
              <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                <div style={{ backgroundColor: colors.successLight, borderRadius: radius.full, padding: `4px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle size={13} color={colors.successDark} />
                  <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.successDark }}>{totalCorrect} correctas</span>
                </div>
                <div style={{ backgroundColor: colors.errorLight, borderRadius: radius.full, padding: `4px ${spacing.sm}px`, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <XCircle size={13} color={colors.errorDark} />
                  <span style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.errorDark }}>{totalQuestions - totalCorrect} incorrectas/omitidas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Per-section breakdown */}
          <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}>
            Desglose por sección
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {sectionResults.map(({ category, correct, total, skipped, percentage }) => {
              const pctColor = percentage >= 70 ? colors.success : percentage >= 50 ? colors.primaryDark : colors.error
              return (
                <div key={category} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, border: `1px solid ${colors.border}`, ...shadow.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                    <p style={{ fontSize: fontSize.md, fontWeight: 700, color: colors.textPrimary }}>{SECTION_LABELS[category] ?? category}</p>
                    <span style={{ fontSize: fontSize.xl, fontWeight: 800, color: pctColor }}>{percentage}%</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden', marginBottom: spacing.sm }}>
                    <div style={{ height: '100%', backgroundColor: pctColor, borderRadius: 999, width: `${percentage}%`, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>{correct}/{total} correctas</span>
                    {skipped > 0 && <span style={{ fontSize: fontSize.sm, color: colors.textMuted }}>{skipped} omitidas</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}`, flexShrink: 0, padding: `${spacing.md}px ${spacing.xl}px` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', gap: spacing.md }}>
          <button onClick={handleRetry} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.euBlue, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
            <RotateCcw size={16} />
            Nuevo examen
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
