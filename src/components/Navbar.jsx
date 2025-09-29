import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const isActive = (path) => location.pathname === path;

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <>
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            {/* <HomeIcon /> */}
            <span>KhmerAds</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            <div className="nav-links">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                <DashboardIcon />
                <span>ទំព័រដើម</span>
              </Link>
              <Link 
                to="/post-ad" 
                className={`nav-link ${isActive('/post-ad') ? 'active' : ''}`}
              >
                <PlusCircleIcon />
                <span>បង្ហោះការផ្សាយ</span>
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/my-listings" 
                  className={`nav-link ${isActive('/my-listings') ? 'active' : ''}`}
                >
                  <ClipboardListIcon />
                  <span>ការផ្សាយរបស់ខ្ញុំ</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Section - Search & Auth */}
          <div className="nav-right">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកអចលនទ្រព្យ..."
                  className="search-input"
                />
              </div>
            </form>

            {/* Auth Buttons */}
            <div className="auth-section">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="btn btn-logout">
                  <LogoutIcon />
                  <span>ចាកចេញ</span>
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn btn-login">
                    <UserIcon />
                    <span>ចូល</span>
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    <UserPlusIcon />
                    <span>ចុះឈ្មោះ</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-content">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mobile-search">
                <div className="search-box">
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកអចលនទ្រព្យ..."
                    className="search-input"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  ស្វែងរក
                </button>
              </form>

              {/* Mobile Links */}
              <Link 
                to="/" 
                className={`mobile-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <DashboardIcon />
                <span>ទំព័រដើម</span>
              </Link>
              <Link 
                to="/post-ad" 
                className={`mobile-link ${isActive('/post-ad') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <PlusCircleIcon />
                <span>បង្ហោះការផ្សាយ</span>
              </Link>
              {isLoggedIn && (
                <Link 
                  to="/my-listings" 
                  className={`mobile-link ${isActive('/my-listings') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <ClipboardListIcon />
                  <span>ការផ្សាយរបស់ខ្ញុំ</span>
                </Link>
              )}

              {/* Mobile Auth */}
              <div className="mobile-auth">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="btn btn-logout btn-full">
                    <LogoutIcon />
                    <span>ចាកចេញ</span>
                  </button>
                ) : (
                  <div className="auth-buttons">
                    <Link to="/login" className="btn btn-outline btn-full" onClick={closeMenu}>
                      <UserIcon />
                      <span>ចូល</span>
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-full" onClick={closeMenu}>
                      <UserPlusIcon />
                      <span>ចុះឈ្មោះ</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation Bar - Mobile Only */}
      {isMobile && (
        <nav className="bottom-nav">
          <Link 
            to="/" 
            className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
          >
            <DashboardIcon />
            <span>ទំព័រដើម</span>
          </Link>
          
          <Link 
            to="/post-ad" 
            className={`bottom-nav-item ${isActive('/post-ad') ? 'active' : ''}`}
          >
            <PlusCircleIcon />
            <span>បង្ហោះ</span>
          </Link>
          
           <Link 
            to="/products" 
            className={`bottom-nav-item ${isActive('/post-ad') ? 'active' : ''}`}
          >
            <SearchIcon />
            <span>ស្វែងរក</span>
          </Link>
          
          {isLoggedIn ? (
            <Link 
              to="/my-listings" 
              className={`bottom-nav-item ${isActive('/my-listings') ? 'active' : ''}`}
            >
              <ClipboardListIcon />
              <span>របស់ខ្ញុំ</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className={`bottom-nav-item ${isActive('/login') ? 'active' : ''}`}
            >
              <UserIcon />
              <span>ចូល</span>
            </Link>
          )}
        </nav>
      )}

      <style jsx>{`
        .navbar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Inter', 'Khmer', sans-serif;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.5rem;
          color: #2563eb;
        }

        .nav-logo svg {
          width: 24px;
          height: 24px;
        }

        /* Desktop Navigation */
        .nav-desktop {
          display: none;
        }

        .nav-right {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }

        /* Search Form */
        .search-form {
          display: none;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          min-width: 280px;
        }

        .search-box svg {
          width: 18px;
          height: 18px;
          color: #64748b;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          flex: 1;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        /* Auth Section */
        .auth-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Buttons */
        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-login {
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .btn-login:hover {
          background: #f8fafc;
          color: #374151;
        }

        .btn-logout {
          background: #ef4444;
          color: white;
        }

        .btn-logout:hover {
          background: #dc2626;
        }

        .btn-outline {
          background: transparent;
          color: #2563eb;
          border: 1px solid #2563eb;
        }

        .btn-outline:hover {
          background: #f0f9ff;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
        }

        /* Mobile Toggle */
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
        }

        .mobile-toggle svg {
          width: 20px;
          height: 20px;
          color: #374151;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 1001;
        }

        .mobile-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-search {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #374151;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .mobile-link:hover,
        .mobile-link.active {
          background: #f8fafc;
          color: #2563eb;
        }

        .mobile-link svg {
          width: 20px;
          height: 20px;
        }

        .mobile-auth {
          margin-top: 0.5rem;
        }

        .auth-buttons {
          display: flex;
          gap: 0.75rem;
        }

        /* Bottom Navigation Bar */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0.5rem 0;
          z-index: 999;
          backdrop-filter: blur(10px);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          text-decoration: none;
          color: #64748b;
          font-size: 0.7rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 80px;
        }

        .bottom-nav-item.active {
          color: #2563eb;
        }

        .bottom-nav-item:hover {
          color: #2563eb;
        }

        .bottom-nav-item svg {
          width: 20px;
          height: 20px;
        }

        .bottom-nav-item span {
          font-size: 0.7rem;
          font-weight: 500;
          text-align: center;
        }

        .search-trigger {
          /* No additional styles needed */
        }

        /* Add padding to main content to account for bottom nav */
        :global(body) {
          padding-bottom: 60px;
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .nav-desktop {
            display: flex;
          }

          .nav-links {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            text-decoration: none;
            color: #64748b;
            border-radius: 6px;
            transition: all 0.2s;
          }

          .nav-link:hover {
            color: #2563eb;
            background: #f0f9ff;
          }

          .nav-link.active {
            color: #2563eb;
            background: #f0f9ff;
            font-weight: 500;
          }

          .nav-link svg {
            width: 18px;
            height: 18px;
          }

          .nav-right {
            display: flex;
          }

          .search-form {
            display: block;
          }

          .mobile-toggle {
            display: none;
          }

          .bottom-nav {
            display: none;
          }

          /* Remove bottom padding on desktop */
          :global(body) {
            padding-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .nav-container {
            padding: 0 2rem;
          }
          
          .search-box {
            min-width: 320px;
          }
        }

        /* Safe area support for notched phones */
        @supports (padding: max(0px)) {
          .bottom-nav {
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

// Keep all your existing Icon components exactly as they are
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