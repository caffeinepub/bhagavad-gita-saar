import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Lock, BookOpen } from 'lucide-react';
import { getCurrentUser, getCurrentPhone } from '../lib/auth';
import { gitaChapters } from '../data/gitaContent';

export default function BookContent() {
  const phone = getCurrentPhone();
  const user = getCurrentUser();
  const isAuthenticated = !!phone;
  const isActivated = user?.isActive === true;
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  const toggleChapter = (num: number) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-10 max-w-md w-full text-center">
          <Lock size={48} className="text-maroon mx-auto mb-4" />
          <h2 className="text-2xl font-devanagari font-bold text-maroon mb-3">लॉगिन आवश्यक</h2>
          <p className="font-devanagari text-maroon/70 mb-6">
            पुस्तक पढ़ने के लिए पहले लॉगिन करें।
          </p>
          <Link
            to="/login"
            className="inline-block bg-maroon text-cream px-8 py-3 rounded-full font-devanagari font-bold hover:bg-maroon-dark transition-all"
          >
            लॉगिन करें
          </Link>
        </div>
      </div>
    );
  }

  if (!isActivated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-devanagari font-bold text-maroon mb-3">
            पुस्तक अनलॉक करें
          </h2>
          <p className="font-devanagari text-maroon/70 mb-2">
            भगवद्गीता का सार पढ़ने के लिए अपनी ID एक्टिवेट करें।
          </p>
          <p className="font-devanagari text-maroon/50 text-sm mb-6">
            ₹100 का भुगतान करें और UTR सबमिट करें।
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-maroon text-cream px-8 py-3 rounded-full font-devanagari font-bold hover:bg-maroon-dark transition-all"
          >
            डैशबोर्ड पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/gita-book-cover.dim_400x500.png"
              alt="Bhagavad Gita"
              className="w-24 h-auto rounded-xl shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-devanagari font-bold text-maroon mb-2">भगवद्गीता का सार</h1>
          <p className="font-devanagari text-maroon/70">18 अध्याय — 100 बिंदुओं में जीवन का सार</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <BookOpen size={16} className="text-saffron" />
            <span className="text-saffron font-devanagari text-sm font-semibold">ID सक्रिय ✓</span>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          {gitaChapters.map((chapter) => (
            <div
              key={chapter.number}
              className="bg-white rounded-2xl shadow-sm border border-gold/20 overflow-hidden"
            >
              <button
                onClick={() => toggleChapter(chapter.number)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-saffron/5 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center text-saffron font-bold text-sm flex-shrink-0">
                    {chapter.number}
                  </div>
                  <div>
                    <div className="font-devanagari font-bold text-maroon text-base">
                      {chapter.title}
                    </div>
                    <div className="font-devanagari text-maroon/50 text-xs">{chapter.subtitle}</div>
                  </div>
                </div>
                <span className="text-maroon/40 text-lg ml-4">
                  {expandedChapter === chapter.number ? '▲' : '▼'}
                </span>
              </button>

              {expandedChapter === chapter.number && (
                <div className="px-6 pb-6 border-t border-gold/10">
                  <div className="pt-4 space-y-2">
                    {chapter.points.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 items-start py-2 border-b border-gold/5 last:border-0"
                      >
                        <span className="w-6 h-6 bg-saffron/20 text-maroon rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-devanagari text-maroon/80 text-sm leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
