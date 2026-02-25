import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { login, setAdminSession } from '../lib/auth';
import { useActor } from '../hooks/useActor';
import { AdminLoginResult } from '../backend';
import { toast } from 'sonner';

export default function Login() {
  const router = useRouter();
  const { actor } = useActor();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.phone) newErrors.phone = 'फ़ोन नंबर आवश्यक है।';
    if (!form.password) newErrors.password = 'पासवर्ड आवश्यक है।';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Admin login: verify credentials via backend adminLogin method
    if (form.phone.toUpperCase() === 'ADMIN') {
      try {
        if (!actor) {
          toast.error('बैकएंड से कनेक्ट नहीं हो सका। पुनः प्रयास करें।');
          setLoading(false);
          return;
        }
        const result = await actor.adminLogin(form.phone, form.password);
        if (result === AdminLoginResult.success) {
          setAdminSession();
          toast.success('एडमिन लॉगिन सफल!');
          router.navigate({ to: '/admin' });
        } else {
          setErrors({ password: 'गलत पासवर्ड। पुनः प्रयास करें।' });
        }
      } catch {
        toast.error('एडमिन सत्यापन विफल। पुनः प्रयास करें।');
      }
      setLoading(false);
      return;
    }

    const result = login(form.phone, form.password);
    setLoading(false);

    if (result.success) {
      toast.success('लॉगिन सफल!');
      router.navigate({ to: '/dashboard' });
    } else {
      setErrors({ phone: result.error || 'लॉगिन विफल।' });
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/20">
          {/* Header */}
          <div className="bg-maroon px-8 py-8 text-center">
            <div className="text-4xl mb-2">🕉️</div>
            <h1 className="text-2xl font-devanagari font-bold text-saffron">लॉगिन करें</h1>
            <p className="text-cream/70 font-devanagari text-sm mt-1">अपने खाते में प्रवेश करें</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Phone / Username */}
            <div>
              <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                फ़ोन नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 अंकों का मोबाइल नंबर"
                className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all ${
                  errors.phone ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                }`}
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
                  placeholder="पासवर्ड डालें"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold text-lg hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-cream border-t-transparent" />
              ) : (
                <LogIn size={20} />
              )}
              {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
            </button>

            <p className="text-center text-maroon/70 font-devanagari text-sm">
              खाता नहीं है?{' '}
              <Link to="/register" className="text-saffron font-bold hover:text-gold transition-colors">
                रजिस्टर करें
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
