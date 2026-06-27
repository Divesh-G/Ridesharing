import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

const features = [
  {
    icon: '📍',
    title: 'Real-Time Tracking',
    description: 'Watch rides move from pickup to drop-off as they happen.',
  },
  {
    icon: '⚡',
    title: 'Smart Matching',
    description: 'Riders and drivers are paired using simulated demand logic.',
  },
  {
    icon: '📊',
    title: 'Trip Insights',
    description: 'Review trip history, earnings, and activity at a glance.',
  },
]

function Home() {
  return (
    <>
      <section className="relative flex w-full flex-col items-center gap-6 overflow-hidden bg-linear-to-b from-indigo-50 via-white to-white px-8 py-28 text-center">
        <div className="absolute top-0 left-1/2 h-72 w-160 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
        <span className="relative rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
          Simulation Platform
        </span>
        <h1 className="relative max-w-3xl text-5xl font-extrabold tracking-tight text-gray-900">
          Ride Sharing,{' '}
          <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Simulated
          </span>
        </h1>
        <p className="relative max-w-xl text-lg text-gray-600">
          Simulate rider and driver experiences in real time, from ride
          requests to matching and trip tracking.
        </p>
        <div className="relative flex gap-4 pt-2">
          <Link to="/rider">
            <Button variant="primary">Rider Dashboard</Button>
          </Link>
          <Link to="/driver">
            <Button variant="secondary">Driver Dashboard</Button>
          </Link>
        </div>
      </section>

      <section className="grid w-full gap-6 px-8 py-16 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-3xl">{feature.icon}</span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {feature.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export default Home
