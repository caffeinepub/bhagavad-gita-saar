import { Link, useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "../lib/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [form, setForm] = useState({
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone) newErrors.phone = "फ़ोन नंबर आवश्यक है।";
    else if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "10 अंकों का सही मोबाइल नंबर डालें।";
    if (!form.oldPassword) newErrors.oldPassword = "पुराना पासवर्ड आवश्यक है।";
    if (!form.newPassword) newErrors.newPassword = "नया पासवर्ड आवश्यक है।";
    else if (form.newPassword.length < 6)
      newErrors.newPassword = "कम से कम 6 अक्षर।";
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "नया पासवर्ड मेल नहीं खाता।";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = changePassword(
        form.phone,
        form.oldPassword,
        form.newPassword,
      );
      if (result.success) {
        toast.success("पासवर्ड बदल दिया गया! अब लॉगिन करें।");
        router.navigate({ to: "/login" });
      } else {
        if (result.error?.includes("पुराना")) {
          setErrors((prev) => ({ ...prev, oldPassword: result.error! }));
        } else {
          toast.error(result.error || "पासवर्ड बदलने में विफल।");
        }
      }
    } catch {
      toast.error("कुछ गलत हुआ। पुनः प्रयास करें।");
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
            <div className="text-5xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold gold-text mb-1">पासवर्ड बदलें</h1>
            <p className="text-sm" style={{ color: "oklch(0.65 0.04 65)" }}>
              पुराने पासवर्ड से नया बनाएं
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone */}
            <div>
              <label
                htmlFor="fp-phone"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                मोबाइल नंबर <span className="text-red-400">*</span>
              </label>
              <input
                id="fp-phone"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                placeholder="10 अंकों का मोबाइल नंबर"
                className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.phone ? "border-red-500/60" : ""}`}
                maxLength={10}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Old Password */}
            <div>
              <label
                htmlFor="fp-old-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                पुराना पासवर्ड <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="fp-old-password"
                  type={showOld ? "text" : "password"}
                  value={form.oldPassword}
                  onChange={(e) =>
                    setForm({ ...form, oldPassword: e.target.value })
                  }
                  placeholder="पुराना पासवर्ड"
                  className={`w-full input-divine rounded-xl px-4 py-3 pr-12 text-sm ${errors.oldPassword ? "border-red-500/60" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
                  style={{ color: "oklch(0.55 0.03 60)" }}
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.oldPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="fp-new-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                नया पासवर्ड <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="fp-new-password"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="नया पासवर्ड (कम से कम 6 अक्षर)"
                  className={`w-full input-divine rounded-xl px-4 py-3 pr-12 text-sm ${errors.newPassword ? "border-red-500/60" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
                  style={{ color: "oklch(0.55 0.03 60)" }}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="fp-confirm-password"
                className="block text-sm font-semibold mb-1.5"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                नया पासवर्ड फिर डालें <span className="text-red-400">*</span>
              </label>
              <input
                id="fp-confirm-password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="नया पासवर्ड दोबारा डालें"
                className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.confirmPassword ? "border-red-500/60" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
              ) : (
                <KeyRound size={18} />
              )}
              {loading ? "बदला जा रहा है..." : "पासवर्ड बदलें"}
            </button>

            <p
              className="text-center text-sm"
              style={{ color: "oklch(0.6 0.03 65)" }}
            >
              वापस जाएं{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline"
              >
                लॉगिन
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
