import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Edit, Trash2, Search, CheckCircle, XCircle, Calendar, Clock, User, Phone } from "lucide-react";
import api from "../../../services/api";
import ConfirmDialog from "../helperComponent/ConfirmDialog";

// Date & time formatters
const formatDate = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (timeString) => {
  if (!timeString) return "—";
  const [hours, minutes] = timeString.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr12 = h % 12 || 12;
  return `${hr12}:${minutes} ${ampm}`;
};

export default function AppointmentsList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  // Delete modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Inline status update loading state (per row)
  const [updatingStatus, setUpdatingStatus] = useState({});

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  // ----- Delete -----
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/webadmin/appointments/${deleteTargetId}`);
      setData((prev) => prev.filter((app) => app.id !== deleteTargetId));
      showToast("Appointment deleted successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    } finally {
      setDeleteTargetId(null);
      setShowDeleteConfirm(false);
    }
  };

// ----- Inline Status Update -----
const handleStatusChange = async (appointmentId, newStatus) => {
  const previousStatus =
    data.find((app) => app.id === appointmentId)?.status || "PENDING";

  setUpdatingStatus((prev) => ({
    ...prev,
    [appointmentId]: true,
  }));

  try {
    await api.patch(
      `/webadmin/appointments/${appointmentId}/status?status=${newStatus}`
    );

    // API successful hone ke baad hi UI update karo
    setData((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? { ...app, status: newStatus }
          : app
      )
    );

    showToast(`Status updated to ${newStatus}`, "success");

  } catch (err) {
    // Backend ka exact message show karo
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      "Failed to update appointment status.";

    showToast(message, "error");

    // Failed hone par old status hi rahega
    setData((prev) =>
      prev.map((app) =>
        app.id === appointmentId
          ? { ...app, status: previousStatus }
          : app
      )
    );

  } finally {
    setUpdatingStatus((prev) => ({
      ...prev,
      [appointmentId]: false,
    }));
  }
};
  // ----- Fetch appointments -----
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/webadmin/appointments");
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  // ----- Table Columns -----
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        size: 50,
      },
      // {
      //   accessorKey: "appointmentCode",
      //   header: "Appointment ID",
      //   cell: (info) => (
      //     <span className="font-semibold text-teal-600">{info.getValue() || "—"}</span>
      //   ),
      // },
      {
        accessorKey: "patientName",
        header: "Patient Name",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800">{info.getValue() || "—"}</span>
          </div>
        ),
      },
      {
  id: "patientCode",
  header: "Patient Id",
  accessorFn: (row) => row.patient?.patientCode || "New",

  cell: (info) => {
    const value = info.getValue();
    const patient = info.row.original.patient;

    if (value === "New" || !patient) {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
          New
        </span>
      );
    }

    return (
      <Link
        to={`/webadmin/patient-view/${patient.patientCode}`}
        className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-200 hover:underline"
      >
        {patient.patientCode}
      </Link>
    );
  },
},
      {
        accessorKey: "patientPhone",
        header: "Phone",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="text-slate-600">{info.getValue() || "—"}</span>
          </div>
        ),
      },
      {
        id: "doctor",
        header: "Doctor",
        accessorFn: (row) => row.doctor?.name || "—",
      
        cell: (info) => {
          const doctor = info.row.original.doctor;
      
          if (!doctor) {
            return <span className="text-slate-400">—</span>;
          }
      
          return (
            <Link
              to={`/webadmin/doctor-view/${doctor.username}`}
              className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
            >
               {doctor.name}
            </Link>
          );
        },
      },
      
      {
        accessorKey: "appointmentDate",
        header: "Date",
        cell: (info) => {
          const date = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span>{date ? formatDate(date) : "—"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "appointmentTime",
        header: "Time",
        cell: (info) => {
          const time = info.getValue();
          return (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span>{time ? formatTime(time) : "—"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const appId = row.original.id;
          const currentStatus = row.original.status || "PENDING";
          const isUpdating = updatingStatus[appId] || false;

          const statusClasses = {
            PENDING: "bg-yellow-100 text-yellow-800",
            CONFIRMED: "bg-blue-100 text-blue-800",
            COMPLETED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
          };

          return (
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(appId, e.target.value)}
              disabled={isUpdating}
              className={`rounded-full px-3 py-1 text-xs font-semibold border-0 outline-none focus:ring-2 focus:ring-teal-500 transition ${
                statusClasses[currentStatus] || "bg-slate-100 text-slate-700"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          );
        },
        sortingFn: (rowA, rowB) =>
          (rowA.original.status || "PENDING").localeCompare(rowB.original.status || "PENDING"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => navigate(`/webadmin/appointment-view/${row.original.id}`)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="View"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => navigate(`/webadmin/appointment-edit/${row.original.id}`)}
              className="text-amber-600 hover:text-amber-800 transition"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className="text-red-600 hover:text-red-800 transition"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
        enableSorting: false,
        size: 120,
      },
    ],
    [navigate, updatingStatus]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-full max-w-md px-4"
          >
            <div
              className={`rounded-xl shadow-lg p-4 flex items-center gap-3 text-white ${
                toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle size={22} className="flex-shrink-0" />
              ) : (
                <XCircle size={22} className="flex-shrink-0" />
              )}
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => setToast({ show: false, message: "", type: "success" })}
                className="text-white/80 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-white shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b p-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
            <p className="text-sm text-gray-500 mt-1">Total: {data.length}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/webadmin/add-appointment")}
            className="rounded-lg bg-teal-600 px-5 py-2 text-white font-medium whitespace-nowrap"
          >
            + New Appointment
          </motion.button>
        </div>

        {/* Search + Rows per page */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by patient name, phone, appointment ID..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Rows:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                table.setPageIndex(0);
              }}
              className="rounded border border-gray-200 px-3 py-1.5 text-sm font-medium bg-white focus:border-teal-500 focus:outline-none"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && " ↑"}
                        {header.column.getIsSorted() === "desc" && " ↓"}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: row.index * 0.05 }}
                    className="hover:bg-teal-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 p-4">
          <div className="text-sm text-gray-500">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{" "}
            of {data.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Appointment?"
        message="This action cannot be undone. Are you sure you want to delete this appointment?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}