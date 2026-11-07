import { Link } from 'react-router-dom'
import {
  GraduationCap, FolderKanban, CalendarDays, ClipboardList, ArrowRight,
  Megaphone, Truck, PackageCheck, Route, TrendingUp,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { fmtDate } from '../lib/store'
import { ProgressBar, Badge } from '../components/ui'

const quickCards = [
  { to: '/learning', icon: GraduationCap, title: 'Learning Modules', desc: 'Courses, notes & videos', color: 'from-brand-pink to-brand-purple' },
  { to: '/projects', icon: FolderKanban, title: 'Project Management', desc: 'Track projects & deadlines', color: 'from-brand-blue to-brand-purple' },
  { to: '/schedule', icon: CalendarDays, title: 'Daily Schedule', desc: 'Timetable & calendar', color: 'from-brand-green to-brand-blue' },
  { to: '/activities', icon: ClipboardList, title: 'Activity Records', desc: 'Log daily activities', color: 'from-brand-purple to-brand-pink' },
]

const heroIcons = [
  { icon: Truck, label: 'Freight', pos: 'left-[4%] top-[18%] hidden sm:flex' },
  { icon: PackageCheck, label: 'Warehousing', pos: 'right-[6%] top-[14%] hidden sm:flex' },
  { icon: Route, label: 'Routing', pos: 'bottom-[16%] left-[10%] hidden md:flex' },
  { icon: TrendingUp, label: 'Analytics', pos: 'bottom-[20%] right-[10%] hidden md:flex' },
]

export default function Home() {
  const { modules, projects, announcements, activities, profile } = useApp()

  const completedModules = modules.filter((m) => m.completed).length
  const overallProgress = modules.length ? Math.round(modules.reduce((s, m) => s + (m.progress || 0), 0) / modules.length) : 0
  const activeProjects = projects.filter((p) => p.status === 'In Progress').length
  const todayActivities = activities.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length

  const stats = [
    { label: 'Learning Modules', value: modules.length, icon: GraduationCap, to: '/learning' },
    { label: 'Active Projects', value: activeProjects, icon: FolderKanban, to: '/projects' },
    { label: 'Activities Today', value: todayActivities, icon: ClipboardList, to: '/activities' },
    { label: 'Modules Completed', value: `${completedModules}/${modules.length}`, icon: PackageCheck, to: '/learning' },
  ]

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple via-brand-blue to-brand-pink p-8 text-white shadow-lift sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-brand-green/20 blur-2xl" />
        {heroIcons.map(({ icon: Icon, label, pos }) => (
          <div key={label} className={`absolute ${pos} items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm`}>
            <Icon className="h-5 w-5" />
            <span className="text-xs font-semibold">{label}</span>
          </div>
        ))}
        <div className="relative max-w-xl">
          <Badge color="green">Learning & Management Portal</Badge>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">Welcome to LOGISTIK UPL</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
            Your all-in-one platform for logistics learning, project management, daily scheduling and activity tracking.
            Hi {profile.name.split(' ')[0]} — let's keep your logistics journey moving forward.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/learning" className="btn bg-white text-brand-purple hover:bg-white/90">Start Learning <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/dashboard" className="btn border border-white/40 text-white hover:bg-white/10">View Dashboard</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:gap-4 sm:p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink transition group-hover:scale-110">
              <s.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-ink-900 dark:text-white sm:text-2xl">{s.value}</p>
              <p className="truncate text-xs font-medium text-ink-500 dark:text-ink-400 sm:text-sm">{s.label}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick access */}
      <section>
        <h2 className="mb-4 text-xl font-extrabold text-ink-900 dark:text-white">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickCards.map((c) => (
            <Link key={c.to} to={c.to} className="card group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-lift">
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-10 transition group-hover:scale-150`} />
              <span className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-sm`}>
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-ink-900 dark:text-white">{c.title}</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{c.desc}</p>
              <ArrowRight className="mt-3 h-4 w-4 text-ink-300 transition group-hover:translate-x-1 group-hover:text-brand-pink" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Announcements */}
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-brand-pink" />
            <h2 className="font-extrabold text-ink-900 dark:text-white">Latest Announcements</h2>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-xl border border-ink-100 p-4 transition hover:border-brand-pink/40 dark:border-ink-800">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-ink-900 dark:text-white">{a.title}</h3>
                  <span className="shrink-0 text-xs text-ink-400">{fmtDate(a.date)}</span>
                </div>
                <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Progress overview */}
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-green" />
            <h2 className="font-extrabold text-ink-900 dark:text-white">Learning Progress Overview</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-ink-600 dark:text-ink-300">Overall completion</span>
                <span className="font-bold text-brand-pink">{overallProgress}%</span>
              </div>
              <ProgressBar value={overallProgress} color="bg-gradient-to-r from-brand-pink to-brand-purple" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {modules.slice(0, 4).map((m) => (
                <div key={m.id} className="rounded-xl bg-ink-50 p-3 dark:bg-ink-800">
                  <p className="mb-2 truncate text-xs font-semibold text-ink-700 dark:text-ink-200">{m.title}</p>
                  <ProgressBar value={m.progress || 0} color={m.completed ? 'bg-brand-green' : 'bg-brand-blue'} />
                  <p className="mt-1.5 text-[11px] font-semibold text-ink-500">{m.progress || 0}%</p>
                </div>
              ))}
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline">
              View full dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
