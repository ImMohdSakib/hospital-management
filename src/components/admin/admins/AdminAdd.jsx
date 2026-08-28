import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowLeft, UserCog, Stethoscope, Loader2, Upload } from 'lucide-react';
import api from '../../../services/api';

const initialForm = {
  username: '',
  password: '',
  email: '',
  role: 'ADMIN', // default
  name: '',
  phone: '',
  gender: '',
  dob: '',
  address: '',
  profilePhoto: '',
  status: 'ACTIVE',
  empId: '',
  joiningDate: '',
  dept: '',
  shift: '',
  salary: '',
  emergencyContact: '',
  // Doctor-only
  qualification: '',
  specialization: '',
  experience: '',
  license: '',
  consultationFee: '',
  availability: '',
};

export default function AddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Image Upload States
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');

  // Duplicate Check States
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [existingEmails, setExistingEmails] = useState([]);
  const [existingUsernames, setExistingUsernames] = useState([]);
  const emailDebounce = useRef(null);
  const usernameDebounce = useRef(null);
  const fileInputRef = useRef(null);

  // Determine back route based on role or previous page
  const getBackRoute = () => {
    if (form.role === 'ADMIN') return '/webadmin/admin-list';
    if (form.role === 'DOCTOR') return '/webadmin/doctors';
    return '/webadmin/dashboard';
  };

  // ===== Fetch existing users (to check uniqueness) =====
  useEffect(() => {
    // We need to check uniqueness across all roles, so we fetch all users.
    // Since we only have /admins endpoint, we can fetch /admins for now, but it's better to have a /all endpoint.
    // For now, we'll fetch from /admins (only admins) – but that won't detect doctors.
    // We'll use the check-username and check-email endpoints directly in debounce instead.
    // So we'll not use a list. We'll modify validation to use API calls.
    // Let's remove the list approach and use direct API calls.
    // We'll implement that in validateEmail and validateUsername.
    // For now, we'll keep the list but we need to fetch all users – we don't have that endpoint.
    // So we'll refactor to use the check endpoints.
  }, []);

  // ===== Email validation with debounce using API =====
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

    emailDebounce.current = setTimeout(async () => {
      try {
        const response = await api.get(`/webadmin/users/check-email?email=${email}`);
        const exists = response.data;
        if (exists) {
          setEmailError('❌ This email is already registered');
          setIsEmailValid(false);
        } else {
          setEmailError('');
          setIsEmailValid(true);
        }
      } catch (err) {
        console.error('Email check failed:', err);
      }
    }, 500);
  };

  // ===== Username validation with debounce using API =====
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

    usernameDebounce.current = setTimeout(async () => {
      try {
        const response = await api.get(`/webadmin/users/check-username?username=${username}`);
        const exists = response.data;
        if (exists) {
          setUsernameError('❌ This username is already taken');
          setIsUsernameValid(false);
        } else {
          setUsernameError('');
          setIsUsernameValid(true);
        }
      } catch (err) {
        console.error('Username check failed:', err);
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
      setForm((prev) => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setForm((prev) => ({ ...prev, profilePhoto: '' }));
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
    // If role changes, clear role-specific errors
    if (name === 'role') {
      // No extra action needed
    }
  };

  // ===== Validation (submit-time) =====
  const validate = () => {
    const next = {};

    if (!form.username.trim()) next.username = 'Username is required';
    else if (form.username.length < 3) next.username = 'Minimum 3 characters';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Minimum 6 characters';
    if (!form.name.trim()) next.name = 'Full name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.gender) next.gender = 'Gender is required';
    if (!form.empId.trim()) next.empId = 'Employee ID is required';
    if (!form.joiningDate) next.joiningDate = 'Joining date is required';
    if (!form.dept.trim()) next.dept = 'Department is required';
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

      const userData = {
        username: form.username,
        password: form.password,
        email: form.email,
        role: form.role,
        name: form.name,
        phone: `+91${form.phone}`,
        gender: form.gender,
        dob: form.dob,
        address: form.address,
        status: form.status,
        empId: form.empId,
        joiningDate: form.joiningDate,
        dept: form.dept,
        shift: form.shift,
        salary: form.salary,
        emergencyContact: form.emergencyContact,
        // Doctor fields (will be null/empty if admin)
        qualification: form.qualification || null,
        specialization: form.specialization || null,
        experience: form.experience ? parseInt(form.experience) : null,
        license: form.license || null,
        consultationFee: form.consultationFee ? parseFloat(form.consultationFee) : null,
        availability: form.availability || null,
      };

      formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

      if (profilePhotoFile) {
        formData.append('image', profilePhotoFile);
      }

      const response = await api.post('/webadmin/users/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('User created:', response.data);
      setDone(true);
    } catch (err) {
      console.error('Error creating user:', err);
      setSubmitError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Reset =====
  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setDone(false);
    setSubmitError('');
    setEmailError('');
    setUsernameError('');
    setIsEmailValid(true);
    setIsUsernameValid(true);
    setProfilePhotoFile(null);
    setProfilePhotoPreview('');
    setPhotoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const isDoctor = form.role === 'DOCTOR';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(getBackRoute())}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to {isDoctor ? 'Doctors' : 'Admins'}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-6 md:p-8 shadow-md ring-1 ring-slate-100"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDoctor ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
            {isDoctor ? <Stethoscope size={22} /> : <UserCog size={22} />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add New {isDoctor ? 'Doctor' : 'Admin'}</h2>
            <p className="text-sm text-slate-500">Create a {isDoctor ? 'doctor' : 'administrator'} account</p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className={labelClass}>User Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${selectClass('role')}`}
          >
            <option value="ADMIN">Administrator</option>
            <option value="DOCTOR">Doctor</option>
          </select>
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
              <h3 className="mt-4 text-xl font-bold text-emerald-900">{isDoctor ? 'Doctor' : 'Admin'} Added Successfully!</h3>
              <p className="mt-2 text-sm text-emerald-700">
                {form.name} has been added as a {form.role}.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button type="button" onClick={resetForm} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                  Add Another
                </button>
                <button
                  type="button"
                  onClick={() => navigate(getBackRoute())}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Go to {isDoctor ? 'Doctors' : 'Admin'} List
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* ===== LOGIN DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className={`mb-3 text-sm font-semibold ${isDoctor ? 'text-blue-600' : 'text-teal-600'}`}>
                  🔐 Login Credentials
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Username *</label>
                    <input
                      name="username"
                      value={form.username}
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
                  </div>

                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
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
                    <label className={labelClass}>Password *</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className={inputClass('password')}
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className={selectClass('status')}>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                  {/* role is already selected above */}
                </div>
              </div>

              {/* ===== PERSONAL DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className={`mb-3 text-sm font-semibold ${isDoctor ? 'text-blue-600' : 'text-teal-600'}`}>
                  👤 Personal Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
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
      name="phone"
      value={form.phone}
      onChange={handleChange}
      placeholder="98765 43210"
      maxLength={10}
      inputMode="numeric"
      className={`${inputClass('phone')} rounded-l-none`}
    />
  </div>

  {errors.phone && (
    <p className="mt-1 text-xs text-red-500">
      {errors.phone}
    </p>
  )}
</div>

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={selectClass('gender')}>
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
                      value={form.dob}
                      onChange={handleChange}
                      className={inputClass('dob')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Full address"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Image Upload */}
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
                      value={form.emergencyContact}
                      onChange={handleChange}
                      placeholder="+91 98765 12345"
                      className={inputClass('emergencyContact')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== EMPLOYMENT DETAILS ===== */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className={`mb-3 text-sm font-semibold ${isDoctor ? 'text-blue-600' : 'text-teal-600'}`}>
                  💼 Employment
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Employee ID *</label>
                    <input
                      name="empId"
                      value={form.empId}
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
                      value={form.joiningDate}
                      onChange={handleChange}
                      className={inputClass('joiningDate')}
                    />
                    {errors.joiningDate && <p className="mt-1 text-xs text-red-500">{errors.joiningDate}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Department *</label>
                    <input
                      name="dept"
                      value={form.dept}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology, HR"
                      className={inputClass('dept')}
                    />
                    {errors.dept && <p className="mt-1 text-xs text-red-500">{errors.dept}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Shift *</label>
                    <select name="shift" value={form.shift} onChange={handleChange} className={selectClass('shift')}>
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
                      value={form.salary}
                      onChange={handleChange}
                      placeholder="50000.00"
                      className={inputClass('salary')}
                    />
                  </div>
                </div>
              </div>

              {/* ===== MEDICAL DETAILS (Doctor only) ===== */}
              {isDoctor && (
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-blue-700">🩺 Medical Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Qualification</label>
                      <input
                        name="qualification"
                        value={form.qualification}
                        onChange={handleChange}
                        placeholder="e.g., MBBS, MD"
                        className={inputClass('qualification')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Specialization</label>
                      <input
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        placeholder="e.g., Cardiologist"
                        className={inputClass('specialization')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Experience (Years)</label>
                      <input
                        name="experience"
                        type="number"
                        value={form.experience}
                        onChange={handleChange}
                        placeholder="5"
                        className={inputClass('experience')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>License Number</label>
                      <input
                        name="license"
                        value={form.license}
                        onChange={handleChange}
                        placeholder="LIC-12345"
                        className={inputClass('license')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Consultation Fee</label>
                      <input
                        name="consultationFee"
                        type="number"
                        step="0.01"
                        value={form.consultationFee}
                        onChange={handleChange}
                        placeholder="500.00"
                        className={inputClass('consultationFee')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Availability</label>
                      <input
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        placeholder="Mon-Fri, 9AM-5PM"
                        className={inputClass('availability')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading || !isEmailValid || !isUsernameValid}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white shadow-lg ${
                  isDoctor 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25' 
                    : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/25'
                } disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating {isDoctor ? 'Doctor' : 'Admin'}...
                  </>
                ) : (
                  `Create ${isDoctor ? 'Doctor' : 'Admin'} Account`
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}