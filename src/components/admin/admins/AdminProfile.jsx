import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  DollarSign, Shield, Clock, UserCog, ArrowLeft, 
  Edit, Camera, Loader2, Award, Stethoscope, BadgeCheck, 
  Users, Activity, FileText, X, Maximize2
} from 'lucide-react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

// ===================== IMAGE URL HELPER =====================

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:8080${path}`;
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const { token, role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===== Modal State =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scroll
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
    return `${datePart}, ${hours}:${minutes} ${ampm}`;
  };

  // ===================== FETCH PROFILE =====================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/webadmin/users/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  // ===================== LOADING / ERROR =====================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Profile...</p>
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

  if (!profile) return null;

  // Determine status
  const statusValue = profile.status || (profile.active ? 'ACTIVE' : 'INACTIVE');
  const isActive = statusValue === 'ACTIVE' || statusValue === true;
  const imageUrl = getImageUrl(profile.profilePhoto);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/dashboard')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header with Avatar & Username */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {/* Profile Photo - Clickable */}
              <div
                className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/50 overflow-hidden cursor-pointer group"
                onClick={() => imageUrl ? openModal(imageUrl) : null}
                title={imageUrl ? "Click to enlarge" : "No image"}
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt={profile.name} className="h-full w-full object-cover" />
                    {/* Hover overlay with zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                      <Maximize2 size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <User size={48} className="text-white/80" />
                )}
              </div>
              {/* <button className="absolute bottom-0 right-0 rounded-full bg-white p-1.5 text-teal-600 shadow-lg hover:bg-teal-50 transition">
                <Camera size={16} />
              </button> */}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-sm text-teal-100 flex items-center justify-center md:justify-start gap-1 mt-0.5">
                <User size={14} /> @{profile.username}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm text-teal-100">
                  <Shield size={16} /> {profile.role}
                </span>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isActive ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'
                }`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 text-sm text-teal-50/80 flex items-center justify-center md:justify-start gap-1">
                <Mail size={14} /> {profile.email}
              </p>
              {/* Last Login – formatted */}
              <p className="mt-1 text-xs text-teal-50/60">
                Last login: {profile.lastLogin ? formatDateTime(profile.lastLogin) : 'N/A'}
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
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Username</p>
                    <p className="text-sm font-medium text-slate-800">{profile.username}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="text-sm font-medium text-slate-800">{profile.role}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity size={18} className="text-teal-600 mt-0.5" />
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
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Full Name</p>
                    <p className="text-sm font-medium text-slate-800">{profile.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{profile.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{profile.gender || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(profile.dob)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-sm font-medium text-slate-800">{profile.address || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Emergency Contact</p>
                    <p className="text-sm font-medium text-slate-800">{profile.emergencyContact || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className="space-y-6">
            {/* Employment Details */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">💼 Employment</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="text-sm font-medium text-slate-800">{profile.empId || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Joining Date</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(profile.joiningDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="text-sm font-medium text-slate-800">{profile.dept || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Shift</p>
                    <p className="text-sm font-medium text-slate-800">{profile.shift || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="text-sm font-medium text-slate-800">{profile.salary ? `₹ ${profile.salary}` : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor-specific fields (if present) */}
            {(profile.qualification || profile.specialization || profile.experience !== undefined || profile.license || profile.consultationFee || profile.availability) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">🩺 Medical Details</h3>
                <div className="mt-3 space-y-3">
                  {profile.qualification && (
                    <div className="flex items-start gap-3">
                      <Award size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Qualification</p>
                        <p className="text-sm font-medium text-slate-800">{profile.qualification}</p>
                      </div>
                    </div>
                  )}
                  {profile.specialization && (
                    <div className="flex items-start gap-3">
                      <Stethoscope size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Specialization</p>
                        <p className="text-sm font-medium text-slate-800">{profile.specialization}</p>
                      </div>
                    </div>
                  )}
                  {profile.experience !== undefined && profile.experience !== null && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="text-sm font-medium text-slate-800">{profile.experience} years</p>
                      </div>
                    </div>
                  )}
                  {profile.license && (
                    <div className="flex items-start gap-3">
                      <BadgeCheck size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">License</p>
                        <p className="text-sm font-medium text-slate-800">{profile.license}</p>
                      </div>
                    </div>
                  )}
                  {profile.consultationFee && (
                    <div className="flex items-start gap-3">
                      <DollarSign size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Consultation Fee</p>
                        <p className="text-sm font-medium text-slate-800">₹ {profile.consultationFee}</p>
                      </div>
                    </div>
                  )}
                  {profile.availability && (
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Availability</p>
                        <p className="text-sm font-medium text-slate-800">{profile.availability}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Audit Fields */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">📅 System Info</h3>
              <div className="mt-3 space-y-3">
                {profile.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Created At</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(profile.createdAt)}</p>
                    </div>
                  </div>
                )}
                {profile.updatedAt && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Last Updated</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(profile.updatedAt)}</p>
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
            onClick={() => navigate(`/webadmin/admin-edit/${profile.username}`)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 inline-flex items-center gap-2"
          >
            <Edit size={16} />
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/webadmin/dashboard')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Done
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

              {/* Optional caption */}
              {/* <div className="text-center text-xs text-gray-500 pb-3">
                Click outside to close
              </div> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}