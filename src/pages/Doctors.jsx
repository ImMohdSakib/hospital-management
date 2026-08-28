import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Calendar, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:8080/api'
const BACKEND_URL = 'http://localhost:8080'

// Helper to get full image URL
const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BACKEND_URL}${path}`
}

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/public/doctors`)
        if (!res.ok) throw new Error('Failed to fetch doctors')
        const data = await res.json()
        setDoctors(data)
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Could not load doctors. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <p className="text-slate-500">Loading doctors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>
      </div>
    )
  }

  if (doctors.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-slate-500">No doctors available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-4xl font-bold text-slate-900"
      >
        Meet Our Specialists
      </motion.h1>
      <p className="mt-4 text-center text-slate-600">Book appointments with experienced consultants.</p>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {doctors.map((doc, i) => {
          const imageUrl = getImageUrl(doc.profilePhoto)
          const specialization = doc.specialization || 'General Practitioner'
          const experience = doc.experience ? `${doc.experience} yrs` : 'Experienced'
          const phone = doc.phone || ''
          // default available status (you can add a field later)
          const available = doc.status === 'ACTIVE'

          return (
            <motion.div
              key={doc.id}
              initial={{
                opacity: 0,
                x: i % 2 === 0 ? -30 : 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.5,
                ease: 'easeOut',
              }}
              className="flex h-64 flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 sm:h-64 sm:flex-row"
            >
              
              {/* Doctor Image */}
              <div className="h-56 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-full sm:w-48">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={doc.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'

                      const fallback =
                        e.target.parentElement.querySelector('.fallback-icon')

                      if (fallback) {
                        fallback.classList.remove('hidden')
                      }
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100">
                    <User size={32} className="text-slate-400" />
                  </div>
                )}

                <div className="fallback-icon hidden h-full w-full items-center justify-center bg-slate-100">
                  <User size={32} className="text-slate-400" />
                </div>
              </div>

              {/* Doctor Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {doc.name}
                  </h2>

                  <p className="font-medium text-teal-600">
                    {specialization}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {doc.experience
                      ? `${doc.experience} Years of Experience`
                      : 'Experienced'}
                  </p>

                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      available
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {available ? 'Available' : 'On leave'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      <Phone size={14} />
                      Call
                    </a>
                  )}

                  <Link
                    to={`/appointment?doctorId=${doc.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    <Calendar size={14} />
                    Book
                  </Link>
                </div>
              </div>
            </motion.div>


          )
        })}
      </div>
    </div>
  )
}