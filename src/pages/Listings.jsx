import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ListingCard from '../components/ListingCard';

const Listings = () => {
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    const category = params.get('category') || '';
    
    setLoading(true);
    apiClient.get(`/listings?search=${search}&category=${category}`)
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
  }, [location.search]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 
          className="text-3xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: "'Kantumruy', sans-serif" }}
        >
          ការផ្សាយទាំងអស់
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
              className="text-gray-600 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              គ្មានការផ្សាយត្រូវនឹងការស្វែងរករបស់អ្នកទេ។
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard 
                key={listing.id}
                listing={listing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;