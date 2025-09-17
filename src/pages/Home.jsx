import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import ListingCard from '../components/ListingCard';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/listings')
      .then((response) => {
        // Sort listings by id in descending order (highest id first)
        const sortedListings = response.data.sort((a, b) => b.id - a.id);
        setListings(sortedListings);
        setError(null);
      })
      .catch((error) => {
        console.error('កំហុសក្នុងការទាញយកការផ្សាយ:', error);
        setError('បរាជ័យក្នុងការទាញយកការផ្សាយ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ឬទាក់ទងអ្នកគ្រប់គ្រង។');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h1
            className="text-3xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            ការផ្សាយពិសេស
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 h-full animate-pulse"
              >
                <div className="relative pt-[70%] bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-9 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ការផ្សាយពិសេស
            </h1>
            <span
              className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              {listings.length} {listings.length === 1 ? 'ទំនិញ' : 'ទំនិញ'}
            </span>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              role="alert"
            >
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

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
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
                ពិនិត្យម្តងទៀតនៅពេលក្រោយសម្រាប់ទំនិញថ្មី។
              </p>
              <Link
                to="/post-ad"
                className="text-blue-700 hover:text-blue-600 font-medium text-sm transition-colors duration-300"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                បង្ហោះការផ្សាយថ្មី
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;