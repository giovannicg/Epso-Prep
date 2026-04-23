import React from 'react'
import { colors, spacing, fontSize, radius } from '../../utils/theme'
import type { TableData } from '../../types'

interface Props { data: TableData }

export function DataTable({ data }: Props) {
  return (
    <div style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.border}`, marginBottom: spacing.md, overflow: 'hidden' }}>
      {data.title && (
        <p style={{ fontSize: fontSize.sm, fontWeight: 700, color: colors.textPrimary, padding: `${spacing.sm}px ${spacing.md}px`, borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.primarySurface }}>{data.title}</p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: colors.euBlue }}>
              {data.headers.map((h, i) => (
                <th key={i} style={{ padding: `${spacing.xs}px ${spacing.sm}px`, fontSize: fontSize.sm, fontWeight: 700, color: '#fff', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} style={{ backgroundColor: ri % 2 === 0 ? colors.surface : colors.surfaceAlt }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: `${spacing.xs}px ${spacing.sm}px`, fontSize: fontSize.sm, color: colors.textPrimary, whiteSpace: 'nowrap' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
