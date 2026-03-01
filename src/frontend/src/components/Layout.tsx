import { Link, useRouter } from "@tanstack/react-router";
import { BookOpen, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import InstallButton from "./InstallButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdminSession, logout, adminLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    if (isAdminSession) {
      adminLogout();
    } else {
      logout();
    }
    router.navigate({ to: "/login" });
    setMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "होम" },
    { to: "/book", label: "पुस्तक" },
    { to: "/contact", label: "संपर्क" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.12 0.02 55)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "oklch(0.09 0.015 55)",
          borderColor: "oklch(0.4 0.08 65 / 0.3)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.8 0.18 75), oklch(0.6 0.2 50))",
              }}
            >
              🕉️
            </div>
            <div>
              <div className="font-bold text-base leading-tight gold-text">
                भगवद्गीता का सार
              </div>
              <div className="text-xs" style={{ color: "oklch(0.65 0.04 65)" }}>
                100 बिंदुओं का वर्णन
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-primary"
                style={{ color: "oklch(0.75 0.04 70)" }}
                activeProps={{ className: "text-primary font-bold" }}
              >
                {link.label}
              </Link>
            ))}

            <InstallButton />

            {isAuthenticated ? (
              <>
                {!isAdminSession && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    style={{ color: "oklch(0.75 0.04 70)" }}
                  >
                    डैशबोर्ड
                  </Link>
                )}
                {isAdminSession && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    style={{ color: "oklch(0.75 0.04 70)" }}
                  >
                    एडमिन पैनल
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-gold px-4 py-1.5 rounded-full text-sm font-bold"
                >
                  लॉगआउट
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  style={{ color: "oklch(0.75 0.04 70)" }}
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  className="btn-gold px-4 py-1.5 rounded-full text-sm font-bold"
                >
                  रजिस्टर
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground/70 hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
            style={{
              borderColor: "oklch(0.4 0.08 65 / 0.2)",
              background: "oklch(0.1 0.018 55)",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-base py-1 transition-colors hover:text-primary"
                style={{ color: "oklch(0.8 0.04 70)" }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <InstallButton className="self-start" />

            {isAuthenticated ? (
              <>
                {!isAdminSession && (
                  <Link
                    to="/dashboard"
                    className="text-base py-1 transition-colors hover:text-primary"
                    style={{ color: "oklch(0.8 0.04 70)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    डैशबोर्ड
                  </Link>
                )}
                {isAdminSession && (
                  <Link
                    to="/admin"
                    className="text-base py-1 transition-colors hover:text-primary"
                    style={{ color: "oklch(0.8 0.04 70)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    एडमिन पैनल
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-gold px-5 py-2 rounded-full text-sm font-bold w-fit"
                >
                  लॉगआउट
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-base py-1 transition-colors hover:text-primary"
                  style={{ color: "oklch(0.8 0.04 70)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  className="btn-gold px-5 py-2 rounded-full text-sm font-bold w-fit"
                  onClick={() => setMenuOpen(false)}
                >
                  रजिस्टर
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="py-10 mt-auto border-t"
        style={{
          background: "oklch(0.09 0.015 55)",
          borderColor: "oklch(0.4 0.08 65 / 0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🕉️</span>
                <span className="font-bold text-base gold-text">
                  भगवद्गीता का सार
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.6 0.03 65)" }}
              >
                100 बिंदुओं में जीवन का सार — ज्ञान, कर्म और भक्ति का मार्ग।
              </p>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: "oklch(0.75 0.18 65)" }}
              >
                त्वरित लिंक
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { to: "/", label: "होम" },
                  { to: "/book", label: "पुस्तक" },
                  { to: "/contact", label: "संपर्क" },
                  { to: "/privacy", label: "गोपनीयता नीति" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm transition-colors hover:text-primary"
                    style={{ color: "oklch(0.55 0.03 60)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4
                className="font-bold text-sm mb-4"
                style={{ color: "oklch(0.75 0.18 65)" }}
              >
                सहायता
              </h4>
              <a
                href="mailto:bhagavadgitamargs@gmail.com"
                className="text-sm transition-colors hover:text-primary break-all"
                style={{ color: "oklch(0.55 0.03 60)" }}
              >
                bhagavadgitamargs@gmail.com
              </a>
            </div>
          </div>
          <div
            className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderColor: "oklch(0.4 0.08 65 / 0.15)" }}
          >
            <p className="text-xs" style={{ color: "oklch(0.45 0.02 60)" }}>
              © {new Date().getFullYear()} भगवद्गीता का सार। सर्वाधिकार सुरक्षित।
            </p>
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "oklch(0.45 0.02 60)" }}
            >
              Built with{" "}
              <Heart size={11} className="text-primary fill-primary mx-0.5" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
