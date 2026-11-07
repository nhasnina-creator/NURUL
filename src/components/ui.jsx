import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

// ---------- Toasts ----------
export function Toasts() {
  const { toasts } = useApp()
  const styles = {
    success: 'border-brand-green/40 bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100',
    error: 'border-red-400/50 bg-white text-red-700 dark:bg-ink-800 dark:text-red-300',
    info: 'border-brand-blue/40 bg-white text-ink-800 dark:bg-ink-800 dark:text-ink-100',
  }
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-brand-green" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-brand-blue" />,
  }
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lift transition ${styles[t.type] || styles.info}`}>
          {icons[t.type] || icons.info}
          <p className="text-sm font-medium">{t.text}</p>
        </div>
      ))}
    </div>
  )
}

// ---------- Modal ----------
export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative m-0 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lift dark:bg-ink-900 sm:m-4 sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ---------- Confirm dialog ----------
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message = 'This action cannot be undone.', confirmLabel = 'Delete' }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-5 text-sm text-ink-600 dark:text-ink-300">{message}</p>
      <div className="flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

// ---------- Badge ----------
const badgeColors = {
  pink: 'bg-brand-pink/10 text-brand-pink',
  green: 'bg-brand-green/15 text-emerald-700 dark:text-brand-green',
  purple: 'bg-brand-purple/10 text-brand-purple dark:text-violet-300',
  blue: 'bg-brand-blue/10 text-brand-blue',
  gray: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export function Badge({ color = 'gray', children }) {
  return <span className={`badge ${badgeColors[color] || badgeColors.gray}`}>{children}</span>
}

export const statusColor = (s) => ({
  'Not Started': 'gray', 'In Progress': 'blue', 'Completed': 'green', 'Pending': 'amber',
  'Ongoing': 'purple', 'Planned': 'blue', 'Low': 'gray', 'Medium': 'amber', 'High': 'red',
}[s] || 'gray')

// ---------- Progress bar ----------
export function ProgressBar({ value = 0, color = 'bg-brand-pink', className = '' }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800 ${className}`}>
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

// ---------- Stat card ----------
export function StatCard({ icon: Icon, label, value, sub, color = 'text-brand-blue', bg = 'bg-brand-blue/10' }) {
  return (
    <div className="card flex items-center gap-4 p-4 sm:p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-2xl font-extrabold text-ink-900 dark:text-white sm:text-3xl">{value}</p>
        <p className="text-xs font-medium text-ink-500 dark:text-ink-400 sm:text-sm">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">{sub}</p>}
      </div>
    </div>
  )
}

// ---------- Empty state ----------
export function EmptyState({ icon: Icon = Info, title = 'Nothing here yet', message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-10 text-center">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-800">
        <Icon className="h-7 w-7 text-ink-400" />
      </div>
      <h3 className="font-bold text-ink-800 dark:text-ink-100">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">{message}</p>}
      {action}
    </div>
  )
}

// ---------- Section header ----------
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}
