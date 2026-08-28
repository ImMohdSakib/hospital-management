import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Shield,
  Reply,
  Trash2,
} from 'lucide-react';
import api from '../../../services/api';

// Date formatter
const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ContactView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/webadmin/contacts/${id}`);
        setContact(response.data);
      } catch (err) {
        console.error('Error fetching contact:', err);
        setError(err.response?.data?.message || 'Failed to load message details.');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading message...</p>
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

  if (!contact) return null;

  // Status badge styling
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    REPLIED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-slate-100 text-slate-700',
  };
  const statusClass = statusColors[contact.status] || 'bg-slate-100 text-slate-700';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate('/webadmin/contacts')}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-teal-600 hover:ring-teal-200"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
        Back to Messages
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md ring-1 ring-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail size={24} />
              <h1 className="text-xl font-bold">Message from {contact.name}</h1>
            </div>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
              {contact.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <User size={18} className="text-teal-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="text-sm font-medium text-slate-800">{contact.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-teal-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <a href={`mailto:${contact.email}`} className="text-sm font-medium text-teal-600 hover:underline">
                  {contact.email}
                </a>
              </div>
            </div>


            <div className="flex items-start gap-3">
              <Phone size={18} className="text-teal-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <a href={`tel:${contact.phone}`} className="text-sm font-medium text-teal-600 hover:underline">
                  {contact.phone}
                </a>
              </div>
            </div>


          </div>

          {/* Message */}
          <div>
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-teal-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-slate-400">Message</p>
                <div className="mt-1 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {contact.message}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-teal-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Received</p>
                <p className="text-sm font-medium text-slate-800">{formatDateTime(contact.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-teal-600 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400">Last Updated</p>
                <p className="text-sm font-medium text-slate-800">{formatDateTime(contact.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Reply Information (if replied) */}
          {contact.status === 'REPLIED' && contact.replyMessage && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/30 p-4">
              <h3 className="text-sm font-semibold text-teal-700 flex items-center gap-2">
                <Reply size={16} /> Reply
              </h3>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-slate-700 whitespace-pre-wrap">{contact.replyMessage}</p>
                {contact.repliedBy && (
                  <p className="text-xs text-slate-500">Replied by: {contact.repliedBy}</p>
                )}
                {contact.repliedAt && (
                  <p className="text-xs text-slate-500">Replied on: {formatDateTime(contact.repliedAt)}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 flex flex-wrap justify-end gap-3">
          {/* <button
            onClick={() => navigate(`/webadmin/contact-reply/${contact.id}`)}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 inline-flex items-center gap-2"
          >
            <Reply size={16} /> Reply
          </button> */}
          <button
            onClick={() => navigate('/webadmin/contacts')}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}