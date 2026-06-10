import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { teamService } from "@/services";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    inviteToken: searchParams.get("invite") || "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const token = searchParams.get("invite");
    if (!token) return;
    teamService.previewInvite(token)
      .then((data) => {
        setInvite(data);
        setForm((p) => ({ ...p, email: data.email, inviteToken: token }));
      })
      .catch(() => {});
  }, [searchParams]);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-2xl backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/80">
          <div className="mb-6 flex flex-col items-center text-center">
            <img
              src="/UptoSkillsLogo.webp"
              alt="UptoSkills Logo"
              className="mb-3 h-14 w-auto object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {invite ? `Joining ${invite.orgName} as ${invite.role}` : "14-day free trial. No credit card required."}
            </p>
          </div>

          {invite && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800 dark:border-teal-900/40 dark:bg-teal-900/20 dark:text-teal-300">
              <Users className="h-4 w-4" />
              <span>You've been invited to <b>{invite.orgName}</b> as <b>{invite.role}</b>.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                required
                autoComplete="name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                autoComplete="email"
                disabled={!!invite}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Creating workspace..." : "Create workspace"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
