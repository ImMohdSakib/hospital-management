import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  VenusAndMars,
  Stethoscope,
  FileText,
  Shield,
  Activity,
  Edit,
  CalendarPlus,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock3,
  Info,
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

const formatTime = (timeString) => {
  if (!timeString) return '—';
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  return `${hr12}:${minutes} ${ampm}`;
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

export default function AppointmentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/webadmin/appointments/${id}`);
        setAppointment(response.data);
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError(err.response?.data?.message || 'Failed to load appointment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Appointment...</p>
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

  if (!appointment) return null;

  // Status badge color mapping
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-gray-100 text-gray-800',
  };
  const statusIcon = {
    PENDING: <Clock3 size={16} className="text-yellow-600" />,
    CONFIRMED: <CheckCircle size={16} className="text-blue-600" />,
    COMPLETED: <CheckCircle size={16} className="text-green-600" />,
    CANCELLED: <XCircle size={16} className="text-red-600" />,
    NO_SHOW: <XCircle size={16} className="text-gray-600" />,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
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
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white">
                <CalendarPlus size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Appointment</h1>
                <p className="text-sm text-teal-100 flex items-center gap-1 mt-0.5">
                  <div className="flex items-center gap-1"> <Info size={14} /> Patient Code:   <span className="font-bold text-white "> {appointment.patientCode || "New"} </span> </div>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusColors[appointment.status] || 'bg-slate-100 text-slate-700'}`}>
                {statusIcon[appointment.status] || null}
                {appointment.status || 'PENDING'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-6">
            {/* Patient Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <User size={18} className="text-teal-600" /> Patient Details
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Name</p>
                    <p className="text-sm font-medium text-slate-800">
                      {appointment.patientCode ? (
                        <Link
                          to={`/webadmin/patient-view/${appointment.patientCode}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline"
                        >
                          {appointment.patientName}
                        </Link>
                      ) : (
                        appointment.patientName
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.patientPhone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.patientEmail || '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <VenusAndMars size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.patientGender || '—'}</p>
                  </div>
                </div>

                {appointment.patientId && (
                  <div className="flex items-start gap-3">
                    <UserPlus size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Patient ID</p>
                      <p className="text-sm font-medium text-slate-800">
                        <Link
                          to={`/webadmin/patient-view/${appointment.patientId}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline"
                        >
                          View Patient Profile
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Stethoscope size={18} className="text-teal-600" /> Doctor
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Doctor</p>
                    <p className="text-sm font-medium text-slate-800">
                      {appointment.doctorName || '—'}
                    </p>
                  </div>
                </div>
                {appointment.doctorSpecialization && (
                  <div className="flex items-start gap-3">
                    <Shield size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Specialization</p>
                      <p className="text-sm font-medium text-slate-800">{appointment.doctorSpecialization}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* Schedule */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <Calendar size={18} className="text-teal-600" /> Schedule
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Date</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Time</p>
                    <p className="text-sm font-medium text-slate-800">{formatTime(appointment.appointmentTime)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose & Notes */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                <FileText size={18} className="text-teal-600" /> Details
              </h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Purpose</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.purpose || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Notes</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.notes || '—'}</p>
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
                    <p className="text-xs text-slate-400">Created By</p>


                    {appointment.createdBy ? (
                          <Link
                            to={
                              appointment.createdByRole === "ROLE_DOCTOR" ||
                              appointment.createdByRole === "DOCTOR"
                                ? `/webadmin/doctor-view/${appointment.createdBy}`
                                : `/webadmin/admin-view/${appointment.createdBy}`
                            }
                            className="text-sm font-medium text-teal-600 hover:text-blue-800 hover:underline"
                          >
                            {appointment.createdBy}
                          </Link>
                        ) : (
                          <p className="text-sm font-medium text-slate-500">
                            By Itself
                          </p>
                        )}


                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Last Updated By</p>
                    <p className="text-sm font-medium text-slate-800">{appointment.updatedBy || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Created At</p>
                    <p className="text-sm font-medium text-slate-800">{formatDateTime(appointment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Last Updated</p>
                    <p className="text-sm font-medium text-slate-800">{formatDateTime(appointment.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => navigate(`/webadmin/appointment-edit/${appointment.id}`)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 inline-flex items-center gap-2"
          >
            <Edit size={16} /> Edit Appointment
          </button>
          <button
            onClick={() => navigate('/webadmin/appointments')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}