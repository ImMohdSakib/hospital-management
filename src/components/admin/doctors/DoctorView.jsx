import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, Briefcase, 
  DollarSign, Shield, Clock, UserCog, Loader2, 
  Award, Stethoscope, BadgeCheck, Users, 
  Activity, Clock3, FileText, X, Maximize2, Edit, HeartPulse, GraduationCap
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

// ===================== IMAGE URL HELPER =====================

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:8080${path}`;
};

// ===================== COMPONENT =====================

export default function DoctorView() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===== Modal State =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // ===== Fetch Doctor =====
  useEffect(() => {
    fetchDoctor();
  }, [username]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/webadmin/doctor-view/${username}`);
      const userData = response.data;
  
      // ✅ Agar user DOCTOR nahi hai to admin-view par redirect
      if (userData.role !== 'DOCTOR') {
        navigate(`/webadmin/admin-view/${userData.id}`, { replace: true });
        return;
      }
  
      setDoctor(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctor details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-blue-600 animate-pulse">Loading Doctor Details...</p>
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

  if (!doctor) return null;

  const statusValue = doctor.status || (doctor.active ? 'ACTIVE' : 'INACTIVE');
  const isActive = statusValue === 'ACTIVE' || statusValue === true;
  const imageUrl = getImageUrl(doctor.profilePhoto);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/doctors')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-blue-600 hover:ring-blue-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Doctors
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header with Avatar - Blue Theme */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            {/* Profile Photo - Clickable */}
            <div 
              className="relative h-20 w-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/50 overflow-hidden cursor-pointer group"
              onClick={() => imageUrl ? openModal(imageUrl) : null}
              title={imageUrl ? "Click to enlarge" : "No image"}
            >
              {imageUrl ? (
                <>
                  <img 
                    src={imageUrl} 
                    alt={doctor.name} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <User size={40} className="text-white/80" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <p className="text-sm text-blue-100 flex items-center gap-1 mt-0.5">
                <User size={14} /> @{doctor.username}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm text-blue-100">
                  <Shield size={16} /> {doctor.role}
                </span>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isActive ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'
                }`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 text-sm text-blue-50/80 flex items-center gap-1">
                <Mail size={14} /> {doctor.email}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-6">
            {/* Login Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">🔐 Login Details</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Username</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.username}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.role}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">👤 Personal Information</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Full Name</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.gender || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(doctor.dob)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.address || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Emergency Contact</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.emergencyContact || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">💼 Employment</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.empId || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Joining Date</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(doctor.joiningDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.dept || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Shift</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.shift || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="text-sm font-medium text-slate-800">{doctor.salary ? `₹ ${doctor.salary}` : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* 🩺 MEDICAL DETAILS - Highlighted for Doctor */}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-4">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-2 flex items-center gap-2">
                <HeartPulse size={18} /> Medical Details
              </h3>
              <div className="mt-3 space-y-3">
                {doctor.qualification && (
                  <div className="flex items-start gap-3">
                    <GraduationCap size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Qualification</p>
                      <p className="text-sm font-medium text-slate-800">{doctor.qualification}</p>
                    </div>
                  </div>
                )}
                {doctor.specialization && (
                  <div className="flex items-start gap-3">
                    <Stethoscope size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Specialization</p>
                      <p className="text-sm font-medium text-slate-800">{doctor.specialization}</p>
                    </div>
                  </div>
                )}
                {doctor.experience !== undefined && doctor.experience !== null && (
                  <div className="flex items-start gap-3">
                    <Clock3 size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Experience</p>
                      <p className="text-sm font-medium text-slate-800">{doctor.experience} years</p>
                    </div>
                  </div>
                )}
                {doctor.license && (
                  <div className="flex items-start gap-3">
                    <BadgeCheck size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">License</p>
                      <p className="text-sm font-medium text-slate-800">{doctor.license}</p>
                    </div>
                  </div>
                )}
                {doctor.consultationFee && (
                  <div className="flex items-start gap-3">
                    <DollarSign size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Consultation Fee</p>
                      <p className="text-sm font-medium text-slate-800">₹ {doctor.consultationFee}</p>
                    </div>
                  </div>
                )}
                {doctor.availability && (
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Availability</p>
                      <p className="text-sm font-medium text-slate-800">{doctor.availability}</p>
                    </div>
                  </div>
                )}
                {!doctor.qualification && !doctor.specialization && doctor.experience === undefined && !doctor.license && !doctor.consultationFee && !doctor.availability && (
                  <p className="text-sm text-slate-500 italic">No medical details available</p>
                )}
              </div>
            </div>

            {/* Audit fields */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">📅 System Info</h3>
              <div className="mt-3 space-y-3">
                {doctor.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Created At</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(doctor.createdAt)}</p>
                    </div>
                  </div>
                )}
                {doctor.updatedAt && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Last Updated</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(doctor.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 flex flex-wrap justify-end gap-3">
          <button
            onClick={() => navigate(`/webadmin/doctor-edit/${doctor.username}`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Edit size={16} /> 
            Edit Doctor
          </button>
          <button
            onClick={() => navigate('/webadmin/doctors')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* ====== IMAGE MODAL (Smaller) ====== */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/30 text-white hover:bg-black/50 transition"
              >
                <X size={20} />
              </button>

              <div className="p-2">
                <img
                  src={modalImage}
                  alt="Profile Photo"
                  className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}