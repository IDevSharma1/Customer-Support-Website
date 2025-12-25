import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const TicketDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = isAdmin ? `/admin/tickets/${id}` : `/tickets/${id}`;
      const res = await api.get(endpoint);
      setTicket(res.data.ticket);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to load ticket details.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id, isAdmin]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-300">Loading...</p>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center">
          <p className="mb-4 text-sm text-red-400">{error}</p>
          <Link
            to="/"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <h1 className="text-xl font-semibold text-slate-100">
            {ticket.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300">{ticket.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 capitalize">
              <span className="mr-1 text-slate-400">Status:</span>
              {ticket.status}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 capitalize">
              <span className="mr-1 text-slate-400">Priority:</span>
              {ticket.priority}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 capitalize">
              <span className="mr-1 text-slate-400">Category:</span>
              {ticket.category}
            </span>
          </div>

          <div className="mt-3 text-xs text-slate-400">
            Created at: {new Date(ticket.createdAt).toLocaleString()}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow">
          <h2 className="mb-3 text-base font-semibold text-slate-100">
            Comments
          </h2>
          {ticket.comments && ticket.comments.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {ticket.comments.map((c) => (
                <li
                  key={c._id}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                >
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>
                      {c.author?.name || "Unknown"} (
                      {c.author?.email || "no-email"})
                    </span>
                    <span>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-100">{c.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No comments yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default TicketDetailPage;
