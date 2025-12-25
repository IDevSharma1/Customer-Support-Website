import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminTicketsPage = () => {
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const [assignForm, setAssignForm] = useState({
    ticketId: "",
    userId: "",
  });
  const [statusForm, setStatusForm] = useState({
    ticketId: "",
    status: "open",
  });
  const [commentForm, setCommentForm] = useState({
    ticketId: "",
    message: "",
  });

  // Admin users list for assignment dropdown
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to load users.");
    }
  };

  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.category) params.set("category", filters.category);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/tickets${buildQuery()}`);
      setTickets(res.data.tickets || []);
    } catch (err) {
      toast.error("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.category]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignForm.ticketId || !assignForm.userId) return;

    try {
      await api.patch(`/admin/tickets/${assignForm.ticketId}/assign`, {
        assignedTo: assignForm.userId,
      });
      toast.success("Ticket assigned");
      setAssignForm({ ticketId: "", userId: "" });      setUserSearch("");      fetchTickets();
    } catch (err) {
      toast.error("Failed to assign ticket");
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!statusForm.ticketId) return;

    try {
      await api.patch(`/admin/tickets/${statusForm.ticketId}/status`, {
        status: statusForm.status,
      });
      toast.success("Status updated");
      setStatusForm({ ticketId: "", status: "open" });
      fetchTickets();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentForm.ticketId || !commentForm.message) return;

    try {
      await api.post(`/admin/tickets/${commentForm.ticketId}/comments`, {
        message: commentForm.message,
      });
      toast.success("Comment added");
      setCommentForm({ ticketId: "", message: "" });
      fetchTickets();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Inovite Support – Admin</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Filters */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow">
          <h2 className="mb-3 text-base font-semibold text-slate-100">
            Filters
          </h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-input-xs select-arrow focus:border-indigo-500"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Priority
              </label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="form-input-xs select-arrow focus:border-indigo-500"
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-input-xs select-arrow focus:border-indigo-500"
              >
                <option value="">All</option>
                <option value="project">Project</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </section>

        {/* Tickets table */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100">
              All Tickets
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-slate-300">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-slate-400">No tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      ID
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Title
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Priority
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Created By
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Assigned To
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-300">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tickets.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-[10px]">
                        {t._id}
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          to={`/tickets/${t._id}`}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          {t.title}
                        </Link>
                      </td>
                      <td className="px-3 py-2 capitalize">{t.status}</td>
                      <td className="px-3 py-2 capitalize">{t.priority}</td>
                      <td className="px-3 py-2 capitalize">{t.category}</td>
                      <td className="px-3 py-2">
                        {t.createdBy
                          ? `${t.createdBy.name} (${t.createdBy.email})`
                          : "—"}
                      </td>
                      <td className="px-3 py-2">
                        {t.assignedTo
                          ? `${t.assignedTo.name} (${t.assignedTo.email})`
                          : "Unassigned"}
                      </td>
                      <td className="px-3 py-2">
                        {new Date(t.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Admin actions */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow">
          <h2 className="mb-4 text-base font-semibold text-slate-100">
            Admin Actions
          </h2>
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            {/* Assign */}
            <form onSubmit={handleAssign} className="space-y-3">
              <h3 className="text-sm font-medium text-slate-200">
                Assign Ticket
              </h3>
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Ticket ID
                </label>
                <input
                  value={assignForm.ticketId}
                  onChange={(e) =>
                    setAssignForm((p) => ({ ...p, ticketId: e.target.value }))
                  }
                  className="form-input-xs focus:border-indigo-500"
                />
              </div>
              {/* Search box */}
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Search user (name or email)
                </label>
                <input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Type to filter users..."
                  className="form-input-xs focus:border-indigo-500"
                />
              </div>

              {/* Filtered dropdown */}
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Assign to user
                </label>
                <select
                  value={assignForm.userId}
                  onChange={(e) =>
                    setAssignForm((p) => ({ ...p, userId: e.target.value }))
                  }
                  className="form-input-xs select-arrow focus:border-indigo-500"
                >
                  <option value="">Select user...</option>
                  {filteredUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email}){u.role === "admin" ? " [admin]" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-400"
              >
                Assign
              </button>
            </form>

            {/* Update status */}
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              <h3 className="text-sm font-medium text-slate-200">
                Update Status
              </h3>
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Ticket ID
                </label>
                <input
                  value={statusForm.ticketId}
                  onChange={(e) =>
                    setStatusForm((p) => ({ ...p, ticketId: e.target.value }))
                  }
                  className="form-input-xs focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Status
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) =>
                    setStatusForm((p) => ({ ...p, status: e.target.value }))
                  }
                  className="form-input-xs select-arrow focus:border-indigo-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-400"
              >
                Update
              </button>
            </form>

            {/* Add comment */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <h3 className="text-sm font-medium text-slate-200">
                Add Comment
              </h3>
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Ticket ID
                </label>
                <input
                  value={commentForm.ticketId}
                  onChange={(e) =>
                    setCommentForm((p) => ({
                      ...p,
                      ticketId: e.target.value,
                    }))
                  }
                  className="form-input-xs focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">
                  Message
                </label>
                <textarea
                  value={commentForm.message}
                  onChange={(e) =>
                    setCommentForm((p) => ({
                      ...p,
                      message: e.target.value,
                    }))
                  }
                  rows={3}
                  className="form-textarea-xs focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-400"
              >
                Add Comment
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminTicketsPage;
