import React from 'react'
import { colors, spacing, fontSize, radius } from '../../utils/theme'

interface Props { text: string }

export function PassageText({ text }: Props) {
  return (
    <div style={{ backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, maxHeight: 200, overflowY: 'auto', border: `1px solid ${colors.border}` }}>
      <p style={{ fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 1.7 }}>{text}</p>
    </div>
  )
}
