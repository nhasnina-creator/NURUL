import { useMemo, useState } from 'react'
import {
  GraduationCap, Search, PlayCircle, FileText, StickyNote, Link2,
  CheckCircle2, RotateCcw, Target, BookOpen, Award,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader, Modal, ProgressBar, Badge, EmptyState } from '../components/ui'

const matIcon = (t) => (t === 'Video' ? PlayCircle : t === 'Notes' ? StickyNote : t === 'Link' ? Link2 : FileText)

function ModuleCard({ module, onOpen }) {
  return (
    <button onClick={() => onOpen(module)} className="card group flex w-full flex-col p-5 text-left transition hover:-translate-y-1 hover:shadow-lift">
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
          <GraduationCap className="h-5 w-5" />
        </span>
        <Badge color={module.completed ? 'green' : 'blue'}>{module.completed ? 'Completed' : 'In Progress'}</Badge>
      </div>
      <h3 className="font-bold text-ink-900 dark:text-white">{module.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{module.description}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold">
          <span className="text-ink-500">Progress</span>
          <span className="text-brand-pink">{module.progress || 0}%</span>
        </div>
        <ProgressBar value={module.progress || 0} color={module.completed ? 'bg-brand-green' : 'bg-gradient-to-r from-brand-blue to-brand-purple'} />
      </div>
      <p className="mt-3 text-xs text-ink-400">{module.materials?.length || 0} materials · {module.category}</p>
    </button>
  )
}

function ModuleDetail({ module, onClose }) {
  const { moduleCrud, notify } = useApp()
  const [progress, setProgress] = useState(module.progress || 0)

  const saveProgress = (val) => {
    moduleCrud.update(module.id, { progress: val, completed: val >= 100 })
    notify(val >= 100 ? 'Module marked as completed!' : 'Progress saved')
  }

  const toggleComplete = () => {
    const done = !module.completed
    moduleCrud.update(module.id, { completed: done, progress: done ? 100 : Math.min(module.progress || 0, 99) })
    notify(done ? 'Module completed — great job!' : 'Module marked incomplete')
  }

  return (
    <Modal open={!!module} onClose={onClose} title={module?.title} wide>
      {module && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="purple">{module.category}</Badge>
            <Badge color={module.completed ? 'green' : 'blue'}>{module.completed ? 'Completed' : 'In Progress'}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{module.description}</p>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink-900 dark:text-white"><Target className="h-4 w-4 text-brand-pink" /> Learning Objectives</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-600 dark:text-ink-300">
              {(module.objectives || []).map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink-900 dark:text-white"><BookOpen className="h-4 w-4 text-brand-blue" /> Learning Materials</h4>
            <div className="space-y-2">
              {(module.materials || []).map((m, i) => {
                const Icon = matIcon(m.type)
                const inner = (
                  <>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate text-sm font-medium">{m.name}</span>
                    <Badge color={m.type === 'Video' ? 'purple' : m.type === 'Notes' ? 'green' : 'blue'}>{m.type}</Badge>
                  </>
                )
                return m.url ? (
                  <a key={i} href={m.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-ink-100 px-3.5 py-2.5 transition hover:border-brand-blue/50 hover:bg-brand-blue/5 dark:border-ink-800">{inner}</a>
                ) : (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-ink-100 px-3.5 py-2.5 dark:border-ink-800">{inner}</div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl bg-ink-50 p-4 dark:bg-ink-800">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-sm font-bold text-ink-900 dark:text-white"><Award className="h-4 w-4 text-brand-green" /> Your Progress</h4>
              <span className="text-sm font-extrabold text-brand-pink">{progress}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={progress}
              onChange={(e) => { const v = +e.target.value; setProgress(v); moduleCrud.update(module.id, { progress: v, completed: v >= 100 }) }}
              className="w-full accent-brand-pink" />
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-primary" onClick={() => saveProgress(progress)}>Save Progress</button>
              <button className={`btn ${module.completed ? 'btn-ghost' : 'btn-green'}`} onClick={toggleComplete}>
                {module.completed ? <><RotateCcw className="h-4 w-4" /> Mark Incomplete</> : <><CheckCircle2 className="h-4 w-4" /> Mark Completed</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default function Learning() {
  const { modules } = useApp()
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const categories = useMemo(() => ['All', ...new Set(modules.map((m) => m.category))], [modules])
  const filtered = useMemo(() => modules.filter((m) =>
    (cat === 'All' || m.category === cat) &&
    (filter === 'All' || (filter === 'Completed' ? m.completed : !m.completed)) &&
    (m.title + m.description).toLowerCase().includes(search.toLowerCase())
  ), [modules, cat, filter, search])

  return (
    <div>
      <PageHeader title="Learning" subtitle="Modules, topics, notes and training materials.">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input w-56 pl-9" placeholder="Search modules..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </PageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${cat === c ? 'bg-brand-purple text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300'}`}>
            {c}
          </button>
        ))}
        <span className="mx-1 hidden w-px bg-ink-200 dark:bg-ink-700 sm:block" />
        {['All', 'In Progress', 'Completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${filter === f ? 'bg-brand-pink text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No modules found" message="Try changing your search or filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => <ModuleCard key={m.id} module={m} onOpen={setSelected} />)}
        </div>
      )}

      <ModuleDetail key={selected?.id || 'closed'} module={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
