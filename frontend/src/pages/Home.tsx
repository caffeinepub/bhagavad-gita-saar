import { Link } from '@tanstack/react-router';
import { BookOpen, Star, Users, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ShareableLink from '../components/ShareableLink';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: BookOpen, title: '18 अध्याय', desc: 'सम्पूर्ण भगवद्गीता के 18 अध्यायों का सार' },
    { icon: Star, title: '100 बिंदु', desc: 'जीवन बदलने वाले 100 महत्वपूर्ण बिंदु' },
    { icon: Users, title: 'रेफरल कमीशन', desc: '10 स्तर तक कमीशन — 25% से 1% तक' },
    { icon: Award, title: 'वॉलेट सिस्टम', desc: 'कमाई को वॉलेट में जमा करें और निकालें' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon via-maroon-dark to-maroon-light opacity-95" />
        <img
          src="/assets/generated/gita-hero-banner.dim_1200x500.png"
          alt="Bhagavad Gita Hero"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="inline-block bg-saffron/20 border border-saffron/40 rounded-full px-4 py-1 mb-6">
            <span className="text-saffron text-sm font-devanagari">🕉️ श्रीमद्भगवद्गीता</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-devanagari font-bold text-cream mb-4 leading-tight">
            भगवद्गीता का सार
          </h1>
          <p className="text-2xl md:text-3xl text-saffron font-devanagari font-semibold mb-6">
            100 बिंदुओं का वर्णन
          </p>
          <p className="text-cream/80 text-lg font-devanagari max-w-2xl mx-auto mb-10 leading-relaxed">
            18 अध्यायों में जीवन का सम्पूर्ण ज्ञान — कर्म, भक्ति और मोक्ष का मार्ग। 
            केवल ₹100 में पाएं जीवन बदलने वाला ज्ञान।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-saffron text-maroon px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-gold transition-all shadow-lg hover:shadow-xl"
                >
                  डैशबोर्ड देखें
                </Link>
                <Link
                  to="/book"
                  className="border-2 border-saffron text-saffron px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-saffron hover:text-maroon transition-all"
                >
                  पुस्तक पढ़ें
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-saffron text-maroon px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-gold transition-all shadow-lg hover:shadow-xl"
                >
                  अभी रजिस्टर करें
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-saffron text-saffron px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-saffron hover:text-maroon transition-all"
                >
                  लॉगिन करें
                </Link>
              </>
            )}
          </div>

          {/* Shareable Short Link */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-cream/60 font-devanagari text-xs mb-1">
              🔗 इस वेबसाइट का छोटा लिंक — दोस्तों को शेयर करें:
            </p>
            <ShareableLink />
          </div>
        </div>
      </section>

      {/* Book Preview */}
      <section className="py-16 bg-cream-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <img
                  src="/assets/generated/gita-book-cover.dim_400x500.png"
                  alt="Gita Book Cover"
                  className="w-64 h-80 object-cover rounded-lg shadow-2xl border-4 border-gold"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-64 h-80 bg-gradient-to-b from-maroon to-maroon-dark rounded-lg shadow-2xl border-4 border-gold flex flex-col items-center justify-center text-center p-6"><div class="text-6xl mb-4">🕉️</div><div class="text-saffron font-devanagari font-bold text-xl">भगवद्गीता का सार</div><div class="text-gold font-devanagari text-sm mt-2">100 बिंदुओं का वर्णन</div></div>`;
                    }
                  }}
                />
                <div className="absolute -top-3 -right-3 bg-saffron text-maroon rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
                  <div className="text-center">
                    <div className="text-xs">मात्र</div>
                    <div className="text-lg font-bold">₹100</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-devanagari font-bold text-maroon mb-4">
                क्यों पढ़ें यह पुस्तक?
              </h2>
              <p className="text-maroon/80 font-devanagari text-lg mb-6 leading-relaxed">
                भगवद्गीता के 18 अध्यायों से चुने गए 100 सबसे महत्वपूर्ण बिंदु, जो आपके जीवन को 
                नई दिशा देंगे। कर्म, ज्ञान और भक्ति के माध्यम से जीवन में सफलता और शांति पाएं।
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  '18 अध्यायों का सार',
                  '100 जीवन-बदलने वाले बिंदु',
                  'सरल हिंदी भाषा में',
                  'व्यावहारिक जीवन उपयोग',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-saffron text-lg">✓</span>
                    <span className="text-maroon font-devanagari text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/register"
                className="inline-block bg-maroon text-cream px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-maroon-dark transition-all shadow-md"
              >
                अभी खरीदें — ₹100
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-devanagari font-bold text-maroon text-center mb-12">
            हमारी विशेषताएं
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 shadow-md border border-gold/20 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={28} className="text-saffron" />
                </div>
                <h3 className="font-devanagari font-bold text-maroon text-lg mb-2">{feature.title}</h3>
                <p className="text-maroon/70 font-devanagari text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16 bg-maroon">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-devanagari font-bold text-saffron mb-4">
            रेफरल कमीशन सिस्टम
          </h2>
          <p className="text-cream/80 font-devanagari mb-10">
            अपने रेफरल कोड से दूसरों को जोड़ें और 10 स्तर तक कमीशन कमाएं
          </p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[
              { level: 'L1', pct: '25%' },
              { level: 'L2', pct: '15%' },
              { level: 'L3', pct: '10%' },
              { level: 'L4', pct: '8%' },
              { level: 'L5', pct: '6%' },
              { level: 'L6', pct: '5%' },
              { level: 'L7', pct: '4%' },
              { level: 'L8', pct: '3%' },
              { level: 'L9', pct: '2%' },
              { level: 'L10', pct: '1%' },
            ].map((item) => (
              <div key={item.level} className="bg-maroon-light rounded-xl p-3 text-center">
                <div className="text-saffron font-bold text-lg">{item.pct}</div>
                <div className="text-cream/70 text-xs mt-1">{item.level}</div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/register"
              className="bg-saffron text-maroon px-8 py-3 rounded-full font-bold font-devanagari text-lg hover:bg-gold transition-all"
            >
              अभी जुड़ें और कमाएं
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-cream-light text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-5xl mb-4">🕉️</div>
          <h2 className="text-3xl font-devanagari font-bold text-maroon mb-4">
            "धीमी और स्थिर चाल से दौड़ जीती जाती है"
          </h2>
          <p className="text-maroon/70 font-devanagari text-lg mb-8">
            भगवद्गीता का ज्ञान अपनाएं, जीवन में सफलता पाएं।
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-maroon text-cream px-10 py-4 rounded-full font-bold font-devanagari text-xl hover:bg-maroon-dark transition-all shadow-lg"
            >
              आज ही शुरू करें
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
