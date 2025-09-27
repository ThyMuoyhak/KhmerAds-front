import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // CSS Variables matching MyListings.jsx and EditListing.jsx
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
    '--error-color': '#dc2626',
    '--success-color': '#16a34a',
    '--hover-bg': '#f1f5f9',
  };

  // Helper to format timestamps (Asia/Phnom_Penh, e.g., 10:05 PM, Sep 27, 2025)
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Phnom_Penh',
      }).format(date);
    } catch (e) {
      return 'មិនអាចបង្ហាញកាលបរិច្ឆេទ';
    }
  };

  // Helper to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      return '/placeholder-image.jpg'; // Fallback image
    }
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.slice(8);
    }
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  // Fetch current user to check admin status
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users/me');
        if (!response.data.is_admin) {
          setError('អ្នកមិនមានសិទ្ធិអ្នកគ្រប់គ្រងទេ');
          navigate('/');
        }
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error.response || error);
        setError('សូមចូលគណនីអ្នកគ្រប់គ្រង');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error.response || error);
      setError(`បរាជ័យក្នុងការទាញយកអ្នកប្រើប្រាស់។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings (sorted last index first)
  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/listings');
      const sortedListings = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setListings(sortedListings);
      setError(null);
    } catch (error) {
      console.error('Error fetching listings:', error.response || error);
      setError(`បរាជ័យក្នុងការទាញយកការផ្សាយ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?')) return;
    try {
      await apiClient.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error.response || error);
      setError(`បរាជ័យក្នុងការលុបអ្នកប្រើប្រាស់។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    }
  };

  // Delete listing
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('តើអ្នកប្រាកដជាចង់លុបការផ្សាយនេះមែនទេ?')) return;
    try {
      await apiClient.delete(`/listings/${listingId}`);
      setListings(listings.filter((listing) => listing.id !== listingId));
      setError(null);
    } catch (error) {
      console.error('Error deleting listing:', error.response || error);
      setError(`បរាជ័យក្នុងការលុបការផ្សាយ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (!currentUser || !currentUser.is_admin) return;
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchListings();
    }
  }, [activeTab, currentUser]);

  // Loading state
  if (!currentUser || loading) {
    return (
      <div style={{
        background: cssVariables['--background'],
        padding: '2rem 1rem',
        minHeight: '100vh',
        fontFamily: "'Kantumruy', 'Arial', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{ fontSize: '1rem', color: cssVariables['--text-secondary'] }}>
          កំពុងផ្ទុក...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: cssVariables['--background'],
      padding: '2rem 1rem',
      minHeight: '100vh',
      fontFamily: "'Kantumruy', 'Arial', sans-serif",
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: cssVariables['--text-primary'],
          marginBottom: '1.5rem',
        }}>
          ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង
        </h1>
        {error && (
          <div style={{
            background: '#fee2e2',
            border: `1px solid ${cssVariables['--error-color']}`,
            color: cssVariables['--error-color'],
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <strong style={{ fontWeight: '600', fontSize: '0.9rem' }}>កំហុស:</strong>
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: `1px solid ${cssVariables['--border']}`,
        }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              fontWeight: '500',
              color: activeTab === 'users' ? cssVariables['--text-primary'] : cssVariables['--text-secondary'],
              background: activeTab === 'users' ? cssVariables['--surface'] : 'transparent',
              borderBottom: activeTab === 'users' ? `2px solid ${cssVariables['--accent-color']}` : 'none',
              cursor: 'pointer',
              transition: cssVariables['--transition'],
            }}
            aria-label="បង្ហាញអ្នកប្រើប្រាស់"
          >
            អ្នកប្រើប្រាស់
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              fontWeight: '500',
              color: activeTab === 'listings' ? cssVariables['--text-primary'] : cssVariables['--text-secondary'],
              background: activeTab === 'listings' ? cssVariables['--surface'] : 'transparent',
              borderBottom: activeTab === 'listings' ? `2px solid ${cssVariables['--accent-color']}` : 'none',
              cursor: 'pointer',
              transition: cssVariables['--transition'],
            }}
            aria-label="បង្ហាញការផ្សាយ"
          >
            ការផ្សាយ
          </button>
        </div>
        {/* Content */}
        <div style={{
          background: cssVariables['--surface'],
          border: `1px solid ${cssVariables['--border']}`,
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: cssVariables['--shadow-sm'],
        }}>
          {activeTab === 'users' ? (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: cssVariables['--text-primary'],
                marginBottom: '1rem',
              }}>
                គ្រប់គ្រងអ្នកប្រើប្រាស់
              </h2>
              {users.length === 0 ? (
                <p style={{ color: cssVariables['--text-secondary'], fontSize: '1rem' }}>
                  មិនមានអ្នកប្រើប្រាស់ទេ
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '8px',
                        background: cssVariables['--surface'],
                        boxShadow: cssVariables['--shadow-sm'],
                        transition: cssVariables['--transition'],
                        '&:hover': { background: cssVariables['--hover-bg'] },
                      }}
                    >
                      <img
                        src={getImageUrl(user.profile_picture)}
                        alt={`${user.username} profile`}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: cssVariables['--text-primary'],
                        }}>
                          {user.firstname} {user.lastname} (@{user.username})
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                        }}>
                          អ៊ីមែល: {user.email}
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                        }}>
                          បានចុះឈ្មោះនៅ: {formatDateTime(user.created_at)}
                        </p>
                      </div>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            color: cssVariables['--surface'],
                            background: cssVariables['--error-color'],
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: cssVariables['--transition'],
                            '&:hover': { background: '#b91c1c' },
                          }}
                          aria-label={`លុបអ្នកប្រើប្រាស់ ${user.username}`}
                        >
                          លុប
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: cssVariables['--text-primary'],
                marginBottom: '1rem',
              }}>
                គ្រប់គ្រងការផ្សាយ
              </h2>
              {listings.length === 0 ? (
                <p style={{ color: cssVariables['--text-secondary'], fontSize: '1rem' }}>
                  មិនមានការផ្សាយទេ
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr auto',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '8px',
                        background: cssVariables['--surface'],
                        boxShadow: cssVariables['--shadow-sm'],
                        transition: cssVariables['--transition'],
                        '&:hover': { background: cssVariables['--hover-bg'] },
                      }}
                    >
                      <img
                        src={getImageUrl(listing.image_url || (listing.images && listing.images[0]?.image_url))}
                        alt={listing.title}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                      <div>
                        <p style={{
                          fontSize: '1rem',
                          fontWeight: '500',
                          color: cssVariables['--text-primary'],
                        }}>
                          {listing.title}
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                          marginTop: '0.25rem',
                        }}>
                          ប្រភេទ: {listing.category}
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                        }}>
                          តម្លៃ: ${listing.price.toFixed(2)}
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                        }}>
                          បានបង្កើតនៅ: {formatDateTime(listing.created_at)}
                        </p>
                        <p style={{
                          fontSize: '0.9rem',
                          color: cssVariables['--text-secondary'],
                        }}>
                          អ្នកបង្កើត: {listing.owner?.username || 'មិនស្គាល់'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          color: cssVariables['--surface'],
                          background: cssVariables['--error-color'],
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: cssVariables['--transition'],
                          '&:hover': { background: '#b91c1c' },
                        }}
                        aria-label={`លុបការផ្សាយ ${listing.title}`}
                      >
                        លុប
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;