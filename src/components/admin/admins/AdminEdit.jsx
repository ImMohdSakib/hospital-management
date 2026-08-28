import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowLeft, UserCog, Loader2, Upload, X } from 'lucide-react';
import api from '../../../services/api';

// ===== IMAGE URL HELPER =====
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  // Use the same base URL as your API (without /api)
  // Adjust this to your backend IP/domain
  const base = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:8080';
  return `${base}${path}`;
};

export default function AdminEdit() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // ===== Image Upload States =====
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  // ===== Duplicate Check States =====
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const emailDebounce = useRef(null);
  const usernameDebounce = useRef(null);

  // ===== Fetch admin data and all users for uniqueness check =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch admin data
        const adminRes = await api.get(`/webadmin/users/${username}`);
        const adminData = adminRes.data;

        // 2. Fetch all admins (for uniqueness check, excluding current)
        const allRes = await api.get('/webadmin/users/admins');
        const allUsers = allRes.data;

        const emails = allUsers
          .filter(user => user.id !== adminData.id)
          .map(user => user.email.toLowerCase());
        const usernames = allUsers
          .filter(user => user.id !== adminData.id)
          .map(user => user.username.toLowerCase());

        setExistingEmails(emails);
        setExistingUsernames(usernames);

        // 3. Set form with existing data
        setForm(adminData);
        setIsEmailValid(true);
        setIsUsernameValid(true);

        // 4. Set image preview if existing photo
        if (adminData.profilePhoto) {
          setProfilePhotoPreview(getImageUrl(adminData.profilePhoto));
        }

      } catch (err) {
        console.error(err);
        setSubmitError(err.response?.data?.message || 'Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // ===== Validation functions =====
  const validateEmail = (email) => {
    if (emailDebounce.current) clearTimeout(emailDebounce.current);

    if (!email.trim()) {
      setEmailError('Email is required');
      setIsEmailValid(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email');
      setIsEmailValid(false);
      return;
    }

    emailDebounce.current = setTimeout(() => {
      const lowerEmail = email.toLowerCase();
      if (existingEmails.includes(lowerEmail)) {
        setEmailError('❌ This email is already registered');
        setIsEmailValid(false);
      } else {
        setEmailError('');
        setIsEmailValid(true);
      }
    }, 500);
  };

  const validateUsername = (username) => {
    if (usernameDebounce.current) clearTimeout(usernameDebounce.current);

    if (!username.trim()) {
      setUsernameError('Username is required');
      setIsUsernameValid(false);
      return;
    }
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      setIsUsernameValid(false);
      return;
    }
    if (username.includes(' ')) {
      setUsernameError('Username cannot contain spaces');
      setIsUsernameValid(false);
      return;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(username)) {
      setUsernameError('Only letters, numbers, underscore, and dot allowed');
      setIsUsernameValid(false);
      return;
    }

    usernameDebounce.current = setTimeout(() => {
      const lowerUsername = username.toLowerCase();
      if (existingUsernames.includes(lowerUsername)) {
        setUsernameError('❌ This username is already taken');
        setIsUsernameValid(false);
      } else {
        setUsernameError('');
        setIsUsernameValid(true);
      }
    }, 500);
  };

  // ===== Cleanup timers =====
  useEffect(() => {
    return () => {
      if (emailDebounce.current) clearTimeout(emailDebounce.current);
      if (usernameDebounce.current) clearTimeout(usernameDebounce.current);
    };
  }, []);

  // ===== Image upload handlers =====
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, JPG, WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size must be less than 5MB.');
      return;
    }

    setPhotoError('');
    setProfilePhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setPhotoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ===== Handlers =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');

    if (name === 'email') {
      validateEmail(newValue);
    }
    if (name === 'username') {
      validateUsername(newValue);
    }
  };

  // ===== Validation (submit-time) =====
  const validate = () => {
    const next = {};

    if (!form.username?.trim()) next.username = 'Username is required';
    else if (form.username.length < 3) next.username = 'Minimum 3 characters';
    if (!form.email?.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password && form.password.length < 6) {
      next.password = 'Minimum 6 characters';
    }
    if (!form.name?.trim()) next.name = 'Full name is required';
    if (!form.phone?.trim()) next.phone = 'Phone number is required';
    if (!form.gender) next.gender = 'Gender is required';
    if (!form.empId?.trim()) next.empId = 'Employee ID is required';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required';
    if (!form.dept?.trim()) next.dept = 'Department is required';
    if (!form.shift) next.shift = 'Shift is required';

    if (!isEmailValid) {
      next.email = emailError || 'Email is invalid or already exists';
    }
    if (!isUsernameValid) {
      next.username = usernameError || 'Username is invalid or already taken';
    }

    return next;
  };

  // ===== Submit =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setSubmitError('');

    try {
      const formData = new FormData();

    // Prepare user data (without profilePhoto – we'll handle it via image)
    const userData = {
      ...form,
      password: form.password || undefined,
      // NOTE: previous logic here was buggy — all 3 ternary branches returned `null`,
      // so profilePhoto was being set to null on EVERY submit, deleting the image
      // even when the user never touched it. Fixed below.
    };

    // Case 1: User selected a NEW image file to upload.
    // -> We don't send profilePhoto in JSON at all; backend will set the new
    //    path itself after saving the uploaded "image" file.
    if (profilePhotoFile) {
      delete userData.profilePhoto;
    }
    // Case 2: User explicitly removed the image (clicked "Remove")
    // -> No file selected AND no preview left -> tell backend to delete existing photo.
    else if (!profilePhotoFile && !profilePhotoPreview) {
      userData.profilePhoto = null;
    }
    // Case 3: User didn't touch the photo at all (no new file, preview still same as before)
    // -> Keep existing profilePhoto value as-is (already spread in from ...form), do nothing.

      // If user removed the image (no preview and no file), set profilePhoto to null
      if (!profilePhotoFile && !profilePhotoPreview) {
        userData.profilePhoto = null;
      }

      // Remove password if empty
      if (!userData.password) delete userData.password;

      // Append user JSON
      formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

      // Append image if selected
      if (profilePhotoFile) {
        formData.append('image', profilePhotoFile);
      }

      const response = await api.put(`/webadmin/users/edit-with-image/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Admin updated:', response.data);
      setDone(true);
    } catch (err) {
      console.error('Error updating admin:', err);
      setSubmitError(err.response?.data?.message || 'Failed to update admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Reset / Cancel =====
  const resetForm = () => {
    navigate('/webadmin/admin-list');
  };

  // ===== Loading =====
  if (loading && !form) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Admin Data...</p>
      </div>
    );
  }

  if (!form) return null;

  // ===== Styling =====
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
        onClick={() => navigate('/webadmin/admin-list')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Admins
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 md:p-8 shadow-md ring-1 ring-slate-100"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <UserCog size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Edit Admin</h2>
            <p className="text-sm text-slate-500">Update administrator account details</p>
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
              <h3 className="mt-4 text-xl font-bold text-emerald-900">Admin Updated Successfully!</h3>
              <p className="mt-2 text-sm text-emerald-700">
                {form.name}'s account has been updated.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/webadmin/admin-list')}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Go to Admin List
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ===== LOGIN DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">🔐 Login Credentials</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* <div>
                    <label className={labelClass}>Username *</label>
                    <input
                      name="username"
                      value={form.username || ''}
                      onChange={handleChange}
                      placeholder="e.g. admin_john"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                        errors.username || usernameError
                          ? 'border-red-400 focus:border-red-500'
                          : usernameError === '' && form.username
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                    />
                    {usernameError && <p className="mt-1 text-xs text-red-500">{usernameError}</p>}
                    {errors.username && !usernameError && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                    {!usernameError && form.username && form.username.length >= 3 && (
                      <p className="mt-1 text-xs text-green-600">✅ Username available</p>
                    )}
                  </div> */}

                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email || ''}
                      onChange={handleChange}
                      placeholder="john@hospital.com"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                        errors.email || emailError
                          ? 'border-red-400 focus:border-red-500'
                          : emailError === '' && form.email
                          ? 'border-green-400 focus:border-green-500'
                          : 'border-slate-200 focus:border-teal-500'
                      }`}
                    />
                    {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                    {errors.email && !emailError && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    {!emailError && form.email && /^\S+@\S+\.\S+$/.test(form.email) && (
                      <p className="mt-1 text-xs text-green-600">✅ Email available</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>New Password (optional)</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password || ''}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className={inputClass('password')}
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select name="status" value={form.status || ''} onChange={handleChange} className={selectClass('status')}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                  <input type="hidden" name="role" value="ADMIN" />
                </div>
              </div>

              {/* ===== PERSONAL DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">👤 Personal Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      name="name"
                      value={form.name || ''}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone || ''}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" value={form.gender || ''} onChange={handleChange} className={selectClass('gender')}>
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      value={form.dob || ''}
                      onChange={handleChange}
                      className={inputClass('dob')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea
                      name="address"
                      value={form.address || ''}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Full address"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* 🔥 Image Upload Area */}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Profile Photo</label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="flex-1">
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition ${
                            photoError ? 'border-red-400 bg-red-50' : 'border-slate-300'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center gap-1 pointer-events-none">
                            <Upload size={28} className="text-slate-400" />
                            <p className="text-sm text-slate-500">Click to upload or drag & drop</p>
                            <p className="text-xs text-slate-400">JPEG, PNG, WEBP up to 5MB</p>
                          </div>
                        </div>
                        {photoError && <p className="mt-1 text-xs text-red-500">{photoError}</p>}
                      </div>

                      {/* Preview */}
                      {profilePhotoPreview && (
                        <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                          <img
                            src={profilePhotoPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition text-white text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Emergency Contact</label>
                    <input
                      name="emergencyContact"
                      value={form.emergencyContact || ''}
                      onChange={handleChange}
                      placeholder="+91 98765 12345"
                      className={inputClass('emergencyContact')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== EMPLOYMENT DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-teal-600">💼 Employment</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Employee ID *</label>
                    <input
                      name="empId"
                      value={form.empId || ''}
                      onChange={handleChange}
                      placeholder="EMP-001"
                      className={inputClass('empId')}
                    />
                    {errors.empId && <p className="mt-1 text-xs text-red-500">{errors.empId}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Joining Date *</label>
                    <input
                      name="joiningDate"
                      type="date"
                      value={form.joiningDate || ''}
                      onChange={handleChange}
                      className={inputClass('joiningDate')}
                    />
                    {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Department *</label>
                    <input
                      name="dept"
                      value={form.dept || ''}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, HR"
                      className={inputClass('dept')}
                    />
                    {errors.dept && <p className="mt-1 text-xs text-red-500">{errors.dept}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Shift *</label>
                    <select name="shift" value={form.shift || ''} onChange={handleChange} className={selectClass('shift')}>
                      <option value="">Select shift</option>
                      <option value="MORNING">Morning</option>
                      <option value="EVENING">Evening</option>
                      <option value="NIGHT">Night</option>
                      <option value="ROTATIONAL">Rotational</option>
                    </select>
                    {errors.shift && <p className="mt-1 text-xs text-red-500">{errors.shift}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Salary</label>
                    <input
                      name="salary"
                      type="number"
                      step="0.01"
                      value={form.salary || ''}
                      onChange={handleChange}
                      placeholder="50000.00"
                      className={inputClass('salary')}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.99 }}
                  type="submit"
                  disabled={loading || !isEmailValid || !isUsernameValid}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-700 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Updating Admin...
                    </>
                  ) : (
                    'Update Admin'
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={() => navigate('/webadmin/admin-list')}
                  className="px-6 py-3.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}