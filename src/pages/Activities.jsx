import { useMemo, useRef, useState } from 'react'
import {
  ClipboardList, Plus, Search, Pencil, Trash2, ImagePlus, Download,
  Printer, CheckCircle2, Clock, Loader, XCircle, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader, Modal, ConfirmDialog, Badge, statusColor, EmptyState } from '../components/ui'
import { fmtDate, fmtTime, todayStr, toCSV, downloadFile } from '../lib/store'

const CATS = ['General', 'Warehouse', 'Transport', 'Meeting', 'Planning', 'Documentation', 'Maintenance', 'Training', 'Field']
const STATUSES = ['Pending', 'Ongoing', 'Completed']
const emptyForm = { description: '', date: todayStr(), time: '', category: 'General', status: 'Pending', remarks: '', image: null }

function ActivityForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyForm)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setErrors({ image: 'Image must be under 2MB' }); return }
    const reader = new FileReader()
    reader.onload = () => set('image', reader.result)
    reader.readAsDataURL(file)
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.date) errs.date = 'Date is required'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave({ ...form, description: form.description.trim(), remarks: form.remarks.trim() })
  }

  const statusIcon = { Pending: XCircle, Ongoing: Loader, Completed: CheckCircle2 }

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Activity' : 'Record Activity'} wide>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Activity Description *</label>
          <textarea className="input min-h-20" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What did you do?" />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Date *</label>
            <input type="date" className="input" value={form.date} onChange={(e) => set('date', e.target.value)} />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label className="label">Time</label>
            <input type="time" className="input" value={form.time} onChange={(e) => set('time', e.target.value)} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <div className="flex gap-2">
            {STATUSES.map((s) => {
              const Icon = statusIcon[s]
              return (
                <button type="button" key={s} onClick={() => set('status', s)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition ${form.status === s ? 'border-brand-pink bg-brand-pink/10 text-brand-pink' : 'border-ink-200 text-ink-500 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800'}`}>
                  <Icon className="h-4 w-4" />{s}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label className="label">Remarks</label>
          <textarea className="input min-h-16" value={form.remarks} onChange={(e) => set('remarks', e.target.value)} placeholder="Notes about this activity..." />
        </div>
        <div>
          <label className="label">Attachment (image, max 2MB)</label>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImage} />
            <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" /> {form.image ? 'Change Image' : 'Upload Image'}</button>
            {form.image && (
              <div className="relative">
                <img src={form.image} alt="attachment" className="h-12 w-12 rounded-lg border border-ink-200 object-cover dark:border-ink-700" />
                <button type="button" onClick={() => set('image', null)} className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white"><X className="h-3 w-3" /></button>
              </div>
            )}
          </div>
          {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Save Activity'}</button>
        </div>
      </form>
    </Modal>
  )
}

function ActivityCard({ act, onEdit, onDelete, onStatus }) {
  return (
    <div className="card flex gap-4 p-4 transition hover:shadow-lift sm:p-5">
      {act.image ? (
        <img src={act.image} alt="" className="h-16 w-16 shrink-0 rounded-xl border border-ink-100 object-cover dark:border-ink-800 sm:h-20 sm:w-20" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-ink-100 dark:bg-ink-800 sm:h-20 sm:w-20">
          <ClipboardList className="h-7 w-7 text-ink-300 dark:text-ink-600" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="purple">{act.category}</Badge>
          <Badge color={statusColor(act.status)}>{act.status}</Badge>
        </div>
        <p className="mt-1.5 font-semibold text-ink-900 dark:text-white">{act.description}</p>
        {act.remarks && <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{act.remarks}</p>}
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
          <Clock className="h-3.5 w-3.5" />{fmtDate(act.date)}{act.time ? ` · ${fmtTime(act.time)}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <button onClick={() => onEdit(act)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-brand-blue/10 hover:text-brand-blue" title="Edit"><Pencil className="h-4 w-4" /></button>
        <button onClick={() => onDelete(act)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="h-4 w-4" /></button>
        {act.status !== 'Completed' && (
          <button onClick={() => onStatus(act)} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-brand-green/15 hover:text-brand-green" title="Mark completed"><CheckCircle2 className="h-4 w-4" /></button>
        )}
      </div>
    </div>
  )
}

export default function Activities() {
  const { activities, activityCrud, notify } = useApp()
  const [search, setSearch] = useState('')
  const [catF, setCatF] = useState('All')
  const [statusF, setStatusF] = useState('All')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() => activities
    .filter((a) =>
      (catF === 'All' || a.category === catF) &&
      (statusF === 'All' || a.status === statusF) &&
      (a.description + a.remarks + a.category).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || ''))),
  [activities, catF, statusF, search])

  const save = (data) => {
    if (modal?.id) { activityCrud.update(modal.id, data); notify('Activity updated') }
    else { activityCrud.add(data); notify('Activity recorded') }
    setModal(null)
  }

  const exportCSV = () => {
    const csv = toCSV(filtered, ['date', 'time', 'description', 'category', 'status', 'remarks'])
    downloadFile(`logistik-upl-activities-${todayStr()}.csv`, csv)
    notify('CSV exported')
  }

  const printReport = () => {
    const rows = filtered.map((a) =>
      `<tr><td>${fmtDate(a.date)}</td><td>${a.time || '—'}</td><td>${a.description}</td><td>${a.category}</td><td>${a.status}</td><td>${a.remarks || ''}</td></tr>`
    ).join('')
    const html = `<html><head><title>Activity Report</title><style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;font-size:13px;text-align:left}th{background:#f0f0f0}</style></head><body>
      <h1>LOGISTIK UPL — Activity Report</h1>
      <p>Generated: ${new Date().toLocaleString()} · ${filtered.length} record(s)</p>
      <table><thead><tr><th>Date</th><th>Time</th><th>Description</th><th>Category</th><th>Status</th><th>Remarks</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html); w.document.close(); w.print()
  }

  return (
    <div>
      <PageHeader title="Activities" subtitle="Record and track your daily logistics activities.">
        <button className="btn-primary" onClick={() => setModal({ ...emptyForm })}><Plus className="h-4 w-4" /> Record Activity</button>
        <button className="btn-ghost" onClick={exportCSV} disabled={!filtered.length}><Download className="h-4 w-4" /> Export CSV</button>
        <button className="btn-ghost" onClick={printReport} disabled={!filtered.length}><Printer className="h-4 w-4" /> Print</button>
      </PageHeader>

      {/* Filters */}
      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={catF} onChange={(e) => setCatF(e.target.value)}>
          <option value="All">All categories</option>{CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input w-auto" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="All">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No activities found" message="Record your first activity to start tracking." action={<button className="btn-primary mt-2" onClick={() => setModal({ ...emptyForm })}><Plus className="h-4 w-4" /> Record Activity</button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => <ActivityCard key={a.id} act={a} onEdit={setModal} onDelete={setDeleting}
            onStatus={(act) => { activityCrud.update(act.id, { status: 'Completed' }); notify('Activity marked completed') }} />)}
        </div>
      )}

      {modal && <ActivityForm initial={modal.id ? modal : null} onClose={() => setModal(null)} onSave={save} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { activityCrud.remove(deleting.id); notify('Activity deleted', 'info'); setDeleting(null) }}
        title="Delete activity?"
        message="This activity record will be permanently removed."
      />
    </div>
  )
}
