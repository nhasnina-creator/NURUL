import { useMemo, useState } from 'react'
import {
  BookOpen, Search, FileText, StickyNote, PlayCircle, Link2, ExternalLink,
  Plus, Pencil, Trash2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader, Modal, ConfirmDialog, Badge, EmptyState } from '../components/ui'

const TYPES = ['PDF', 'Notes', 'Video', 'Link', 'Document']
const typeIcon = (t) => (t === 'Video' ? PlayCircle : t === 'Notes' ? StickyNote : t === 'Link' ? Link2 : FileText)
const typeColor = (t) => ({ Video: 'purple', Notes: 'green', Link: 'blue', PDF: 'pink', Document: 'gray' }[t] || 'gray')

const emptyForm = { title: '', type: 'PDF', category: 'Documents', description: '', url: '' }

function ResourceForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if ((form.type === 'Link' || form.type === 'Video') && form.url && !/^https?:\/\//.test(form.url)) errs.url = 'URL must start with http(s)://'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Resource' : 'Add Resource'}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Title *</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Resource title" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="e.g. Documents" />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-16" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What is this resource about?" />
        </div>
        <div>
          <label className="label">URL {(form.type === 'Link' || form.type === 'Video') && '*'}</label>
          <input className="input" value={form.url || ''} onChange={(e) => set('url', e.target.value)} placeholder="https://..." />
          {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Add Resource'}</button>
        </div>
      </form>
    </Modal>
  )
}

export default function Resources() {
  const { resources, resourceCrud, notify } = useApp()
  const [search, setSearch] = useState('')
  const [typeF, setTypeF] = useState('All')
  const [catF, setCatF] = useState('All')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const categories = useMemo(() => ['All', ...new Set(resources.map((r) => r.category))], [resources])
  const filtered = useMemo(() => resources.filter((r) =>
    (typeF === 'All' || r.type === typeF) &&
    (catF === 'All' || r.category === catF) &&
    (r.title + ' ' + r.description).toLowerCase().includes(search.toLowerCase())
  ), [resources, typeF, catF, search])

  const save = (data) => {
    if (modal?.id) { resourceCrud.update(modal.id, data); notify('Resource updated') }
    else { resourceCrud.add(data); notify('Resource added') }
    setModal(null)
  }

  return (
    <div>
      <PageHeader title="Resources" subtitle="Digital library of documents, notes, videos and links.">
        <button className="btn-primary" onClick={() => setModal({ ...emptyForm })}><Plus className="h-4 w-4" /> Add Resource</button>
      </PageHeader>

      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={typeF} onChange={(e) => setTypeF(e.target.value)}>
          <option value="All">All types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select className="input w-auto" value={catF} onChange={(e) => setCatF(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No resources found" message="Add a resource or adjust your filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const Icon = typeIcon(r.type)
            return (
              <div key={r.id} className="card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-lift">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge color={typeColor(r.type)}>{r.type}</Badge>
                    <button onClick={() => setModal(r)} className="rounded-lg p-1.5 text-ink-300 opacity-0 transition hover:bg-brand-blue/10 hover:text-brand-blue group-hover:opacity-100" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(r)} className="rounded-lg p-1.5 text-ink-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-ink-900 dark:text-white">{r.title}</h3>
                {r.description && <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{r.description}</p>}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <Badge color="gray">{r.category}</Badge>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-ink-400">Offline resource</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && <ResourceForm initial={modal.id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { resourceCrud.remove(deleting.id); notify('Resource deleted', 'info'); setDeleting(null) }}
        title="Delete resource?"
        message={`"${deleting?.title}" will be permanently removed.`}
      />
    </div>
  )
}
