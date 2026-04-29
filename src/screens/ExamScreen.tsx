import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Clock } from 'lucide-react'
import { useExamStore } from '../store/examStore'
import { getQuestionById } from '../data/questions'
import { DataTable } from '../components/quiz/DataTable'
import { PassageText } from '../components/quiz/PassageText'
import { QuizImageSet } from '../components/quiz/QuizImageSet'
import { colors, spacing, fontSize, radius } from '../utils/theme'
import type { AnswerKey, Language } from '../types'

const SECTION_LABELS: Record<string, string> = {
  verbal_reasoning: 'Razonamiento Verbal',
  numerical_reasoning: 'Razonamiento Numérico',
  eu_knowledge: 'Conocimiento UE',
}

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

type Variant = 'default' | 'selected' | 'correct' | 'incorrect'

function variantStyle(variant: Variant): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: spacing.md,
    padding: `${spacing.sm + 4}px ${spacing.md}px`,
    borderRadius: radius.md, border: '1.5px solid',
    marginBottom: spacing.sm, width: '100%', textAlign: 'left',
    cursor: variant === 'default' ? 'pointer' : 'default', transition: 'all 0.15s',
  }
  switch (variant) {
    case 'selected': return { ...base, backgroundColor: colors.optionSelected, borderColor: colors.primary }
    case 'correct': return { ...base, backgroundColor: colors.optionCorrect, borderColor: colors.success }
    case 'incorrect': return { ...base, backgroundColor: colors.optionIncorrect, borderColor: colors.error }
    default: return { ...base, backgroundColor: colors.optionDefault, borderColor: colors.border }
  }
}

export default function ExamScreen() {
  const navigate = useNavigate()
  const { language } = useParams<{ language: string }>()

  const session = useExamStore(s => s.session)
  const startExam = useExamStore(s => s.startExam)
  const submitAnswer = useExamStore(s => s.submitAnswer)
  const advanceQuestion = useExamStore(s => s.advanceQuestion)
  const completeSection = useExamStore(s => s.completeSection)
  const clearExam = useExamStore(s => s.clearExam)

  const [selectedKey, setSelectedKey] = useState<AnswerKey | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [, setTick] = useState(0)

  const completeSectionRef = useRef(completeSection)
  completeSectionRef.current = completeSection

  useEffect(() => {
    if (!session) startExam(language as Language)
  }, [])

  // Tick every second; auto-advance section when timer expires
  useEffect(() => {
    const interval = setInterval(() => {
      const s = useExamStore.getState().session
      if (!s || s.completedAt) return
      const section = s.sections[s.currentSectionIndex]
      if (!section || section.completedAt !== null || section.startedAt === 0) return
      const elapsed = Math.floor((Date.now() - section.startedAt) / 1000)
      if (elapsed >= section.timeLimitSeconds) {
        completeSectionRef.current()
      } else {
        setTick(n => n + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (session?.completedAt) navigate('/exam-results', { replace: true })
  }, [session?.completedAt])

  const currentSectionIndex = session?.currentSectionIndex ?? 0
  const currentSection = session?.sections[currentSectionIndex]
  const currentQuestionId = currentSection?.questionIds[currentSection.currentIndex] ?? null

  useEffect(() => {
    setSelectedKey(null)
    setSubmitted(false)
  }, [currentQuestionId])

  if (!session || !currentSection || !currentQuestionId || session.completedAt) return null

  const question = getQuestionById(currentQuestionId)
  if (!question) return null

  const elapsed = currentSection.startedAt > 0
    ? Math.floor((Date.now() - currentSection.startedAt) / 1000)
    : 0
  const timeRemaining = Math.max(0, currentSection.timeLimitSeconds - elapsed)
  const timerPct = timeRemaining / currentSection.timeLimitSeconds
  const timerColor = timerPct > 0.4 ? '#fff' : timerPct > 0.15 ? colors.euGold : '#FF6B6B'

  const attempt = currentSection.attempts[currentQuestionId]
  const isLastQuestion = currentSection.currentIndex >= currentSection.questionIds.length - 1
  const isLastSection = currentSectionIndex >= session.sections.length - 1
  const questionPct = (currentSection.currentIndex + 1) / currentSection.questionIds.length

  function onConfirm() {
    if (!selectedKey) return
    submitAnswer(currentQuestionId!, selectedKey)
    setSubmitted(true)
  }

  function onNext() {
    if (isLastQuestion) completeSection()
    else advanceQuestion()
  }

  function getVariant(key: AnswerKey): Variant {
    if (!submitted) return selectedKey === key ? 'selected' : 'default'
    if (key === question!.correctKey) return 'correct'
    if (key === selectedKey) return 'incorrect'
    return 'default'
  }

  const nextLabel = isLastQuestion
    ? (isLastSection ? 'Ver resultados' : 'Siguiente sección →')
    : 'Siguiente pregunta'

  return (
    <div className="quiz-shell">
      {/* Header */}
      <div style={{ backgroundColor: colors.euBlue, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.sm}px ${spacing.xl}px`, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <button
            aria-label="Abandonar examen"
            onClick={() => { clearExam(); navigate('/') }}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
          >
            <X size={16} color="#fff" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: fontSize.xs, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Examen · Sección {currentSectionIndex + 1} de {session.sections.length}
            </p>
            <p style={{ fontSize: fontSize.md, color: '#fff', fontWeight: 700 }}>
              {SECTION_LABELS[currentSection.category] ?? currentSection.category}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: radius.md, padding: '6px 14px', flexShrink: 0 }}>
            <Clock size={13} color={timerColor} />
            <span style={{ fontSize: fontSize.md, fontWeight: 800, color: timerColor, fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5 }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.xs + 2}px ${spacing.xl}px ${spacing.sm}px` }}>
          <div style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: colors.euGold, borderRadius: 999, width: `${questionPct * 100}%`, transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
            {currentSection.currentIndex + 1} / {currentSection.questionIds.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: spacing.xl, paddingBottom: spacing.xl }}>
        <div className="quiz-body">
          {question.imageUrls?.length
            ? <QuizImageSet imageUrls={question.imageUrls} />
            : question.tableData
              ? <DataTable data={question.tableData} />
              : question.passage
                ? <PassageText text={question.passage} />
                : null}

          <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.6, marginBottom: spacing.md }}>
            {question.question}
          </p>

          {question.options.map(opt => {
            const variant = getVariant(opt.key)
            return (
              <button key={opt.key} style={variantStyle(variant)} onClick={() => { if (!submitted) setSelectedKey(opt.key) }} disabled={submitted}>
                <span style={{ width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: variant === 'correct' ? colors.success : variant === 'incorrect' ? colors.error : variant === 'selected' ? colors.primary : colors.surfaceAlt }}>
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
              {question.explanation && (
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 1.6 }}>{question.explanation}</p>
              )}
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
            <button onClick={onNext} style={{ width: '100%', backgroundColor: colors.euBlue, color: '#fff', borderRadius: radius.xl, padding: `${spacing.sm + 4}px`, fontSize: fontSize.md, fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
