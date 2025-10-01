import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListingCard.css';

const ListingCard = ({ listing, onUpdate, onDelete, isDeleting }) => {
  // Initialize currentTime to real Phnom Penh time
  const [currentTime, setCurrentTime] = useState(() => {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const acc = parts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return new Date(
      parseInt(acc.year, 10),
      parseInt(acc.month, 10) - 1,
      parseInt(acc.day, 10),
      parseInt(acc.hour, 10),
      parseInt(acc.minute, 10),
      parseInt(acc.second, 10)
    );
  });

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [primaryImageUrl, setPrimaryImageUrl] = useState(null);

  // Update currentTime every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Map categories to Khmer
  const categoryMap = {
    'Cars and Vehicles': 'ឡាននិងយានជំនិះ',
    'Phones & Tablets': 'ទូរស័ព្ទនិងថេប្លេត',
    'Computers & Accessories': 'កុំព្យូទ័រនិងគ្រឿងបន្លាស់',
    'Electronics & Appliances': 'អេឡិចត្រូនិចនិងឧបករណ៍',
    'House & Land': 'ផ្ទះនិងដី',
    Jobs: 'ការងារ',
    Services: 'សេវាកម្ម',
    'Fashion & Beauty': 'ម៉ូដនិងសម្ផស្ស',
    'Furniture & Decor': 'គ្រឿងសង្ហារិមនិងការតុបតែង',
    'Books, Sports & Hobbies': 'សៀវភៅ កីឡា និងចំណង់ចំណូលចិត្ត',
    Pets: 'សត្វចិញ្ចឹម',
    Foods: 'អាហារ',
    Electronics: 'អេឡិចត្រូនិច',
    Fashion: 'ម៉ូដ',
    'Home & Garden': 'ផ្ទះ និងសួន',
    Vehicles: 'យានយន្ត',
    Sports: 'កីឡា',
    Hobbies: 'ចំណង់ចំណូលចិត្ត',
    Other: 'ផ្សេងៗ',
  };

  // FIXED: Set primary image URL with correct API base URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.warn('Invalid or missing imageUrl:', imageUrl);
      return null;
    }
    
    // Use your actual API URL
    const baseUrl = 'https://khmer365-1.onrender.com';
    
    // If already a full URL, return as-is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Remove leading slash if present
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    
    // If path already includes 'uploads/', use as-is
    if (cleanPath.startsWith('uploads/')) {
      return `${baseUrl}/${cleanPath}`;
    }
    
    // Otherwise add 'uploads/' prefix
    return `${baseUrl}/uploads/${cleanPath}`;
  };

  useEffect(() => {
    if (listing?.images && Array.isArray(listing.images) && listing.images.length > 0 && listing.images[0]?.image_url) {
      const url = getImageUrl(listing.images[0].image_url);
      console.log('Setting image URL from images array:', url);
      setPrimaryImageUrl(url);
      setImageLoading(true);
      setImageError(false);
    } else if (listing?.image_url) {
      const url = getImageUrl(listing.image_url);
      console.log('Setting image URL from image_url:', url);
      setPrimaryImageUrl(url);
      setImageLoading(true);
      setImageError(false);
    } else {
      console.log('No image found for listing:', listing?.id);
      setPrimaryImageUrl(null);
      setImageLoading(false);
      setImageError(true);
    }
  }, [listing]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    console.error('Failed to load image:', primaryImageUrl);
    setImageLoading(false);
    setImageError(true);
  };

  // Format relative time in Khmer
  const formatTimeSincePosted = (dateString) => {
    if (!dateString) return 'គ្មានព័ត៌មាន';
    try {
      const postedDate = new Date(dateString);
      const diffMs = currentTime - postedDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (diffHours >= 24) {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} ថ្ងៃមុន`;
      } else if (diffHours >= 1) {
        return `${diffHours} ម៉ោង${diffMinutes > 0 ? ` និង ${diffMinutes} នាទី` : ''}មុន`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes} នាទីមុន`;
      } else if (diffSeconds >= 0) {
        return `ឥឡូវនេះ`;
      } else {
        return 'មិនអាចគណនាបាន';
      }
    } catch (error) {
      console.error('Error formatting time since posted:', error);
      return 'មិនអាចគណនាបាន';
    }
  };

  return (
    <div className="listing-card">
      <div className="image-container">
        {primaryImageUrl ? (
          <>
            {imageLoading && (
              <div className="image-loading">
                <div className="spinner" />
              </div>
            )}
            <img
              src={primaryImageUrl}
              alt={listing?.title || 'Listing image'}
              className="listing-image"
              loading="eager"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {imageError && (
              <div className="image-error" role="img" aria-label="Image load failed">
                <div className="image-error-content">
                  <svg className="image-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="image-error-text">រូបភាពមិនអាចបង្ហាញបាន</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-image" role="img" aria-label="No image available">
            <div className="image-error-content">
              <svg className="image-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="image-error-text">គ្មានរូបភាព</span>
            </div>
          </div>
        )}
        <span className="category-badge">
          {categoryMap[listing?.category] || listing?.category || 'ផ្សេងៗ'}
        </span>
        <div className="price-badge">
          <span className="price-text">${Number(listing?.price || 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="content-section">
        <h3 className="listing-title">{listing?.title || 'គ្មានចំណងជើង'}</h3>
        <div className="post-time-section">
          <svg className="post-time-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="post-time-text">
            បង្ហោះ៖ {formatTimeSincePosted(listing?.created_at)}
          </span>
        </div>
        <div className="contact-links">
          {listing?.telegram_link && (
            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <svg className="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.58 7.44c-.12.532-.432.66-.876.41l-2.436-1.8-1.176 1.128c-.132.132-.24.24-.492.24l.168-2.388L15.12 9.28c.192-.168-.048-.264-.288-.096l-3.3 2.08-2.22-.696c-.48-.156-.492-.48.108-.708l8.688-3.348c.408-.156.756.096.636.708z" />
                </svg>
              </div>
              <a href={listing.telegram_link} target="_blank" rel="noopener noreferrer" className="contact-link" aria-label="Contact via Telegram">
                ទំនាក់ទំនងតាម Telegram
              </a>
            </div>
          )}
          {listing?.email && (
            <div className="contact-item">
              <div className="contact-icon-wrapper">
                <svg className="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <a href={`mailto:${listing.email}`} className="contact-link-E" aria-label={`Email ${listing.email}`}>
                {listing.email}
              </a>
            </div>
          )}
        </div>
        <Link to={`/listing/${listing?.id || ''}`} className="details-button">
          មើលព័ត៌មានបន្ថែម
        </Link>
        {(onUpdate || onDelete) && (
          <div className="action-buttons">
            {onUpdate && (
              <button onClick={onUpdate} className="action-button edit-button" disabled={isDeleting} aria-label="Edit listing">
                កែសម្រួល
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="action-button delete-button" disabled={isDeleting} aria-label="Delete listing">
                {isDeleting ? (
                  <span className="delete-loading">
                    <svg className="delete-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    កំពុងលុប...
                  </span>
                ) : (
                  'លុប'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;