import { Target, Eye, HeartHandshake, BookOpenCheck, Truck } from 'lucide-react'
import { PageHeader } from '../components/ui'

const sections = [
  {
    icon: Info2Icon, title: 'About LOGISTIK UPL',
    body: 'LOGISTIK UPL is a digital learning and management portal designed for logistics learners and teams. It brings together learning modules, project management, daily schedules, activity records and a resource library into one simple, modern platform.',
  },
  {
    icon: Target, title: 'Website Objectives',
    body: 'To provide a central hub where learners can study logistics topics at their own pace, manage real-world logistics projects, plan daily activities, and keep track of progress — all in one place that works on any device.',
  },
  {
    icon: Eye, title: 'Vision',
    body: 'To become the go-to learning portal for logistics education, empowering learners and professionals with practical, organized and accessible tools for everyday logistics work.',
  },
  {
    icon: HeartHandshake, title: 'Mission',
    body: 'To deliver quality logistics education through structured modules, hands-on project experience, disciplined scheduling and clear activity documentation — making every learner job-ready.',
  },
  {
    icon: BookOpenCheck, title: 'Learning Objectives',
    body: 'Learners will understand core logistics and supply chain concepts, apply warehouse and transport best practices, manage projects with clear deadlines, and build consistent daily habits through schedule and activity tracking.',
  },
]

function Info2Icon(props) {
  return <Truck {...props} />
}

export default function About() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="About LOGISTIK UPL" subtitle="Our story, purpose and what we offer." />
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="card flex gap-4 p-5 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-pink/10 text-brand-pink">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink-900 dark:text-white">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
