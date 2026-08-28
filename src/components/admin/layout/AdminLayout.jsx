import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import AdminNotifications from './AdminNotifications'
import AdminUserMenu from './AdminUserMenu'
import { Search } from 'lucide-react'

const titles = {
  dashboard: 'Dashboard',

  'admin-list': 'Admin Users',
  'add-user': 'Add User',
  'add-patient' : "Add Patient",
  doctors: 'Doctors',
  patients: 'Patients',
  appointments: 'Appointments',
  settings: 'Settings',
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const segment = location.pathname.split('/').pop() || 'dashboard'
  const title = titles[segment] || 'Admin'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-slate-800"
          >
            {title}
          </motion.h1>
          <div className="flex items-center gap-4">

            {/* Search ==== */}

            {/* <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 sm:flex">
              <Search size={18} className="text-slate-400" />
              <input placeholder="Search..." className="bg-transparent text-sm outline-none w-40" />
            </div> */}


            <AdminNotifications />
            <AdminUserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
