import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { submitContact } from '../lib/auth';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'नाम आवश्यक है।';
    if (!form.email.trim()) newErrors.email = 'ईमेल आवश्यक है।';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'सही ईमेल पता डालें।';
    if (!form.message.trim()) newErrors.message = 'संदेश आवश्यक है।';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      submitContact(form.name.trim(), form.email.trim(), form.message.trim());
      setSubmitted(true);
      toast.success('आपका संदेश भेज दिया गया!');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('संदेश भेजने में विफल। पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📬</div>
          <h1 className="text-3xl font-devanagari font-bold text-maroon mb-2">संपर्क करें</h1>
          <p className="font-devanagari text-maroon/70">
            कोई प्रश्न है? हम आपकी सहायता के लिए यहाँ हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Support Email */}
          <div className="md:col-span-1 bg-maroon rounded-2xl p-6 text-center shadow-lg">
            <Mail size={32} className="text-saffron mx-auto mb-3" />
            <h3 className="font-devanagari font-bold text-saffron mb-2">सहायता ईमेल</h3>
            <a
              href="mailto:bhagavadgitamargs@gmail.com"
              className="text-cream/80 text-sm hover:text-saffron transition-colors break-all"
            >
              bhagavadgitamargs@gmail.com
            </a>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md border border-gold/20 p-6">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="font-devanagari font-bold text-maroon text-xl mb-2">
                  संदेश भेजा गया!
                </h3>
                <p className="font-devanagari text-maroon/70 mb-4">
                  हम जल्द ही आपसे संपर्क करेंगे।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-maroon text-cream px-6 py-2 rounded-full font-devanagari font-bold hover:bg-maroon-dark transition-all"
                >
                  नया संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={20} className="text-saffron" />
                  <h3 className="font-devanagari font-bold text-maroon text-lg">संदेश भेजें</h3>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                    नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="आपका नाम"
                    className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                    ईमेल <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                    संदेश <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="अपना प्रश्न या संदेश यहाँ लिखें..."
                    rows={4}
                    className={`w-full border rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron transition-all resize-none ${
                      errors.message ? 'border-red-400 bg-red-50' : 'border-gold/40 bg-cream'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                  ) : (
                    <Send size={16} />
                  )}
                  संदेश भेजें
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gold/20 p-6">
          <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">
            अक्सर पूछे जाने वाले प्रश्न
          </h3>
          <div className="space-y-4">
            {[
              {
                q: 'ID एक्टिवेट होने में कितना समय लगता है?',
                a: 'UTR सबमिट करने के बाद 24 घंटे के अंदर एडमिन वेरिफाई करेगा।',
              },
              {
                q: 'कमीशन कब मिलता है?',
                a: 'जब आपके रेफरल से कोई नया व्यक्ति ID एक्टिवेट करता है, तो कमीशन तुरंत वॉलेट में जमा होता है।',
              },
              {
                q: 'निकासी में कितना समय लगता है?',
                a: 'निकासी अनुरोध एडमिन द्वारा 24-48 घंटे में प्रोसेस किया जाता है।',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gold/10 pb-4 last:border-0 last:pb-0">
                <p className="font-devanagari font-semibold text-maroon text-sm mb-1">
                  प्र: {faq.q}
                </p>
                <p className="font-devanagari text-maroon/70 text-sm">उ: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
