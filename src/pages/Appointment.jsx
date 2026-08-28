import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, User, Phone, Mail, Calendar, Clock, Stethoscope } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

// Change this if your backend runs on a different host/port
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://hospital-management-backend-vpco.onrender.com/api";

const BACKEND_URL =
  API_BASE.replace(/\/api\/?$/, "");

// Helper to get full image URL
const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BACKEND_URL}${path}`
}

export default function Appointment() {
  const [done, setDone] = useState(false)

  // ----- Doctors -----
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [doctorsError, setDoctorsError] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [searchParams] = useSearchParams()
  const doctorIdFromUrl = searchParams.get('doctorId')

  // ----- Form state -----
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    purpose: '',
  })
  const [formErrors, setFormErrors] = useState({})


  // For future date and time

  // Today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0]

// Check whether selected date is today
const isToday = formData.appointmentDate === today

// Current time in HH:mm format
const now = new Date()
const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
  now.getMinutes()
).padStart(2, '0')}`

  // ----- Fetch doctors -----
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true)
        setDoctorsError('')
  
        const res = await fetch(`${API_BASE}/public/doctors`)
  
        if (!res.ok) {
          throw new Error('Failed to fetch doctors')
        }
  
        const data = await res.json()
  
        setDoctors(data)
  
        // URL se doctorId mila hai to automatically select karo
        if (doctorIdFromUrl) {
          const doctor = data.find(
            (d) => d.id === parseInt(doctorIdFromUrl, 10)
          )
  
          if (doctor && doctor.status === 'ACTIVE') {
            setSelectedDoctor(doctor)
          }
        }
  
      } catch (err) {
        console.error('Failed to load doctors:', err)
        setDoctorsError('Could not load doctors list. Please refresh the page.')
      } finally {
        setLoadingDoctors(false)
      }
    }
  
    fetchDoctors()
  }, [doctorIdFromUrl])

  const handleDoctorChange = (e) => {
    const id = e.target.value
    const doc = doctors.find(d => d.id === parseInt(id, 10))
    setSelectedDoctor(doc || null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required'
    if (!formData.patientPhone.trim()) errors.patientPhone = 'Phone number is required'
    if (!selectedDoctor) errors.doctor = 'Please select a doctor'
    if (!formData.appointmentDate) errors.appointmentDate = 'Appointment date is required'
    if (!formData.appointmentTime) errors.appointmentTime = 'Appointment time is required'
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) {
      const firstErrorField = document.querySelector('[data-error="true"]')
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const payload = {
      patientName: formData.patientName.trim(),
      patientPhone: `+91${formData.patientPhone.trim()}`,
      patientEmail: formData.patientEmail.trim() || null,
      patientGender: formData.patientGender,
      doctorId: selectedDoctor.id,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      purpose: formData.purpose.trim() || null,
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch(`${API_BASE}/public/appointments/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to submit appointment request')
      setDone(true)
    } catch (err) {
      console.error('Error submitting appointment:', err)
      setSubmitError('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setDone(false)
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientGender: '',
      appointmentDate: '',
      appointmentTime: '',
      purpose: '',
    })
    setSelectedDoctor(null)
    setFormErrors({})
    setSubmitError('')
  }

  const doctorImage = selectedDoctor ? getImageUrl(selectedDoctor.profilePhoto) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-slate-900">Book Appointment</h1>
          <p className="mt-2 text-lg text-slate-600">Choose a doctor and fill in your details to schedule a visit.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-12 max-w-lg rounded-2xl bg-emerald-50 p-12 text-center ring-1 ring-emerald-200"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 className="mx-auto text-emerald-600" size={64} />
              </motion.div>
              <h2 className="mt-4 text-2xl font-bold text-emerald-900">Appointment Requested!</h2>
              <p className="mt-2 text-emerald-700">Our team will call you shortly to confirm.</p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 text-sm font-medium text-teal-600 underline hover:text-teal-800"
              >
                Book another
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5"
            >
             


{/* ===== DOCTOR IMAGE – Large with Frame ===== */}
<div className="lg:col-span-2">
  <div className="sticky top-8">
    {selectedDoctor ? (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200 p-4"
      >
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center" style={{ minHeight: '400px' }}>
          {doctorImage ? (
            <img
              src={doctorImage}
              alt={selectedDoctor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User size={64} className="text-slate-400" />
            </div>
          )}
        </div>
      </motion.div>
    ) : (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-white/50 p-8 text-center shadow-sm ring-1 ring-slate-200/60 backdrop-blur-sm">
        <User size={48} className="text-slate-300" />
        <p className="mt-4 text-slate-500">Select a doctor from the dropdown</p>
        {/* <p className="text-xs text-slate-400">Doctor image will appear here</p> */}
      </div>
    )}
  </div>
</div>




              {/* ===== FORM (right column) – unchanged ===== */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
                  {submitError && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
                  )}
                  {doctorsError && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{doctorsError}</div>
                  )}

                  {/* Doctor selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Select Doctor *</label>
                    <select
                      value={selectedDoctor?.id || ''}
                      onChange={handleDoctorChange}
                      disabled={loadingDoctors}
                      className={`mt-1 w-full rounded-xl border ${formErrors.doctor ? 'border-red-400' : 'border-slate-200'} px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-60`}
                    >
                      <option value="">{loadingDoctors ? 'Loading doctors...' : '-- Choose a doctor --'}</option>
                      {doctors
                      .filter((d) => d.status === 'ACTIVE').map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.specialization || 'General'}
                        </option>
                      ))}
                    </select>
                    {formErrors.doctor && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.doctor}</p>
                    )}
                  </div>

                  {/* Patient details */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                      <input
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. John Doe"
                        className={`mt-1 w-full rounded-xl border ${formErrors.patientName ? 'border-red-400' : 'border-slate-200'} px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200`}
                        data-error={!!formErrors.patientName}
                      />
                      {formErrors.patientName && (
                        <p className="mt-1 text-xs text-red-500">{formErrors.patientName}</p>
                      )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                          Phone *
                        </label>

                        <div
                          className={`mt-1 flex w-full overflow-hidden rounded-xl border ${
                            formErrors.patientPhone
                              ? 'border-red-400'
                              : 'border-slate-200'
                          } focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200`}
                        >
                          {/* Country Code */}
                          <span className="flex items-center bg-slate-50 px-4 py-3 text-slate-600 border-r border-slate-200">
                            +91
                          </span>

                          {/* Phone Input */}
                          <input
                            name="patientPhone"
                            value={formData.patientPhone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10)

                              setFormData(prev => ({
                                ...prev,
                                patientPhone: value
                              }))

                              if (formErrors.patientPhone) {
                                setFormErrors(prev => ({
                                  ...prev,
                                  patientPhone: ''
                                }))
                              }
                            }}
                            required
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="98765 43210"
                            className="w-full px-4 py-3 outline-none"
                            data-error={!!formErrors.patientPhone}
                          />
                        </div>

                        {formErrors.patientPhone && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.patientPhone}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email (optional)</label>
                      <input
                        name="patientEmail"
                        value={formData.patientEmail}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="patient@email.com"
                        className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                      />
                    </div>

                    <div>
  <label className="block text-sm font-medium text-slate-700">
    Gender *
  </label>

  <select
    name="patientGender"
    value={formData.patientGender}
    onChange={handleInputChange}
    required
    className={`mt-1 w-full rounded-xl border ${
      formErrors.patientGender
        ? 'border-red-400'
        : 'border-slate-200'
    } px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200`}
    data-error={!!formErrors.patientGender}
  >
    <option value="">-- Select Gender --</option>
    <option value="MALE">Male</option>
    <option value="FEMALE">Female</option>
    <option value="OTHER">Other</option>
  </select>

  {formErrors.patientGender && (
    <p className="mt-1 text-xs text-red-500">
      {formErrors.patientGender}
    </p>
  )}
</div>

                  </div>

                  {/* Date and time */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Date *
                    </label>

                    <input
                      name="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      min={today}
                      onChange={handleInputChange}
                      required
                      className={`mt-1 w-full rounded-xl border ${
                        formErrors.appointmentDate
                          ? 'border-red-400'
                          : 'border-slate-200'
                      } px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200`}
                      data-error={!!formErrors.appointmentDate}
                    />

                    {formErrors.appointmentDate && (
                      <p className="mt-1 text-xs text-red-500">
                        {formErrors.appointmentDate}
                      </p>
                    )}
                  </div>


                  <div>
  <label className="block text-sm font-medium text-slate-700">
    Time *
  </label>

  <input
    name="appointmentTime"
    type="time"
    value={formData.appointmentTime}
    min={isToday ? currentTime : undefined}
    onChange={handleInputChange}
    required
    className={`mt-1 w-full rounded-xl border ${
      formErrors.appointmentTime
        ? 'border-red-400'
        : 'border-slate-200'
    } px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200`}
    data-error={!!formErrors.appointmentTime}
  />

  {formErrors.appointmentTime && (
    <p className="mt-1 text-xs text-red-500">
      {formErrors.appointmentTime}
    </p>
  )}
</div>


                  </div>

                  {/* Purpose / notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Symptoms / Notes (optional)</label>
                    <textarea
                      name="purpose"
                      rows={3}
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Describe your symptoms or any special requests..."
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: submitting ? 1 : 1.01 }}
                    whileTap={{ scale: submitting ? 1 : 0.99 }}
                    type="submit"
                    disabled={submitting || loadingDoctors}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}