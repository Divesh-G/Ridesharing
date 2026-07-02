import Button from '../components/common/Button'
import ApiSetupNotice from '../components/common/ApiSetupNotice'
import RideStatusBadge from '../components/ride/RideStatusBadge'
import { useRideHistory } from '../hooks/useRideHistory'

function formatTimestamp(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function History() {
  const { entries, loading, error, reload } = useRideHistory()

  return (
    <section className="w-full px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
          <p className="mt-1 text-gray-600">
            Completed, cancelled, and rejected rides saved from every dashboard.
          </p>
        </div>
        <Button variant="secondary" onClick={reload} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error.message}
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-500">Loading ride history…</p>
        ) : entries.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">No ride history yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Route</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Rider</th>
                <th className="px-6 py-3 font-medium">Driver</th>
                <th className="px-6 py-3 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id ?? entry.rideId}>
                  <td className="px-6 py-4 text-gray-900">
                    {entry.pickupLabel ?? 'Pickup'} → {entry.dropoffLabel ?? 'Dropoff'}
                  </td>
                  <td className="px-6 py-4">
                    <RideStatusBadge status={entry.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-600">{entry.rider ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{entry.driver ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{formatTimestamp(entry.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ApiSetupNotice />
    </section>
  )
}

export default History
