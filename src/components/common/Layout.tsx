import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Home, GraduationCap, BarChart2 } from 'lucide-react'
import { colors, spacing, fontSize } from '../../utils/theme'

export default function Layout() {
  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${spacing.xs}px`,
    gap: 3,
    minHeight: 56,
    color: isActive ? colors.primary : colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: isActive ? 700 : 400,
    transition: 'color 0.15s',
    borderTop: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 480, margin: '0 auto', backgroundColor: colors.background }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </div>
      <nav style={{ display: 'flex', borderTop: `1px solid ${colors.border}`, backgroundColor: colors.surface, flexShrink: 0 }}>
        <NavLink to="/" end style={{ flex: 1, textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={tabStyle(isActive)}>
              <Home size={20} />
              <span>Inicio</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/practice" style={{ flex: 1, textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={tabStyle(isActive)}>
              <GraduationCap size={20} />
              <span>Práctica</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/progress" style={{ flex: 1, textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={tabStyle(isActive)}>
              <BarChart2 size={20} />
              <span>Progreso</span>
            </div>
          )}
        </NavLink>
      </nav>
    </div>
  )
}
