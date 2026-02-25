import { Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.navigate({ to: '/login' });
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'होम' },
    { to: '/book', label: 'पुस्तक' },
    { to: '/contact', label: 'संपर्क' },
    { to: '/privacy', label: 'गोपनीयता' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-maroon shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/lotus-icon.dim_64x64.png"
              alt="Lotus"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <div className="text-saffron font-devanagari font-bold text-lg leading-tight">भगवद्गीता का सार</div>
              <div className="text-gold text-xs font-sans">100 बिंदुओं का वर्णन</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-cream hover:text-saffron transition-colors font-devanagari text-sm font-medium"
                activeProps={{ className: 'text-saffron border-b-2 border-saffron' }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-cream hover:text-saffron transition-colors font-devanagari text-sm font-medium"
                >
                  डैशबोर्ड
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-saffron text-maroon px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gold transition-colors"
                >
                  लॉगआउट
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-cream hover:text-saffron transition-colors font-devanagari text-sm font-medium"
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  className="bg-saffron text-maroon px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gold transition-colors"
                >
                  रजिस्टर
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-maroon-dark border-t border-maroon-light px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-cream hover:text-saffron font-devanagari text-base py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-cream hover:text-saffron font-devanagari text-base py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  डैशबोर्ड
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-saffron text-maroon px-4 py-2 rounded-full text-sm font-bold w-fit"
                >
                  लॉगआउट
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-cream hover:text-saffron font-devanagari text-base py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  लॉगिन
                </Link>
                <Link
                  to="/register"
                  className="bg-saffron text-maroon px-4 py-2 rounded-full text-sm font-bold w-fit"
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
      <footer className="bg-maroon text-cream py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={20} className="text-saffron" />
                <span className="font-devanagari font-bold text-saffron">भगवद्गीता का सार</span>
              </div>
              <p className="text-cream/70 text-sm font-devanagari">
                100 बिंदुओं में जीवन का सार — ज्ञान, कर्म और भक्ति का मार्ग।
              </p>
            </div>
            <div>
              <h4 className="font-bold text-saffron mb-3 font-devanagari">त्वरित लिंक</h4>
              <div className="flex flex-col gap-1">
                <Link to="/" className="text-cream/70 hover:text-saffron text-sm font-devanagari transition-colors">होम</Link>
                <Link to="/book" className="text-cream/70 hover:text-saffron text-sm font-devanagari transition-colors">पुस्तक</Link>
                <Link to="/contact" className="text-cream/70 hover:text-saffron text-sm font-devanagari transition-colors">संपर्क</Link>
                <Link to="/privacy" className="text-cream/70 hover:text-saffron text-sm font-devanagari transition-colors">गोपनीयता नीति</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-saffron mb-3 font-devanagari">सहायता</h4>
              <a
                href="mailto:bhagavadgitamargs@gmail.com"
                className="text-cream/70 hover:text-saffron text-sm transition-colors break-all"
              >
                bhagavadgitamargs@gmail.com
              </a>
            </div>
          </div>
          <div className="border-t border-maroon-light pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-cream/60 text-xs font-devanagari">
              © {new Date().getFullYear()} भगवद्गीता का सार। सर्वाधिकार सुरक्षित।
            </p>
            <p className="text-cream/60 text-xs flex items-center gap-1">
              Built with <Heart size={12} className="text-saffron fill-saffron" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'bhagavad-gita-saar')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-saffron hover:text-gold transition-colors"
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
