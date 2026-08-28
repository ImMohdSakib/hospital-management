import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Search, CheckCircle, XCircle, Loader2, Edit } from "lucide-react";
import api from "../../../services/api";
import ConfirmDialog from "../helperComponent/ConfirmDialog";

export default function DoctorsList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");

  // Delete Confirmation States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Status update loading state (per row)
  const [updatingStatus, setUpdatingStatus] = useState({});

  // ===== Toast Notification States =====
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  // Open modal
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  // Perform delete after confirmation
  const confirmDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      await api.delete(`/webadmin/users/${deleteTargetId}`);
      setData((prev) => prev.filter((user) => user.id !== deleteTargetId));
      showToast('Doctor deleted successfully!', 'success');
    } catch (err) {
      showToast('Delete failed. Please try again.', 'error');
    } finally {
      setDeleteTargetId(null);
      setShowDeleteConfirm(false);
    }
  };

  // ===== Status Change Handler =====
  const handleStatusChange = async (userId, newStatus) => {
    // Find the user from current data
    const userToUpdate = data.find((u) => u.username === userId);
    if (!userToUpdate) return;

    // Set loading for this row
    setUpdatingStatus((prev) => ({ ...prev, [userId]: true }));

    try {
      // Prepare the full user object with updated status
      const updatedUser = {
        ...userToUpdate,
        status: newStatus,
        // Ensure all required fields are present (the DTO expects them)
        // We already have all fields from the row, so it's safe.
      };

      // Send PUT request to edit endpoint
      const response = await api.put(`/webadmin/users/edit/${userId}`, updatedUser);

      // Update local state
      setData((prev) =>
        prev.map((user) =>
          user.username === userId ? { ...user, status: newStatus } : user
        )
      );

      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Failed to update status. Please try again.', 'error');
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // ✅ Fetch admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get("/webadmin/doctor/list");
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load dpctors.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Table Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "#",
        cell: (info) => info.row.index + 1,
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Full Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "dept",
        header: "Department",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "shift",
        header: "Shift",
        cell: (info) => info.getValue() || "—",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: (info) => info.getValue() || "—",
      },
      // 🔥 Status column – now inline editable
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const userId = row.original.username;
          const currentStatus = row.original.status || (row.original.active ? "ACTIVE" : "INACTIVE");
          const isUpdating = updatingStatus[userId] || false;

          return (
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(userId, e.target.value)}
              disabled={isUpdating}
              className={`rounded-full px-3 py-1 text-xs font-semibold border-0 focus:ring-2 focus:ring-teal-500 transition ${
                currentStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : currentStatus === "INACTIVE"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <option value="ACTIVE" className="bg-white text-green-700">Active</option>
              <option value="INACTIVE" className="bg-white text-red-600">Inactive</option>
            </select>
          );
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const statusA = rowA.original.status || (rowA.original.active ? "ACTIVE" : "INACTIVE");
          const statusB = rowB.original.status || (rowB.original.active ? "ACTIVE" : "INACTIVE");
          return statusA.localeCompare(statusB);
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(`/webadmin/doctor-view/${row.original.username}`)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => navigate(`/webadmin/doctor-edit/${row.original.username}`)}
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
    [navigate, data, updatingStatus]
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

  // Loading & Error states
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading Doctors...</p>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  return (
    <>
      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[999] w-full max-w-md px-4"
          >
            <div
              className={`rounded-xl shadow-lg p-4 flex items-center gap-3 text-white ${
                toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={22} className="flex-shrink-0" />
              ) : (
                <XCircle size={22} className="flex-shrink-0" />
              )}
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => setToast({ show: false, message: '', type: 'success' })}
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
            <h2 className="text-2xl font-bold text-slate-800">Doctor Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Doctors : {data.length}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/webadmin/add-user")}
            className="rounded-lg bg-teal-600 px-5 py-2 text-white font-medium whitespace-nowrap"
          >
            + Add User
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
              placeholder="Search by username, name, email, role, dept..."
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
                    No Doctor Found
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

      {/* ✅ Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Doctor?"
        message="This action cannot be undone. Are you sure you want to delete this doctor account?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}