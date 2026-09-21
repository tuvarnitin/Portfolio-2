import { socialLinks } from '@/data/social';
import { FiArrowUp, FiDownload, FiArrowUpRight } from 'react-icons/fi';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="contact" role="contentinfo">
      <div className="container">
        {/* CTA Section */}
        <div className="cta-section">
          <p className="text-overline" style={{ marginBottom: '1rem' }}>
            Get in Touch
          </p>
          <h2 className="cta-title">
            Let's build something
            <br />
            <span style={{ color: 'var(--color-primary)' }}>amazing together.</span>
          </h2>
          <p className="cta-desc">
            I'm currently open to full-time roles, freelance projects, and interesting
            collaborations. Let's connect and create something remarkable.
          </p>
          <div className="cta-buttons">
            <a href="mailto:nitintuvar2003@gmail.com" className="btn btn-primary">
              Say Hello <FiArrowUpRight className="btn-icon" />
            </a>
            <a href="" className="btn btn-outline" download>
              <FiDownload /> Resume
            </a>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              nitin<span>.</span>
            </div>
            <p className="footer-desc">
              Full Stack MERN Developer passionate about building scalable, production-ready web
              applications with exceptional user experiences.
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links">
              {['About', 'Skills', 'Projects', 'Experience'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="footer-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="footer-heading">Connect</h3>
            <ul className="footer-links">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="footer-link"
                    target={link.url.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    aria-label={`${link.name}: ${link.value}`}
                  >
                    <link.icon />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Nitin Tuvar. Crafted with care.
          </p>
          <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
