import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <HomeIcon className="logo-icon" />
          <span className="logo-text">Khmer365</span>
        </Link>

        <div className="navbar-desktop">
          <div className="nav-group nav-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <DashboardIcon className="nav-icon" />
              <span>ទំព័រដើម</span>
            </Link>
            <Link 
              to="/post-ad" 
              className={`nav-link ${isActive('/post-ad') ? 'active' : ''}`}
            >
              <PlusCircleIcon className="nav-icon" />
              <span>បង្ហោះការផ្សាយ</span>
            </Link>
            {isLoggedIn && (
              <Link 
                to="/my-listings" 
                className={`nav-link ${isActive('/my-listings') ? 'active' : ''}`}
              >
                <ClipboardListIcon className="nav-icon" />
                <span>ការផ្សាយរបស់ខ្ញុំ</span>
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកអចលនទ្រព្យ..."
                className="search-input"
              />
              <button type="submit" className="search-button" aria-label="Search">
                <SearchIcon />
              </button>
            </div>
          </form>

          <div className="nav-group auth-buttons">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button">
                <LogoutIcon className="button-icon" />
                <span className="button-text">ចាកចេញ</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="login-button">
                  <UserIcon className="button-icon" />
                  <span className="button-text">ចូល</span>
                </Link>
                <Link to="/register" className="register-button">
                  <UserPlusIcon className="button-icon" />
                  <span className="button-text">ចុះឈ្មោះ</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
        <div className="mobile-menu" onClick={e => e.stopPropagation()}>
          <div className="mobile-menu-content">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកអចលនទ្រព្យ..."
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-button">
                <SearchIcon className="button-icon" />
                <span>ស្វែងរក</span>
              </button>
            </form>

            <Link 
              to="/" 
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <DashboardIcon className="nav-icon" />
              <span>ទំព័រដើម</span>
            </Link>
            <Link 
              to="/post-ad" 
              className={`mobile-nav-link ${isActive('/post-ad') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <PlusCircleIcon className="nav-icon" />
              <span>បង្ហោះការផ្សាយ</span>
            </Link>
            {isLoggedIn && (
              <Link 
                to="/my-listings" 
                className={`mobile-nav-link ${isActive('/my-listings') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <ClipboardListIcon className="nav-icon" />
                <span>ការផ្សាយរបស់ខ្ញុំ</span>
              </Link>
            )}

            <div className="mobile-auth-buttons">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="mobile-logout-button">
                  <LogoutIcon className="button-icon" />
                  <span>ចាកចេញ</span>
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="mobile-login-button"
                    onClick={closeMenu}
                  >
                    <UserIcon className="button-icon" />
                    <span>ចូល</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="mobile-register-button"
                    onClick={closeMenu}
                  >
                    <UserPlusIcon className="button-icon" />
                    <span>ចុះឈ្មោះ</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #1e40af; /* Vibrant blue */
          --accent-color: #3b82f6; /* Lighter blue for hover */
          --text-primary: #111827; /* Dark gray for text */
          --text-secondary: #6b7280; /* Muted gray for secondary text */
          --background: #f8fafc; /* Light gray background */
          --surface: #ffffff; /* White for cards and surfaces */
          --border: #e5e7eb; /* Light border color */
          --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        .navbar {
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Khmer, 'Inter', sans-serif;
          box-shadow: var(--shadow-sm);
        }

        .navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.75rem;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--accent-color);
          transition: var(--transition);
        }

        .logo-text {
          color: var(--primary-color);
          transition: var(--transition);
        }

        .navbar-logo:hover .logo-text {
          color: var(--accent-color);
        }

        .navbar-desktop {
          display: none;
          flex-grow: 1;
          justify-content: center;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        @media (min-width: 1024px) {
          .navbar-desktop {
            display: flex;
          }
        }

        .nav-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          transition: var(--transition);
        }

        .nav-icon {
          width: 22px;
          height: 22px;
          color: var(--text-secondary);
          transition: var(--transition);
        }

        .nav-link:hover {
          color: var(--primary-color);
          background: var(--background);
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: var(--primary-color);
          background: var(--background);
          font-weight: 600;
          box-shadow: 0 2px 0 var(--accent-color);
        }

        .search-form {
          display: none;
        }

        @media (min-width: 1024px) {
          .search-form {
            display: flex;
          }
        }

        .search-input-group {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .search-input-group:focus-within {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .search-input {
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          outline: none;
          width: 300px;
          font-size: 1rem;
          color: var(--text-primary);
          font-family: 'Khmer, 'Inter', sans-serif;
        }

        .search-button {
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }

        .search-button:hover {
          color: var(--accent-color);
        }

        .auth-buttons {
          gap: 0.75rem;
        }

        .button-icon {
          width: 20px;
          height: 20px;
        }

        .login-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          border-radius: 10px;
          transition: var(--transition);
        }

        .login-button:hover {
          color: var(--primary-color);
          background: var(--background);
          transform: translateY(-2px);
        }

        .register-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary-color);
          color: var(--surface);
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
        }

        .register-button:hover {
          background: var(--accent-color);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #ef4444;
          color: var(--surface);
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
          font-family: 'Khmer, 'Inter', sans-serif;
        }

        .logout-button:hover {
          background: #dc2626;
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) and (min-width: 1024px) {
          .auth-buttons .button-text {
            display: none;
          }
          .auth-buttons .login-button,
          .auth-buttons .register-button,
          .auth-buttons .logout-button {
            padding: 0.75rem;
          }
          .auth-buttons {
            gap: 0.5rem;
          }
        }

        .mobile-menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--surface);
          color: var(--primary-color);
          cursor: pointer;
          transition: var(--transition);
        }

        .mobile-menu-button:hover {
          background: var(--background);
          box-shadow: var(--shadow-sm);
        }

        @media (min-width: 1024px) {
          .mobile-menu-button {
            display: none;
          }
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
          visibility: hidden;
          opacity: 0;
          transition: opacity 0.3s, visibility 0.3s;
        }

        .mobile-menu-overlay.open {
          visibility: visible;
          opacity: 1;
        }

        .mobile-menu {
          background: var(--surface);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          border-radius: 0 0 16px 16px;
          transform: translateY(-100%);
          transition: transform 0.3s ease-out;
          box-shadow: var(--shadow-md);
        }

        .mobile-menu-overlay.open .mobile-menu {
          transform: translateY(0);
        }

        .mobile-menu-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 1.1rem;
          border-radius: 12px;
          transition: var(--transition);
        }

        .mobile-nav-link .nav-icon {
          color: var(--accent-color);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: var(--background);
          color: var(--primary-color);
          font-weight: 600;
        }

        .mobile-search-form {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-search-input {
          width: 100%;
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Khmer, 'Inter', sans-serif;
          outline: none;
          transition: var(--transition);
        }

        .mobile-search-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .mobile-search-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--primary-color);
          color: var(--surface);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .mobile-search-button:hover {
          background: var(--accent-color);
          box-shadow: var(--shadow-md);
        }

        .mobile-auth-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .mobile-login-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          text-decoration: none;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          border-radius: 12px;
          font-weight: 500;
          font-size: 1rem;
          background: transparent;
          transition: var(--transition);
        }

        .mobile-login-button:hover {
          background: rgba(59, 130, 246, 0.05);
          box-shadow: var(--shadow-sm);
        }

        .mobile-register-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          text-decoration: none;
          background: var(--primary-color);
          color: var(--surface);
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          transition: var(--transition);
        }

        .mobile-register-button:hover {
          background: var(--accent-color);
          box-shadow: var(--shadow-md);
        }

        .mobile-logout-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #ef4444;
          color: var(--surface);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          font-family: 'Khmer, 'Inter', sans-serif;
          transition: var(--transition);
        }

        .mobile-logout-button:hover {
          background: #dc2626;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </nav>
  );
};

const IconBase = ({ children, className }) => (
  <svg 
    className={className} 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const MenuIcon = (props) => (
  <IconBase {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </IconBase>
);

const CloseIcon = (props) => (
  <IconBase {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
);

const SearchIcon = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </IconBase>
);

const LogoutIcon = (props) => (
  <IconBase {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </IconBase>
);

const UserIcon = (props) => (
  <IconBase {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconBase>
);

const UserPlusIcon = (props) => (
  <IconBase {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </IconBase>
);

const HomeIcon = (props) => (
  <IconBase {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </IconBase>
);

const PlusCircleIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </IconBase>
);

const ClipboardListIcon = (props) => (
  <IconBase {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M15 2H9a1 1 0 0 0-1 1v1h8V3a1 1 0 0 0-1-1z" />
    <line x1="10" y1="11" x2="14" y2="11" />
    <line x1="10" y1="15" x2="14" y2="15" />
  </IconBase>
);

const DashboardIcon = (props) => (
  <IconBase {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  </IconBase>
);

export default Navbar;