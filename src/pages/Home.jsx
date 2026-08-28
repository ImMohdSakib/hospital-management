import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  Activity,
  Phone,
  Ambulance,
  CalendarCheck,
  FileText,
  Video,
  Star,
  MapPin,
  Mail,
  Building2,
  BadgeCheck,
  Heart,
  Brain,
  Bone,
  Baby,
  Ribbon,
  Flower2,
  Droplets,
  Stethoscope,
  Siren,
} from 'lucide-react';
import {
  services,
  stats,
  hospitalInfo,
  quickActions,
  whyChooseUs,
  appointmentSteps,
  departments,
  accreditations,
  insurancePartners,
  testimonials,
  healthNews,
  homeFaqs,
  facilityHighlights,
} from '../data/mockData';
import { staggerContainer, fadeUp } from '../components/ui/PageTransition';
import HomeFAQ from './HomeFAQ';

// ---- Helper for image URLs ----
const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://hospital-management-backend-vpco.onrender.com/api";

const BACKEND_URL =
  API_BASE.replace(/\/api\/?$/, "");

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BACKEND_URL}${path}`;
};

const deptIcons = {
  heart: Heart,
  brain: Brain,
  bone: Bone,
  baby: Baby,
  ribbon: Ribbon,
  flower: Flower2,
  droplet: Droplets,
  stomach: Stethoscope,
};

const quickIcons = [CalendarCheck, Siren, FileText, Video];

function SectionHeader({ eyebrow, title, desc, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h2>
      {desc && <p className="mt-3 text-slate-600">{desc}</p>}
    </motion.div>
  );
}

export default function Home() {
  // ----- State for doctors (fetched from backend) -----
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const res = await fetch(`${API_BASE}/public/doctors`);
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setDoctorsError('Could not load doctors. Please refresh the page.');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      {/* Emergency strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-600 px-4 py-2.5 text-center text-sm text-white"
      >
        <span className="inline-flex flex-wrap items-center justify-center gap-2 font-medium">
          <Siren size={16} className="animate-pulse" />
          Medical emergency? Call{' '}
          <a href="tel:108" className="underline underline-offset-2">
            108
          </a>{' '}
          or{' '}
          <a href={`tel:${hospitalInfo.helpline.replace(/\s/g, '')}`} className="font-bold underline">
            {hospitalInfo.helpline}
          </a>
          — Ambulance & trauma team available 24/7
        </span>
      </motion.div>

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden px-4 py-16 text-white sm:py-24 lg:py-28">
        {/* ... hero content unchanged ... */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:px-8">
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {accreditations.slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur"
                >
                  <BadgeCheck size={14} /> {badge}
                </span>
              ))}
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-sm font-semibold uppercase tracking-widest text-teal-100">
              {hospitalInfo.tagline}
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Your Health, Our <span className="text-cyan-200">Priority</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-lg text-lg text-teal-50/90">
              {stats.departments} departments, {stats.doctors}+ specialists, advanced diagnostics, and round-the-clock
              emergency care at {hospitalInfo.name}.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-4 flex items-center gap-2 text-teal-100">
              <Phone size={18} />
              <span>
                Helpline: <strong className="text-white">{hospitalInfo.helpline}</strong>
              </span>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-teal-800 shadow-xl transition hover:scale-105"
              >
                Book Appointment
                <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </Link>
              <Link
                to="/doctors"
                className="rounded-full border-2 border-white/40 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white/10"
              >
                Find a Doctor
              </Link>
              <Link to="/contact" className="rounded-full px-4 py-3.5 text-sm font-medium text-teal-100 underline-offset-4 hover:underline">
                Directions & contact
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="animate-float rounded-3xl bg-white/10 p-6 backdrop-blur-lg ring-1 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop"
                alt="Hospital building"
                className="rounded-2xl shadow-2xl"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl"
              >
                <p className="text-2xl font-bold text-teal-700">{stats.bedsAvailable}</p>
                <p className="text-xs text-slate-500">Beds available now</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="absolute -right-2 top-8 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-xl"
              >
                <p className="text-xs font-medium opacity-90">Emergency</p>
                <p className="text-lg font-bold">24/7 Open</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick actions – unchanged */}
      <section className="relative z-10 -mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => {
            const Icon = quickIcons[i] || CalendarCheck
            const inner = (
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-100"
              >
                <div
                  className={`inline-flex w-fit rounded-xl p-2.5 ${
                    action.accent === 'red'
                      ? 'bg-red-100 text-red-600'
                      : action.accent === 'cyan'
                        ? 'bg-cyan-100 text-cyan-700'
                        : action.accent === 'violet'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-teal-100 text-teal-700'
                  }`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{action.title}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-600">{action.desc}</p>
                <span className="mt-3 text-sm font-medium text-teal-600">Learn more →</span>
              </motion.div>
            )
            return action.href ? (
              <a key={action.title} href={action.href}>
                {inner}
              </a>
            ) : (
              <Link key={action.title} to={action.to}>
                {inner}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: Users, label: 'Patients treated', value: `${stats.patients.toLocaleString()}+` },
            { icon: Activity, label: 'Appointments today', value: stats.appointmentsToday },
            { icon: Building2, label: 'Clinical departments', value: stats.departments },
            { icon: Ambulance, label: 'Ambulances on fleet', value: stats.ambulanceFleet },
            { icon: Shield, label: 'Years of trust', value: '25+' },
            { icon: Clock, label: 'Emergency care', value: '24/7' },
            { icon: Stethoscope, label: 'Surgeries / year', value: `${(stats.surgeriesYearly / 1000).toFixed(1)}k+` },
            { icon: BadgeCheck, label: 'Expert doctors', value: `${stats.doctors}+` },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 text-center shadow-sm"
            >
              <item.icon className="mx-auto text-teal-600" size={28} />
              <p className="mt-2 text-2xl font-bold text-teal-900">{item.value}</p>
              <p className="text-xs text-slate-600">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why choose us – unchanged */}
      <section className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why MediCare+"
            title="Care built around patients, not paperwork"
            desc="From admission to discharge, we combine clinical excellence with clear communication and support for families."
            center
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6"
              >
                <h3 className="font-semibold text-teal-300">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Simple process"
          title="How to get care at our hospital"
          desc="Whether it is a routine check-up or planned surgery, these steps keep your visit smooth."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {appointmentSteps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-6 ring-1 ring-teal-100"
            >
              <span className="text-3xl font-black text-teal-200">{s.step}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/appointment"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-teal-700"
          >
            Start booking <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Departments – unchanged */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Departments"
            title="Multi-specialty care under one roof"
            desc={`Explore ${stats.departments} departments with dedicated wards, nursing teams, and consultant rosters.`}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d, i) => {
              const Icon = deptIcons[d.icon] || Stethoscope
              return (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{d.name}</h3>
                    <p className="text-xs text-slate-500">{d.beds} beds · OPD daily</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            Plus ENT, dermatology, psychiatry, physiotherapy, dental, and more —{' '}
            <Link to="/services" className="font-semibold text-teal-600 hover:underline">
              view all services
            </Link>
          </p>
        </div>
      </section>

      {/* Services – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Services" title="End-to-end clinical services" desc="Emergency, diagnostics, surgery, pharmacy, ICU, and telemedicine—integrated for faster recovery." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100"
            >
              <h3 className="text-lg font-semibold text-teal-800">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency highlight – unchanged */}
      <section className="mx-4 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 to-red-700 py-12 text-white sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 lg:flex-row lg:justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold">Emergency & trauma center</h2>
            <p className="mt-3 max-w-xl text-red-100">
              Level-III trauma bay, stroke & cardiac protocols, blood bank on-site, and {stats.ambulanceFleet} GPS ambulances.
              Average door-to-doctor time under 8 minutes for critical cases.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-red-50">
              <li>• {hospitalInfo.emergencyHours}</li>
              <li>• Triage nurse at entrance 24/7</li>
              <li>• Dedicated pediatric emergency zone</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="tel:108"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-red-700 shadow-xl"
            >
              <Phone size={20} /> Call 108
            </a>
            <a
              href={`tel:${hospitalInfo.emergencyPhone.split('/')[1]?.trim().replace(/\s/g, '') || '1800911'}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 font-semibold"
            >
              Hospital ER line
            </a>
          </motion.div>
        </div>
      </section>

      {/* Facilities – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Facilities" title="Modern infrastructure for safer outcomes" desc="Modular operating theatres, infection-controlled ICUs, and patient-friendly recovery spaces." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilityHighlights.map((f, i) => (
            <motion.figure
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              className="group overflow-hidden rounded-2xl shadow-lg"
            >
              <img src={f.img} alt={f.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-110" />
              <figcaption className="bg-white py-3 text-center text-sm font-semibold text-slate-800">{f.title}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ===== DYNAMIC DOCTORS SECTION ===== */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Doctors"
            title="Meet our leading specialists"
            desc="Book OPD with cardiologists, neurologists, pediatricians, orthopedists, and more."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {loadingDoctors ? (
              // Show skeleton while loading
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100 animate-pulse"
                >
                  <div className="h-48 w-full bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                    <div className="h-3 w-1/3 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded mt-2" />
                  </div>
                </div>
              ))
            ) : doctorsError ? (
              <div className="col-span-full text-center text-red-600">{doctorsError}</div>
            ) : doctors.length === 0 ? (
              <div className="col-span-full text-center text-slate-500">No doctors available at the moment.</div>
            ) : (
              doctors.slice(0, 4).map((doc, i) => {
                const imageUrl = getImageUrl(doc.profilePhoto);
                const specialty = doc.specialization || 'General Practitioner';
                const experience = doc.experience ? `${doc.experience} yrs` : 'Experienced';

                return (
                  <motion.article
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100"
                  >
                    <div className="h-48 w-full overflow-hidden bg-slate-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={doc.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.fallback-icon');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <Stethoscope size={32} className="text-slate-400" />
                        </div>
                      )}
                      <div className="fallback-icon hidden flex h-full w-full items-center justify-center bg-slate-100">
                        <Stethoscope size={32} className="text-slate-400" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900">Dr. {doc.name}</h3>
                      <p className="text-sm text-teal-600">{specialty}</p>
                      <p className="mt-1 text-xs text-slate-500">{experience}</p>
                      <Link
                         to={`/appointment?doctorId=${doc.id}`}
                        className="mt-3 inline-block text-sm font-medium text-teal-600 hover:underline">
                        Book with this doctor
                      </Link>
                    </div>
                  </motion.article>
                );
              })
            )}
          </div>
          <div className="mt-10 text-center">
            <Link to="/doctors" className="font-semibold text-teal-600 hover:underline">
              Full doctor directory →
            </Link>
          </div>
        </div>
      </section>

      {/* Accreditations & insurance – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader center={false} eyebrow="Trust" title="Accreditations & quality" desc="We maintain national quality benchmarks and regular clinical audits." />
            <div className="mt-8 flex flex-wrap gap-3">
              {accreditations.map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 ring-1 ring-teal-100"
                >
                  <BadgeCheck size={16} /> {a}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader center={false} eyebrow="Insurance" title="Cashless & reimbursement partners" desc="Present your policy card at admission desk—we coordinate with major TPAs." />
            <div className="mt-8 flex-wrap flex gap-2">
              {insurancePartners.map((p) => (
                <span key={p} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials – unchanged */}
      <section className="bg-teal-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Patient stories" title="What families say about us" desc="Real feedback from patients across Mumbai and Navi Mumbai." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white/10 p-6 backdrop-blur ring-1 ring-white/20"
              >
                <div className="flex gap-1 text-amber-300">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-teal-50">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold">
                  {t.name} · <span className="font-normal text-teal-200">{t.location}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Health news – unchanged */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Health hub" title="Tips, prevention & hospital updates" desc="Stay informed with articles reviewed by our clinical team." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {healthNews.map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{n.category}</span>
              <h3 className="mt-2 font-semibold text-slate-900">{n.title}</h3>
              <p className="mt-3 text-xs text-slate-500">
                {n.date} · {n.readMin} min read
              </p>
              <button type="button" className="mt-4 text-sm font-medium text-teal-600 hover:underline">
                Read article
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Hours & location – unchanged */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-100"
          >
            <SectionHeader center={false} eyebrow="Visit us" title="Hours & location" />
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              <li className="flex gap-3">
                <Clock className="shrink-0 text-teal-600" size={20} />
                <div>
                  <p className="font-medium text-slate-900">OPD</p>
                  <p>{hospitalInfo.opdHours}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Siren className="shrink-0 text-red-500" size={20} />
                <div>
                  <p className="font-medium text-slate-900">Emergency</p>
                  <p>{hospitalInfo.emergencyHours}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="shrink-0 text-teal-600" size={20} />
                <div>
                  <p className="font-medium text-slate-900">Address</p>
                  <p>{hospitalInfo.address}</p>
                  <p className="mt-1 text-slate-500">{hospitalInfo.parking}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="shrink-0 text-teal-600" size={20} />
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <a href={`mailto:${hospitalInfo.email}`} className="text-teal-600 hover:underline">
                    {hospitalInfo.email}
                  </a>
                </div>
              </li>
            </ul>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-600 hover:underline">
              Contact form & map <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl bg-slate-200 shadow-inner ring-1 ring-slate-200"
          >
            <iframe
              title="Hospital location map"
              className="h-full min-h-[320px] w-full border-0 grayscale-[30%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.85%2C19.11%2C72.88%2C19.14&layer=mapnik&marker=19.125%2C72.865"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ – unchanged */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Common questions" desc="Quick answers before your visit. For billing or records, call our helpline." />
        <div className="mt-10">
          <HomeFAQ items={homeFaqs} />
        </div>
      </section>

      {/* Final CTA – unchanged */}
      <section className="mx-4 mb-16 sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-hero px-8 py-14 text-center text-white shadow-2xl"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to take the next step?</h2>
          <p className="mx-auto mt-4 max-w-xl text-teal-100">
            Book an OPD slot, speak to our care desk, or walk in to emergency—we are here when you need us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/appointment" className="rounded-full bg-white px-8 py-3.5 font-semibold text-teal-800 shadow-lg hover:scale-105 transition">
              Book appointment
            </Link>
            <Link to="/about" className="rounded-full border-2 border-white/40 px-8 py-3.5 font-semibold hover:bg-white/10">
              About our hospital
            </Link>
          </div>
        </motion.div>
        {/* <button
          type="button"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="mt-3 text-xs text-red-500 underline hover:text-red-700"
        >
          🧹 Clear Stored Data (Fix Login Loop)
        </button> */}
      </section>
    </div>
  );
}