import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900">
        Ride Sharing Simulation Platform
      </h1>
      <p className="max-w-xl text-gray-600">
        Simulate rider and driver experiences in real time, from ride
        requests to matching and trip tracking.
      </p>
      <div className="flex gap-4">
        <Link to="/rider">
          <Button variant="primary">Rider Dashboard</Button>
        </Link>
        <Link to="/driver">
          <Button variant="secondary">Driver Dashboard</Button>
        </Link>
      </div>
    </section>
  )
}

export default Home
