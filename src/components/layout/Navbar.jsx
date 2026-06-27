import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/rider', label: 'Rider' },
  { to: '/driver', label: 'Driver' },
]

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="flex w-full items-center justify-between px-8 py-4">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            🚗
          </span>
          RideShare
        </span>
        <div className="flex items-center gap-8">
          <ul className="flex gap-8">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-indigo-600 after:transition-transform after:content-[''] ${
                      isActive
                        ? 'text-indigo-600 after:scale-x-100'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Log Out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Log In
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
