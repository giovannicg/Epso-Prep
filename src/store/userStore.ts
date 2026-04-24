import { create } from 'zustand'
import type { Language } from '../types'

export type UserId = 'giova' | 'vicky'

export const USER_PROFILES: Record<UserId, { name: string; initials: string; color: string; bg: string }> = {
  giova: { name: 'Giova', initials: 'GI', color: '#0369A1', bg: '#E0F2FE' },
  vicky: { name: 'Vicky', initials: 'VI', color: '#7C3AED', bg: '#EDE9FE' },
}

const STORAGE_KEY = 'epso_active_user'
const LANG_KEY = 'epso_language'

interface UserStore {
  activeUser: UserId | null
  preferredLanguage: Language
  setActiveUser: (user: UserId) => void
  clearUser: () => void
  setPreferredLanguage: (lang: Language) => void
}

export const useUserStore = create<UserStore>((set) => ({
  activeUser: (localStorage.getItem(STORAGE_KEY) as UserId | null) ?? null,
  preferredLanguage: (localStorage.getItem(LANG_KEY) as Language | null) ?? 'es',
  setActiveUser: (user) => {
    localStorage.setItem(STORAGE_KEY, user)
    set({ activeUser: user })
  },
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ activeUser: null })
  },
  setPreferredLanguage: (lang) => {
    localStorage.setItem(LANG_KEY, lang)
    set({ preferredLanguage: lang })
  },
}))
