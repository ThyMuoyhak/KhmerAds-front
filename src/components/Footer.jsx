import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="brand-content">
              <Link to="/" className="footer-logo">
                
                <span>KhmerAds</span>
              </Link>
              <p className="footer-description">
                ទីផ្សារទំនើបសម្រាប់ការទិញ និងលក់ទំនិញគុណភាពខ្ពស់។ 
                ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកទិញ និងអ្នកលក់នៅក្នុងសហគមន៍របស់អ្នក។
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FacebookIcon />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <TwitterIcon />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="section-title">តំណភ្ជាប់រហ័ស</h4>
            <ul className="footer-links">
              <li><Link to="/categories" className="footer-link">ស្វែងរកតាមប្រភេទ</Link></li>
              <li><Link to="/featured" className="footer-link">ទំនិញពិសេស</Link></li>
              <li><Link to="/popular" className="footer-link">ការស្វែងរកពេញនិយម</Link></li>
              <li><Link to="/deals" className="footer-link">ការផ្សព្វផ្សាយ និងបញ្ចុះតម្លៃ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="section-title">ជំនួយ</h4>
            <ul className="footer-links">
              <li><Link to="/help" className="footer-link">មជ្ឈមណ្ឌលជំនួយ</Link></li>
              <li><Link to="/faq" className="footer-link">សំណួរចម្លើយ</Link></li>
              <li><Link to="/contact" className="footer-link">ទាក់ទងមកយើង</Link></li>
              <li><Link to="/privacy" className="footer-link">គោលការណ៍ឯកជនភាព</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="section-title">ទទួលបានព័ត៌មានថ្មីៗ</h4>
            <p className="newsletter-description">
              ចុះឈ្មោះទទួលព័ត៌មានថ្មីៗសម្រាប់ការអាប់ដេតចុងក្រោយ
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                ចុះឈ្មោះ
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2025 KhmerAds។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
            <div className="legal-links">
              <Link to="/terms" className="legal-link">លក្ខខណ្ឌប្រើប្រាស់</Link>
              <Link to="/privacy" className="legal-link">គោលការណ៍ឯកជនភាព</Link>
              <Link to="/cookies" className="legal-link">គោលការណ៍ខូឃី</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, rgba(10, 14, 39, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%);
          border-top: 4px solid #533483;
          margin-top: auto;
          font-family: 'Inter', 'Khmer', sans-serif;
          color: #e2e8f0;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding: 3rem 0 2rem;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        /* Brand Section */
        .brand-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.5rem;
          color: #00d9ff;
          transition: all 0.2s ease;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 1px;
        }

        .footer-logo:hover {
          transform: translate(-3px, -3px);
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 217, 255, 0.3);
        }

        .footer-logo span {
          background: linear-gradient(135deg, #00d9ff, #0099cc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-description {
          color: #7b8cde;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 3px solid #533483;
          border-radius: 0;
          color: #00d9ff;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          image-rendering: pixelated;
        }

        .social-link:hover {
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          color: #0a0e27;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        /* Section Titles */
        .section-title {
          color: #00d9ff;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 1px;
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          color: #7b8cde;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .footer-link:hover {
          color: #00d9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
          transform: translateX(3px);
        }

        /* Newsletter */
        .newsletter-description {
          color: #7b8cde;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .newsletter-input {
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 3px solid #533483;
          border-radius: 0;
          font-size: 0.9rem;
          color: #e2e8f0;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(5px);
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
          transform: translate(-2px, -2px);
        }

        .newsletter-input::placeholder {
          color: #7b8cde;
        }

        .newsletter-button {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          color: #0a0e27;
          border: 3px solid #006699;
          border-radius: 0;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'Khmer', monospace;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .newsletter-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .newsletter-button:hover::before {
          left: 100%;
        }

        .newsletter-button:hover {
          background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        .newsletter-button:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
        }

        /* Footer Bottom */
        .footer-bottom {
          border-top: 4px solid #533483;
          padding: 1.5rem 0;
        }

        .footer-bottom-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .copyright {
          color: #7b8cde;
          font-size: 0.85rem;
          margin: 0;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .legal-links {
          display: flex;
          gap: 1.5rem;
        }

        .legal-link {
          color: #7b8cde;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .legal-link:hover {
          color: #00d9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
          transform: translateX(3px);
        }

        /* Responsive Design */
        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 3rem;
          }

          .footer-bottom-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        @media (min-width: 1024px) {
          .footer-container {
            padding: 0 2rem;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            padding: 2rem 0 1.5rem;
            gap: 1.5rem;
          }

          .legal-links {
            flex-direction: column;
            gap: 0.75rem;
            align-items: center;
          }

          .newsletter-form {
            gap: 0.5rem;
          }

          .footer {
            border-top-width: 3px;
          }

          .footer-bottom {
            border-top-width: 3px;
          }
        }

        /* Pixel-perfect icons */
        .input-icon,
        .button-icon,
        .social-link svg {
          image-rendering: pixelated;
        }

        /* Glow effects */
        .footer-logo:hover,
        .social-link:hover,
        .newsletter-button:hover,
        .footer-link:hover,
        .legal-link:hover {
          animation: elementGlow 1.5s ease-in-out infinite;
        }

        @keyframes elementGlow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor); }
        }
      `}</style>
    </footer>
  );
};

// Icon Components
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.25 14.816 3.76 13.665 3.76 12.368s.49-2.448 1.366-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.875.875 1.366 2.026 1.366 3.323s-.491 2.448-1.366 3.323c-.875.807-2.026 1.297-3.323 1.297z"/>
    <circle cx="12.017" cy="11.987" r="3.323"/>
  </svg>
);

export default Footer;