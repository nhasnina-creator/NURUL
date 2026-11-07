import { useMemo, useState } from 'react'
import {
  FolderKanban, Plus, Search, Pencil, Trash2, Printer, CalendarClock,
  User, Flag,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader, Modal, ConfirmDialog, Badge, statusColor, EmptyState } from '../components/ui'
import { fmtDate, todayStr } from '../lib/store'

const emptyForm = { title: '', description: '', startDate: todayStr(), deadline: '', pic: '', status: 'Not Started', priority: 'Medium' }

function ProjectForm({ initial, onClose, onSave }) {
  const { notify } = useApp()
  const [form, setForm] = useState(initial || emptyForm)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.pic.trim()) errs.pic = 'Person in charge is required'
    if (form.startDate && form.deadline && form.deadline < form.startDate) errs.deadline = 'Deadline must be after start date'
    setErrors(errs)
    if (Object.keys(errs).length) { notify('Please fix the highlighted fields', 'error'); return }
    onSave({ ...form, title: form.title.trim(), description: form.description.trim(), pic: form.pic.trim() })
  }

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Project' : 'New Project'} wide>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Project Title *</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Warehouse Layout Redesign" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-20" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What is this project about?" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </div>
          <div>
            <label className="label">Deadline *</label>
            <input type="date" className="input" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
            {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Person in Charge *</label>
            <input className="input" value={form.pic} onChange={(e) => set('pic', e.target.value)} placeholder="Name or team" />
            {errors.pic && <p className="mt-1 text-xs text-red-500">{errors.pic}</p>}
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              {['Not Started', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Priority</label>
          <div className="flex gap-2">
            {['Low', 'Medium', 'High'].map((p) => (
              <button type="button" key={p} onClick={() => set('priority', p)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${form.priority === p ? 'border-brand-pink bg-brand-pink/10 text-brand-pink' : 'border-ink-200 text-ink-500 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Add Project'}</button>
        </div>
      </form>
    </Modal>
  )
}

function ProjectCard({ project, onEdit, onDelete }) {
  const daysLeft = project.deadline ? Math.ceil((new Date(project.deadline) - new Date(todayStr())) / 86400000) : null
  return (
    <div className="card flex flex-col p-5 transition hover:shadow-lift">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-bold text-ink-900 dark:text-white">{project.title}</h3>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit(project)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-brand-blue/10 hover:text-brand-blue" title="Edit"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => onDelete(project)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      {project.description && <p className="mb-3 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{project.description}</p>}
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge color={statusColor(project.status)}>{project.status}</Badge>
        <Badge color={statusColor(project.priority)}><Flag className="h-3 w-3" />{project.priority}</Badge>
        {daysLeft !== null && project.status !== 'Completed' && (
          <Badge color={daysLeft < 0 ? 'red' : daysLeft <= 7 ? 'amber' : 'gray'}>
            <CalendarClock className="h-3 w-3" />
            {daysLeft < 0 ? `${-daysLeft}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
          </Badge>
        )}
      </div>
      <div className="mt-auto space-y-1.5 border-t border-ink-100 pt-3 text-xs text-ink-500 dark:border-ink-800 dark:text-ink-400">
        <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{project.pic}</p>
        <p>Start: {fmtDate(project.startDate)} · Deadline: {fmtDate(project.deadline)}</p>
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects, projectCrud, notify } = useApp()
  const [search, setSearch] = useState('')
  const [statusF, setStatusF] = useState('All')
  const [prioF, setPrioF] = useState('All')
  const [sort, setSort] = useState('deadline')
  const [modal, setModal] = useState(null) // 'new' | project object
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => {
    let list = projects.filter((p) =>
      (statusF === 'All' || p.status === statusF) &&
      (prioF === 'All' || p.priority === prioF) &&
      (p.title + ' ' + p.description + ' ' + p.pic).toLowerCase().includes(search.toLowerCase())
    )
    list.sort((a, b) => {
      if (sort === 'deadline') return (a.deadline || '9999').localeCompare(b.deadline || '9999')
      if (sort === 'priority') return { High: 0, Medium: 1, Low: 2 }[a.priority] - { High: 0, Medium: 1, Low: 2 }[b.priority]
      return (b.createdAt || '').localeCompare(a.createdAt || '')
    })
    return list
  }, [projects, search, statusF, prioF, sort])

  const save = (data) => {
    if (modal && modal !== 'new') {
      projectCrud.update(modal.id, data)
      notify('Project updated')
    } else {
      projectCrud.add(data)
      notify('Project added')
    }
    setModal(null)
  }

  const printReport = () => {
    const rows = filtered.map((p) =>
      `<tr><td>${p.title}</td><td>${p.pic}</td><td>${p.status}</td><td>${p.priority}</td><td>${fmtDate(p.startDate)}</td><td>${fmtDate(p.deadline)}</td></tr>`
    ).join('')
    const html = `<html><head><title>Project Report</title><style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;font-size:13px;text-align:left}th{background:#f0f0f0}</style></head><body>
      <h1>LOGISTIK UPL — Project Report</h1>
      <p>Generated: ${new Date().toLocaleString()} · ${filtered.length} project(s)</p>
      <table><thead><tr><th>Title</th><th>PIC</th><th>Status</th><th>Priority</th><th>Start</th><th>Deadline</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html); w.document.close(); w.print()
  }

  return (
    <div>
      <PageHeader title="Projects" subtitle="Manage logistics projects, deadlines and responsibilities.">
        <button className="btn-primary" onClick={() => setModal('new')}><Plus className="h-4 w-4" /> New Project</button>
        <button className="btn-ghost" onClick={printReport} disabled={!filtered.length}><Printer className="h-4 w-4" /> Print Report</button>
      </PageHeader>

      {/* Filters */}
      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option>All</option>{['Not Started', 'In Progress', 'Completed'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-auto" value={prioF} onChange={(e) => setPrioF(e.target.value)}>
          <option value="All">All priorities</option>{['Low', 'Medium', 'High'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="deadline">Sort: Deadline</option>
          <option value="priority">Sort: Priority</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" message="Add your first project or adjust your filters." action={<button className="btn-primary mt-2" onClick={() => setModal('new')}><Plus className="h-4 w-4" /> New Project</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} onEdit={(proj) => setModal(proj)} onDelete={setDeleting} />)}
        </div>
      )}

      {modal && <ProjectForm initial={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={save} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { projectCrud.remove(deleting.id); notify('Project deleted', 'info'); setDeleting(null) }}
        title="Delete project?"
        message={`"${deleting?.title}" will be permanently removed.`}
      />
    </div>
  )
}
