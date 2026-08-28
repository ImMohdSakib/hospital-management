import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Clock,
  Loader2,
  FileText,
  HeartPulse,
  Stethoscope,
  Users,
  Activity,
  Award,
  BadgeCheck,
  X,
  Maximize2,
  Edit,
  UserPlus,
  Map,
  Home,
  PhoneCall,
  Pill,
  Scissors,
  AlertCircle,
  Globe,
} from 'lucide-react';
import api from '../../../services/api';

// ===================== DATE FORMATTING HELPERS =====================

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  const datePart = formatDate(isoString);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${datePart} ${hours}:${minutes} ${ampm}`;
};

// ===================== COMPONENT =====================

export default function PatientView() {
  const { patientCode } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===== Fetch Patient =====
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/webadmin/patients/${patientCode}`);
        setPatient(response.data);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError(err.response?.data?.message || 'Failed to load patient details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Patient Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>
      </div>
    );
  }

  if (!patient) return null;

  const statusColor = patient.status === 'ACTIVE' ? 'green' : patient.status === 'INACTIVE' ? 'red' : 'yellow';
  const statusLabel = patient.status || 'N/A';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
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
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header with Patient Code & Status */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/50 overflow-hidden">
              <User size={40} className="text-white/80" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-sm text-teal-100 flex items-center gap-1 mt-0.5">
                <UserPlus size={14} /> Patient Code: {patient.patientCode}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-${statusColor}-400/20 text-${statusColor}-100`}>
                  {statusLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-teal-100">
                  <Shield size={16} /> Registered
                </span>
              </div>
              {patient.email && (
                <p className="mt-1 text-sm text-teal-50/80 flex items-center gap-1">
                  <Mail size={14} /> {patient.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <User size={18} className="text-teal-600" /> Personal Information
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Full Name</p>
                    <p className="text-sm font-medium text-slate-800">{patient.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{patient.gender || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Blood Group</p>
                    <p className="text-sm font-medium text-slate-800">{patient.bloodGroup || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{patient.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{patient.email || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <MapPin size={18} className="text-teal-600" /> Address
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <Home size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-sm font-medium text-slate-800">{patient.address || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Map size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">City</p>
                    <p className="text-sm font-medium text-slate-800">{patient.city || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">State</p>
                    <p className="text-sm font-medium text-slate-800">{patient.state || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Pincode</p>
                    <p className="text-sm font-medium text-slate-800">{patient.pincode || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Country</p>
                    <p className="text-sm font-medium text-slate-800">{patient.country || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <PhoneCall size={18} className="text-teal-600" /> Emergency Contact
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Name</p>
                    <p className="text-sm font-medium text-slate-800">{patient.emergencyContactName || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* Medical Summary */}
            <div className="rounded-xl border-2 border-teal-200 bg-teal-50/30 p-4">
              <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wider border-b border-teal-200 pb-2 flex items-center gap-2">
                <HeartPulse size={18} /> Medical Summary
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Medical History</p>
                    <p className="text-sm font-medium text-slate-800">{patient.medicalHistory || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Known Diseases</p>
                    <p className="text-sm font-medium text-slate-800">{patient.knownDiseases || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Allergies</p>
                    <p className="text-sm font-medium text-slate-800">{patient.allergies || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pill size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Current Medications</p>
                    <p className="text-sm font-medium text-slate-800">{patient.currentMedications || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scissors size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Previous Surgeries</p>
                    <p className="text-sm font-medium text-slate-800">{patient.previousSurgeries || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Stethoscope size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Chronic Conditions</p>
                    <p className="text-sm font-medium text-slate-800">{patient.chronicConditions || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Clock size={18} className="text-teal-600" /> System Info
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Registered By</p>
                    <p className="text-sm font-medium text-slate-800">{patient.registeredBy || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />


                  <div>
                    <p className="text-xs text-slate-400">Last Updated By</p>

                    {patient.updatedBy ? (
                        <Link
                            to={`/webadmin/admin-view/${patient.updatedBy}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            {patient.updatedBy}
                        </Link>
                    ) : (
                        <p className="text-sm font-medium text-slate-800">—</p>
                    )}
                </div>


                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Created At</p>
                    <p className="text-sm font-medium text-slate-800">{formatDateTime(patient.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Last Updated</p>
                    <p className="text-sm font-medium text-slate-800">{formatDateTime(patient.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => navigate(`/webadmin/patient-edit/${patient.patientCode}`)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 inline-flex items-center gap-2"
          >
            <Edit size={16} /> Edit Patient
          </button>
          <button
            onClick={() => navigate('/webadmin/patients')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}