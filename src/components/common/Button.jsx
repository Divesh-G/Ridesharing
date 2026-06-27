const variants = {
  primary:
    'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300',
  secondary:
    'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300',
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
