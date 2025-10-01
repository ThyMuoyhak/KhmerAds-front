import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Icon components (unchanged from your original code)
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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileSearchInputRef = useRef(null);

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
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input
      setIsMobileMenuOpen(false);
    } else {
      alert('Please enter a search term to find products.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img style={{borderRadius:'10px'}} width={70} src="/img/khmerads.jpg" alt="" />
            <span>KhmerAds</span>
          </Link>

          <div className="nav-desktop">
            <div className="nav-links">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <DashboardIcon />
                <span>ទំព័រដើម</span>
              </Link>
              
              <Link to="/post-ad" className={`nav-link ${isActive('/post-ad') ? 'active' : ''}`}>
                <PlusCircleIcon />
                <span>បង្ហោះការផ្សាយ</span>
              </Link>
              {isLoggedIn && (
                <Link to="/my-listings" className={`nav-link ${isActive('/my-listings') ? 'active' : ''}`}>
                  <ClipboardListIcon />
                  <span>ការផ្សាយរបស់ខ្ញុំ</span>
                </Link>
              )}
            </div>
          </div>

          <div className="nav-right">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-box">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកផលិតផល..."
                  className="search-input"
                  aria-label="Search for products"
                />
              </div>
            </form>

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

          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-content">
              <form onSubmit={handleSearch} className="mobile-search">
                <div className="search-box">
                  <SearchIcon />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកផលិតផល..."
                    className="search-input"
                    ref={mobileSearchInputRef}
                    aria-label="Search for products"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full">
                  ស្វែងរក
                </button>
              </form>

              <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
                <DashboardIcon />
                <span>ទំព័រដើម</span>
              </Link>
              <Link to="/post-ad" className={`mobile-link ${isActive('/post-ad') ? 'active' : ''}`} onClick={closeMenu}>
                <PlusCircleIcon />
                <span>បង្ហោះការផ្សាយ</span>
              </Link>
              {isLoggedIn && (
                <Link to="/my-listings" className={`mobile-link ${isActive('/my-listings') ? 'active' : ''}`} onClick={closeMenu}>
                  <ClipboardListIcon />
                  <span>ការផ្សាយរបស់ខ្ញុំ</span>
                </Link>
              )}

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

      {isMobile && (
        <nav className="bottom-nav">
          <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
            <DashboardIcon />
            <span>ទំព័រដើម</span>
          </Link>
          <Link to="/post-ad" className={`bottom-nav-item ${isActive('/post-ad') ? 'active' : ''}`}>
            <PlusCircleIcon />
            <span>បង្ហោះ</span>
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(true);
              setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
            }}
            className={`bottom-nav-item ${isActive('/products') ? 'active' : ''}`}
            aria-label="Open search menu"
          >
            <SearchIcon />
            <span>ស្វែងរក</span>
          </button>
          {isLoggedIn ? (
            <Link to="/my-listings" className={`bottom-nav-item ${isActive('/my-listings') ? 'active' : ''}`}>
              <ClipboardListIcon />
              <span>របស់ខ្ញុំ</span>
            </Link>
          ) : (
            <Link to="/login" className={`bottom-nav-item ${isActive('/login') ? 'active' : ''}`}>
              <UserIcon />
              <span>ចូល</span>
            </Link>
          )}
        </nav>
      )}

      <style jsx>{`
        /* Pixel Art Modern Navbar Styles */
        .navbar {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-bottom: 4px solid #0f3460;
          box-shadow: 0 4px 0 #533483, 0 8px 20px rgba(0, 0, 0, 0.5);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Press Start 2P', 'Inter', 'Khmer', monospace;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 1.2rem;
          color: #00d9ff;
          text-shadow: 3px 3px 0 #533483, 6px 6px 0 rgba(0, 0, 0, 0.3);
          transition: transform 0.1s;
          padding: 0.5rem;
        }

        .nav-logo:hover {
          transform: scale(1.05);
          color: #7df9ff;
        }

        .nav-logo svg {
          width: 28px;
          height: 28px;
          filter: drop-shadow(2px 2px 0 #533483);
        }

        .nav-desktop {
          display: none;
        }

        .nav-right {
          display: none;
          align-items: center;
          gap: 1rem;
        }

        .search-form {
          display: none;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #0f3460;
          border: 3px solid #533483;
          border-radius: 0;
          padding: 0.75rem 1rem;
          min-width: 280px;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }

        .search-box:focus-within {
          border-color: #00d9ff;
          box-shadow: 4px 4px 0 #00d9ff;
        }

        .search-box svg {
          width: 20px;
          height: 20px;
          color: #00d9ff;
        }

        .search-input {
          border: none;
          background: transparent;
          outline: none;
          flex: 1;
          font-size: 0.85rem;
          color: #ffffff;
          font-family: 'Inter', 'Khmer', monospace;
        }

        .search-input::placeholder {
          color: #7b8cde;
        }

        .auth-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: 3px solid;
          border-radius: 0;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.1s;
          text-transform: uppercase;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
          background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
          color: white;
          border-color: #a32035;
        }

        .btn-primary:hover {
          background: linear-gradient(180deg, #ff5470 0%, #e94560 100%);
          border-color: #c72c41;
        }

        .btn-login {
          background: linear-gradient(180deg, #533483 0%, #3a2359 100%);
          color: #00d9ff;
          border-color: #7b8cde;
        }

        .btn-login:hover {
          background: linear-gradient(180deg, #6b4798 0%, #533483 100%);
          color: #7df9ff;
        }

        .btn-logout {
          background: linear-gradient(180deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border-color: #c92a2a;
        }

        .btn-logout:hover {
          background: linear-gradient(180deg, #ff8787 0%, #ff6b6b 100%);
        }

        .btn-outline {
          background: transparent;
          color: #00d9ff;
          border-color: #00d9ff;
        }

        .btn-outline:hover {
          background: rgba(0, 217, 255, 0.1);
          color: #7df9ff;
          border-color: #7df9ff;
        }

        .btn-full {
          width: 100%;
          justify-content: center;
        }

        .btn svg {
          width: 16px;
          height: 16px;
        }

        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 3px solid #533483;
          border-radius: 0;
          background: linear-gradient(180deg, #0f3460 0%, #0a1f3d 100%);
          cursor: pointer;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          transition: all 0.1s;
        }

        .mobile-toggle:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .mobile-toggle svg {
          width: 24px;
          height: 24px;
          color: #00d9ff;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #16213e 0%, #0f1b2e 100%);
          border-top: 4px solid #533483;
          border-bottom: 4px solid #0f3460;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
          z-index: 1001;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          padding: 1rem;
          text-decoration: none;
          color: #7b8cde;
          border: 2px solid transparent;
          border-radius: 0;
          transition: all 0.2s;
          font-size: 0.85rem;
          background: rgba(15, 52, 96, 0.3);
          box-shadow: inset 0 0 0 rgba(0, 217, 255, 0);
        }

        .mobile-link:hover,
        .mobile-link.active {
          background: rgba(15, 52, 96, 0.8);
          color: #00d9ff;
          border-color: #533483;
          box-shadow: inset 0 0 20px rgba(0, 217, 255, 0.2);
        }

        .mobile-link svg {
          width: 22px;
          height: 22px;
        }

        .mobile-auth {
          margin-top: 0.5rem;
        }

        .auth-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          border-top: 4px solid #533483;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0.75rem 0;
          z-index: 999;
          box-shadow: 0 -4px 0 #0f3460, 0 -8px 20px rgba(0, 0, 0, 0.5);
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 0.5rem;
          text-decoration: none;
          color: #7b8cde;
          font-size: 0.65rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 80px;
          position: relative;
        }

        .bottom-nav-item::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 4px;
          background: #00d9ff;
          transition: width 0.2s;
          box-shadow: 0 0 10px #00d9ff;
        }

        .bottom-nav-item.active {
          color: #00d9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }

        .bottom-nav-item.active::before {
          width: 60%;
        }

        .bottom-nav-item:hover {
          color: #7df9ff;
          transform: translateY(-2px);
        }

        .bottom-nav-item svg {
          width: 24px;
          height: 24px;
          filter: drop-shadow(0 0 5px currentColor);
        }

        .bottom-nav-item span {
          font-size: 0.65rem;
          font-weight: 600;
          text-align: center;
          letter-spacing: 0.5px;
        }

        body {
          padding-bottom: 70px;
          background: #0a0e27;
        }

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
            padding: 0.75rem 1rem;
            text-decoration: none;
            color: #7b8cde;
            border: 2px solid transparent;
            border-radius: 0;
            transition: all 0.2s;
            font-size: 0.75rem;
            background: rgba(15, 52, 96, 0.3);
            position: relative;
          }

          .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: #00d9ff;
            transition: width 0.2s;
            box-shadow: 0 0 10px #00d9ff;
          }

          .nav-link:hover {
            color: #00d9ff;
            background: rgba(15, 52, 96, 0.8);
            border-color: #533483;
            transform: translateY(-2px);
          }

          .nav-link:hover::after {
            width: 100%;
          }

          .nav-link.active {
            color: #00d9ff;
            background: rgba(15, 52, 96, 0.8);
            border-color: #533483;
            font-weight: 600;
          }

          .nav-link.active::after {
            width: 100%;
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

          body {
            padding-bottom: 0;
          }
        }

        @media (min-width: 1024px) {
          .nav-container {
            padding: 0 2rem;
          }

          .search-box {
            min-width: 350px;
          }

          .nav-logo {
            font-size: 1.4rem;
          }
        }

        @keyframes pixelGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor);
          }
        }

        .btn:hover svg,
        .nav-link:hover svg,
        .bottom-nav-item:hover svg {
          animation: pixelGlow 1.5s ease-in-out infinite;
        }

        @supports (padding: max(0px)) {
          .bottom-nav {
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          }
        }

        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px,
            transparent 2px
          );
          pointer-events: none;
          opacity: 0.3;
        }
      `}</style>
    </>
  );
};

export default Navbar;