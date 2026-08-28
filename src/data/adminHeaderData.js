export const adminProfile = {
  name: 'Rajesh Verma',
  role: 'Super Administrator',
  email: 'admin@medicareplus.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  lastLogin: 'Today, 9:42 AM',
}

export const adminNotifications = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'New appointment request',
    message: 'Amit Kumar booked OPD with Dr. Priya Sharma for Jul 30, 10:00 AM.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'patient',
    title: 'Patient check-in',
    message: 'Sneha Reddy checked in at Reception — Cardiology OPD.',
    time: '22 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'lab',
    title: 'Lab report ready',
    message: 'Critical values flagged for Mohammed Ali (CBC). Review in lab module.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Daily backup completed',
    message: 'Hospital database backup finished successfully at 6:00 AM.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'staff',
    title: 'Shift reminder',
    message: 'Night nursing roster updated for ICU — 4 staff changes.',
    time: 'Yesterday',
    read: true,
  },
]
