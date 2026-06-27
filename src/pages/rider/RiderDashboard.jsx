const stats = [
  { label: 'Active Ride', value: 'None' },
  { label: 'Completed Rides', value: '0' },
  { label: 'Total Spent', value: '$0.00' },
]

function RiderDashboard() {
  return (
    <section className="w-full px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Request rides, track active trips, and view ride history.
          </p>
        </div>
        <button className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700">
          Request a Ride
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RiderDashboard
