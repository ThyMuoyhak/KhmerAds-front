import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscription logic here
    setEmail('');
  };

  // CSS Variables matching your style
  const cssVariables = {
    '--primary-color': '#1e40af',
    '--accent-color': '#3b82f6',
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--background': '#f8fafc',
    '--surface': '#ffffff',
    '--border': '#e5e7eb',
    '--shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
    '--transition': 'all 0.3s ease',
    '--error-color': '#dc2626'
  };

  return (
    <footer style={{
      background: cssVariables['--surface'],
      borderTop: `1px solid ${cssVariables['--border']}`,
      marginTop: 'auto',
      fontFamily: "'Noto Sans Khmer', 'Arial', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          padding: '3rem 0 2rem'
        }}>
          {/* Brand Section */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: cssVariables['--primary-color'],
                fontWeight: '700',
                fontSize: '1.5rem'
              }}>
                <span style={{ fontSize: '1.75rem' }}>🏠</span>
                <span style={{
                  background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Khmer365
                </span>
              </Link>
              <p style={{
                color: cssVariables['--text-secondary'],
                fontSize: '0.9rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                ទីផ្សារទំនើបសម្រាប់ការទិញ និងលក់ទំនិញគុណភាពខ្ពស់។ 
                ភ្ជាប់ទំនាក់ទំនងជាមួយអ្នកទិញ និងអ្នកលក់នៅក្នុងសហគមន៍របស់អ្នក។
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: cssVariables['--background'],
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '8px',
                  color: cssVariables['--text-secondary'],
                  textDecoration: 'none',
                  transition: cssVariables['--transition']
                }}>
                  <FacebookIcon />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: cssVariables['--background'],
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '8px',
                  color: cssVariables['--text-secondary'],
                  textDecoration: 'none',
                  transition: cssVariables['--transition']
                }}>
                  <TwitterIcon />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  background: cssVariables['--background'],
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '8px',
                  color: cssVariables['--text-secondary'],
                  textDecoration: 'none',
                  transition: cssVariables['--transition']
                }}>
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              color: cssVariables['--text-primary'],
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0'
            }}>
              តំណភ្ជាប់រហ័ស
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li><Link to="/categories" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>ស្វែងរកតាមប្រភេទ</Link></li>
              <li><Link to="/featured" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>ទំនិញពិសេស</Link></li>
              <li><Link to="/popular" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>ការស្វែងរកពេញនិយម</Link></li>
              <li><Link to="/deals" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>ការផ្សព្វផ្សាយ និងបញ្ចុះតម្លៃ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              color: cssVariables['--text-primary'],
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0'
            }}>
              ជំនួយ
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li><Link to="/help" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>មជ្ឈមណ្ឌលជំនួយ</Link></li>
              <li><Link to="/faq" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>សំណួរចម្លើយ</Link></li>
              <li><Link to="/contact" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>ទាក់ទងមកយើង</Link></li>
              <li><Link to="/privacy" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: cssVariables['--transition']
              }}>គោលការណ៍ឯកជនភាព</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{
              color: cssVariables['--text-primary'],
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0'
            }}>
              ទទួលបានព័ត៌មានថ្មីៗ
            </h4>
            <p style={{
              color: cssVariables['--text-secondary'],
              fontSize: '0.9rem',
              lineHeight: '1.6',
              margin: '0 0 1.5rem 0'
            }}>
              ចុះឈ្មោះទទួលព័ត៌មានថ្មីៗសម្រាប់ការអាប់ដេតចុងក្រោយ
            </p>
            <form onSubmit={handleSubscribe} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
                style={{
                  padding: '0.75rem 1rem',
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: "'Noto Sans Khmer', 'Arial', sans-serif",
                  transition: cssVariables['--transition'],
                  background: cssVariables['--background']
                }}
                required
              />
              <button type="submit" style={{
                padding: '0.75rem 1.5rem',
                background: cssVariables['--accent-color'],
                color: cssVariables['--surface'],
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'Noto Sans Khmer', 'Arial', sans-serif",
                cursor: 'pointer',
                transition: cssVariables['--transition']
              }}>
                ចុះឈ្មោះ
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: `1px solid ${cssVariables['--border']}`,
          padding: '1.5rem 0'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <p style={{
              color: cssVariables['--text-secondary'],
              fontSize: '0.85rem',
              margin: 0
            }}>
              &copy; 2025 Khmer365។ រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/terms" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: cssVariables['--transition']
              }}>លក្ខខណ្ឌប្រើប្រាស់</Link>
              <Link to="/privacy" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: cssVariables['--transition']
              }}>គោលការណ៍ឯកជនភាព</Link>
              <Link to="/cookies" style={{
                color: cssVariables['--text-secondary'],
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: cssVariables['--transition']
              }}>គោលការណ៍ខូឃី</Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (min-width: 768px) {
            .footer-content {
              grid-template-columns: 2fr 1fr 1fr 1.5fr;
              gap: 3rem;
            }
          }

          @media (min-width: 640px) {
            .footer-bottom-content {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
          }

          .social-link:hover,
          .footer-link:hover,
          .legal-link:hover {
            color: ${cssVariables['--accent-color']};
          }

          .social-link:hover {
            background: ${cssVariables['--accent-color']};
            color: ${cssVariables['--surface']};
            border-color: ${cssVariables['--accent-color']};
            transform: translateY(-1px);
          }

          .newsletter-input:focus {
            outline: none;
            border-color: ${cssVariables['--accent-color']};
            background: ${cssVariables['--surface']};
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .newsletter-button:hover {
            background: ${cssVariables['--primary-color']};
          }

          .newsletter-input::placeholder {
            color: #94a3b8;
          }
        `}
      </style>
    </footer>
  );
};

// Icon Components (unchanged)
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