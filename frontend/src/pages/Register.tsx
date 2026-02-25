import { useState, useEffect } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { register } from '../lib/auth';
import { toast } from 'sonner';
import ShareableLink from '../components/ShareableLink';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '', referralCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Pre-fill referral code from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setForm((prev) => ({ ...prev, referralCode: ref.toUpperCase() }));
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone) newErrors.phone = 'फ़ोन नंबर आवश्यक है।';
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'सही 10 अंकों का फ़ोन नंबर डालें।';
    if (!form.password) newErrors.password = 'पासवर्ड आवश्यक है।';
    else if (form.password.length < 6) newErrors.password = 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।';
    if (!form.referralCode) newErrors.referralCode = 'रेफरल कोड आवश्यक है।';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = register(form.phone, form.password, form.referralCode.toUpperCase());
      if (result.success) {
        toast.success('रजिस्ट्रेशन सफल! अब लॉगिन करें।');
        router.navigate({ to: '/login' });
      } else {
        if (result.error?.includes('फ़ोन')) {
          setErrors((prev) => ({ ...prev, phone: result.error! }));
        } else if (result.error?.includes('रेफरल')) {
          setErrors((prev) => ({ ...prev, referralCode: result.error! }));
        } else {
          toast.error(result.error || 'रजिस्ट्रेशन विफल।');
        }
      }
    } catch {
      toast.error('रजिस्ट्रेशन विफल। कृपया अपना कनेक्शन जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/20">
          {/* Header */}
          <div className="bg-maroon px-8 py-8 text-center">
            <div className="text-4xl mb-2">🕉️</div>
            <h1 className="text-2xl font-devanagari font-bold text-saffron">नया खाता बनाएं</h1>
            <p className="text-cream/70 font-devanagari text-sm mt-1">भगवद्गीता का सार पाएं</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                फ़ोन नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 अंकों का मोबाइल नंबर"
                className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all ${
                  errors.phone ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                }`}
                maxLength={10}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                पासवर्ड <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="कम से कम 6 अक्षर"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon/50 hover:text-maroon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.password}</p>
              )}
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                रेफरल कोड <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.referralCode}
                onChange={(e) => setForm({ ...form, referralCode: e.target.value.toUpperCase() })}
                placeholder="रेफरल कोड डालें (जैसे: GITA0000)"
                className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all uppercase ${
                  errors.referralCode ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                }`}
              />
              {errors.referralCode && (
                <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.referralCode}</p>
              )}
              <p className="text-maroon/50 text-xs mt-1 font-devanagari">
                पहली बार? सीड कोड: <strong>GITA0000</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold text-lg hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-cream border-t-transparent" />
              ) : (
                <UserPlus size={20} />
              )}
              {loading ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}
            </button>

            <p className="text-center text-maroon/70 font-devanagari text-sm">
              पहले से खाता है?{' '}
              <Link to="/login" className="text-saffron font-bold hover:text-gold transition-colors">
                लॉगिन करें
              </Link>
            </p>
          </form>

          {/* Share Link Section */}
          <div className="px-8 pb-6 border-t border-gold/20 pt-4 bg-cream/30">
            <p className="text-center text-maroon/60 font-devanagari text-xs mb-2">
              🔗 इस वेबसाइट को दोस्तों के साथ शेयर करें:
            </p>
            <ShareableLink className="justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
}
