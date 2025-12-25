import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import toast from 'react-hot-toast';
import { useAuth } from "../hooks/useAuth.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post('/auth/login', form);
    const { user, token } = res.data;
    login(user, token);
    if (user.role === 'admin') {
      navigate('/admin/tickets');
    } else {
      navigate('/');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-2">
          Inovite Support
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Sign in to manage your tickets
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input focus:border-indigo-500 bg-slate-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input focus:border-indigo-500 bg-slate-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;