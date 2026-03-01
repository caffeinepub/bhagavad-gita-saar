import { Link } from "@tanstack/react-router";
import { BookOpen, Lock } from "lucide-react";
import { useState } from "react";
import { gitaChapters } from "../data/gitaContent";
import { getCurrentPhone, getCurrentUser } from "../lib/auth";

export default function BookContent() {
  const phone = getCurrentPhone();
  const user = getCurrentUser();
  const isAuthenticated = !!phone;
  const isActivated = user?.isActive === true;
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  const toggleChapter = (num: number) => {
    setExpandedChapter(expandedChapter === num ? null : num);
  };

  const cardStyle = {
    background: "oklch(0.17 0.025 55)",
    border: "1px solid oklch(0.4 0.08 65 / 0.25)",
  };
  const labelStyle = { color: "oklch(0.65 0.04 65)" };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center shadow-divine"
          style={cardStyle}
        >
          <Lock size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 gold-text">लॉगिन आवश्यक</h2>
          <p className="text-sm mb-6" style={labelStyle}>
            पुस्तक पढ़ने के लिए पहले लॉगिन करें।
          </p>
          <Link
            to="/login"
            className="btn-gold px-8 py-3 rounded-full font-bold inline-block"
          >
            लॉगिन करें
          </Link>
        </div>
      </div>
    );
  }

  if (!isActivated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center shadow-divine"
          style={cardStyle}
        >
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-3 gold-text">पुस्तक अनलॉक करें</h2>
          <p className="text-sm mb-2" style={labelStyle}>
            भगवद्गीता का सार पढ़ने के लिए अपनी ID एक्टिवेट करें।
          </p>
          <p className="text-xs mb-6" style={{ color: "oklch(0.5 0.02 60)" }}>
            ₹100 का भुगतान करें और UTR सबमिट करें।
          </p>
          <Link
            to="/dashboard"
            className="btn-gold px-8 py-3 rounded-full font-bold inline-block"
          >
            डैशबोर्ड पर जाएं
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "oklch(0.12 0.02 55)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕉️</div>
          <h1 className="text-3xl font-bold mb-2 gold-text">भगवद्गीता का सार</h1>
          <p className="text-sm" style={labelStyle}>
            18 अध्याय — 100 बिंदुओं में जीवन का सार
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <BookOpen size={16} className="text-primary" />
            <span className="text-sm font-semibold text-green-400">
              ID सक्रिय ✓
            </span>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-3">
          {gitaChapters.map((chapter) => (
            <div
              key={chapter.number}
              className="rounded-xl overflow-hidden"
              style={cardStyle}
            >
              <button
                type="button"
                onClick={() => toggleChapter(chapter.number)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-primary/5"
              >
                <div className="flex items-center gap-4 text-left">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.8 0.18 75), oklch(0.65 0.2 50))",
                      color: "oklch(0.12 0.02 55)",
                    }}
                  >
                    {chapter.number}
                  </div>
                  <div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: "oklch(0.85 0.08 70)" }}
                    >
                      {chapter.title}
                    </div>
                    <div className="text-xs mt-0.5" style={labelStyle}>
                      {chapter.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-lg ml-4" style={labelStyle}>
                  {expandedChapter === chapter.number ? "▲" : "▼"}
                </span>
              </button>

              {expandedChapter === chapter.number && (
                <div
                  className="px-5 pb-5"
                  style={{ borderTop: "1px solid oklch(0.35 0.06 60 / 0.3)" }}
                >
                  <div className="pt-4 space-y-2">
                    {chapter.points.map((point, idx) => (
                      <div
                        key={`${chapter.number}-${idx}`}
                        className="flex gap-3 items-start py-2"
                        style={{
                          borderBottom:
                            idx < chapter.points.length - 1
                              ? "1px solid oklch(0.3 0.04 55 / 0.3)"
                              : "none",
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{
                            background: "oklch(0.75 0.18 65 / 0.15)",
                            color: "oklch(0.75 0.18 65)",
                            border: "1px solid oklch(0.75 0.18 65 / 0.2)",
                          }}
                        >
                          {idx + 1}
                        </span>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "oklch(0.78 0.04 68)" }}
                        >
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
