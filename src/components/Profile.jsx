import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ListingCard from './ListingCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Category map matching ListingCard
  const categoryMap = {
    electronics: 'អេឡិចត្រូនិច',
    fashion: 'ម៉ូដ',
    house: 'ផ្ទះ',
    photography: 'ការថតរូប',
    car: 'ឡាន',
    Other: 'ផ្សេងៗ',
  };

  // Function to format account creation date in Khmer
  const formatAccountCreationDate = (createdAt) => {
    if (!createdAt) return 'គ្មានព័ត៌មាន';

    const now = new Date('2025-09-18T16:22:00+07:00'); // Current time: 4:22 PM +07
    const creationDate = new Date(createdAt);

    if (isNaN(creationDate.getTime())) {
      return creationDate.toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    const diffMs = now - creationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMonths > 0) return `បង្កើតគណនីមុន ${diffMonths} ខែ`;
    if (diffWeeks > 0) return `បង្កើតគណនីមុន ${diffWeeks} សប្តាហ៍`;
    if (diffDays > 0) return `បង្កើតគណនីមុន ${diffDays} ថ្ងៃ`;
    if (diffHours > 0) return `បង្កើតគណនីមុន ${diffHours} ម៉ោង`;
    if (diffMins > 0) return `បង្កើតគណនីមុន ${diffMins} នាទី`;

    return 'ទើបនឹងបង្កើតគណនី';
  };

  const fetchProfileAndListings = async () => {
    setIsLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('សូមចូលគណនីដើម្បីមើលទម្រង់។');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    try {
      const profileResponse = await apiClient.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(profileResponse.data);

      const listingsResponse = await apiClient.get('/me/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(listingsResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        endpoint: err.config?.url,
      });
      if (err.response?.status === 401) {
        setError('សម័យគណនីផុតកំណត់។ សូមចូលគណនីម្តងទៀត។');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('រកមិនឃើញទិន្នន័យអ្នកប្រើប្រាស់ ឬការផ្សាយ។');
      } else {
        setError(`បរាជ័យក្នុងការទាញទិន្នន័យ៖ ${err.response?.data?.detail || err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndListings();
  }, [navigate]);

  const handleDelete = async (listingId) => {
    if (!window.confirm('តើអ្នកប្រាកដថាចង់លុបការផ្សាយនេះទេ?')) return;
    try {
      await apiClient.delete(`/listings/${listingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setListings(listings.filter((listing) => listing.id !== listingId));
      setError('');
    } catch (err) {
      console.error('Error deleting listing:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(`បរាជ័យក្នុងការលុបការផ្សាយ៖ ${err.response?.data?.detail || err.message}`);
    }
  };

  const handleUpdate = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleRetry = () => {
    fetchProfileAndListings();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 hover:shadow-md transition-all duration-300">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 h-4 bg-gray-200 rounded-md w-1/4"></div>
              <div className="mt-4 h-10 bg-gray-200 rounded-md w-1/4 ml-auto"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-200 rounded-md p-3 text-center">
              <p className="text-sm text-red-700" style={{ fontFamily: "'Kantumruy', sans-serif" }}>{error}</p>
              <div className="mt-2 space-x-2">
                {error.includes('ចូលគណនី') ? (
                  <Link to="/login" className="inline-block px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 hover:shadow-md transition-all duration-300" style={{ fontFamily: "'Kantumruy', sans-serif" }}>ចូលគណនី</Link>
                ) : (
                  <button onClick={handleRetry} className="inline-block px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 hover:shadow-md transition-all duration-300" style={{ fontFamily: "'Kantumruy', sans-serif" }}>ព្យាយាមម្តងទៀត</button>
                )}
              </div>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-semibold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900">{user.username || 'អ្នកប្រើប្រាស់'}</h2>
                  <p className="text-sm text-gray-600">{user.email || 'គ្មានអ៊ីមែល'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>បង្កើតគណនី: {formatAccountCreationDate(user.created_at)}</span>
              </div>
              <div className="flex justify-end">
                <Link to="/edit-profile" className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 hover:shadow-md transition-all duration-300" style={{ fontFamily: "'Kantumruy', sans-serif" }}>កែសម្រួលទម្រង់</Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">ការផ្សាយរបស់អ្នក ({listings.length})</h2>
            <Link to="/post-ad" className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 hover:shadow-md transition-all duration-300" style={{ fontFamily: "'Kantumruy', sans-serif" }}>បង្ហោះការផ្សាយថ្មី</Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-80 bg-gray-100 rounded-xl shadow-sm border border-gray-100">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-all duration-300">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Kantumruy', sans-serif" }}>អ្នកមិនទាន់មានការផ្សាយទេ។</p>
              <Link to="/post-ad" className="inline-block px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 hover:shadow-md transition-all duration-300" style={{ fontFamily: "'Kantumruy', sans-serif" }}>បង្ហោះការផ្សាយថ្មី</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={{
                    ...listing,
                    category: categoryMap[listing.category] || listing.category,
                    image_url: listing.image_url ? `http://localhost:8000${listing.image_url}` : null,
                  }}
                  onUpdate={() => handleUpdate(listing.id)}
                  onDelete={() => handleDelete(listing.id)}
                  isDeleting={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;