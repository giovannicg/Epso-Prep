import React from 'react'
import { colors, spacing, radius } from '../../utils/theme'

interface Props {
  imageUrls: string[]
}

export function QuizImageSet({ imageUrls }: Props) {
  return (
    <div style={{ marginBottom: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
      {imageUrls.map((url, i) => (
        <div key={i} style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
          <img
            src={url}
            alt={`Tabla/Gráfico ${i + 1}`}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      ))}
    </div>
  )
}
