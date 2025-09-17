import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is logged in by checking for JWT token
  const isLoggedIn = !!localStorage.getItem('token');

  // Check if current path matches to apply active styling
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Category options matching listings.py
  const categoryOptions = [
    { value: '', label: 'ប្រភេទទាំងអស់' },
    { value: 'electronics', label: 'អេឡិចត្រូនិច' },
    { value: 'fashion', label: 'ម៉ូដ' },
    { value: 'house', label: 'ផ្ទះ' },
    { value: 'photography', label: 'ការថតរូប' },
    { value: 'car', label: 'ឡាន' },
    { value: 'Other', label: 'ផ្សេងៗ' },
  ];

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCategory) {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
      if (selectedCategory) queryParams.append('category', selectedCategory);
      navigate(`/listings?${queryParams.toString()}`);
    } else {
      navigate('/listings');
    }
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className="bg-white rounded-b-xl shadow-sm border border-gray-100/50 sticky top-0 z-50"
      style={{ fontFamily: "'Kantumruy', sans-serif" }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-gray-900 hover:text-blue-700 transition-all duration-300"
            aria-label="ទៅកាន់ទំព័រដើម"
          >
            <span className="text-2xl font-semibold text-gray-900">
              KhmerAds
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 hover:shadow-sm'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              ទំព័រដើម
            </Link>
            <Link 
              to="/post-ad" 
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/post-ad') 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 hover:shadow-sm'
              }`}
              aria-current={isActive('/post-ad') ? 'page' : undefined}
            >
              បង្ហោះការផ្សាយ
            </Link>
            <Link 
              to="/my-listings" 
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                isActive('/my-listings') 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50 hover:shadow-sm'
              }`}
              aria-current={isActive('/my-listings') ? 'page' : undefined}
            >
              ការផ្សាយរបស់ខ្ញុំ
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center space-x-2 flex-1 mx-6"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកការផ្សាយ..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-all duration-300"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ស្វែងរក
            </button>
          </form>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 hover:shadow-md transition-all duration-300"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ចាកចេញ
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-gray-600 font-medium text-sm rounded-lg hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-300"
                >
                  ចូល
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 hover:shadow-md transition-all duration-300"
                >
                  ចុះឈ្មោះ
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg bg-gray-100/60 border border-gray-100 hover:bg-blue-50/50 hover:shadow-sm transition-all duration-300"
            aria-label="បើកម៉ឺនុយ"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-2 px-6">
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="flex flex-col space-y-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ស្វែងរកការផ្សាយ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-all duration-300"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  ស្វែងរក
                </button>
              </form>
              {/* Mobile Navigation Links */}
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ទំព័រដើម
              </Link>
              <Link 
                to="/post-ad" 
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive('/post-ad') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                បង្ហោះការផ្សាយ
              </Link>
              <Link 
                to="/my-listings" 
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  isActive('/my-listings') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ការផ្សាយរបស់ខ្ញុំ
              </Link>
              {/* Mobile Auth Buttons */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-all duration-300 text-left"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  ចាកចេញ
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="w-full px-4 py-2 text-gray-600 font-medium text-sm rounded-lg hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-300 text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ចូល
                  </Link>
                  <Link 
                    to="/register" 
                    className="w-full px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded-lg hover:bg-blue-800 transition-all duration-300 text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ចុះឈ្មោះ
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;