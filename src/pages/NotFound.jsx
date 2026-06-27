import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-indigo-600 hover:underline">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
