import { useMemo, useState } from 'react'
import {
  CalendarDays, Plus, Pencil, Trash2, Clock, MapPin, ChevronLeft, ChevronRight, Search,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { PageHeader, Modal, ConfirmDialog, Badge, statusColor, EmptyState } from '../components/ui'
import { fmtDate, fmtTime, todayStr } from '../lib/store'

export const CATEGORIES = {
  Meeting: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
  Work: 'bg-brand-green/15 text-emerald-700 border-brand-green/40 dark:text-brand-green',
  Training: 'bg-brand-purple/15 text-brand-purple border-brand-purple/30 dark:text-violet-300',
  Field: 'bg-brand-pink/15 text-brand-pink border-brand-pink/30',
  Safety: 'bg-red-100 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-300',
  Admin: 'bg-ink-100 text-ink-600 border-ink-200 dark:bg-ink-800 dark:text-ink-300',
}

const catDot = (c) => ({
  Meeting: 'bg-brand-blue', Work: 'bg-brand-green', Training: 'bg-brand-purple',
  Field: 'bg-brand-pink', Safety: 'bg-red-500', Admin: 'bg-ink-400',
}[c] || 'bg-ink-400')

const emptyForm = { title: '', date: todayStr(), time: '09:00', endTime: '', location: '', category: 'Work', status: 'Planned', notes: '' }

const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const weekStart = (iso) => { const d = new Date(iso + 'T00:00:00'); const diff = (d.getDay() + 6) % 7; return addDays(iso, -diff) }
const monthOf = (iso) => iso.slice(0, 7)

function ScheduleForm({ initial, defaultDate, onClose, onSave }) {
  const { notify } = useApp()
  const [form, setForm] = useState(initial || { ...emptyForm, date: defaultDate || todayStr() })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.date) errs.date = 'Date is required'
    if (form.time && form.endTime && form.endTime <= form.time) errs.endTime = 'End time must be after start time'
    setErrors(errs)
    if (Object.keys(errs).length) { notify('Please fix the highlighted fields', 'error'); return }
    onSave({ ...form, title: form.title.trim(), location: form.location.trim(), notes: form.notes.trim() })
  }

  return (
    <Modal open onClose={onClose} title={initial ? 'Edit Schedule' : 'Add Schedule'}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Activity Title *</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Team Briefing" />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Date *</label>
            <input type="date" className="input" value={form.date} onChange={(e) => set('date', e.target.value)} />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {Object.keys(CATEGORIES).map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Start Time</label>
            <input type="time" className="input" value={form.time} onChange={(e) => set('time', e.target.value)} />
          </div>
          <div>
            <label className="label">End Time</label>
            <input type="time" className="input" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
            {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Meeting Room A" />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              {['Planned', 'Ongoing', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Notes & Remarks</label>
          <textarea className="input min-h-20" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Additional details..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Add Schedule'}</button>
        </div>
      </form>
    </Modal>
  )
}

function EventChip({ ev, onEdit, onDelete, compact }) {
  return (
    <div className={`group flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${CATEGORIES[ev.category] || CATEGORIES.Admin} ${ev.status === 'Completed' ? 'opacity-60 line-through' : ''}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${catDot(ev.category)}`} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-xs font-bold ${compact ? '' : 'sm:text-sm'}`}>{ev.title}</p>
        {!compact && <p className="truncate text-[11px] opacity-80">{fmtTime(ev.time)}{ev.endTime ? `–${fmtTime(ev.endTime)}` : ''}{ev.location ? ` · ${ev.location}` : ''}</p>}
      </div>
      {!compact && (
        <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
          <button onClick={() => onEdit(ev)} className="rounded p-1 hover:bg-white/50"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={() => onDelete(ev)} className="rounded p-1 hover:bg-white/50"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      )}
    </div>
  )
}

export default function Schedule() {
  const { schedules, scheduleCrud, notify } = useApp()
  const [view, setView] = useState('week')
  const [anchor, setAnchor] = useState(todayStr())
  const [selectedDay, setSelectedDay] = useState(todayStr())
  const [catFilter, setCatFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const byDate = useMemo(() => {
    const map = {}
    schedules.filter((s) => catFilter === 'All' || s.category === catFilter)
      .filter((s) => (s.title + s.location + s.notes).toLowerCase().includes(search.toLowerCase()))
      .forEach((s) => { (map[s.date] ||= []).push(s) })
    Object.values(map).forEach((arr) => arr.sort((a, b) => (a.time || '').localeCompare(b.time || '')))
    return map
  }, [schedules, catFilter, search])

  const save = (data) => {
    if (modal?.id) { scheduleCrud.update(modal.id, data); notify('Schedule updated') }
    else { scheduleCrud.add(data); notify('Schedule added') }
    setModal(null)
  }

  // ---- view data ----
  const ws = weekStart(anchor)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  const monthStart = monthOf(anchor) + '-01'
  const monthDaysCount = new Date(+monthStart.slice(0, 4), +monthStart.slice(5, 7), 0).getDate()
  const monthFirstOffset = (new Date(monthStart + 'T00:00:00').getDay() + 6) % 7
  const monthCells = [...Array(monthFirstOffset).fill(null), ...Array.from({ length: monthDaysCount }, (_, i) => addDays(monthStart, i))]

  const shift = (dir) => {
    if (view === 'day') setAnchor(addDays(anchor, dir))
    else if (view === 'week') setAnchor(addDays(ws, dir * 7))
    else setAnchor(addDays(anchor, dir * 28))
  }
  const goToday = () => { setAnchor(todayStr()); setSelectedDay(todayStr()) }

  const dayEvents = (iso) => byDate[iso] || []
  const rangeLabel = view === 'day' ? fmtDate(anchor) : view === 'week' ? `${fmtDate(ws)} – ${fmtDate(addDays(ws, 6))}` : new Date(+anchor.slice(0, 4), +anchor.slice(5, 7) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div>
      <PageHeader title="Daily Schedule" subtitle="Timetable, weekly and monthly calendar of activities.">
        <button className="btn-primary" onClick={() => setModal({ ...emptyForm, date: view === 'month' ? selectedDay : anchor })}><Plus className="h-4 w-4" /> Add Schedule</button>
      </PageHeader>

      {/* Controls */}
      <div className="card mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="flex rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
          {['day', 'week', 'month'].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${view === v ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-700 dark:text-white' : 'text-ink-500 hover:text-ink-800 dark:text-ink-400'}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => shift(-1)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={goToday} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10">Today</button>
          <button onClick={() => shift(1)} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><ChevronRight className="h-4 w-4" /></button>
          <span className="ml-2 text-sm font-bold text-ink-800 dark:text-ink-100">{rangeLabel}</span>
        </div>
        <div className="relative ml-auto min-w-40 flex-1 sm:max-w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-9" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        {['All', ...Object.keys(CATEGORIES)].map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${catFilter === c ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900' : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300'}`}>
            {c !== 'All' && <span className={`h-2 w-2 rounded-full ${catDot(c)}`} />}{c}
          </button>
        ))}
      </div>

      {/* DAY VIEW */}
      {view === 'day' && (
        <div className="card p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-900 dark:text-white">{fmtDate(anchor)} {anchor === todayStr() && <Badge color="pink">Today</Badge>}</h2>
            <span className="text-sm text-ink-500">{dayEvents(anchor).length} event(s)</span>
          </div>
          {dayEvents(anchor).length === 0 ? (
            <EmptyState icon={CalendarDays} title="No events this day" message="Add a schedule to plan your day." action={<button className="btn-primary mt-2" onClick={() => setModal({ ...emptyForm, date: anchor })}><Plus className="h-4 w-4" /> Add Schedule</button>} />
          ) : (
            <div className="space-y-3">
              {dayEvents(anchor).map((ev) => (
                <div key={ev.id} className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${CATEGORIES[ev.category] || CATEGORIES.Admin}`}>
                  <div className="flex shrink-0 items-center gap-2 sm:w-28">
                    <Clock className="h-4 w-4 opacity-70" />
                    <span className="text-sm font-bold">{fmtTime(ev.time) || '—'}{ev.endTime ? `–${fmtTime(ev.endTime)}` : ''}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{ev.title} <Badge color={statusColor(ev.status)}>{ev.status}</Badge></p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs opacity-80">
                      {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>}
                      {ev.notes && <span>{ev.notes}</span>}
                    </p>
                  </div>
                  <div className="flex gap-1 self-end sm:self-auto">
                    <button onClick={() => setModal(ev)} className="rounded-lg p-2 hover:bg-white/50"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleting(ev)} className="rounded-lg p-2 hover:bg-white/50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WEEK VIEW */}
      {view === 'week' && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {weekDays.map((iso) => {
            const evs = dayEvents(iso)
            const isToday = iso === todayStr()
            return (
              <div key={iso} className={`card flex min-h-48 flex-col p-3 ${isToday ? 'ring-2 ring-brand-pink/50' : ''}`}>
                <button onClick={() => { setView('day'); setAnchor(iso) }} className="mb-2 text-left">
                  <p className="text-[10px] font-bold uppercase text-ink-400">{new Date(iso + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}</p>
                  <p className={`text-lg font-extrabold ${isToday ? 'text-brand-pink' : 'text-ink-900 dark:text-white'}`}>{+iso.slice(8, 10)}</p>
                </button>
                <div className="flex-1 space-y-1.5">
                  {evs.slice(0, 4).map((ev) => <EventChip key={ev.id} ev={ev} compact onEdit={setModal} onDelete={setDeleting} />)}
                  {evs.length > 4 && <p className="text-[11px] font-semibold text-ink-400">+{evs.length - 4} more</p>}
                </div>
                <button onClick={() => setModal({ ...emptyForm, date: iso })} className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-ink-200 py-1.5 text-xs font-semibold text-ink-400 transition hover:border-brand-pink hover:text-brand-pink dark:border-ink-700">
                  <Plus className="h-3 w-3" /> Add
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* MONTH VIEW */}
      {view === 'month' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card overflow-hidden lg:col-span-2">
            <div className="grid grid-cols-7 border-b border-ink-100 text-center text-[10px] font-bold uppercase text-ink-400 dark:border-ink-800">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {monthCells.map((iso, i) => {
                if (!iso) return <div key={i} className="min-h-20 border-b border-r border-ink-100 bg-ink-50/50 dark:border-ink-800 dark:bg-ink-900/40" />
                const evs = dayEvents(iso)
                const isToday = iso === todayStr()
                const isSel = iso === selectedDay
                return (
                  <button key={iso} onClick={() => setSelectedDay(iso)}
                    className={`min-h-20 border-b border-r border-ink-100 p-1.5 text-left transition hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800/60 ${isSel ? 'bg-brand-pink/5 ring-1 ring-inset ring-brand-pink/40' : ''}`}>
                    <span className={`mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${isToday ? 'bg-brand-pink text-white' : 'text-ink-600 dark:text-ink-300'}`}>{+iso.slice(8, 10)}</span>
                    <div className="space-y-0.5">
                      {evs.slice(0, 2).map((ev) => (
                        <p key={ev.id} className={`truncate rounded px-1 py-0.5 text-[10px] font-semibold ${CATEGORIES[ev.category] || CATEGORIES.Admin}`}>{ev.title}</p>
                      ))}
                      {evs.length > 2 && <p className="px-1 text-[10px] font-semibold text-ink-400">+{evs.length - 2} more</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          {/* Selected day panel */}
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-ink-900 dark:text-white">{fmtDate(selectedDay)}</h3>
              <button onClick={() => setModal({ ...emptyForm, date: selectedDay })} className="btn-primary !px-3 !py-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Add</button>
            </div>
            <div className="space-y-2">
              {dayEvents(selectedDay).length === 0 && <p className="py-6 text-center text-sm text-ink-400">No events on this day.</p>}
              {dayEvents(selectedDay).map((ev) => <EventChip key={ev.id} ev={ev} onEdit={setModal} onDelete={setDeleting} />)}
            </div>
          </div>
        </div>
      )}

      {modal && <ScheduleForm initial={modal.id ? modal : null} defaultDate={modal.date || anchor} onClose={() => setModal(null)} onSave={save} />}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => { scheduleCrud.remove(deleting.id); notify('Schedule deleted', 'info'); setDeleting(null) }}
        title="Delete schedule?"
        message={`"${deleting?.title}" on ${fmtDate(deleting?.date)} will be removed.`}
      />
    </div>
  )
}
