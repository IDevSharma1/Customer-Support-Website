import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.jsx";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "general",
  });
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get("/tickets");
      setTickets(res.data.tickets || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/tickets", form);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        category: "general",
      });
      toast.success("Ticket created");
      fetchTickets();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Inovite Support – Dashboard</h1>
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

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Create ticket card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <h2 className="mb-4 text-base font-semibold text-slate-100">
            Create Ticket
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="form-input focus:border-indigo-500"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="form-textarea focus:border-indigo-500"
                placeholder="Describe the problem in detail"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="form-input select-arrow focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-200">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-input select-arrow focus:border-indigo-500"
              >
                <option value="project">Project</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </section>

        {/* Tickets table card */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-100">
              My Tickets
            </h2>
          </div>

          {loadingTickets ? (
            <p className="text-sm text-slate-300">Loading...</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-slate-400">No tickets yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
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
                      Role
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
                      <td className="px-3 py-2 text-xs text-slate-300">
                        {t.assignedTo && t.assignedTo === user.id
                          ? "Assigned to you"
                          : "Created by you"}
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
      </main>
    </div>
  );
};

export default UserDashboard;
