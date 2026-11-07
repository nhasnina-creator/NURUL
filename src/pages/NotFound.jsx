import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <div className="flex justify-center pt-10">
      <EmptyState icon={Home} title="Page not found" message="The page you're looking for doesn't exist."
        action={<Link to="/" className="btn-primary mt-2">Back to Home</Link>} />
    </div>
  )
}
