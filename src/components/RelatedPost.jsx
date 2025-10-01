import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const RelatedPost = ({ listingId, category }) => {
  const [relatedListings, setRelatedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Reuse getImageUrl from ListingDetails
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    const baseUrl = 'https://khmer365-1.onrender.com';
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    if (cleanPath.startsWith('uploads/')) {
      return `${baseUrl}/${cleanPath}`;
    }
    return `${baseUrl}/uploads/${cleanPath}`;
  }, []);

  // Get the first valid image URL for a listing
  const getFirstImageUrl = useCallback(
    (listing) => {
      if (listing?.images && Array.isArray(listing.images) && listing.images.length > 0) {
        const validImage = listing.images.find((img) => img.image_url);
        return validImage ? getImageUrl(validImage.image_url) : null;
      }
      return listing?.image_url ? getImageUrl(listing.image_url) : null;
    },
    [getImageUrl]
  );

  // Fetch related listings based on category
  useEffect(() => {
    const fetchRelatedListings = async () => {
      // Log the category for debugging
      console.log('Fetching related listings for category:', category, 'listingId:', listingId);

      if (!category || typeof category !== 'string') {
        console.error('Invalid category:', category);
        setError('ប្រភេទការផ្សាយមិនត្រឹមត្រូវ។');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Mock data for testing (uncomment to simulate API response)
        /*
        const mockData = [
          { id: 1, title: 'Sample Post 1', category, price: 100, images: [{ image_url: 'sample1.jpg' }] },
          { id: 2, title: 'Sample Post 2', category, price: 200, images: [{ image_url: 'sample2.jpg' }] },
          { id: 3, title: 'Sample Post 3', category, price: 300, images: [{ image_url: 'sample3.jpg' }] },
          { id: 4, title: 'Sample Post 4', category, price: 400, images: [{ image_url: 'sample4.jpg' }] },
        ];
        const filteredListings = mockData.filter((listing) => listing.id !== listingId).slice(0, 4);
        setRelatedListings(filteredListings);
        setError(null);
        setLoading(false);
        return;
        */

        const response = await apiClient.get(`/listings?category=${encodeURIComponent(category)}`);
        console.log('API response:', response.data);

        // Validate response data
        if (!Array.isArray(response.data)) {
          throw new Error('API response is not an array');
        }

        const filteredListings = response.data
          .filter((listing) => listing.id !== listingId)
          .slice(0, 4); // Limit to 4 related posts
        setRelatedListings(filteredListings);
        setError(null);
      } catch (err) {
        console.error('Error fetching related listings:', err);
        if (retryCount < 1) {
          // Retry once after a 2-second delay
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        } else {
          setError(
            err.response?.status === 404
              ? 'មិនមានការផ្សាយពាក់ព័ន្ធសម្រាប់ប្រភេទនេះទេ។'
              : `បរាជ័យក្នុងការទាញយកការផ្សាយពាក់ព័ន្ធ៖ ${err.message}។ សូមព្យាយាមម្តងទៀត។`
          );
        }
      } finally {
        if (retryCount >= 1) {
          setLoading(false);
        }
      }
    };

    fetchRelatedListings();
  }, [listingId, category, retryCount]);

  if (loading) {
    return (
      <div className="related-posts-container">
        <h2 className="related-posts-title">ការផ្សាយពាក់ព័ន្ធ</h2>
        <div className="related-posts-grid">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="loading-placeholder card" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="related-posts-container">
        <h2 className="related-posts-title">ការផ្សាយពាក់ព័ន្ធ</h2>
        <div className="error-message">
          <strong>កំហុស:</strong> <span>{error}</span>
        </div>
      </div>
    );
  }

  if (relatedListings.length === 0) {
    return (
      <div className="related-posts-container">
        <h2 className="related-posts-title">ការផ្សាយពាក់ព័ន្ធ</h2>
        <p className="no-related">មិនមានការផ្សាយពាក់ព័ន្ធទេ។</p>
      </div>
    );
  }

  return (
    <div className="related-posts-container">
      <h2 className="related-posts-title">ការផ្សាយពាក់ព័ន្ធ</h2>
      <div className="related-posts-grid">
        {relatedListings.map((listing) => (
          <Link
            key={listing.id}
            to={`/listing/${listing.id}`}
            className="related-post-card"
          >
            <div className="related-image-container">
              {getFirstImageUrl(listing) ? (
                <img
                  src={getFirstImageUrl(listing)}
                  alt={listing.title}
                  className="related-image"
                  onError={(e) => (e.target.src = '/img/fallback.jpg')}
                  loading="lazy"
                />
              ) : (
                <div className="no-image">
                  <svg
                    className="icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>គ្មានរូបភាព</span>
                </div>
              )}
            </div>
            <div className="related-post-content">
              <span className="category-badge">{listing.category}</span>
              <h3 className="related-post-title">{listing.title}</h3>
              <p className="related-post-price">
                ${Number(listing.price || 0).toFixed(2)} <span className="currency">USD</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .related-posts-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
          font-family: 'Inter', 'Khmer', sans-serif;
          background: #0a0e27;
          color: #7b8cde;
        }

        .related-posts-title {
          font-size: 1.5rem;
          color: #00d9ff;
          text-shadow: 2px 2px 0 #533483;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .related-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .related-post-card {
          background: #16213e;
          border: 4px solid #533483;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .related-post-card:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
        }

        .related-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          border-bottom: 4px solid #533483;
          overflow: hidden;
        }

        .related-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          display: block;
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #0f3460;
          color: #7b8cde;
          font-size: 0.8rem;
        }

        .no-image .icon {
          width: 24px;
          height: 24px;
          margin-bottom: 0.5rem;
        }

        .related-post-content {
          padding: 1rem;
        }

        .category-badge {
          display: inline-block;
          background: #e94560;
          color: white;
          padding: 0.3rem 0.6rem;
          font-size: 0.8rem;
          border: 2px solid #a32035;
          margin-bottom: 0.5rem;
        }

        .related-post-title {
          font-size: 1rem;
          color: #00d9ff;
          margin: 0.5rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .related-post-price {
          font-size: 0.9rem;
          color: #00d9ff;
          font-weight: 600;
        }

        .currency {
          font-size: 0.7rem;
          color: #7b8cde;
        }

        .loading-placeholder.card {
          background: #0f3460;
          border: 4px solid #533483;
          opacity: 0.5;
          animation: pulse 1.5s infinite;
          aspect-ratio: 16 / 9;
          height: 200px;
        }

        .error-message {
          text-align: center;
          color: #e94560;
          font-size: 0.9rem;
        }

        .error-message strong {
          font-size: 1rem;
        }

        .no-related {
          text-align: center;
          font-size: 0.9rem;
          color: #7b8cde;
        }

        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .related-posts-container {
            padding-bottom: 80px;
          }

          .related-posts-title {
            font-size: 1.2rem;
          }

          .related-posts-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .related-post-card {
            border: 3px solid #533483;
            box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.4);
          }

          .related-image-container {
            border-bottom: 3px solid #533483;
          }

          .related-post-title {
            font-size: 0.9rem;
          }

          .related-post-price {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RelatedPost;