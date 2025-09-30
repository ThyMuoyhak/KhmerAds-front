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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    address: '',
    phonenumber: '',
    bio: '',
    profile_picture: null,
    cover_banner: null,
  });
  const [previewProfilePic, setPreviewProfilePic] = useState(null);
  const [previewCoverBanner, setPreviewCoverBanner] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'មិនមានកាលបរិច្ឆេទ';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes < 60) return `${diffMinutes} នាទីមុន`;
      if (diffHours < 24) return `${diffHours} ម៉ោងមុន`;
      if (diffDays < 7) return `${diffDays} ថ្ងៃមុន`;
      return date.toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      return 'កាលបរិច្ឆេទមិនត្រឹមត្រូវ';
    }
  };

  const truncateDescription = (description, maxLength = 60) => {
    if (!description) return 'គ្មានការពិពណ៌នា';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  
  // Use your actual API URL
  const baseUrl = 'https://khmer365-1.onrender.com';
  
  // If already a full URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Remove leading slash and normalize path
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // If path already includes 'uploads/', use as-is
  if (cleanPath.startsWith('uploads/')) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  // Otherwise add 'uploads/' prefix
  return `${baseUrl}/uploads/${cleanPath}`;
};

  const getFirstImage = (listing) => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) 
      return listing.images[0]?.image_url || null;
    if (listing.image_url) return listing.image_url;
    if (listing.image) return listing.image;
    return null;
  };

  const getSortedListings = () => {
    return [...listings].reverse();
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
      const userResponse = await apiClient.get('/users/me');
      setUser(userResponse.data);
      const listingsResponse = await apiClient.get('/listings/my');
      setListings(listingsResponse.data);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      const errorDetail = error.response?.data?.detail || error.message;
      const status = error.response?.status;
      let errorMessage = `បរាជ័យក្នុងការទាញយកទិន្នន័យ។ (កំហុស: ${errorDetail})`;
      if (status === 401) errorMessage = 'សេសម្ភារៈសុវត្ថិភាពមិនត្រឹមត្រូវ។ សូមឡុកអ៊ីនឡើងវិញ។';
      else if (status === 404) errorMessage = 'ទិន្នន័យរបស់អ្នកមិនអាចរកឃើញ។';
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
      setRetryCount(0);
      fetchData();
    }
  };

  const handleUpdate = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('តើអ្នកប្រាកដថាចង់លុបការផ្សាយនេះទេ?')) return;
    setDeletingId(listingId);
    try {
      await apiClient.delete(`/listings/${listingId}`);
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== listingId));
      setError(null);
    } catch (error) {
      setError(`បរាជ័យក្នុងការលុបការផ្សាយ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        gender: user.gender || '',
        address: user.address || '',
        phonenumber: user.phonenumber || '',
        bio: user.bio || '',
        profile_picture: null,
        cover_banner: null,
      });
      setPreviewProfilePic(user.profile_picture ? getImageUrl(user.profile_picture) : null);
      setPreviewCoverBanner(user.cover_banner ? getImageUrl(user.cover_banner) : null);
      setFormErrors({});
    } else {
      setEditForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        gender: user.gender || '',
        address: user.address || '',
        phonenumber: user.phonenumber || '',
        bio: user.bio || '',
        profile_picture: null,
        cover_banner: null,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, [name]: 'ទំហំរូបភាពមិនហួស ៥MB ទេ។' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({ ...prev, [name]: 'សូមជ្រើសរើសឯកសាររូបភាពប៉ុណ្ណោះ។' }));
        return;
      }
      setEditForm((prev) => ({ ...prev, [name]: file }));
      const previewUrl = URL.createObjectURL(file);
      if (name === 'profile_picture') setPreviewProfilePic(previewUrl);
      else if (name === 'cover_banner') setPreviewCoverBanner(previewUrl);
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };
    switch (name) {
      case 'firstname':
      case 'lastname':
        if (!value.trim()) errors[name] = 'ត្រូវតែបំពេញ';
        else delete errors[name];
        break;
      case 'phonenumber':
        const phoneRegex = /^\+?855\d{8,9}$/;
        if (value && !phoneRegex.test(value)) errors[name] = 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ (ឧ. +85512345678)';
        else delete errors[name];
        break;
      default:
        delete errors[name];
    }
    setFormErrors(errors);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const errors = {};
    ['firstname', 'lastname'].forEach((field) => validateField(field, editForm[field]));
    validateField('phonenumber', editForm.phonenumber);
    setFormErrors(errors);
    if (Object.values(errors).some((error) => error)) return;

    if (!window.confirm('តើអ្នកប្រាកដថាចង់រក្សាទុកការផ្លាស់ប្តូរនេះទេ?')) return;

    const formData = new FormData();
    Object.keys(editForm).forEach((key) => {
      if (editForm[key]) formData.append(key, editForm[key]);
    });

    try {
      const response = await apiClient.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(`បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រវត្តិ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    }
  };

  if (loading) {
    return (
      <div className="my-listings-container">
        <div className="my-listings-wrapper">
          <div className="loading-container">
            <div className="loading-header"></div>
            <div className="loading-grid">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="loading-card">
                  <div className="loading-image"></div>
                  <div className="loading-content">
                    <div className="loading-line"></div>
                    <div className="loading-line short"></div>
                    <div className="loading-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedListings = getSortedListings();

  return (
    <div className="my-listings-container">
      <div className="my-listings-wrapper">
        
        {/* Header */}
        <div className="listings-header">
          <div className="header-content">
            <h1>ការផ្សាយរបស់ខ្ញុំ</h1>
            {user && (
              <p className="welcome-text">
                សូមស្វាគមន៍, {user.firstname} {user.lastname || ''}
              </p>
            )}
          </div>
          <Link to="/post-ad" className="post-button">
            បង្ហោះការផ្សាយថ្មី
          </Link>
        </div>

        {/* Error Message */}
        {(error || Object.keys(formErrors).length > 0) && (
          <div className="error-alert">
            <div className="error-content">
              <strong className="error-strong">កំហុស:</strong>
              <span className="error-message">
                {error || Object.values(formErrors).find((err) => err)}
              </span>
            </div>
            {error && retryCount > 0 && (
              <button onClick={handleRetry} className="retry-button">
                ព្យាយាមម្តងទៀត
              </button>
            )}
          </div>
        )}

        {/* User Profile and Listings */}
        {user ? (
          <div className="main-content">
            
            {/* Profile Header */}
            <div className="profile-header">
              <h2 className="profile-title">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
              <button onClick={handleEditToggle} className="edit-toggle-button">
                {isEditing ? 'បោះបង់' : 'កែប្រែ'}
              </button>
            </div>

            {/* Edit Form */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="edit-form">
                <div className="edit-form-grid">
                  
                  {/* First Name */}
                  <div className="form-group">
                    <label className="form-label">ឈ្មោះ:</label>
                    <input
                      type="text"
                      name="firstname"
                      value={editForm.firstname}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.firstname ? 'form-input-error' : ''}`}
                    />
                    {formErrors.firstname && (
                      <p className="form-error">{formErrors.firstname}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-group">
                    <label className="form-label">នាមគ្រួសារ:</label>
                    <input
                      type="text"
                      name="lastname"
                      value={editForm.lastname}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.lastname ? 'form-input-error' : ''}`}
                    />
                    {formErrors.lastname && (
                      <p className="form-error">{formErrors.lastname}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">ភេទ:</label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">ជ្រើសរើស</option>
                      <option value="male">ប្រុស</option>
                      <option value="female">ស្រី</option>
                      <option value="other">ផ្សេងៗ</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label className="form-label">លេខទូរស័ព្ទ:</label>
                    <input
                      type="text"
                      name="phonenumber"
                      value={editForm.phonenumber}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.phonenumber ? 'form-input-error' : ''}`}
                    />
                    {formErrors.phonenumber && (
                      <p className="form-error">{formErrors.phonenumber}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="form-group full-width">
                    <label className="form-label">ប្រវត្តិ:</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  {/* Profile Picture */}
                  <div className="form-group full-width">
                    <label className="form-label">រូបផ្ទាល់ខ្លួន:</label>
                    <input
                      type="file"
                      name="profile_picture"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {previewProfilePic && (
                      <div className="image-preview-container">
                        <img
                          src={previewProfilePic}
                          alt="Profile Preview"
                          className="image-preview"
                        />
                      </div>
                    )}
                  </div>

                </div>

                <button type="submit" className="submit-button">
                  រក្សាទុក
                </button>
              </form>
            ) : (
              /* Profile Display */
              <div className="profile-display">
                
                {/* Cover and Avatar */}
                <div className="cover-section">
                  <div className="cover-image">
                    {user.cover_banner && (
                      <img
                        src={getImageUrl(user.cover_banner)}
                        alt="Cover"
                      />
                    )}
                  </div>
                  <div className="profile-avatar">
                    {user.profile_picture ? (
                      <img
                        src={getImageUrl(user.profile_picture)}
                        alt="Profile"
                      />
                    ) : (
                      `${user.firstname?.charAt(0)?.toUpperCase() || '?'}${user.lastname?.charAt(0)?.toUpperCase() || ''}`
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="profile-info-grid">
                  
                  {/* Basic Info */}
                  <div className="info-section">
                    <h3>ព័ត៌មានមូលដ្ឋាន</h3>
                    <div className="info-row">
                      <span className="info-label">ឈ្មោះ:</span>
                      <span className="info-value">
                        {user.firstname} {user.lastname || ''}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">ភេទ:</span>
                      <span className="info-value">
                        {user.gender === 'male' ? 'ប្រុស' : 
                         user.gender === 'female' ? 'ស្រី' : 
                         user.gender || 'N/A'}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">អ៊ីមែល:</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="info-section">
                    <h3>ព័ត៌មានបន្ថែម</h3>
                    <div className="info-row">
                      <span className="info-label">លេខទូរស័ព្ទ:</span>
                      <span className="info-value">{user.phonenumber || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">ប្រវត្តិ:</span>
                      <span className="info-value">{user.bio || 'N/A'}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Listings Section */}
            <div className="listings-section">
              <h3 className="listings-title">
                ការផ្សាយរបស់ខ្ញុំ ({listings.length})
              </h3>
              
              {sortedListings.length > 0 ? (
                <div className="listings-grid">
                  {sortedListings.map((listing) => {
                    const imageUrl = getImageUrl(getFirstImage(listing));
                    return (
                      <div key={listing.id} className="listing-card">
                        
                        {/* Listing Image */}
                        <div className="listing-image">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={listing.title}
                            />
                          ) : (
                            <div className="no-image">
                              <ImageIcon className="no-image-icon" />
                              <span className="no-image-text">គ្មានរូបភាព</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Listing Content */}
                        <div className="listing-content">
                          <h4 className="listing-title">{listing.title}</h4>
                          
                          {listing.price && (
                            <p className="listing-price">
                              ${Number(listing.price).toFixed(2)}
                            </p>
                          )}
                          
                          <p className="listing-description">
                            {truncateDescription(listing.description)}
                          </p>
                          
                          <div className="listing-time">
                            <TimeIcon className="time-icon" />
                            <span>{formatTimestamp(listing.created_at)}</span>
                          </div>

                         
                                                      <Link
                                                        to={`/listing/${listing.id}`}
                                                        className="action-button view-button"
                                                      >
                                                        មើលព័ត៌មាន
                                                      </Link>
                          
                          {/* Action Buttons */}
                          <div className="listing-actions">
                            <button
                              onClick={() => handleUpdate(listing.id)}
                              className="action-button edit-button"
                            >
                              កែ
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              disabled={deletingId === listing.id}
                              className="action-button delete-button"
                            >
                              {deletingId === listing.id ? 'កំពុងលុប...' : 'លុប'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="empty-state">
                  <PlusIcon className="empty-icon" />
                  <p className="empty-text">គ្មានការផ្សាយ</p>
                  <Link to="/post-ad" className="post-button">
                    បង្ហោះការផ្សាយថ្មី
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="empty-state">
            <TimeIcon className="empty-icon" />
            <p className="empty-text">ទាញយកព័ត៌មានបរាជ័យ។</p>
            <button onClick={handleRetry} className="post-button">
              ព្យាយាមម្តងទៀត
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .my-listings-container {
          background: #f8fafc;
          padding: 2rem 1rem;
          min-height: 100vh;
          font-family: 'Inter', 'Khmer', sans-serif;
        }

        .my-listings-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .listings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .welcome-text {
          font-size: 0.9rem;
          color: #6b7280;
          margin-top: 0.5rem;
          margin: 0;
        }

        .post-button {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: #ffffff;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .post-button:hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Error Message */
        .error-alert {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .error-strong {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .error-message {
          font-size: 0.9rem;
        }

        .retry-button {
          margin-left: 1rem;
          color: #3b82f6;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Main Content */
        .main-content {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        /* Profile Header */
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }

        .profile-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .edit-toggle-button {
          padding: 0.75rem 1.5rem;
          background: #ffffff;
          border: 1px solid #3b82f6;
          color: #3b82f6;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-toggle-button:hover {
          background: #3b82f6;
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* Edit Form */
        .edit-form {
          margin-bottom: 2rem;
        }

        .edit-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b7280;
        }

        .form-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #111827;
          background: #ffffff;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input-error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-error {
          font-size: 0.75rem;
          color: #ef4444;
          margin: 0.25rem 0 0 0;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        textarea.form-input {
          min-height: 100px;
          resize: vertical;
        }

        select.form-input {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: #3b82f6;
          color: #ffffff;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
        }

        .submit-button:hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Profile Display */
        .profile-display {
          margin-bottom: 2rem;
        }

        .cover-section {
          position: relative;
          margin-bottom: 3rem;
        }

        .cover-image {
          height: 12rem;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
        }

        .cover-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-avatar {
          position: absolute;
          bottom: -2rem;
          left: 1.5rem;
          width: 8rem;
          height: 8rem;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 500;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .info-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
          margin: 0 0 1rem 0;
        }

        .info-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .info-label {
          width: 30%;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .info-value {
          font-size: 0.9rem;
          color: #111827;
          font-weight: 500;
        }

        /* Listings Section */
        .listings-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
        }

        .listings-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* Listing Card */
        .listing-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .listing-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .listing-image {
          height: 10rem;
          overflow: hidden;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.5rem;
        }

        .no-image-icon {
          width: 2rem;
          height: 2rem;
          color: #6b7280;
        }

        .no-image-text {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .listing-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .listing-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5rem;
        }

        .listing-price {
          font-size: 1rem;
          font-weight: 700;
          color: #3b82f6;
          margin: 0;
        }

        .listing-description {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.1rem;
        }

        .listing-time {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          color: #6b7280;
          gap: 0.25rem;
          margin-top: 0.25rem;
        }

        .time-icon {
          width: 0.75rem;
          height: 0.75rem;
          color: #3b82f6;
        }

        .listing-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .action-button {
          flex: 1;
          padding: 0.5rem;
          background: #ffffff;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid;
        }

        .edit-button {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .edit-button:hover {
          background: #3b82f6;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .delete-button {
          border-color: #ef4444;
          color: #ef4444;
        }

        .delete-button:hover {
          background: #ef4444;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Empty States */
        .empty-state {
          text-align: center;
          padding: 3rem;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-top: 2rem;
        }

        .empty-icon {
          width: 4rem;
          height: 4rem;
          color: #3b82f6;
          margin: 0 auto 1rem;
        }

        .empty-text {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        /* Loading States */
        .loading-container {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .loading-header {
          height: 2rem;
          background: #e5e7eb;
          border-radius: 8px;
          margin-bottom: 2rem;
          animation: pulse 2s infinite;
        }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
        }

        .loading-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .loading-image {
          height: 10rem;
          background: #e5e7eb;
          border-radius: 12px;
          animation: pulse 2s infinite;
        }

        .loading-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .loading-line {
          height: 0.875rem;
          background: #e5e7eb;
          border-radius: 4px;
          animation: pulse 2s infinite;
        }

        .loading-line.short {
          width: 60%;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* File Input */
        .file-input {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #ffffff;
          cursor: pointer;
        }

        .file-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Image Preview */
        .image-preview-container {
          margin-top: 0.5rem;
        }

        .image-preview {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          max-width: 8rem;
          height: 8rem;
          object-fit: cover;
        }

        /* Responsive Design */
        @media (max-width: 1400px) {
          .listings-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1200px) {
          .listings-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .listings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .profile-info-grid,
          .edit-form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .my-listings-container {
            padding: 1rem;
          }
          
          .main-content {
            padding: 1.5rem;
          }
          
          .listings-grid {
            grid-template-columns: 1fr;
          }
          
          .listings-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .profile-avatar {
            position: static;
            margin: 0 auto 1rem;
          }
          
          .cover-section {
            margin-bottom: 1rem;
          }
          
          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .info-label {
            width: 100%;
          }
          
          .error-alert {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .retry-button {
            margin-left: 0;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .my-listings-container {
            background: #1e293b;
          }
          
          .main-content,
          .listing-card,
          .empty-state,
          .loading-container {
            background: #334155;
            border-color: #475569;
          }
          
          .header-content h1,
          .profile-title,
          .listings-title,
          .listing-title,
          .info-value {
            color: #f1f5f9;
          }
          
          .welcome-text,
          .form-label,
          .info-label,
          .listing-description,
          .listing-time,
          .empty-text {
            color: #94a3b8;
          }
          
          .form-input,
          .file-input {
            background: #475569;
            border-color: #64748b;
            color: #e2e8f0;
          }
          
          .form-input:focus,
          .file-input:focus {
            border-color: #3b82f6;
            background: #475569;
          }
          
          .no-image,
          .loading-image,
          .loading-header,
          .loading-line {
            background: #475569;
          }
          
          .edit-toggle-button {
            background: #334155;
            color: #3b82f6;
          }
          
          .action-button {
            background: #334155;
          }
          
          .image-preview {
            border-color: #475569;
          }
        }

        /* Animation for new listings */
        @keyframes highlightNew {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .listing-card:first-child {
          animation: highlightNew 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// Icon Components
const ImageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TimeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export default MyListings;