import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import PublicLayout from "./components/layout/PublicLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";

import Login from "./pages/admin/Login";

import AdminLayout from "./components/admin/layout/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";
import AdminList from "./components/admin/admins/AdminList";
import AdminAdd from "./components/admin/admins/AdminAdd";
import AdminEdit from "./components/admin/admins/AdminEdit";
import AdminView from "./components/admin/admins/AdminView";
import AdminProfile from "./components/admin/admins/AdminProfile";
import DoctorsList from "./components/admin/doctors/DoctorsList";
import DoctorView from "./components/admin/doctors/DoctorView";
import DoctorEdit from "./components/admin/doctors/DoctorEdit";
import PatientsList from "./components/admin/patients/PatientsList";
import PatientAdd from "./components/admin/patients/PatientAdd";
import PatientView from "./components/admin/patients/PatientView";
import PatientEdit from "./components/admin/patients/PatientEdit";
import AppointmentsList from "./components/admin/appointments/AppointmentsList";
import AppointmentView from "./components/admin/appointments/AppointmentView";
import AppointmentEdit from "./components/admin/appointments/AppointmentEdit";
import AppointmentAdd from "./components/admin/appointments/AppointmentAdd";
import ContactsList from "./components/admin/contacts/ContactsList";
import ContactView from "./components/admin/contacts/ContactView";
import Settings from "./components/admin/settings/Settings";

function App() {
  return (


        <Routes>

          {/* ================= PUBLIC WEBSITE ================= */}

          <Route element={<PublicLayout />}>

            <Route index element={<Home />} />

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/services" element={<Services />} />

            <Route path="/doctors" element={<Doctors />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/appointment" element={<Appointment />} />

          </Route>


          {/* ================= LOGIN ================= */}

          <Route element={<PublicRoute />}>

            <Route
              path="/webadmin/login"
              element={<Login />}
            />

          </Route>


          {/* ================= ADMIN ================= */}

          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]} />}
          >

            <Route
              path="/webadmin"
              element={<AdminLayout />}
            >

              <Route
                index
                element={<Navigate to="dashboard" replace />}
              />

              <Route
                path="dashboard"
                element={<Dashboard />}
              />

              <Route
                path="admin-list"
                element={<AdminList />}
              />

              <Route
                path="add-user"
                element={<AdminAdd />}
              />

              <Route 
                path="admin-edit/:username" 
                element={<AdminEdit />} />

              {/* <Route 
                path="admin-view/:id" 
                element={<AdminView />} /> */}

              <Route 
                path="profile" 
                element={<AdminProfile />} />

              <Route
                path="doctors"
                element={<DoctorsList />}
              />

              <Route 
                path="admin-view/:username" 
                element={<AdminView />} />

              <Route 
                path="doctor-view/:username" 
                element={<DoctorView />} />

              <Route 
                path="doctor-edit/:username" 
                element={<DoctorEdit />} />



{/* Patients-------------------------------- */}
              <Route
                path="patients"
                element={<PatientsList />}
              />

              <Route
                path="add-patient"
                element={<PatientAdd />}
              />

              <Route
                path="patient-view/:patientCode"
                element={<PatientView  />}
              />

              <Route
                path="patient-edit/:patientCode"
                element={<PatientEdit  />}
              />


{/* =========================================================== */}


{/* ==========Appointments=================== */}

              <Route
                path="appointments"
                element={<AppointmentsList />}
              />

              <Route
                path="settings"
                element={<Settings />}
              />

              <Route
                path="add-appointment"
                element={<AppointmentAdd />}
              />

              <Route
                path="appointment-view/:id"
                element={<AppointmentView  />}
              />

              <Route
                path="appointment-edit/:id"
                element={<AppointmentEdit  />}
              />

            {/* Contacts */}


            <Route
              path="contacts"
              element={<ContactsList />}
            />

            <Route
                path="contact-view/:id"
                element={<ContactView />}
              />


            </Route>
          </Route>


          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>


  );
}

export default App;
