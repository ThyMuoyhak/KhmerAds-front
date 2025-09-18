import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const MyListings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'មិនមានកាលបរិច្ឆេទ';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 60) {
        return `${diffMinutes} នាទីមុន`;
      } else if (diffHours < 24) {
        return `${diffHours} ម៉ោងមុន`;
      } else if (diffDays < 7) {
        return `${diffDays} ថ្ងៃមុន`;
      } else {
        return date.toLocaleDateString('km-KH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ';
    }
  };

  // Helper function to truncate description to 2 lines
  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return 'គ្មានការពិពណ៌នា';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  // Helper function to get full image URL - FIXED VERSION
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle different path formats from backend
    if (imagePath.includes('listings/') || imagePath.includes('profiles/') || imagePath.includes('banners/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${imagePath}`;
    }
    
    // If it starts with /, assume it's from the backend
    if (imagePath.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${imagePath}`;
    }
    
    // Default case - assume it's in the uploads directory
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${imagePath}`;
  };

  // Get the first image from a listing - handles different data structures
  const getFirstImage = (listing) => {
    // If images is an array with at least one item
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) {
      return listing.images[0];
    }
    
    // If image_url exists (like in ListingCard)
    if (listing.image_url) {
      return listing.image_url;
    }
    
    // If there's a direct image property
    if (listing.image) {
      return listing.image;
    }
    
    // No image available
    return null;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('គ្មានសេសម្ភារៈសុវត្ថិភាព។ សូមឡុកអ៊ីនមុន។');
      setLoading(false);
      return;
    }

    if (retryCount > 3) {
      setError('បានឈានដល់ដែនកំណត់ការព្យាយាម។ សូមពិនិត្យការតភ្ជាប់ឬឡុកអ៊ីនឡើងវិញ។');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching user data from /users/me...');
      const userResponse = await apiClient.get('/users/me');
      console.log('User data fetched:', userResponse.data);
      setUser(userResponse.data);

      console.log('Fetching listings from /listings/my...');
      const listingsResponse = await apiClient.get('/listings/my');
      console.log('Listings data fetched:', listingsResponse.data);
      
      // Log image data for debugging
      listingsResponse.data.forEach(listing => {
        console.log(`Listing ${listing.id} image data:`, {
          images: listing.images,
          image_url: listing.image_url,
          image: listing.image
        });
      });
      
      setListings(listingsResponse.data);
      setError(null);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response : error);
      const errorDetail = error.response?.data?.detail || error.message;
      const status = error.response?.status;
      console.log('Failed request config:', error.response?.config || error.config);
      let errorMessage = `បរាជ័យក្នុងការទាញយកទិន្នន័យ។ (កំហុស: ${errorDetail})`;
      if (status === 401) {
        errorMessage = 'សេសម្ភារៈសុវត្ថិភាពមិនត្រឹមត្រូវ។ សូមឡុកអ៊ីនឡើងវិញ។';
      } else if (status === 404) {
        errorMessage = 'ទិន្នន័យរបស់អ្នកមិនអាចរកឃើញ។';
      }
      setError(errorMessage);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    if (retryCount <= 3 || window.confirm('បានឈានដល់ដែនកំណត់ការព្យាយាម។ តើអ្នកចង់ធ្វើការព្យាយាមឡើងវិញទេ?')) {
      setRetryCount(0); // Reset on manual retry
      fetchData();
    }
  };

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
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ការផ្សាយរបស់ខ្ញុំ
            </h1>
            {user && (
              <p
                className="text-sm text-gray-600 mt-1"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                សូមស្វាគមន៍, {user.firstname} {user.lastname || ''}
              </p>
            )}
          </div>
          <Link
            to="/post-ad"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 text-sm"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            បង្ហោះការផ្សាយថ្មី
          </Link>
        </div>
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
            <button
              onClick={handleRetry}
              className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ព្យាយាមម្តងទៀត
            </button>
          </div>
        )}
        {user ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ព័ត៌មានផ្ទាល់ខ្លួន
            </h2>
            
            {/* Cover Photo (Facebook-style) */}
            <div className="relative mb-16">
              <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {user.cover_banner ? (
                  <img
                    src={getImageUrl(user.cover_banner)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center ${user.cover_banner ? 'hidden' : 'flex'}`}>
                  <span className="text-gray-500" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                    {user.cover_banner ? 'រូបផ្ទាំងមិនអាចបង្ហាញ' : 'គ្មានរូបផ្ទាំង'}
                  </span>
                </div>
              </div>
              
              {/* Profile Picture (Positioned over cover) */}
              <div className="absolute -bottom-12 left-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  {user.profile_picture ? (
                    <img
                      src={getImageUrl(user.profile_picture)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gray-200 rounded-full flex items-center justify-center ${user.profile_picture ? 'hidden' : 'flex'}`}>
                    <span className="text-gray-500 text-xs" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                      {user.profile_picture ? 'រូបមិនអាចបង្ហាញ' : 'គ្មានរូប'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Info */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                  ព័ត៌មានមូលដ្ឋាន
                </h3>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>ឈ្មោះ:</div>
                  <div className="w-2/3 font-medium">{user.firstname} {user.lastname || ''}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>ភេទ:</div>
                  <div className="w-2/3">{user.gender || 'N/A'}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>អ៊ីមែល:</div>
                  <div className="w-2/3">{user.email}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                  ព័ត៌មានបន្ថែម
                </h3>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>អាសយដ្ឋាន:</div>
                  <div className="w-2/3">{user.address || 'N/A'}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>លេខទូរស័ព្ទ:</div>
                  <div className="w-2/3">{user.phonenumber || 'N/A'}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-1/3 text-gray-600" style={{ fontFamily: "'Kantumruy', sans-serif" }}>ប្រវត្តិ:</div>
                  <div className="w-2/3">{user.bio || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            {/* Listings Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                ការផ្សាយរបស់ខ្ញុំ ({listings.length})
              </h3>
              
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => {
                    const imageUrl = getImageUrl(getFirstImage(listing));
                    return (
                      <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Listing Image */}
                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                          {imageUrl ? (
                            <>
                              <img
                                src={imageUrl}
                                alt={listing.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => { 
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentNode.querySelector('.image-fallback');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                              <div 
                                className="image-fallback w-full h-full bg-gray-200 flex items-center justify-center hidden"
                              >
                                <span className="text-gray-500 text-sm" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                                  រូបភាពមិនអាចបង្ហាញ
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                                គ្មានរូបភាព
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Listing Content */}
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-2 text-gray-900" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                            {listing.title}
                          </h4>
                          
                          {/* Price */}
                          {listing.price && (
                            <p className="text-xl font-bold text-blue-600 mb-2">
                              ${listing.price}
                            </p>
                          )}
                          
                          {/* Description (2 lines with ellipsis) */}
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed" style={{ 
                            fontFamily: "'Kantumruy', sans-serif",
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '1.4'
                          }}>
                            {truncateDescription(listing.description)}
                          </p>
                          
                          {/* Upload Timestamp */}
                          <div className="flex items-center text-xs text-gray-500 mb-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                              បង្ហោះនៅ: {formatTimestamp(listing.created_at)}
                            </span>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdate(listing.id)}
                              className="flex-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm px-3 py-2 border border-blue-200 rounded-md transition-colors duration-200"
                              style={{ fontFamily: "'Kantumruy', sans-serif" }}
                            >
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              កែ
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="flex-1 text-red-600 hover:text-red-800 hover:bg-red-50 text-sm px-3 py-2 border border-red-200 rounded-md transition-colors duration-200"
                              style={{ fontFamily: "'Kantumruy', sans-serif" }}
                              disabled={deletingId === listing.id}
                            >
                              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {deletingId === listing.id ? 'កំពុងលុប...' : 'លុប'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
                    គ្មានការផ្សាយ
                  </p>
                  <Link
                    to="/post-ad"
                    className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-300"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    បង្ហោះការផ្សាយថ្មី
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ទាញយកព័ត៌មានបរាជ័យ។
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ព្យាយា�មម្តងទៀត
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;