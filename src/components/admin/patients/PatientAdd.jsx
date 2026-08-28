import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import api from '../../../services/api';

// Enum options (matching backend enums)
const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'];
const BLOOD_GROUP_OPTIONS = [
  'A_POSITIVE',
  'A_NEGATIVE',
  'B_POSITIVE',
  'B_NEGATIVE',
  'AB_POSITIVE',
  'AB_NEGATIVE',
  'O_POSITIVE',
  'O_NEGATIVE',
  'UNKNOWN'
];
const PATIENT_STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'DISCHARGED', 'DECEASED'];

const initialForm = {

  name: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  emergencyContactName: '',
  medicalHistory: '',
  knownDiseases: '',
  allergies: '',
  currentMedications: '',
  previousSurgeries: '',
  chronicConditions: '',
  status: 'ACTIVE',
};

export default function AddPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.dateOfBirth) next.dateOfBirth = 'Date of birth is required';
    if (!form.gender) next.gender = 'Gender is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.address.trim()) next.address = 'Address is required';

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setSubmitError('');

    try {
      const payload = {
        ...form,
        // Convert empty strings to null for optional fields
        email: form.email.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        pincode: form.pincode.trim() || null,
        emergencyContactName: form.emergencyContactName.trim() || null,
        medicalHistory: form.medicalHistory.trim() || null,
        knownDiseases: form.knownDiseases.trim() || null,
        allergies: form.allergies.trim() || null,
        currentMedications: form.currentMedications.trim() || null,
        previousSurgeries: form.previousSurgeries.trim() || null,
        chronicConditions: form.chronicConditions.trim() || null,
        bloodGroup: form.bloodGroup || null,
      };

      const response = await api.post('/webadmin/patients/add', payload);
      console.log('Patient created:', response.data);
      setDone(true);
    } catch (err) {
      console.error('Error creating patient:', err);
      setSubmitError(err.response?.data?.message || 'Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setDone(false);
    setSubmitError('');
  };

  // Styling helpers
  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
    }`;

  const selectClass = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
      errors[field] ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
    }`;

  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/patients')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Patients
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 md:p-8 shadow-md ring-1 ring-slate-100"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <UserPlus size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Register New Patient</h2>
            <p className="text-sm text-slate-500">Enter patient details to create a new record</p>
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
              <h3 className="mt-4 text-xl font-bold text-emerald-900">Patient Registered!</h3>
              <p className="mt-2 text-sm text-emerald-700">
                {form.name} has been added successfully.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={resetForm} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                  Add Another
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/webadmin/patients')}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Go to Patient List
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ===== PATIENT IDENTIFICATION ===== */}
              {/* <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">🆔 Patient Identification</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Patient Code *</label>
                    <input
                      name="patientCode"
                      value={form.patientCode}
                      onChange={handleChange}
                      placeholder="e.g. P-1001"
                      className={inputClass('patientCode')}
                    />
                    {errors.patientCode && <p className="mt-1 text-xs text-red-500">{errors.patientCode}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Registration Number *</label>
                    <input
                      name="registrationNumber"
                      value={form.registrationNumber}
                      onChange={handleChange}
                      placeholder="e.g. REG-2025-001"
                      className={inputClass('registrationNumber')}
                    />
                    {errors.registrationNumber && <p className="mt-1 text-xs text-red-500">{errors.registrationNumber}</p>}
                  </div>
                </div>
              </div> */}

              {/* ===== PERSONAL INFORMATION ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">👤 Personal Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Patient's full name"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className={inputClass('dateOfBirth')}
                    />
                    {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={selectClass('gender')}>
                      <option value="">Select gender</option>
                      {GENDER_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={selectClass('bloodGroup')}>
                      <option value="">Select blood group</option>
                      {BLOOD_GROUP_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="patient@email.com"
                      className={inputClass('email')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== ADDRESS INFORMATION ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">📍 Address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address *</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Street, locality, landmark"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                        errors.address ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-teal-500'
                      }`}
                    />
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Mumbai"
                      className={inputClass('city')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="e.g. Maharashtra"
                      className={inputClass('state')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className={inputClass('pincode')}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="India"
                      className={inputClass('country')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== EMERGENCY CONTACT ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">📞 Emergency Contact</h3>
                <div className="grid gap-4 sm:grid-cols-1">
                  <div>
                    <label className={labelClass}>Emergency Contact Name</label>
                    <input
                      name="emergencyContactName"
                      value={form.emergencyContactName}
                      onChange={handleChange}
                      placeholder="Name of emergency contact"
                      className={inputClass('emergencyContactName')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== MEDICAL SUMMARY ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">🩺 Medical Summary</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Medical History</label>
                    <textarea
                      name="medicalHistory"
                      value={form.medicalHistory}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Past medical history"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Known Diseases</label>
                    <textarea
                      name="knownDiseases"
                      value={form.knownDiseases}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Known diseases or conditions"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Allergies</label>
                    <textarea
                      name="allergies"
                      value={form.allergies}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Known allergies (drugs, food, etc.)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Current Medications</label>
                    <textarea
                      name="currentMedications"
                      value={form.currentMedications}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Medications currently taking"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Previous Surgeries</label>
                    <textarea
                      name="previousSurgeries"
                      value={form.previousSurgeries}
                      onChange={handleChange}
                      rows="2"
                      placeholder="List of past surgeries"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Chronic Conditions</label>
                    <textarea
                      name="chronicConditions"
                      value={form.chronicConditions}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Chronic/long-term conditions"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ===== STATUS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">📌 Status</h3>
                <div>
                  <label className={labelClass}>Patient Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={selectClass('status')}>
                    {PATIENT_STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Registering Patient...
                  </>
                ) : (
                  'Register Patient'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}