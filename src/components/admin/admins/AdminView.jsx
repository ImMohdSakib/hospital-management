import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, Mail, Phone, Calendar, MapPin, Briefcase, 
  DollarSign, Shield, Clock, UserCog, Loader2, 
  Award, Stethoscope, BadgeCheck, Users, 
  Activity, Clock3, FileText, X, Maximize2, Edit
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

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const backendUrl = (
    import.meta.env.VITE_API_URL ||
    "https://hospital-management-backend-vpco.onrender.com/api"
  ).replace(/\/api\/?$/, "");
  return `${backendUrl}${path}`;
};



  return `${backendUrl}${path}`;
};

// ===================== COMPONENT =====================

export default function AdminView() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
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

  // ===== Fetch Data =====
  useEffect(() => {
    fetchAdmin();
  }, [username]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/webadmin/users/${username}`);
      const userData = response.data;
  
      if (userData.role !== 'ADMIN') {
        navigate(`/webadmin/doctor-view/${username}`, { replace: true });
        return;
      }
  
      setAdmin(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Admin Details...</p>
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

  if (!admin) return null;

  const statusValue = admin.status || (admin.active ? 'ACTIVE' : 'INACTIVE');
  const isActive = statusValue === 'ACTIVE' || statusValue === true;
  const imageUrl = getImageUrl(admin.profilePhoto);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/admin-list')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Admins
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header with Avatar & Username */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 text-white">
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
                    alt={admin.name} 
                    className="h-full w-full object-cover" 
                  />
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <User size={40} className="text-white/80" />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{admin.name}</h1>
              <p className="text-sm text-teal-100 flex items-center gap-1 mt-0.5">
                <User size={14} /> @{admin.username}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-sm text-teal-100">
                  <Shield size={16} /> {admin.role}
                </span>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isActive ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'
                }`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 text-sm text-teal-50/80 flex items-center gap-1">
                <Mail size={14} /> {admin.email}
              </p>
            </div>
          </div>
        </div>

        {/* ====== REST OF THE DETAILS GRID (unchanged) ====== */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (everything unchanged) ... */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">🔐 Login Details</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Username</p>
                    <p className="text-sm font-medium text-slate-800">{admin.username}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-medium text-slate-800">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="text-sm font-medium text-slate-800">{admin.role}</p>
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

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">👤 Personal Information</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Full Name</p>
                    <p className="text-sm font-medium text-slate-800">{admin.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-medium text-slate-800">{admin.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Gender</p>
                    <p className="text-sm font-medium text-slate-800">{admin.gender || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Date of Birth</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(admin.dob)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="text-sm font-medium text-slate-800">{admin.address || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Emergency Contact</p>
                    <p className="text-sm font-medium text-slate-800">{admin.emergencyContact || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">💼 Employment</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-3">
                  <FileText size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="text-sm font-medium text-slate-800">{admin.empId || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Joining Date</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(admin.joiningDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="text-sm font-medium text-slate-800">{admin.dept || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Shift</p>
                    <p className="text-sm font-medium text-slate-800">{admin.shift || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={18} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400">Salary</p>
                    <p className="text-sm font-medium text-slate-800">{admin.salary ? `₹ ${admin.salary}` : '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {(admin.qualification || admin.specialization || admin.experience !== undefined || admin.license || admin.consultationFee || admin.availability) && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">🩺 Medical Details</h3>
                <div className="mt-3 space-y-3">
                  {admin.qualification && (
                    <div className="flex items-start gap-3">
                      <Award size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Qualification</p>
                        <p className="text-sm font-medium text-slate-800">{admin.qualification}</p>
                      </div>
                    </div>
                  )}
                  {admin.specialization && (
                    <div className="flex items-start gap-3">
                      <Stethoscope size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Specialization</p>
                        <p className="text-sm font-medium text-slate-800">{admin.specialization}</p>
                      </div>
                    </div>
                  )}
                  {admin.experience !== undefined && admin.experience !== null && (
                    <div className="flex items-start gap-3">
                      <Clock3 size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="text-sm font-medium text-slate-800">{admin.experience} years</p>
                      </div>
                    </div>
                  )}
                  {admin.license && (
                    <div className="flex items-start gap-3">
                      <BadgeCheck size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">License</p>
                        <p className="text-sm font-medium text-slate-800">{admin.license}</p>
                      </div>
                    </div>
                  )}
                  {admin.consultationFee && (
                    <div className="flex items-start gap-3">
                      <DollarSign size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Consultation Fee</p>
                        <p className="text-sm font-medium text-slate-800">₹ {admin.consultationFee}</p>
                      </div>
                    </div>
                  )}
                  {admin.availability && (
                    <div className="flex items-start gap-3">
                      <Clock3 size={18} className="text-teal-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-400">Availability</p>
                        <p className="text-sm font-medium text-slate-800">{admin.availability}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">📅 System Info</h3>
              <div className="mt-3 space-y-3">
              {admin.createdBy && (
                  <div className="flex items-start gap-3">
                    <User size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Created By</p>
                      <p className="text-sm font-medium text-slate-800">{admin.createdBy}</p>
                    </div>
                  </div>
                )}

                {admin.createdAt && (
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Created At</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(admin.createdAt)}</p>
                    </div>
                  </div>
                )}
                {admin.updatedAt && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400">Last Updated</p>
                      <p className="text-sm font-medium text-slate-800">{formatDateTime(admin.updatedAt)}</p>
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
            onClick={() => navigate(`/webadmin/admin-edit/${admin.username}`)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 inline-flex items-center gap-2"
          >
            <Edit size={16} />
             Edit Admin
          </button>
          <button
            onClick={() => navigate('/webadmin/admin-list')}
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