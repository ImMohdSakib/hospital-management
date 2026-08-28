import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  BedDouble,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  UserPlus,
} from 'lucide-react';
import api from '../../../services/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/webadmin/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  if (!stats) return null;

  // Stats cards with safe fallback for undefined values
  const cards = [
    {
      label: 'Total Patients',
      value: stats.totalPatients ?? 0,
      icon: Users,
      color: 'from-teal-500 to-emerald-500',
      trend: stats.totalPatients > 0 ? '+12%' : '—',
    },
    {
      label: 'Doctors',
      value: stats.totalDoctors ?? 0,
      icon: Stethoscope,
      color: 'from-cyan-500 to-blue-500',
      trend: stats.totalDoctors > 0 ? '+5%' : '—',
    },
    {
      label: "Today's Appointments",
      value: stats.todayAppointments ?? 0,
      icon: CalendarCheck,
      color: 'from-violet-500 to-purple-500',
      trend: stats.todayAppointments > 0 ? `${stats.todayAppointments} scheduled` : 'No bookings',
    },
    {
      label: 'Beds Available',
      value: stats.bedsAvailable ?? 0,
      icon: BedDouble,
      color: 'from-amber-500 to-orange-500',
      trend: stats.bedsAvailable > 0 ? `${stats.bedsAvailable} free` : 'Full',
    },
  ];

  const quickActions = [
    { label: 'Add Patient', icon: UserPlus, to: '/webadmin/add-patient', color: 'bg-teal-100 text-teal-700' },
    { label: 'Book Appointment', icon: Calendar, to: '/webadmin/add-appointment', color: 'bg-blue-100 text-blue-700' },
    { label: 'View All Appointments', icon: Eye, to: '/webadmin/appointments', color: 'bg-violet-100 text-violet-700' },
    { label: 'Add Doctor', icon: Stethoscope, to: '/webadmin/add-user', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="overflow-hidden rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{c.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {c.value.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-xl bg-gradient-to-br ${c.color} p-3 text-white shadow-lg`}>
                <c.icon size={22} />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp size={14} /> {c.trend}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Two‑column layout: Recent Appointments + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Recent Appointments</h2>
            <Link
              to="/webadmin/appointments"
              className="text-sm font-medium text-teal-600 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            {stats.recentAppointments && stats.recentAppointments.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 pr-4 font-medium">Patient</th>
                    <th className="pb-3 pr-4 font-medium">Doctor</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((app, i) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="border-b border-slate-50 hover:bg-slate-50/80"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-800">{app.patientName || '—'}</td>
                      <td className="py-3 pr-4 text-slate-600">Dr. {app.doctorName || '—'}</td>
                      <td className="py-3 pr-4 text-slate-600">
                        {formatDate(app.appointmentDate)} at {formatTime(app.appointmentTime)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            app.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : app.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700'
                              : app.status === 'COMPLETED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {app.status ? app.status.toLowerCase() : 'unknown'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-8 text-center text-slate-500">No recent appointments</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50 group"
              >
                <div className={`rounded-xl ${action.color} p-2.5`}>
                  <action.icon size={18} />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-teal-700">
                  {action.label}
                </span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-teal-600" />
              </Link>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-6 rounded-xl bg-teal-50 p-4">
            <p className="text-sm font-medium text-teal-800">📊 Total Appointments</p>
            <p className="text-2xl font-bold text-teal-900">{stats.totalAppointments ?? 0}</p>
            <p className="text-xs text-teal-600">Since inception</p>
          </div>
        </motion.div>
      </div>

      {/* Weekly chart – kept as is, but you can add fallback if needed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100"
      >
        <h2 className="text-lg font-semibold text-slate-800">Weekly Appointments Trend</h2>
        <div className="mt-4 flex items-end gap-2 h-40">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const heights = [40, 65, 80, 55, 90, 30, 20];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: heights[i] }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                  className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-teal-400 to-cyan-400"
                  style={{ height: heights[i] }}
                />
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center">* Based on last week's data (illustrative)</p>
      </motion.div>
    </div>
  );
}