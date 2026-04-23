import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Home, GraduationCap, BarChart2 } from 'lucide-react'
import { colors, fontSize } from '../../utils/theme'

const NAV_LINKS = [
  { to: '/', end: true, icon: <Home size={18} />, label: 'Inicio' },
  { to: '/practice', end: false, icon: <GraduationCap size={18} />, label: 'Práctica' },
  { to: '/progress', end: false, icon: <BarChart2 size={18} />, label: 'Progreso' },
]

export default function Layout() {
  return (
    <div className="app-shell">
      <nav className="sidebar-nav">
        {/* Logo */}
        <div className="sidebar-logo" style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, backgroundColor: colors.euBlue, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: colors.euGold, fontSize: 14, lineHeight: 1 }}>★</span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: fontSize.md, color: colors.textPrimary, lineHeight: 1.2 }}>EPSO Prep</p>
              <p style={{ fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 }}>EU Exam Training</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="sidebar-links" style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', flex: 1 }}>
          {NAV_LINKS.map(({ to, end, icon, label }) => (
            <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div
                  className={`sidebar-link${isActive ? ' active' : ''}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 20px',
                    fontSize: fontSize.sm,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? colors.primary : colors.textSecondary,
                    borderLeft: `3px solid ${isActive ? colors.primary : 'transparent'}`,
                    backgroundColor: isActive ? colors.primarySurface : 'transparent',
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {icon}
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}` }}>
          <p style={{ fontSize: fontSize.xs, color: colors.textMuted, lineHeight: 1.5 }}>
            Preparación para exámenes EPSO · Nivel AST/ES
          </p>
        </div>
      </nav>

      <main className="main-area">
        <Outlet />
      </main>
    </div>
  )
}
