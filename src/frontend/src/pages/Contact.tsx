import { CheckCircle, Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { submitContact } from "../lib/auth";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "नाम आवश्यक है।";
    if (!form.email.trim()) newErrors.email = "ईमेल आवश्यक है।";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "सही ईमेल पता डालें।";
    if (!form.message.trim()) newErrors.message = "संदेश आवश्यक है।";
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
      toast.success("संदेश भेज दिया गया!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("संदेश भेजने में विफल। पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "oklch(0.17 0.025 55)",
    border: "1px solid oklch(0.4 0.08 65 / 0.25)",
  };
  const labelStyle = { color: "oklch(0.65 0.04 65)" };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "oklch(0.12 0.02 55)" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">📬</div>
          <h1 className="text-3xl font-bold mb-2 gold-text">संपर्क करें</h1>
          <p className="text-sm" style={labelStyle}>
            कोई प्रश्न है? हम आपकी सहायता के लिए यहाँ हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="md:col-span-1 rounded-2xl p-6 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.06 55), oklch(0.17 0.04 55))",
              border: "1px solid oklch(0.75 0.18 65 / 0.2)",
            }}
          >
            <Mail size={30} className="text-primary mx-auto mb-3" />
            <h3
              className="font-bold mb-2 text-sm"
              style={{ color: "oklch(0.75 0.18 65)" }}
            >
              सहायता ईमेल
            </h3>
            <a
              href="mailto:bhagavadgitamargs@gmail.com"
              className="text-xs hover:text-primary transition-colors break-all"
              style={labelStyle}
            >
              bhagavadgitamargs@gmail.com
            </a>
          </div>

          <div
            className="md:col-span-2 rounded-2xl p-6 shadow-divine"
            style={cardStyle}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle size={48} className="text-green-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 gold-text">
                  संदेश भेजा गया!
                </h3>
                <p className="text-sm mb-4" style={labelStyle}>
                  हम जल्द ही आपसे संपर्क करेंगे।
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-gold px-6 py-2 rounded-full font-bold text-sm"
                >
                  नया संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-primary" />
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    संदेश भेजें
                  </h3>
                </div>

                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    नाम <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="आपका नाम"
                    className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.name ? "border-red-500/60" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    ईमेल <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className={`w-full input-divine rounded-xl px-4 py-3 text-sm ${errors.email ? "border-red-500/60" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    संदेश <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="अपना प्रश्न या संदेश यहाँ लिखें..."
                    rows={4}
                    className={`w-full input-divine rounded-xl px-4 py-3 text-sm resize-none ${errors.message ? "border-red-500/60" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
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
        <div className="rounded-2xl p-6 shadow-divine" style={cardStyle}>
          <h3
            className="font-bold text-base mb-4"
            style={{ color: "oklch(0.85 0.08 70)" }}
          >
            अक्सर पूछे जाने वाले प्रश्न
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "ID एक्टिवेट होने में कितना समय लगता है?",
                a: "UTR सबमिट करने के बाद 24 घंटे के अंदर एडमिन वेरिफाई करेगा।",
              },
              {
                q: "कमीशन कब मिलता है?",
                a: "जब आपके रेफरल से कोई ID एक्टिवेट करता है, कमीशन तुरंत वॉलेट में जमा होता है।",
              },
              {
                q: "निकासी में कितना समय लगता है?",
                a: "निकासी अनुरोध 24-48 घंटे में प्रोसेस किया जाता है।",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="pb-4 last:pb-0"
                style={{
                  borderBottom: "1px solid oklch(0.35 0.06 60 / 0.2)",
                }}
              >
                <p
                  className="font-semibold text-sm mb-1"
                  style={{ color: "oklch(0.8 0.06 70)" }}
                >
                  प्र: {faq.q}
                </p>
                <p className="text-sm" style={labelStyle}>
                  उ: {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
