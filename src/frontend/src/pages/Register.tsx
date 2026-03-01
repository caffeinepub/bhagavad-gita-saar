import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { register } from "../lib/auth";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    password: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone) newErrors.phone = "फ़ोन नंबर आवश्यक है।";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "सही 10 अंकों का फ़ोन नंबर डालें।";
    if (!form.password) newErrors.password = "पासवर्ड आवश्यक है।";
    else if (form.password.length < 6)
      newErrors.password = "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।";
    if (!form.referralCode) newErrors.referralCode = "रेफरल कोड आवश्यक है।";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = register(
        form.phone,
        form.password,
        form.referralCode.toUpperCase(),
      );
      if (result.success) {
        toast.success("रजिस्ट्रेशन सफल! अब लॉगिन करें।");
        router.navigate({ to: "/login" });
      } else {
        if (result.error?.includes("फ़ोन")) {
          setErrors((prev) => ({ ...prev, phone: result.error! }));
        } else if (
          result.error?.includes("रेफरल") ||
          result.error?.includes("कोड")
        ) {
          setErrors((prev) => ({ ...prev, referralCode: result.error! }));
        } else {
          toast.error(result.error || "रजिस्ट्रेशन विफल।");
        }
      }
    } catch {
      toast.error("रजिस्ट्रेशन विफल। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold gold-text mb-1">नया खाता बनाएं</h1>
            <p className="text-sm" style={{ color: "oklch(0.65 0.04 65)" }}>
              भगवद्गीता का सार पाएं
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone */}
            <div>
              <label
                htmlFor="reg-phone"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                फ़ोन नंबर <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                placeholder="10 अंकों का मोबाइल नंबर"
                className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.phone ? "border-red-500/60" : ""}`}
                maxLength={10}
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                पासवर्ड <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="कम से कम 6 अक्षर"
                  className={`w-full input-divine rounded-xl px-4 py-3 pr-12 text-sm ${errors.password ? "border-red-500/60" : ""}`}
                  autoComplete="new-password"
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

            {/* Referral Code */}
            <div>
              <label
                htmlFor="reg-referral"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                रेफरल कोड <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-referral"
                type="text"
                value={form.referralCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    referralCode: e.target.value.toUpperCase(),
                  })
                }
                placeholder="रेफरल कोड डालें (जैसे: GITA0)"
                className={`w-full input-divine rounded-xl px-4 py-3 text-sm uppercase ${errors.referralCode ? "border-red-500/60" : ""}`}
              />
              {errors.referralCode && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.referralCode}
                </p>
              )}
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.55 0.03 60)" }}
              >
                यदि आपके पास किसी का कोड नहीं है तो{" "}
                <strong style={{ color: "oklch(0.75 0.18 65)" }}>GITA0</strong>{" "}
                डालें
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
              ) : (
                <UserPlus size={18} />
              )}
              {loading ? "रजिस्टर हो रहा है..." : "रजिस्टर करें"}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: "oklch(0.6 0.03 65)" }}
            >
              पहले से खाता है?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline"
              >
                लॉगिन करें
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
