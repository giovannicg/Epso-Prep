import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useQuizSession } from '../hooks/useQuizSession'
import { useQuizRoute, useAppNavigation } from '../navigation/useTypedNavigation'
import { useQuizStore } from '../store/quizStore'
import { getQuestionById } from '../data/questions'
import { DataTable } from '../components/quiz/DataTable'
import { PassageText } from '../components/quiz/PassageText'
import { colors, spacing, fontSize, radius } from '../utils/theme'
import type { AnswerKey } from '../types'

const CATEGORY_LABELS: Record<string, string> = {
  verbal_reasoning: 'Razonamiento Verbal',
  numerical_reasoning: 'Razonamiento Numérico',
  abstract_reasoning: 'Razonamiento Abstracto',
  situational_judgement: 'Juicio Situacional',
}

export default function QuizScreen() {
  const route = useQuizRoute()
  const navigation = useAppNavigation()
  const { session, currentQuestionId, handleSubmit, handleNext } = useQuizSession()
  const store = useQuizStore()

  const [selectedKey, setSelectedKey] = useState<AnswerKey | null>(null)
  const [submitted, setSubmitted] = useState(false)

  React.useEffect(() => {
    if (!session) {
      const newSession = store.startSession(route.params.category, route.params.language)
      if (!newSession) navigation.goBack()
    }
  }, [])

  React.useEffect(() => {
    setSelectedKey(null)
    setSubmitted(false)
  }, [currentQuestionId])

  if (!session || !currentQuestionId) return null

  const question = getQuestionById(currentQuestionId)
  if (!question) return null

  const attempt = session.attempts[currentQuestionId]

  function onConfirm() {
    if (!selectedKey) return
    handleSubmit(selectedKey)
    setSubmitted(true)
  }

  type Variant = 'default' | 'selected' | 'correct' | 'incorrect'
  function getVariant(key: AnswerKey): Variant {
    if (!submitted) return selectedKey === key ? 'selected' : 'default'
    if (key === question!.correctKey) return 'correct'
    if (key === selectedKey) return 'incorrect'
    return 'default'
  }

  const variantStyle = (variant: Variant): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'flex', alignItems: 'center', gap: spacing.md,
      padding: `${spacing.sm + 4}px ${spacing.md}px`,
      borderRadius: radius.md, border: '1.5px solid',
      marginBottom: spacing.sm, width: '100%', textAlign: 'left',
      cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s',
    }
    switch (variant) {
      case 'selected': return { ...base, backgroundColor: colors.optionSelected, borderColor: colors.primary }
      case 'correct': return { ...base, backgroundColor: colors.optionCorrect, borderColor: colors.success }
      case 'incorrect': return { ...base, backgroundColor: colors.optionIncorrect, borderColor: colors.error }
      default: return { ...base, backgroundColor: colors.optionDefault, borderColor: colors.border }
    }
  }

  const isLastQuestion = session.currentIndex >= session.totalQuestions - 1
  const pct = (session.currentIndex + 1) / session.totalQuestions
  const categoryLabel = CATEGORY_LABELS[route.params.category] ?? route.params.category

  return (
    <div className="quiz-shell">
      {/* Top bar */}
      <div style={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm}px ${spacing.xl}px` }}>
        <button aria-label="Cerrar" onClick={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <X size={18} color={colors.textSecondary} />
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div style={{ flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: colors.primary, borderRadius: 999, width: `${pct * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.primary, whiteSpace: 'nowrap' }}>
            {session.currentIndex + 1} / {session.totalQuestions}
          </span>
        </div>
        <span style={{ fontSize: fontSize.sm, fontWeight: 600, color: colors.textSecondary, whiteSpace: 'nowrap' }}>{categoryLabel}</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        <div className="quiz-body">
          {question.tableData ? <DataTable data={question.tableData} /> : question.passage ? <PassageText text={question.passage} /> : null}

          <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.6, marginBottom: spacing.md }}>{question.question}</p>

          {question.options.map(opt => {
            const variant = getVariant(opt.key)
            return (
              <button key={opt.key} style={variantStyle(variant)} onClick={() => { if (!submitted) setSelectedKey(opt.key) }} disabled={submitted}>
                <span style={{ width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: variant === 'correct' ? colors.success : variant === 'incorrect' ? colors.error : variant === 'selected' ? colors.primary : colors.surfaceAlt, flexShrink: 0 }}>
                  <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: variant === 'default' ? colors.textSecondary : '#fff' }}>{opt.key}</span>
                </span>
                <span style={{ fontSize: fontSize.md, color: colors.textPrimary, flex: 1, lineHeight: 1.5 }}>{opt.text}</span>
              </button>
            )
          })}

          {submitted && attempt && (
            <div style={{ marginTop: spacing.md, padding: spacing.md, borderRadius: radius.md, backgroundColor: attempt.status === 'correct' ? colors.successLight : colors.errorLight, border: `1px solid ${attempt.status === 'correct' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}` }}>
              <p style={{ fontWeight: 700, color: attempt.status === 'correct' ? colors.successDark : colors.errorDark, marginBottom: spacing.xs }}>
                {attempt.status === 'correct' ? '✓ ¡Correcto!' : `✗ Incorrecto — Respuesta correcta: ${question.correctKey}`}
              </p>
              {question.explanation && <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 1.6 }}>{question.explanation}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}`, flexShrink: 0, padding: `${spacing.md}px ${spacing.xl}px` }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          {!submitted ? (
            <button onClick={onConfirm} disabled={!selectedKey} style={{ width: '100%', backgroundColor: selectedKey ? colors.primary : colors.disabled, color: selectedKey ? '#fff' : colors.disabledText, borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: selectedKey ? 'pointer' : 'default', minHeight: 48 }}>
              Confirmar respuesta
            </button>
          ) : (
            <button onClick={handleNext} style={{ width: '100%', backgroundColor: colors.primary, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
              {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
