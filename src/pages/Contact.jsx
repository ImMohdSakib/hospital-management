import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: `+91${formData.phone}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message');
      }

      setSuccess(true);
      // Don't reset immediately – the success screen is shown.
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setSuccess(false);
    setError('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {success ? (
          // ===== SUCCESS SCREEN =====
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="mx-auto max-w-lg rounded-2xl bg-white p-12 text-center shadow-xl ring-1 ring-slate-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              </div>
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-slate-900">Message Sent!</h2>
            <p className="mt-2 text-slate-600">
              Thank you, <strong>{formData.name}</strong>! Our team will get back to you shortly.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-medium text-white shadow-lg hover:bg-teal-700 transition"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          // ===== CONTACT FORM =====
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-12 lg:grid-cols-2"
          >
            {/* Left column – info */}
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl font-bold text-slate-900">Get in Touch</h1>
              <p className="mt-4 text-slate-600">
                Questions about treatment, billing, or visits? We are here to help.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: MapPin, text: '123 Health Avenue, Andheri East, Mumbai 400069' },
                  { icon: Phone, text: '+91 1800-123-4567 (24/7 Helpline)' },
                  { icon: Mail, text: 'care@medicareplus.com' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 text-slate-700">
                    <item.icon className="mt-0.5 shrink-0 text-teal-600" size={20} />
                    {item.text}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right column – form */}
            <motion.form
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-200"
            >
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <div className="flex w-full overflow-hidden rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
                <span className="flex items-center bg-slate-50 px-4 py-3 text-slate-600 border-r border-slate-200">
                  +91
                </span>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    handleChange({
                      target: { name: 'phone', value },
                    });
                  }}
                  required
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  className="w-full px-4 py-3 outline-none"
                />
              </div>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Message"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}