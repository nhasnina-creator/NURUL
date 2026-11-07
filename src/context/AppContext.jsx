import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { LS_KEYS, seedData, uid } from '../lib/store'

const AppContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => load(LS_KEYS.theme, 'light'))
  const [toasts, setToasts] = useState([])

  const [modules, setModules] = useState(() => load(LS_KEYS.modules, seedData.modules))
  const [projects, setProjects] = useState(() => load(LS_KEYS.projects, seedData.projects))
  const [schedules, setSchedules] = useState(() => load(LS_KEYS.schedules, seedData.schedules))
  const [activities, setActivities] = useState(() => load(LS_KEYS.activities, seedData.activities))
  const [resources, setResources] = useState(() => load(LS_KEYS.resources, seedData.resources))
  const [announcements, setAnnouncements] = useState(() => load(LS_KEYS.announcements, seedData.announcements))
  const [notifications, setNotifications] = useState(() => load(LS_KEYS.notifications, seedData.notifications))
  const [profile, setProfile] = useState(() => load(LS_KEYS.profile, { name: 'Nurul Aisyah', role: 'Logistics Learner' }))

  // persist
  useEffect(() => { localStorage.setItem(LS_KEYS.theme, JSON.stringify(theme)) }, [theme])
  useEffect(() => { localStorage.setItem(LS_KEYS.modules, JSON.stringify(modules)) }, [modules])
  useEffect(() => { localStorage.setItem(LS_KEYS.projects, JSON.stringify(projects)) }, [projects])
  useEffect(() => { localStorage.setItem(LS_KEYS.schedules, JSON.stringify(schedules)) }, [schedules])
  useEffect(() => { localStorage.setItem(LS_KEYS.activities, JSON.stringify(activities)) }, [activities])
  useEffect(() => { localStorage.setItem(LS_KEYS.resources, JSON.stringify(resources)) }, [resources])
  useEffect(() => { localStorage.setItem(LS_KEYS.announcements, JSON.stringify(announcements)) }, [announcements])
  useEffect(() => { localStorage.setItem(LS_KEYS.notifications, JSON.stringify(notifications)) }, [notifications])
  useEffect(() => { localStorage.setItem(LS_KEYS.profile, JSON.stringify(profile)) }, [profile])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const notify = useCallback((text, type = 'success') => {
    const id = uid()
    setToasts((t) => [...t, { id, text, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  // generic CRUD factory
  const makeCrud = (list, setList) => ({
    add: (item) => {
      const rec = { id: uid(), createdAt: new Date().toISOString(), ...item }
      setList((l) => [rec, ...l])
      return rec
    },
    update: (id, patch) =>
      setList((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    remove: (id) => setList((l) => l.filter((x) => x.id !== id)),
  })

  const api = useMemo(() => ({
    theme, toggleTheme, notify, toasts,
    modules, setModules,
    projects, setProjects,
    schedules, setSchedules,
    activities, setActivities,
    resources, setResources,
    announcements, setAnnouncements,
    notifications, setNotifications,
    profile, setProfile,
    moduleCrud: makeCrud(modules, setModules),
    projectCrud: makeCrud(projects, setProjects),
    scheduleCrud: makeCrud(schedules, setSchedules),
    activityCrud: makeCrud(activities, setActivities),
    resourceCrud: makeCrud(resources, setResources),
  }), [theme, toggleTheme, notify, toasts, modules, projects, schedules, activities, resources, announcements, notifications, profile])

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
