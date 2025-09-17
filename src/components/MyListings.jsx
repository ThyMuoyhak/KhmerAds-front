import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ListingCard from './ListingCard';

const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/listings/my')
      .then(response => {
        setListings(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
        setError(`បរាជ័យក្នុងការទាញយកការផ្សាយ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdate = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('តើអ្នកប្រាកដថាចង់លុបការផ្សាយនេះទេ?')) {
      return;
    }
    setDeletingId(listingId);
    try {
      await apiClient.delete(`/listings/${listingId}`);
      setListings(listings.filter(listing => listing.id !== listingId));
      setError(null);
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError(`បរាជ័យក្នុងការលុបការផ្សាយ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 
          className="text-3xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: "'Kantumruy', sans-serif" }}
        >
          ការផ្សាយរបស់ខ្ញុំ
        </h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong 
              className="font-bold"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              កំហុស: 
            </strong>
            <span 
              className="block sm:inline"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              {error}
            </span>
          </div>
        )}
        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 
              className="text-lg font-medium text-gray-900 mb-1"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              គ្មានការផ្សាយ
            </h3>
            <p 
              className="text-gray-600 text-sm mb-4"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              អ្នកមិនទាន់បានបង្ហោះការផ្សាយទេ។ ចុចខាងក្រោមដើម្បីបង្ហោះថ្មី។
            </p>
            <Link 
              to="/post-ad" 
              className="text-blue-700 hover:text-blue-600 font-medium text-sm transition-colors duration-300"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              បង្ហោះការផ្សាយថ្មី
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard 
                key={listing.id}
                listing={listing}
                onUpdate={() => handleUpdate(listing.id)}
                onDelete={() => handleDelete(listing.id)}
                isDeleting={deletingId === listing.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;