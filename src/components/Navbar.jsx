import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, LayoutDashboard, GraduationCap, FolderKanban, CalendarDays,
  ClipboardList, BookOpen, Info, Menu, X, Sun, Moon, Bell, User, Truck,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { fmtDate } from '../lib/store'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/learning', label: 'Learning', icon: GraduationCap },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/schedule', label: 'Daily Schedule', icon: CalendarDays },
  { to: '/activities', label: 'Activities', icon: ClipboardList },
  { to: '/resources', label: 'Resources', icon: BookOpen },
  { to: '/about', label: 'About', icon: Info },
]

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return (
    <div className="hidden flex-col leading-tight lg:flex">
      <span className="font-mono text-sm font-bold text-ink-800 dark:text-ink-100">{time}</span>
      <span className="text-[11px] text-ink-500 dark:text-ink-400">{fmtDate(now.toISOString().slice(0, 10))}</span>
    </div>
  )
}

function Notifications() {
  const { notifications, setNotifications } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const markAll = () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-pink text-[10px] font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-ink-200 bg-white shadow-lift dark:border-ink-700 dark:bg-ink-900">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-800">
            <h4 className="text-sm font-bold">Notifications</h4>
            {unread > 0 && <button onClick={markAll} className="text-xs font-semibold text-brand-blue hover:underline">Mark all read</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-ink-500">No notifications.</p>
            ) : notifications.map((n) => (
              <div key={n.id} className={`border-b border-ink-100 px-4 py-3 last:border-0 dark:border-ink-800 ${n.read ? 'opacity-60' : ''}`}>
                <p className="text-sm text-ink-700 dark:text-ink-200">{n.text}</p>
                <p className="mt-0.5 text-xs text-ink-400">{fmtDate(n.time)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileMenu() {
  const { profile, setProfile, notify } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(profile)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const save = () => {
    if (!form.name.trim()) { notify('Name cannot be empty', 'error'); return }
    setProfile({ name: form.name.trim(), role: form.role.trim() || 'Learner' })
    setEditing(false); setOpen(false)
    notify('Profile updated')
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-xl p-1.5 pr-3 transition hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Profile">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple text-sm font-bold text-white">
          {profile.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold md:block">{profile.name.split(' ')[0]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-ink-200 bg-white p-3 shadow-lift dark:border-ink-700 dark:bg-ink-900">
          {editing ? (
            <div className="space-y-2">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
              <input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" />
              <div className="flex gap-2 pt-1">
                <button className="btn-primary flex-1" onClick={save}>Save</button>
                <button className="btn-ghost" onClick={() => { setEditing(false); setOpen(false) }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3 dark:bg-ink-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-purple font-bold text-white">{profile.name.charAt(0).toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{profile.name}</p>
                  <p className="truncate text-xs text-ink-500">{profile.role}</p>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                <User className="h-4 w-4" /> Edit profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useApp()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-ink-200/70 bg-white/90 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue text-white shadow-sm">
            <Truck className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block text-base font-extrabold tracking-tight text-ink-900 dark:text-white">LOGISTIK <span className="text-brand-pink">UPL</span></span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-ink-500 dark:text-ink-400">Learning Portal</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                  isActive
                    ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-pink/20'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white'
                }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Clock />
          <button onClick={toggleTheme} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Notifications />
          <ProfileMenu />
          <button onClick={() => setOpen((o) => !o)} className="rounded-xl p-2 text-ink-600 transition hover:bg-ink-100 lg:hidden dark:text-ink-300 dark:hover:bg-ink-800" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-ink-100 bg-white px-4 pb-4 pt-2 dark:border-ink-800 dark:bg-ink-950 lg:hidden">
          <div className="grid grid-cols-2 gap-1.5">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to} to={to} end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-pink/20'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
