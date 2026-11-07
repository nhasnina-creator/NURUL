// ---------- helpers ----------
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

export const todayStr = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtTime = (t) => {
  if (!t) return ''
  const [h, m] = t.split(':')
  const hr = parseInt(h, 10)
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`
}

export const toCSV = (rows, headers) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = [headers.map(esc).join(',')]
  rows.forEach((r) => lines.push(headers.map((h) => esc(r[h])).join(',')))
  return lines.join('\n')
}

export const downloadFile = (filename, content, mime = 'text/csv') => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ---------- seed data ----------
const objectives = [
  'Understand core logistics concepts',
  'Apply supply chain management techniques',
  'Track and evaluate personal progress',
]

export const seedData = {
  modules: [
    {
      id: uid(), category: 'Supply Chain', title: 'Introduction to Logistics & Supply Chain',
      description: 'Learn the fundamentals of logistics, supply chain flows, and key terminology used in the industry.',
      objectives, materials: [
        { name: 'Lecture Slides – Module 1', type: 'PDF' },
        { name: 'Supply Chain Overview (Video)', type: 'Video', url: 'https://www.coursera.org' },
        { name: 'Key Terms Notes', type: 'Notes' },
      ],
      progress: 100, completed: true,
    },
    {
      id: uid(), category: 'Warehouse', title: 'Warehouse Operations & Inventory Control',
      description: 'Explore warehouse layout, receiving, storage, picking, packing and inventory control best practices.',
      objectives: ['Explain warehouse functions', 'Understand inventory counting methods', 'Describe order fulfilment flow'],
      materials: [
        { name: 'Warehouse SOP Document', type: 'PDF' },
        { name: 'Forklift Safety Video', type: 'Video', url: 'https://www.osha.gov' },
      ],
      progress: 60, completed: false,
    },
    {
      id: uid(), category: 'Transport', title: 'Transportation & Route Planning',
      description: 'Study transport modes, route optimisation, and cost factors in freight movement.',
      objectives: ['Compare transport modes', 'Plan efficient delivery routes', 'Calculate basic transport costs'],
      materials: [
        { name: 'Route Planning Worksheet', type: 'Notes' },
        { name: 'Freight Basics Video', type: 'Video', url: 'https://www.iata.org' },
      ],
      progress: 25, completed: false,
    },
    {
      id: uid(), category: 'Project', title: 'Project Management for Logistics',
      description: 'Learn how to plan, execute and monitor logistics-related projects using modern PM tools.',
      objectives: ['Define project scope and milestones', 'Use Gantt-style scheduling', 'Report project status effectively'],
      materials: [{ name: 'PM Toolkit Guide', type: 'PDF' }],
      progress: 0, completed: false,
    },
  ],
  projects: [
    {
      id: uid(), title: 'Warehouse Layout Redesign', description: 'Redesign the main warehouse floor layout to improve picking efficiency and safety.',
      startDate: todayStr(-10), deadline: todayStr(20), pic: 'Nurul Aisyah', status: 'In Progress', priority: 'High', createdAt: todayStr(-10),
    },
    {
      id: uid(), title: 'Supplier Onboarding Programme', description: 'Document and streamline the process for onboarding new logistics suppliers.',
      startDate: todayStr(-3), deadline: todayStr(15), pic: 'Ahmad Faiz', status: 'In Progress', priority: 'Medium', createdAt: todayStr(-3),
    },
    {
      id: uid(), title: 'Fleet Maintenance Tracking', description: 'Set up a simple tracking system for vehicle maintenance schedules.',
      startDate: todayStr(5), deadline: todayStr(40), pic: 'Nurul Aisyah', status: 'Not Started', priority: 'Low', createdAt: todayStr(5),
    },
    {
      id: uid(), title: 'Q3 Delivery Performance Report', description: 'Compile quarterly delivery performance metrics for management review.',
      startDate: todayStr(-30), deadline: todayStr(-5), pic: 'Team Logistics', status: 'Completed', priority: 'Medium', createdAt: todayStr(-30),
    },
  ],
  schedules: [
    { id: uid(), title: 'Morning Team Briefing', date: todayStr(0), time: '08:00', endTime: '09:00', location: 'Meeting Room A', category: 'Meeting', status: 'Planned', notes: 'Daily sync on warehouse tasks' },
    { id: uid(), title: 'Inventory Audit – Zone B', date: todayStr(0), time: '10:00', endTime: '12:00', location: 'Warehouse Zone B', category: 'Work', status: 'Planned', notes: 'Bring handheld scanners' },
    { id: uid(), title: 'Forklift Safety Training', date: todayStr(1), time: '14:00', endTime: '16:00', location: 'Training Hall', category: 'Training', status: 'Planned', notes: 'Certifications to be issued' },
    { id: uid(), title: 'Supplier Meeting – TransMaju', date: todayStr(2), time: '09:30', endTime: '11:00', location: 'Online (Zoom)', category: 'Meeting', status: 'Planned', notes: 'Review Q4 rates' },
    { id: uid(), title: 'Delivery Route Inspection', date: todayStr(-1), time: '09:00', endTime: '12:00', location: 'North Depot', category: 'Field', status: 'Completed', notes: 'Route 3 and 7 checked' },
    { id: uid(), title: 'Monthly Safety Drill', date: todayStr(6), time: '10:00', endTime: '11:00', location: 'Main Office', category: 'Safety', status: 'Planned', notes: 'Fire evacuation drill' },
    { id: uid(), title: 'Office Administration', date: todayStr(0), time: '13:00', endTime: '14:00', location: 'Admin Office', category: 'Admin', status: 'Planned', notes: '' },
  ],
  activities: [
    { id: uid(), description: 'Conducted stock count for Zone A shelves', date: todayStr(0), time: '09:15', category: 'Warehouse', status: 'Completed', remarks: 'All counts matched system records.', image: null },
    { id: uid(), description: 'Met with TransMaju supplier to discuss delivery rates', date: todayStr(0), time: '11:00', category: 'Meeting', status: 'Completed', remarks: 'Agreed on revised rate card.', image: null },
    { id: uid(), description: 'Prepared weekly dispatch schedule', date: todayStr(-1), time: '15:30', category: 'Planning', status: 'Completed', remarks: '', image: null },
    { id: uid(), description: 'Update route planning documentation', date: todayStr(0), time: '14:00', category: 'Documentation', status: 'Ongoing', remarks: 'Draft v2 in progress.', image: null },
    { id: uid(), description: 'Inspect loading dock equipment', date: todayStr(1), time: '08:30', category: 'Maintenance', status: 'Pending', remarks: '', image: null },
  ],
  resources: [
    { id: uid(), title: 'Logistics Fundamentals Handbook', type: 'PDF', category: 'Documents', description: 'Complete handbook covering logistics basics, terminology and processes.', url: 'https://www.iata.org' },
    { id: uid(), title: 'Warehouse SOP Collection', type: 'PDF', category: 'Documents', description: 'Standard operating procedures for receiving, storage and dispatch.', url: 'https://www.osha.gov' },
    { id: uid(), title: 'IATA – Cargo & Logistics Portal', type: 'Link', category: 'Websites', description: 'Official aviation logistics resources and standards.', url: 'https://www.iata.org' },
    { id: uid(), title: 'Supply Chain Management Intro (Video)', type: 'Video', category: 'Videos', description: 'Video lecture series introducing supply chain concepts.', url: 'https://www.coursera.org' },
    { id: uid(), title: 'Personal Study Notes – Transport Modes', type: 'Notes', category: 'Notes', description: 'Compiled notes on road, rail, sea and air freight.', url: null },
    { id: uid(), title: 'Project Management Templates', type: 'PDF', category: 'Templates', description: 'Gantt chart, risk register and status report templates.', url: 'https://www.projectmanagement.com' },
  ],
  announcements: [
    { id: uid(), title: 'New Module Available', body: 'The Transportation & Route Planning module has been added to the Learning section.', date: todayStr(0) },
    { id: uid(), title: 'Safety Drill This Friday', body: 'Monthly fire evacuation drill scheduled for Friday 10:00 AM at the main office.', date: todayStr(-1) },
    { id: uid(), title: 'Portal Maintenance', body: 'Scheduled maintenance this Sunday 02:00–04:00. Save your work before then.', date: todayStr(-2) },
  ],
  notifications: [
    { id: uid(), text: 'Module "Warehouse Operations" is 60% complete', time: todayStr(0), read: false },
    { id: uid(), text: 'Schedule: Forklift Safety Training tomorrow 14:00', time: todayStr(0), read: false },
    { id: uid(), text: 'Project "Warehouse Layout Redesign" deadline in 20 days', time: todayStr(-1), read: true },
  ],
}

export const LS_KEYS = {
  modules: 'lu_modules',
  projects: 'lu_projects',
  schedules: 'lu_schedules',
  activities: 'lu_activities',
  resources: 'lu_resources',
  announcements: 'lu_announcements',
  notifications: 'lu_notifications',
  theme: 'lu_theme',
  profile: 'lu_profile',
}
