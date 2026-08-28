export const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiology', experience: '12 yrs', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop', available: true, phone: '+91 98765 43210' },
  { id: 2, name: 'Dr. Rahul Mehta', specialty: 'Neurology', experience: '15 yrs', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', available: true, phone: '+91 98765 43211' },
  { id: 3, name: 'Dr. Ananya Patel', specialty: 'Pediatrics', experience: '8 yrs', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop', available: false, phone: '+91 98765 43212' },
  { id: 4, name: 'Dr. Vikram Singh', specialty: 'Orthopedics', experience: '10 yrs', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop', available: true, phone: '+91 98765 43213' },
]

export const services = [
  { id: 1, title: 'Emergency Care', desc: '24/7 trauma & critical care with advanced life support.', icon: 'ambulance' },
  { id: 2, title: 'Diagnostics', desc: 'MRI, CT scan, lab tests with same-day reports.', icon: 'scan' },
  { id: 3, title: 'Surgery', desc: 'Minimally invasive procedures in modular OTs.', icon: 'scalpel' },
  { id: 4, title: 'Pharmacy', desc: 'In-house pharmacy with genuine medicines.', icon: 'pill' },
  { id: 5, title: 'ICU & NICU', desc: 'Dedicated critical care units with monitoring.', icon: 'heart' },
  { id: 6, title: 'Telemedicine', desc: 'Consult doctors from home via video call.', icon: 'video' },
]

export const patients = [
  { id: 'P001', name: 'Amit Kumar', age: 34, blood: 'O+', phone: '9123456780', lastVisit: '2026-07-20' },
  { id: 'P002', name: 'Sneha Reddy', age: 28, blood: 'A+', phone: '9123456781', lastVisit: '2026-07-22' },
  { id: 'P003', name: 'Mohammed Ali', age: 45, blood: 'B+', phone: '9123456782', lastVisit: '2026-07-18' },
  { id: 'P004', name: 'Kavita Desai', age: 52, blood: 'AB+', phone: '9123456783', lastVisit: '2026-07-25' },
]

export const appointments = [
  { id: 'A101', patient: 'Amit Kumar', doctor: 'Dr. Priya Sharma', date: '2026-07-30', time: '10:00', status: 'confirmed' },
  { id: 'A102', patient: 'Sneha Reddy', doctor: 'Dr. Rahul Mehta', date: '2026-07-30', time: '11:30', status: 'pending' },
  { id: 'A103', patient: 'Kavita Desai', doctor: 'Dr. Vikram Singh', date: '2026-07-31', time: '09:00', status: 'confirmed' },
  { id: 'A104', patient: 'Mohammed Ali', doctor: 'Dr. Ananya Patel', date: '2026-07-29', time: '14:00', status: 'completed' },
]

export const admins = [
  { id: 1, name: 'Super Admin', email: 'admin@hospital.com', role: 'Administrator', active: true },
  { id: 2, name: 'Reception Desk', email: 'reception@hospital.com', role: 'Staff', active: true },
  { id: 3, name: 'Lab Manager', email: 'lab@hospital.com', role: 'Staff', active: false },
]

export const stats = {
  patients: 2847,
  doctors: 48,
  appointmentsToday: 67,
  bedsAvailable: 23,
  departments: 32,
  surgeriesYearly: 4200,
  ambulanceFleet: 12,
}

export const hospitalInfo = {
  name: 'MediCare+ Multi-Specialty Hospital',
  tagline: 'NABH-accredited care since 2001',
  emergencyPhone: '108 / +91 1800-911-HELP',
  helpline: '+91 1800-123-4567',
  email: 'care@medicareplus.com',
  address: '123 Health Avenue, Andheri East, Mumbai, Maharashtra 400069',
  opdHours: 'Mon–Sat: 8:00 AM – 8:00 PM | Sun: 9:00 AM – 2:00 PM',
  emergencyHours: 'Emergency & Trauma: Open 24 hours, 365 days',
  parking: 'Free patient parking · Valet at main gate',
}

export const quickActions = [
  { title: 'Book OPD', desc: 'Choose doctor & time slot online', to: '/appointment', accent: 'teal' },
  { title: 'Emergency', desc: 'Trauma bay & ambulance dispatch', href: 'tel:108', accent: 'red' },
  { title: 'Lab Reports', desc: 'Download reports within 24 hrs', to: '/contact', accent: 'cyan' },
  { title: 'Teleconsult', desc: 'Video visit from home', to: '/services', accent: 'violet' },
]

export const whyChooseUs = [
  { title: 'NABH Accredited', desc: 'Quality protocols audited for patient safety and outcomes.' },
  { title: 'Advanced Technology', desc: '3T MRI, digital OTs, robotic-assisted surgery options.' },
  { title: 'Expert Team', desc: '48+ consultants across 32 clinical departments.' },
  { title: 'Cashless Insurance', desc: '200+ TPAs and corporate tie-ups for hassle-free billing.' },
  { title: 'Patient-First Care', desc: 'Dedicated care coordinators and multilingual staff.' },
  { title: 'Transparent Pricing', desc: 'Package rates for common procedures—no hidden charges.' },
]

export const appointmentSteps = [
  { step: '01', title: 'Choose service', desc: 'OPD, diagnostics, or procedure—pick what you need.' },
  { step: '02', title: 'Select doctor & slot', desc: 'See availability and book in under 2 minutes.' },
  { step: '03', title: 'Visit or teleconsult', desc: 'Check in at reception or join your video call.' },
  { step: '04', title: 'Follow-up & reports', desc: 'Prescriptions and lab reports in your patient record.' },
]

export const departments = [
  { name: 'Cardiology', beds: 24, icon: 'heart' },
  { name: 'Neurology', beds: 18, icon: 'brain' },
  { name: 'Orthopedics', beds: 30, icon: 'bone' },
  { name: 'Pediatrics', beds: 20, icon: 'baby' },
  { name: 'Oncology', beds: 16, icon: 'ribbon' },
  { name: 'Gynecology', beds: 22, icon: 'flower' },
  { name: 'Nephrology', beds: 14, icon: 'droplet' },
  { name: 'Gastroenterology', beds: 12, icon: 'stomach' },
]

export const accreditations = [
  'NABH Accredited',
  'ISO 9001:2015',
  'Green OT Certified',
  'Blood Bank License',
  'ICU Level-III',
  'JCI Ready Campus',
]

export const insurancePartners = [
  'Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Care Health', 'New India Assurance', 'CGHS / ECHS',
]

export const testimonials = [
  { name: 'Ramesh Iyer', location: 'Mumbai', text: 'My father\'s cardiac surgery was handled with utmost care. Staff explained every step in Hindi and English.', rating: 5 },
  { name: 'Fatima Khan', location: 'Thane', text: 'Emergency team reached within 18 minutes. ICU nurses were compassionate throughout the night.', rating: 5 },
  { name: 'Deepak Joshi', location: 'Navi Mumbai', text: 'Online appointment saved hours. Reports were on WhatsApp the same evening—very smooth experience.', rating: 5 },
]

export const healthNews = [
  { id: 1, title: 'Monsoon health: Preventing dengue & malaria at home', date: 'Jul 22, 2026', category: 'Prevention', readMin: 4 },
  { id: 2, title: 'Heart health after 40: screenings you should not skip', date: 'Jul 15, 2026', category: 'Cardiology', readMin: 6 },
  { id: 3, title: 'New pediatric vaccination camp — free slots this weekend', date: 'Jul 10, 2026', category: 'Hospital News', readMin: 3 },
]

export const homeFaqs = [
  { q: 'Do I need a referral for specialist OPD?', a: 'No referral is required for most specialties. Bring prior reports if you have them; our reception will guide you to the right department.' },
  { q: 'Which insurance plans do you accept?', a: 'We accept 200+ cashless policies including major TPAs, CGHS, ECHS, and corporate panels. Verify your policy at billing before admission.' },
  { q: 'How do I get ambulance service?', a: 'Call our 24/7 emergency line or 108. GPS-enabled ambulances depart from our trauma center with ACLS-equipped crews.' },
  { q: 'Can I get same-day lab reports?', a: 'Routine blood tests often report same day; MRI/CT may need scheduling. Urgent critical values are called to your doctor immediately.' },
  { q: 'Is parking available for attendants?', a: 'Yes—free parking for patients and one attendant vehicle. Valet service is available at the main entrance during OPD hours.' },
]

export const facilityHighlights = [
  { title: 'Modular OTs', img: 'https://images.unsplash.com/photo-1516549655169-0f7e10654746?w=600&h=400&fit=crop' },
  { title: 'Modern ICU', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop' },
  { title: 'Diagnostic Center', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop' },
  { title: 'Patient Lounge', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop' },
]
