import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Shapes, Users, Lock, ChevronRight } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { UserPickerModal } from '../components/quiz/UserPickerModal'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'
import type { ExamCategory } from '../types'

const CATEGORIES: { category: ExamCategory; title: string; description: string; icon: React.ReactNode; locked: boolean }[] = [
  { category: 'verbal_reasoning', title: 'Razonamiento Verbal', description: 'Comprensión lectora y análisis textual', icon: <BookOpen size={22} color={colors.primary} />, locked: false },
  { category: 'numerical_reasoning', title: 'Razonamiento Numérico', description: 'Tablas, gráficos y cálculos estadísticos', icon: <Calculator size={22} color={colors.primary} />, locked: false },
  { category: 'abstract_reasoning', title: 'Razonamiento Abstracto', description: 'Patrones y secuencias lógicas', icon: <Shapes size={22} color={colors.textMuted} />, locked: true },
  { category: 'situational_judgement', title: 'Juicio Situacional', description: 'Toma de decisiones profesionales', icon: <Users size={22} color={colors.textMuted} />, locked: true },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const statsByCategory = useProgressStore(s => s.statsByCategory)
  const [showPicker, setShowPicker] = useState(false)
  const pendingNav = useRef<string | null>(null)

  function startQuiz(path: string) {
    pendingNav.current = path
    setShowPicker(true)
  }

  function handleUserSelected() {
    setShowPicker(false)
    if (pendingNav.current) navigate(pendingNav.current)
  }

  return (
    <div>
      {showPicker && (
        <UserPickerModal
          onSelect={handleUserSelected}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Hero banner */}
      <div style={{ backgroundColor: colors.euBlue, padding: `${spacing.xl}px ${spacing.xl * 2}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: spacing.sm }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ fontSize: 12, color: colors.euGold }}>★</span>
            ))}
          </div>
          <h1 style={{ color: '#fff', fontSize: fontSize.xxxl, fontWeight: 800, marginBottom: spacing.xs }}>EU Exam Prep</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: fontSize.md }}>Preparación EPSO · Nivel AST/ES</p>
        </div>
        <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          {[{ label: 'Categorías', value: '4' }, { label: 'Preguntas', value: '40+' }, { label: 'Idiomas', value: 'ES' }].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md, padding: `${spacing.sm}px ${spacing.md}px`, border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ fontSize: fontSize.xl, fontWeight: 800, color: '#fff' }}>{value}</p>
              <p style={{ fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="content-wrap">
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.md }}>Categorías de examen</p>
        <div className="category-grid">
          {CATEGORIES.map(({ category, title, description, icon, locked }) => {
            const stats = statsByCategory[category]
            const lastScore = stats.sessionsCompleted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : null
            return (
              <button
                key={category}
                onClick={() => !locked && startQuiz(`/quiz/${category}/es`)}
                disabled={locked}
                style={{ display: 'flex', flexDirection: 'column', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, textAlign: 'left', border: `1px solid ${colors.border}`, opacity: locked ? 0.45 : 1, cursor: locked ? 'default' : 'pointer', ...(!locked ? shadow.sm : {}), transition: 'box-shadow 0.15s, border-color 0.15s', width: '100%' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.md }}>
                  <div style={{ width: 48, height: 48, borderRadius: radius.md, backgroundColor: locked ? colors.surfaceAlt : colors.primarySurface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${locked ? colors.border : 'rgba(3,105,161,0.12)'}`, flexShrink: 0 }}>
                    {locked ? <Lock size={22} color={colors.textMuted} /> : icon}
                  </div>
                  {!locked && lastScore != null && (
                    <div style={{ backgroundColor: colors.primarySurface, borderRadius: radius.full, padding: '4px 12px', border: '1px solid rgba(3,105,161,0.2)' }}>
                      <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.primary }}>{lastScore}%</span>
                    </div>
                  )}
                  {!locked && lastScore == null && <ChevronRight size={18} color={colors.textMuted} />}
                </div>
                <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: locked ? colors.textMuted : colors.textPrimary, marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 1.5 }}>{description}</p>
                {!locked && (
                  <div style={{ marginTop: spacing.md, display: 'flex', gap: spacing.md }}>
                    <span style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{stats.sessionsCompleted} sesiones</span>
                    <span style={{ fontSize: fontSize.xs, color: colors.textMuted }}>{stats.totalAttempted} preguntas</span>
                  </div>
                )}
                {locked && <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: spacing.sm }}>Próximamente</p>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
