import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminLogin, login } from "../lib/auth";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone) newErrors.phone = "फ़ोन नंबर आवश्यक है।";
    if (!form.password) newErrors.password = "पासवर्ड आवश्यक है।";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Admin login
    if (form.phone.toUpperCase() === "ADMIN") {
      const result = adminLogin(form.phone, form.password);
      setLoading(false);
      if (result.success) {
        toast.success("एडमिन लॉगिन सफल!");
        router.navigate({ to: "/admin" });
      } else {
        setErrors({ password: result.error || "गलत पासवर्ड।" });
      }
      return;
    }

    // User login
    const result = login(form.phone, form.password);
    setLoading(false);

    if (result.success) {
      toast.success("लॉगिन सफल!");
      router.navigate({ to: "/dashboard" });
    } else {
      setErrors({ phone: result.error || "लॉगिन विफल।" });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.1 0.018 55) 0%, oklch(0.14 0.025 50) 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="card-divine rounded-2xl overflow-hidden shadow-divine">
          {/* Header */}
          <div
            className="px-8 py-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.15 0.03 55), oklch(0.2 0.035 50))",
              borderBottom: "1px solid oklch(0.4 0.08 65 / 0.3)",
            }}
          >
            <div className="text-5xl mb-3">🕉️</div>
            <h1 className="text-2xl font-bold gold-text mb-1">लॉगिन करें</h1>
            <p className="text-sm" style={{ color: "oklch(0.65 0.04 65)" }}>
              अपने खाते में प्रवेश करें
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone */}
            <div>
              <label
                htmlFor="login-phone"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                फ़ोन नंबर <span className="text-red-400">*</span>
              </label>
              <input
                id="login-phone"
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 अंकों का मोबाइल नंबर"
                className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.phone ? "border-red-500/60" : ""}`}
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                पासवर्ड <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="पासवर्ड डालें"
                  className={`w-full input-divine rounded-xl px-4 py-3 pr-12 text-sm ${errors.password ? "border-red-500/60" : ""}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-primary"
                  style={{ color: "oklch(0.55 0.03 60)" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs transition-colors hover:text-primary"
                style={{ color: "oklch(0.65 0.15 60)" }}
              >
                पासवर्ड भूल गए?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: "oklch(0.6 0.03 65)" }}
            >
              खाता नहीं है?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:underline"
              >
                रजिस्टर करें
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
