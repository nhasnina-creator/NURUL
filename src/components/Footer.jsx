import { Truck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-ink-200/70 bg-white dark:border-ink-800 dark:bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-pink to-brand-blue text-white">
            <Truck className="h-4 w-4" />
          </span>
          <p className="text-sm font-bold text-ink-800 dark:text-ink-100">LOGISTIK UPL</p>
        </div>
        <p className="text-xs text-ink-500 dark:text-ink-400">Learning & Management Portal — built for logistics learners.</p>
        <p className="text-xs text-ink-400">© {new Date().getFullYear()} LOGISTIK UPL</p>
      </div>
    </footer>
  )
}
