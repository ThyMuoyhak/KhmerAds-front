
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/listings/${id}`)
      .then((response) => {
        setListing(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('កំហុសក្នុងការទាញយកព័ត៌មានការផ្សាយ:', error);
        setError('បរាជ័យក្នុងការទាញយកព័ត៌មានការផ្សាយ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។');
        // Sample data for demonstration
        setListing({
          id: 1,
          title: "កាសស្តាប់ត្រចៀកឥតខ្សែគុណភាពខ្ពស់ជាមួយបច្ចេកវិទ្យាលុបសំឡេង",
          price: 199.99,
          category: "អេឡិចត្រូនិច",
          description:
            "កាសស្តាប់ត្រចៀកឥតខ្សែថ្មីសន្លាស់ជាមួយបច្ចេកវិទ្យាលុបសំឡេង។ ល្អបំផុតសម្រាប់ការធ្វើដំណើរ ធ្វើការ ឬសម្រាកនៅផ្ទះ។ មានអាយុកាលថ្ម ៣៦ ម៉ោង បន្ទះត្រចៀកទន់ស្រួល និងគុណភាពសំឡេងច្បាស់ថ្លា។",
          image_url: "/images/headphones.jpg",
          telegram_link: "https://t.me/audio_deals",
          email: "seller@example.com",
          created_at: "2023-10-15T14:30:00Z",
          // Added sample location data for dynamic map (replace with actual data from API)
          location: {
            lat: 11.552310837853577,
            lng: 104.89392166687959,
            name: "Phnom Penh",
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleContact = () => {
    if (listing.telegram_link) {
      window.open(listing.telegram_link, '_blank', 'noopener,noreferrer');
    } else if (listing.email) {
      window.location.href = `mailto:${listing.email}`;
    }
  };

  // Generate Google Map URL dynamically based on listing location
  const getMapUrl = () => {
    if (listing?.location?.lat && listing?.location?.lng) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250175.59514609256!2d${listing.location.lng}!3d${listing.location.lat}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(listing.location.name)}!5e0!3m2!1sen!2skh!4v1758135907692!5m2!1sen!2skh`;
    }
    // Fallback to Phnom Penh map
    return "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d250175.59514609256!2d104.89392166687959!3d11.552310837853577!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1758135907692!5m2!1sen!2skh";
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-80 bg-gray-200 rounded-lg mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong className="font-bold" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
              កំហុស:
            </strong>
            <span className="block sm:inline" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
              {error}
            </span>
          </div>
          <div className="text-center">
            <Link
              to="/"
              className="text-blue-700 hover:text-blue-600 font-medium transition-colors duration-300"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
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
              រកមិនឃើញការផ្សាយ
            </h3>
            <p
              className="text-gray-600 mb-4 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ការផ្សាយដែលអ្នកកំពុងស្វែងរកមិនមានទេ។
            </p>
            <Link
              to="/"
              className="text-blue-700 hover:text-blue-600 font-medium text-sm transition-colors duration-300"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-300"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                ទំព័រដើម
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="ml-1 text-sm font-medium text-gray-600 md:ml-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {listing.category}
                </span>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="ml-1 text-sm font-medium text-gray-600 md:ml-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {listing.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div>
              {listing.image_url && !imageError ? (
                <img
                  src={`http://localhost:8000${listing.image_url}`}
                  alt={listing.title}
                  className="w-full h-80 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    >
                      គ្មានរូបភាព
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                  {listing.category}
                </span>
                <h1
                  className="text-2xl md:text-3xl font-bold text-gray-900 mt-3"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {listing.title}
                </h1>
                <div className="flex items-center mt-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span
                    className="ml-1 text-sm text-gray-600"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    4.8 (១២៤ ការវាយតម្លៃ)
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-baseline">
                  <span
                    className="text-3xl font-bold text-blue-700"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    ${listing.price}
                  </span>
                  <span
                    className="ml-2 text-sm text-gray-500"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    USD
                  </span>
                </div>
                <p
                  className="text-sm text-gray-600 mt-1"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  គ្មានថ្លៃបន្ថែម
                </p>
              </div>

              <div>
                <h3
                  className="text-lg font-medium text-gray-900 mb-3"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  ការពិពណ៌នា
                </h3>
                <p
                  className="text-gray-700 text-sm leading-relaxed"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {listing.description}
                </p>
              </div>

              <div className="space-y-4">
                <h3
                  className="text-lg font-medium text-gray-900"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  ទាក់ទងអ្នកលក់
                </h3>
                <div className="flex flex-wrap gap-3">
                  {listing.telegram_link && (
                    <a
                      href={listing.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:shadow-sm transition-all duration-300 text-sm"
                      style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16 .16-.295 .296-.426 .298l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                      </svg>
                      ផ្ញើសារតាម Telegram
                    </a>
                  )}
                  {listing.email && (
                    <a
                      href={`mailto:${listing.email}`}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 hover:shadow-sm transition-all duration-300 text-sm"
                      style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      ផ្ញើអ៊ីមែល
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={handleContact}
                className="w-full bg-blue-700 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ទាក់ទងអ្នកលក់
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-6">
          <h3
            className="text-lg font-medium text-gray-900 mb-4"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            ព័ត៌មានលម្អិតអំពីទំនិញ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ប្រភេទ
              </h4>
              <p
                className="text-gray-900 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                {listing.category}
              </p>
            </div>
            <div>
              <h4
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                បង្ហោះនៅ
              </h4>
              <p
                className="text-gray-900 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                {new Date(listing.created_at).toLocaleDateString('km-KH')}
              </p>
            </div>
            <div>
              <h4
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ស្ថានភាពទំនិញ
              </h4>
              <p
                className="text-gray-900 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ថ្មី
              </p>
            </div>
            <div>
              <h4
                className="text-sm font-medium text-gray-600"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ការវាយតម្លៃអ្នកលក់
              </h4>
              <p
                className="text-gray-900 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                4.8/5 (១២៤ ការវាយតម្លៃ)
              </p>
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-6">
          <h3
            className="text-lg font-medium text-gray-900 mb-4"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            ទីតាំង
          </h3>
          <div className="w-full h-[450px] rounded-lg overflow-hidden">
            <iframe
              src={getMapUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
