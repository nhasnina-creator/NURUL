import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, FolderKanban, CalendarDays, CheckCircle2, TrendingUp,
  Clock, MapPin, ArrowRight, Activity,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { fmtDate, fmtTime, todayStr } from '../lib/store'
import { StatCard, ProgressBar, Badge, statusColor, PageHeader } from '../components/ui'

// ---------- mini month calendar ----------
function MiniCalendar({ schedules }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = todayStr()

  const eventsByDate = useMemo(() => {
    const map = {}
    schedules.forEach((s) => { (map[s.date] ||= []).push(s) })
    return map
  }, [schedules])

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, iso, events: eventsByDate[iso] || [] })
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-ink-900 dark:text-white">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="rounded-lg px-2.5 py-1 text-sm font-bold text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">‹</button>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="rounded-lg px-2.5 py-1 text-sm font-bold text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-ink-400">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => (
          <div key={i} className={`min-h-9 rounded-lg p-1 text-xs ${c ? 'hover:bg-ink-50 dark:hover:bg-ink-800' : ''} ${c?.iso === today ? 'bg-brand-pink/10 font-bold text-brand-pink ring-1 ring-brand-pink/40' : 'text-ink-700 dark:text-ink-200'}`}>
            {c && (
              <>
                <span className="block text-center">{c.day}</span>
                {c.events.length > 0 && <span className="mx-auto mt-0.5 block h-1.5 w-1.5 rounded-full bg-brand-blue" />}
              </>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-400">Dots indicate scheduled activities.</p>
    </div>
  )
}

export default function Dashboard() {
  const { modules, projects, schedules, activities } = useApp()

  const stats = useMemo(() => ({
    modules: modules.length,
    projects: projects.length,
    upcoming: schedules.filter((s) => s.date >= todayStr() && s.status !== 'Completed').length,
    completedTasks: activities.filter((a) => a.status === 'Completed').length + projects.filter((p) => p.status === 'Completed').length,
    progress: modules.length ? Math.round(modules.reduce((s, m) => s + (m.progress || 0), 0) / modules.length) : 0,
  }), [modules, projects, schedules, activities])

  const recentActivities = [...activities].sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || ''))).slice(0, 6)
  const upcomingSchedule = schedules
    .filter((s) => s.date >= todayStr() && s.status !== 'Completed')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6)

  const moduleBars = modules.map((m) => ({ ...m, pct: m.progress || 0 }))
  const projectByStatus = ['Not Started', 'In Progress', 'Completed'].map((st) => ({
    status: st, count: projects.filter((p) => p.status === st).length,
  }))

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your learning, projects and daily operations.">
        <Link to="/activities" className="btn-primary"><Activity className="h-4 w-4" /> Log Activity</Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard icon={GraduationCap} label="Learning Modules" value={stats.modules} color="text-brand-pink" bg="bg-brand-pink/10" />
        <StatCard icon={FolderKanban} label="Total Projects" value={stats.projects} color="text-brand-blue" bg="bg-brand-blue/10" />
        <StatCard icon={CalendarDays} label="Upcoming Activities" value={stats.upcoming} color="text-brand-green" bg="bg-brand-green/15" />
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={stats.completedTasks} color="text-brand-purple" bg="bg-brand-purple/10" />
        <StatCard icon={TrendingUp} label="Learning Progress" value={`${stats.progress}%`} color="text-amber-500" bg="bg-amber-100 dark:bg-amber-900/30" />
      </div>

      {/* Progress overview */}
      <div className="card p-5">
        <h2 className="mb-4 font-bold text-ink-900 dark:text-white">Module Progress</h2>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {moduleBars.map((m) => (
            <div key={m.id}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-ink-700 dark:text-ink-200">{m.title}</span>
                <span className="shrink-0 text-xs font-bold text-ink-500">{m.pct}%</span>
              </div>
              <ProgressBar value={m.pct} color={m.completed ? 'bg-brand-green' : 'bg-gradient-to-r from-brand-blue to-brand-purple'} />
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 border-t border-ink-100 pt-4 dark:border-ink-800 sm:grid-cols-3">
          {projectByStatus.map((p) => (
            <div key={p.status} className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-800">
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">{p.status}</span>
              <Badge color={statusColor(p.status)}>{p.count}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming schedule */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-900 dark:text-white">Upcoming Schedule</h2>
            <Link to="/schedule" className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {upcomingSchedule.length === 0 && <p className="py-4 text-center text-sm text-ink-400">No upcoming events.</p>}
            {upcomingSchedule.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                  <span className="text-sm font-extrabold leading-none">{s.date.slice(8, 10)}</span>
                  <span className="text-[9px] font-bold uppercase">{new Date(s.date + 'T00:00:00').toLocaleDateString('en', { month: 'short' })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{s.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-500 dark:text-ink-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtTime(s.time)}{s.endTime ? `–${fmtTime(s.endTime)}` : ''}</span>
                    {s.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>}
                  </p>
                </div>
                <Badge color={statusColor(s.status)}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-900 dark:text-white">Recent Activities</h2>
            <Link to="/activities" className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="relative space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-ink-100 dark:before:bg-ink-800">
            {recentActivities.map((a) => (
              <div key={a.id} className="relative flex gap-3 pl-6">
                <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-green ring-2 ring-brand-green/30 dark:border-ink-900" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{a.description}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{fmtDate(a.date)} · {fmtTime(a.time)} · {a.category}</p>
                </div>
                <Badge color={statusColor(a.status)}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar overview */}
      <MiniCalendar schedules={schedules} />
    </div>
  )
}
