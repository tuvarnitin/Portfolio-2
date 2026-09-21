import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/themeSlice';
import { toggleTerminal } from '@/store/terminalSlice';
import { FiSun, FiMoon, FiTerminal, FiMenu, FiX } from 'react-icons/fi';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut for terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        dispatch(toggleTerminal());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const scrollTo = useCallback((href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a
              href="#"
              className="nav-logo"
              aria-label="Nitin Tuvar - Home"
              style={{
                fontFamily: 'var(--font-handwriting-alt)',
                fontSize: '2rem',
                textTransform: 'none',
                letterSpacing: 'normal',
              }}
            >
              Nitin Tuvar
            </a>
          </div>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  className="nav-link"
                  onClick={() => scrollTo(item.href)}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              className="nav-icon-btn"
              onClick={() => dispatch(toggleTerminal())}
              aria-label="Open terminal (Ctrl+`)"
              title="Terminal (Ctrl+`)"
            >
              <FiTerminal />
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <FiX size={22} />
              ) : (
                <>
                  <span />
                  <span />
                  <span />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <button 
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
        >
          <FiX size={28} />
        </button>
        {navItems.map((item) => (
          <button key={item.href} className="nav-link" onClick={() => scrollTo(item.href)}>
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
