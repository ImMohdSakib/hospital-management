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
import { Eye, Edit, Trash2, Search, CheckCircle, XCircle, Mail, MessageCircle } from "lucide-react";
import api from "../../../services/api";
import ConfirmDialog from "../helperComponent/ConfirmDialog";

// Date formatter
const formatDate = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatDateTime = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "—";
  const datePart = formatDate(isoString);
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${datePart} ${hours}:${minutes}`;
};

export default function ContactsList() {
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
      await api.delete(`/webadmin/contacts/${deleteTargetId}`);
      setData((prev) => prev.filter((contact) => contact.id !== deleteTargetId));
      showToast("Contact message deleted successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    } finally {
      setDeleteTargetId(null);
      setShowDeleteConfirm(false);
    }
  };

  // ----- Inline Status Update -----
  const handleStatusChange = async (contactId, newStatus) => {
    const previousStatus = data.find((c) => c.id === contactId)?.status || "PENDING";

    setUpdatingStatus((prev) => ({ ...prev, [contactId]: true }));

    try {
      await api.patch(`/webadmin/contacts/${contactId}/status?status=${newStatus}`);

      // UI update on success
      setData((prev) =>
        prev.map((contact) =>
          contact.id === contactId ? { ...contact, status: newStatus } : contact
        )
      );

      showToast(`Status updated to ${newStatus}`, "success");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update status.";
      showToast(message, "error");
      // Revert on error
      setData((prev) =>
        prev.map((contact) =>
          contact.id === contactId ? { ...contact, status: previousStatus } : contact
        )
      );
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [contactId]: false }));
    }
  };

  // ----- Fetch contacts -----
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/webadmin/contacts");
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load contacts.");
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
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-slate-800">{info.getValue() || "—"}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <a href={`mailto:${info.getValue()}`} className="text-teal-600 hover:underline">
            {info.getValue() || "—"}
          </a>
        ),
      },

      {
        accessorKey: "phone",
        header: "Phone",
        cell: (info) => (
          <a href={`tel:${info.getValue()}`} className="text-teal-600 hover:underline">
            {info.getValue() || "—"}
          </a>
        ),
      },

      {
        accessorKey: "message",
        header: "Message",
        cell: (info) => {
          const msg = info.getValue() || "";
          return (
            <div className="max-w-xs truncate text-sm text-slate-600" title={msg}>
              {msg}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const contactId = row.original.id;
          const currentStatus = row.original.status || "PENDING";
          const isUpdating = updatingStatus[contactId] || false;

          const statusClasses = {
            PENDING: "bg-yellow-100 text-yellow-800",
            IN_PROGRESS: "bg-blue-100 text-blue-800",
            REPLIED: "bg-green-100 text-green-800",
            ARCHIVED: "bg-slate-100 text-slate-700",
          };

          return (
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(contactId, e.target.value)}
              disabled={isUpdating}
              className={`rounded-full px-3 py-1 text-xs font-semibold border-0 outline-none focus:ring-2 focus:ring-teal-500 transition ${
                statusClasses[currentStatus] || "bg-slate-100 text-slate-700"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REPLIED">Replied</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          );
        },
        sortingFn: (rowA, rowB) =>
          (rowA.original.status || "PENDING").localeCompare(rowB.original.status || "PENDING"),
      },
      {
        accessorKey: "createdAt",
        header: "Received",
        cell: (info) => {
          const date = info.getValue();
          return <span className="text-sm text-slate-600">{date ? formatDateTime(date) : "—"}</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => navigate(`/webadmin/contact-view/${row.original.id}`)}
              className="text-blue-600 hover:text-blue-800 transition"
              title="View"
            >
              <Eye size={18} />
            </button>
            {/* <button
              onClick={() => navigate(`/webadmin/contact-reply/${row.original.id}`)}
              className="text-teal-600 hover:text-teal-800 transition"
              title="Reply"
            >
              <MessageCircle size={18} />
            </button> */}
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
        <p className="text-lg font-semibold text-teal-600 animate-pulse">Loading contacts...</p>
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
            <h2 className="text-2xl font-bold text-slate-800">Contact Messages</h2>
            <p className="text-sm text-gray-500 mt-1">Total: {data.length}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Optional: refresh button or filter */}
          </div>
        </div>

        {/* Search + Rows per page */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by name, email, or message..."
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
                    No messages found
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
        title="Delete Message?"
        message="This action cannot be undone. Are you sure you want to delete this contact message?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}