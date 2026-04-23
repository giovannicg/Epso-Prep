import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useQuizSession } from '../hooks/useQuizSession'
import { useQuizRoute, useAppNavigation } from '../navigation/useTypedNavigation'
import { useQuizStore } from '../store/quizStore'
import { getQuestionById } from '../data/questions'
import { DataTable } from '../components/quiz/DataTable'
import { PassageText } from '../components/quiz/PassageText'
import { colors, spacing, fontSize } from '../utils/theme'
import type { AnswerKey } from '../types'

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
    const base: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: 14, border: '1.5px solid', marginBottom: spacing.sm, width: '100%', textAlign: 'left', cursor: submitted ? 'default' : 'pointer', transition: 'all 0.15s' }
    switch (variant) {
      case 'selected': return { ...base, backgroundColor: colors.optionSelected, borderColor: colors.primary }
      case 'correct': return { ...base, backgroundColor: colors.optionCorrect, borderColor: colors.success }
      case 'incorrect': return { ...base, backgroundColor: colors.optionIncorrect, borderColor: colors.error }
      default: return { ...base, backgroundColor: colors.optionDefault, borderColor: colors.border }
    }
  }

  const isLastQuestion = session.currentIndex >= session.totalQuestions - 1
  const pct = (session.currentIndex + 1) / session.totalQuestions

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', backgroundColor: colors.background }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.sm}px ${spacing.md}px`, borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.surface, flexShrink: 0 }}>
        <button onClick={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} color={colors.textSecondary} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary }}>
            {route.params.category === 'verbal_reasoning' ? 'Razonamiento Verbal' : 'Razonamiento Numérico'}
          </p>
          <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 1 }}>
            {session.currentIndex + 1} de {session.totalQuestions}
          </p>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: spacing.md }}>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
          <div style={{ flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: colors.primary, borderRadius: 999, width: `${pct * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.primary, minWidth: 44, textAlign: 'right' }}>
            {session.currentIndex + 1} / {session.totalQuestions}
          </span>
        </div>

        {question.tableData ? <DataTable data={question.tableData} /> : question.passage ? <PassageText text={question.passage} /> : null}

        <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.5, marginBottom: spacing.md }}>{question.question}</p>

        {question.options.map(opt => {
          const variant = getVariant(opt.key)
          return (
            <button key={opt.key} style={variantStyle(variant)} onClick={() => { if (!submitted) setSelectedKey(opt.key) }} disabled={submitted}>
              <span style={{ width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: variant === 'correct' ? colors.success : variant === 'incorrect' ? colors.error : variant === 'selected' ? colors.primary : colors.surfaceAlt, flexShrink: 0 }}>
                <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: variant === 'default' ? colors.textSecondary : '#fff' }}>{opt.key}</span>
              </span>
              <span style={{ fontSize: fontSize.md, color: colors.textPrimary, flex: 1 }}>{opt.text}</span>
            </button>
          )
        })}

        {submitted && attempt && (
          <div style={{ marginTop: spacing.md, padding: spacing.md, borderRadius: 14, backgroundColor: attempt.status === 'correct' ? colors.successLight : colors.errorLight, border: `1px solid ${attempt.status === 'correct' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}` }}>
            <p style={{ fontWeight: 700, color: attempt.status === 'correct' ? colors.successDark : colors.errorDark, marginBottom: spacing.xs }}>
              {attempt.status === 'correct' ? '✓ ¡Correcto!' : `✗ Incorrecto — Respuesta: ${question.correctKey}`}
            </p>
            {question.explanation && <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 1.5 }}>{question.explanation}</p>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: spacing.md, paddingBottom: spacing.lg, backgroundColor: colors.surface, borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
        {!submitted ? (
          <button onClick={onConfirm} disabled={!selectedKey} style={{ width: '100%', backgroundColor: selectedKey ? colors.primary : colors.disabled, color: selectedKey ? '#fff' : colors.disabledText, borderRadius: 32, padding: `${spacing.md}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: selectedKey ? 'pointer' : 'default', minHeight: 52 }}>
            Confirmar respuesta
          </button>
        ) : (
          <button onClick={handleNext} style={{ width: '100%', backgroundColor: colors.primary, color: '#fff', borderRadius: 32, padding: `${spacing.md}px`, fontSize: fontSize.lg, fontWeight: 700, cursor: 'pointer', minHeight: 52 }}>
            {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
          </button>
        )}
      </div>
    </div>
  )
}
