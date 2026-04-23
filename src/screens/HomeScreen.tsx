import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Shapes, Users, Lock, ChevronRight } from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { colors, spacing, fontSize, radius, shadow } from '../utils/theme'
import type { ExamCategory } from '../types'

const CATEGORIES: { category: ExamCategory; title: string; description: string; icon: React.ReactNode; locked: boolean }[] = [
  { category: 'verbal_reasoning', title: 'Razonamiento Verbal', description: 'Comprensión lectora y análisis textual', icon: <BookOpen size={24} color={colors.primary} />, locked: false },
  { category: 'numerical_reasoning', title: 'Razonamiento Numérico', description: 'Tablas, gráficos y cálculos estadísticos', icon: <Calculator size={24} color={colors.primary} />, locked: false },
  { category: 'abstract_reasoning', title: 'Razonamiento Abstracto', description: 'Patrones y secuencias lógicas', icon: <Shapes size={24} color={colors.textMuted} />, locked: true },
  { category: 'situational_judgement', title: 'Juicio Situacional', description: 'Toma de decisiones profesionales', icon: <Users size={24} color={colors.textMuted} />, locked: true },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const statsByCategory = useProgressStore(s => s.statsByCategory)

  return (
    <div style={{ flex: 1, backgroundColor: colors.background }}>
      <div style={{ backgroundColor: colors.euBlue, padding: spacing.lg, paddingTop: spacing.xl }}>
        <div style={{ display: 'flex', gap: spacing.xs, marginBottom: spacing.sm }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ fontSize: 10 }}>★</span>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm, marginBottom: 4 }}>Preparación EPSO</p>
        <h1 style={{ color: '#fff', fontSize: fontSize.xxxl, fontWeight: 800 }}>EU Exam Prep</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: fontSize.sm, marginTop: spacing.xs }}>Practica para los exámenes de selección de la UE</p>
      </div>

      <div style={{ padding: spacing.md }}>
        <p style={{ fontSize: fontSize.xs, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.sm }}>Categorías</p>
        {CATEGORIES.map(({ category, title, description, icon, locked }) => {
          const stats = statsByCategory[category]
          const lastScore = stats.sessionsCompleted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : null
          return (
            <button
              key={category}
              onClick={() => !locked && navigate(`/quiz/${category}/es`)}
              disabled={locked}
              style={{
                display: 'flex', alignItems: 'center', gap: spacing.md,
                backgroundColor: colors.surface, borderRadius: radius.lg,
                padding: spacing.md, marginBottom: spacing.sm, width: '100%', textAlign: 'left',
                border: `1px solid ${colors.border}`, opacity: locked ? 0.45 : 1, cursor: locked ? 'default' : 'pointer',
                ...(!locked ? shadow.sm : {}),
              }}
            >
              <div style={{ width: 50, height: 50, borderRadius: radius.md, backgroundColor: locked ? colors.surfaceAlt : colors.primarySurface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${locked ? colors.border : 'rgba(3,105,161,0.12)'}`, flexShrink: 0 }}>
                {locked ? <Lock size={24} color={colors.textMuted} /> : icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: fontSize.lg, fontWeight: 700, color: locked ? colors.textMuted : colors.textPrimary, marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{description}</p>
              </div>
              {!locked && lastScore != null ? (
                <div style={{ backgroundColor: colors.primarySurface, borderRadius: radius.full, padding: '4px 10px', border: '1px solid rgba(3,105,161,0.2)', flexShrink: 0 }}>
                  <span style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.primary }}>{lastScore}%</span>
                </div>
              ) : !locked ? (
                <ChevronRight size={20} color={colors.textMuted} />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
