import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './ListingDetails.css';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ownerError, setOwnerError] = useState(null);
  const [imageErrors, setImageErrors] = useState([]);
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Define functions before useEffect hooks
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    if (imagePath.startsWith('http')) return imagePath;
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.slice(8);
    return `${baseUrl}/uploads/${cleanPath}`;
  }, []);

  const getImageUrls = useCallback(
    (listing) => {
      if (listing?.images && Array.isArray(listing.images) && listing.images.length > 0) {
        return listing.images
          .map((img) => img.image_url)
          .filter((url) => url)
          .map((url) => getImageUrl(url));
      }
      if (listing?.image_url) {
        return [getImageUrl(listing.image_url)];
      }
      return [];
    },
    [getImageUrl]
  );

  const nextImage = useCallback(() => {
    const urls = getImageUrls(listing);
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % urls.length);
  }, [getImageUrls, listing]);

  const prevImage = useCallback(() => {
    const urls = getImageUrls(listing);
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? urls.length - 1 : prevIndex - 1
    );
  }, [getImageUrls, listing]);

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

  // Auto image slider
  useEffect(() => {
    if (listing && getImageUrls(listing).length > 1) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prevIndex) => {
          const imageUrls = getImageUrls(listing);
          return (prevIndex + 1) % imageUrls.length;
        });
      }, 5000);
      setAutoSlideInterval(interval);
      return () => clearInterval(interval);
    }
  }, [listing, getImageUrls]);

  // Fetch current user
  useEffect(() => {
    apiClient
      .get('/auth/me')
      .then((response) => {
        setCurrentUser(response.data.username || 'Guest');
      })
      .catch(() => {
        setCurrentUser('Guest');
      });
  }, []);

  // Increment views only once per page load
  useEffect(() => {
    if (listing) {
      apiClient
        .post(`/listings/${id}/view`)
        .then(() => {
          setViews((prev) => prev + 1);
        })
        .catch((err) => {
          console.error('Failed to increment views:', err);
        });
    }
  }, [listing, id]);

  const handleImageSelect = (index) => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      setAutoSlideInterval(null);
    }
    setSelectedImageIndex(index);
  };

  const formatDescription = (description) => {
    if (!description) return 'គ្មានការពិពណ៌នា';
    return description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < description.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const formatCambodianDate = (dateString) => {
    if (!dateString) return 'មិនមានកាលបរិច្ឆេទ';
    try {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Phnom_Penh',
      };
      return date.toLocaleString('km-KH', options);
    } catch (error) {
      return 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ';
    }
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'មិនមានកាលបរិច្ឆេទ';
    try {
      const date = new Date(dateString);
      const diffMs = Math.abs(currentTime - date);
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHours >= 24) {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} ថ្ងៃមុន`;
      } else if (diffHours >= 1) {
        return `${diffHours} ម៉ោង${diffMinutes > 0 ? ` និង ${diffMinutes} នាទី` : ''}មុន`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes} នាទីមុន`;
      } else {
        return `ឥឡូវនេះ`;
      }
    } catch (error) {
      return 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ';
    }
  };

  const getCurrentCambodianTime = () => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Phnom_Penh',
      hour12: false,
    };
    return currentTime.toLocaleString('km-KH', options);
  };

  const openFullscreen = () => setIsFullscreenOpen(true);
  const closeFullscreen = () => setIsFullscreenOpen(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullscreenOpen) {
        if (event.key === 'Escape') closeFullscreen();
        else if (event.key === 'ArrowRight') nextImage();
        else if (event.key === 'ArrowLeft') prevImage();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenOpen, nextImage, prevImage]);

  // Fetch listing data
  useEffect(() => {
    setLoading(true);
    setSelectedImageIndex(0);
    setImageErrors([]);
    apiClient
      .get(`/listings/${id}`)
      .then((response) => {
        setListing(response.data);
        setViews(response.data.views || 0);
        setComments(response.data.reviews || []);
        setError(null);
      })
      .catch(() => {
        setError('បរាជ័យក្នុងការទាញយកព័ត៌មានការផ្សាយ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (listing && listing.owner && !ownerDetails) {
      setOwnerLoading(true);
      const ownerId = listing.owner.id;
      apiClient
        .get(`/users/${ownerId}`)
        .then((response) => {
          setOwnerDetails(response.data);
          setOwnerError(null);
        })
        .catch(() => {
          setOwnerError('បរាជ័យក្នុងការទាញយកព័ត៌មានអ្នកផ្សាយ។');
          setOwnerDetails(listing.owner);
        })
        .finally(() => {
          setOwnerLoading(false);
        });
    }
  }, [listing, ownerDetails]);

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || currentUser === 'Guest') return;
    apiClient
      .post(`/listings/${id}/reviews`, { rating: 5, comment: newComment })
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment('');
      })
      .catch((error) => {
        console.error('Failed to submit comment:', error);
      });
  };

  const handleContactTelegram = () => {
    if (listing.telegram_link) {
      window.open(listing.telegram_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContactEmail = () => {
    if (listing.email) {
      window.location.href = `mailto:${listing.email}`;
    }
  };

  const imageUrls = getImageUrls(listing);
  const owner = ownerDetails || listing?.owner;

  if (loading) {
    return (
      <div className="listing-details-container">
        <div className="listing-details-content">
          <div className="loading-placeholder title" />
          <div className="loading-placeholder subtitle" />
          <div className="loading-grid">
            <div className="loading-placeholder image" />
            <div className="loading-placeholder details" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="listing-details-container">
        <div className="listing-details-content">
          <div className="error-message">
            <strong>កំហុស:</strong>
            <span>{error}</span>
          </div>
          <div className="center">
            <Link to="/" className="back-link">
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="listing-details-container">
        <div className="listing-details-content">
          <div className="not-found">
            <h3>រកមិនឃើញការផ្សាយ</h3>
            <p>ការផ្សាយដែលអ្នកកំពុងស្វែងរកមិនមានទេ�।</p>
            <Link to="/" className="back-link">
              ត្រឡប់ទៅទំព័រដើម
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-details-container">
      <div className="listing-details-content">
        {/* Real-time Cambodia Time Display */}
        

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/" className="breadcrumb-link">
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001 1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                ទំព័រដើម
              </Link>
            </li>
            <li>
              <svg className="icon chevron" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span>{listing.category}</span>
            </li>
            <li>
              <svg className="icon chevron" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li aria-current="page">
              <span className="truncate">{listing.title}</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="main-content">
          <div className="image-section">
            {imageUrls.length > 0 ? (
              <div>
                <div className="main-image-container">
                  {imageErrors[selectedImageIndex] ? (
                    <div className="image-error">
                      <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>រូបភាពមិនអាចផ្ទុកបាន</span>
                    </div>
                  ) : (
                    <img
                      src={imageUrls[selectedImageIndex]}
                      alt={`${listing.title} ${selectedImageIndex + 1}`}
                      className="main-image"
                      onClick={openFullscreen}
                      onError={() => {
                        setImageErrors((prev) => {
                          const newErrors = [...prev];
                          newErrors[selectedImageIndex] = true;
                          return newErrors;
                        });
                      }}
                    />
                  )}
                  {imageUrls.length > 1 && (
                    <>
                      <div className="image-counter">
                        {selectedImageIndex + 1} / {imageUrls.length}
                      </div>
                      <button onClick={prevImage} className="nav-button prev">
                        ‹
                      </button>
                      <button onClick={nextImage} className="nav-button next">
                        ›
                      </button>
                    </>
                  )}
                </div>
                {imageUrls.length > 1 && (
                  <div className="thumbnail-gallery">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageSelect(index)}
                        className={`thumbnail ${selectedImageIndex === index ? 'selected' : ''}`}
                      >
                        {imageErrors[index] ? (
                          <div className="thumbnail-error">
                            <span>រូបភាពមិនអាចផ្ទុកបាន</span>
                          </div>
                        ) : (
                          <img src={url} alt={`${listing.title} ${index + 1}`} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="profile-section">
            <h2>ព័ត៌មានអ្នកផ្សាយ</h2>
            {ownerLoading ? (
              <div className="profile-loading">
                <div className="loading-placeholder avatar" />
                <div className="loading-placeholder text" />
              </div>
            ) : ownerError ? (
              <p className="error">{ownerError}</p>
            ) : (
              <div className="profile-content">
                <div className="avatar">
                  {owner?.profile_picture ? (
                    <img src={getImageUrl(owner.profile_picture)} alt={owner?.username} />
                  ) : (
                    <div className="avatar-placeholder">{owner?.username?.charAt(0).toUpperCase() || 'U'}</div>
                  )}
                </div>
                <p className="username">{owner?.username || 'អ្នកប្រើប្រាស់'}</p>
                <div className="contact-buttons">
                  {listing.telegram_link && (
                    <button onClick={handleContactTelegram} className="contact-button telegram">
                      <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.32 8.52l-5.46 3.99c-.19.14-.42.22-.66.22-.22 0-.43-.08-.6-.22l-.24-.18c-.08-.06-.15-.14-.2-.23-.05-.09-.07-.19-.07-.29V11c0-.18.06-.34.16-.48.1-.14.24-.25.4-.3l4.73-1.89c.33-.13.68-.05.93.2.25.25.33.6.2.93l-1.9 4.75c-.08.18-.08.38 0 .56.07.19.2.35.37.45l.18.11c.21.12.44.18.67.18s.45-.06.67-.18l3.99-2.73c.27-.18.41-.5.37-.82-.04-.33-.28-.6-.6-.7L15.4 10.98c-.14-.06-.3-.06-.44 0z" />
                      </svg>
                      Telegram
                    </button>
                  )}
                  {listing.email && (
                    <button onClick={handleContactEmail} className="contact-button email">
                      <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      ផ្ញើអ៊ីមែល
                    </button>
                  )}
                </div>
                <Link to={`/user/${owner?.username}`} className="profile-link">
                  មើលប្រវត្តិផ្សាយ
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="details-section">
          <span className="category-badge">{listing.category}</span>
          <h1>{listing.title}</h1>
          <div className="meta-info">
            <p>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>ផ្សាយ {formatRelativeTime(listing.created_at)}</span>
            </p>
            <p>
              
            </p>
          </div>
          <div className="price-section">
            <span className="price">${Number(listing.price || 0).toFixed(2)}</span>
            <span className="currency">USD</span>
          </div>
          <div className="info-grid">
            <div>
              <span className="label">កាលបរិច្ឆេទពេញ</span>
              <span className="value">{formatCambodianDate(listing.created_at)}</span>
            </div>
          </div>
          <div className="description-section">
            <h2>ការពិពណ៌នា</h2>
            <p>{formatDescription(listing.description)}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2>មតិយោបល់</h2>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id} className="comment">
                  <p>
                    <strong>{comment.reviewer.username}</strong>: {comment.comment}
                  </p>
                  <p>Rating: {comment.rating}/5</p>
                  <p>{formatCambodianDate(comment.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>មិនទាន់មានមតិយោបល់ទេ�।</p>
          )}
          {currentUser && currentUser !== 'Guest' && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="សរសេរមតិយោបល់របស់អ្នក..."
                required
              />
              <button type="submit">បញ្ចូនមតិ</button>
            </form>
          )}
        </div>

        {/* Safety Tips Section */}
        <div className="safety-tips">
          <h2>ព័ត៌មានសុវត្ថិភាពសម្រាប់អ្នកទិញ</h2>
          <ul>
            <li>
              <strong>មិនត្រូវធ្វើការផ្ញើប្រាក់ទៅមុន មុនពេលទទួលទំនិញ</strong>
            </li>
            <li>
              <strong>សូមពិនិត្យមើលទំនិញមុនពេលដែលអ្នកទិញ</strong>
            </li>
            <li>
              <strong>បង់ប្រាក់បន្ទាប់ពីទទួលបានទំនិញ</strong>
            </li>
            <li>
              <strong>ត្រូវជួបអ្នកលក់នៅទីតាំងដែលមានសុវត្ថិភាព</strong>
            </li>
          </ul>
        </div>

        {/* Disclaimer Section */}
        <div className="disclaimer">
          <h2>ការមិនទទួលខុសត្រូវ / Disclaimer</h2>
          <ul>
            <li>
              <strong>
                យើងខ្ញុំមិនគ្រប់គ្រងមាតិកា
                ដែលបានបង្ហោះឡើងដោយសមាជិកឡើយ។ ដូច្នេះយើងមិនទទួលខុសត្រូវលើការផ្សាយផលិតផលនេះទេ
                ហើយក៏មិនធានាចំពោះបញ្ហាដែលទាក់ទងដោយផ្ទាល់ ឬ
                ប្រយោលទៅនឹងសកម្មភាព ឬ អសកម្មណាមួយឡើយ។
              </strong>
            </li>
            <li>
              <strong>
                We do not control the content posted by members and therefore assume no responsibility and
                disclaim any liability for any consequence relating directly or indirectly to any action or
                inaction.
              </strong>
            </li>
          </ul>
        </div>

        {/* Fullscreen Image Modal */}
        {isFullscreenOpen && imageUrls.length > 0 && (
          <div className="fullscreen-modal">
            <button onClick={closeFullscreen} className="close-button">
              ✕
            </button>
            <button onClick={prevImage} className="nav-button prev">
              ‹
            </button>
            <div className="fullscreen-image">
              {imageErrors[selectedImageIndex] ? (
                <div className="image-error">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>រូបភាពមិនអាចផ្ទុកបាន</span>
                </div>
              ) : (
                <img
                  src={imageUrls[selectedImageIndex]}
                  alt={`${listing.title} ${selectedImageIndex + 1}`}
                />
              )}
            </div>
            <button onClick={nextImage} className="nav-button next">
              ›
            </button>
            <div className="image-counter">
              {selectedImageIndex + 1} / {imageUrls.length}
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="back-to-top"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default ListingDetails;