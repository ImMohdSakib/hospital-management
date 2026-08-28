import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowLeft, CalendarPlus, Loader2, User, Phone, Mail, Stethoscope } from 'lucide-react';
import api from '../../../services/api';

// Status options (matching backend enum)
const APPOINTMENT_STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

export default function AddAppointment() {
  const navigate = useNavigate();

  // ----- Form state -----
  const [form, setForm] = useState({
    patientId: '',           // selected patient ID (optional)
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    purpose: '',
    notes: '',
    status: 'PENDING',
    patientGender: "",
  });

  // ----- UI states -----
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');


  // For future date and time...

  const today = new Date();

const todayDate = today.toISOString().split("T")[0];

const currentTime = today.toTimeString().slice(0, 5);

  // ----- Fetch patients & doctors on mount -----
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientsRes, doctorsRes] = await Promise.all([
          api.get('/webadmin/patients'),
          api.get('/webadmin/doctor/list'),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error('Failed to load data:', err);
        setSubmitError('Could not load patients or doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ----- Handlers -----
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'patientId') {
      const selectedPatient = patients.find(
        (p) => String(p.id) === String(value)
      );
  
      if (selectedPatient) {
        setForm((prev) => ({
          ...prev,
          patientId: value,
          patientName: selectedPatient.name || '',
          patientPhone: selectedPatient.phone || '',
          patientEmail: selectedPatient.email || '',
          patientGender: selectedPatient.gender || '',
        }));
      } else {
        // No patient selected
        setForm((prev) => ({
          ...prev,
          patientId: '',
          patientName: '',
          patientPhone: '',
          patientEmail: '',
        }));
      }
  
      return;
    }
  
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  
    if (submitError) {
      setSubmitError('');
    }
  };

  const validate = () => {
    const next = {};
    if (!form.doctorId) next.doctorId = 'Please select a doctor';
    if (!form.appointmentDate) next.appointmentDate = 'Appointment date is required';
    if (!form.appointmentTime) next.appointmentTime = 'Appointment time is required';
    if (!form.patientName.trim()) next.patientName = 'Patient name is required';
    if (!form.patientPhone.trim()) next.patientPhone = 'Patient phone is required';
    if (!form.patientGender) next.patientGender = 'Patient gender is required';
    // email is optional
    return next;
  };

  // ----- Submit -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        patientId: form.patientId
        ? parseInt(form.patientId, 10)
        : null,
        patientName: form.patientName.trim(),
        patientPhone: form.patientPhone.trim(),
        patientEmail: form.patientEmail.trim() || null,
        doctorId: parseInt(form.doctorId, 10),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        purpose: form.purpose.trim() || null,
        notes: form.notes.trim() || null,
        status: form.status,
        patientGender: form.patientGender,
      };

      const response = await api.post('/webadmin/appointments/add', payload);
      console.log('Appointment created:', response.data);
      setDone(true);
    } catch (err) {
      console.error('Error creating appointment:', err);
      setSubmitError(err.response?.data?.message || 'Failed to create appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ----- Reset after success -----
  const resetForm = () => {
    setForm({
      patientId: '',
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      purpose: '',
      notes: '',
      status: 'PENDING',
      gender: '',
    });
    setErrors({});
    setDone(false);
    setSubmitError('');
  };

  // ----- Styling helpers -----
  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
    }`;

  const selectClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
    }`;

  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/appointments')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Appointments
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 md:p-8 shadow-md ring-1 ring-slate-100"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <CalendarPlus size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">New Appointment</h2>
            <p className="text-sm text-slate-500">Book a new appointment</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{submitError}</div>
        )}

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-emerald-50 p-10 text-center ring-1 ring-emerald-200"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <CheckCircle2 className="mx-auto text-emerald-600" size={56} />
              </motion.div>
              <h3 className="mt-4 text-xl font-bold text-emerald-900">Appointment Booked!</h3>
              <p className="mt-2 text-sm text-emerald-700">
                Appointment for {form.patientName} has been created.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={resetForm} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                  Book Another
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/webadmin/appointments')}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Go to Appointments
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ===== PATIENT DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
  <h3 className="mb-3 text-sm font-semibold text-teal-600">
    👤 Patient Details
  </h3>

  <div className="grid gap-4 sm:grid-cols-2">

    {/* Existing Patient */}
    <div>
      <label className={labelClass}>Select Existing Patient</label>

      <select
        name="patientId"
        value={form.patientId}
        onChange={handleChange}
        className={selectClass('patientId')}
      >
        <option value="">
          -- Select patient (optional) --
        </option>

        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.patientCode} - {p.name} ({p.phone})
          </option>
        ))}
      </select>
    </div>

    <div className="sm:col-span-2">
      <div className="text-xs text-slate-400 mb-2">
        Or fill in new patient details below:
      </div>
    </div>

    {/* Patient Name */}
    <div>
      <label className={labelClass}>Patient Name *</label>

      <input
        name="patientName"
        value={form.patientName}
        onChange={handleChange}
        placeholder="Full name"
        className={inputClass('patientName')}
      />

      {errors.patientName && (
        <p className="mt-1 text-xs text-red-500">
          {errors.patientName}
        </p>
      )}
    </div>

            {/* Phone */}
          <div>
            <label className={labelClass}>Phone *</label>

            <div className="mt-1 flex">
              {/* Fixed +91 */}
              <span className="flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                +91
              </span>

              {/* Phone Input */}
              <input
                name="patientPhone"
                value={form.patientPhone}
                onChange={handleChange}
                placeholder="98765 43210"
                maxLength={10}
                inputMode="numeric"
                className={`${inputClass('patientPhone')} rounded-l-none`}
              />
            </div>

            {errors.patientPhone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.patientPhone}
              </p>
            )}
          </div>

            {/* Gender */}
            <div>
              <label className={labelClass}>Gender *</label>

              <select
                name="patientGender"
                value={form.patientGender}
                onChange={handleChange}
                className={selectClass('patientGender')}
              >
                <option value="">-- Select gender --</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              {errors.patientGender && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.patientGender}
                </p>
              )}
            </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>

                <input
                  name="patientEmail"
                  value={form.patientEmail}
                  onChange={handleChange}
                  placeholder="patient@email.com"
                  className={inputClass('patientEmail')}
                />
              </div>

            </div>
          </div>

              {/* ===== DOCTOR & APPOINTMENT DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">👨‍⚕️ Doctor & Schedule</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Doctor *</label>
                    <select
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      className={selectClass('doctorId')}
                    >
                      <option value="">-- Select doctor --</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          Dr. {doc.name} ({doc.specialization || 'General'})
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && <p className="mt-1 text-xs text-red-500">{errors.doctorId}</p>}
                  </div>


                  <div>
  <label className={labelClass}>Appointment Date *</label>

  <input
    name="appointmentDate"
    type="date"
    value={form.appointmentDate}
    min={todayDate}
    onChange={handleChange}
    className={inputClass('appointmentDate')}
  />

  {errors.appointmentDate && (
    <p className="mt-1 text-xs text-red-500">
      {errors.appointmentDate}
    </p>
  )}
</div>


<div>
  <label className={labelClass}>Appointment Time *</label>

  <input
    name="appointmentTime"
    type="time"
    value={form.appointmentTime}
    min={form.appointmentDate === todayDate ? currentTime : undefined}
    onChange={handleChange}
    className={inputClass('appointmentTime')}
  />

  {errors.appointmentTime && (
    <p className="mt-1 text-xs text-red-500">
      {errors.appointmentTime}
    </p>
  )}
</div>




                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={selectClass('status')}
                    >
                      {APPOINTMENT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ===== PURPOSE & NOTES ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">📝 Details</h3>
                <div className="grid gap-4">
                  <div>
                    <label className={labelClass}>Purpose</label>
                    <textarea
                      name="purpose"
                      value={form.purpose}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Reason for appointment"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Additional Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Any extra notes"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Booking Appointment...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}