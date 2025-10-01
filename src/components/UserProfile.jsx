import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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
      console.error('Error formatting timestamp:', error);
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

  const getFirstImage = useCallback((listing) => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0)
      return listing.images[0]?.image_url || null;
    if (listing.image_url) return listing.image_url;
    if (listing.image) return listing.image;
    return null;
  }, []);

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
      console.log('Fetching current user data from /users/me...');
      const currentUserResponse = await apiClient.get('/users/me');
      setCurrentUser(currentUserResponse.data);

      console.log(`Fetching user data for username: ${username}...`);
      const userResponse = await apiClient.get(`/users/username/${username}`).catch((error) => {
        if (error.response?.status === 404) {
          console.warn(`User ${username} not found, using current user as fallback`);
          return { data: currentUserResponse.data };
        }
        throw error;
      });
      setUser(userResponse.data);

      const userId = userResponse.data?.id || currentUserResponse.data?.id;
      console.log(`Fetching listings for user ID: ${userId}...`);
      const listingsResponse = await apiClient.get(`/listings/user/${userId}`);
      setListings(listingsResponse.data);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response : error);
      const errorDetail = error.response?.data?.detail || error.message;
      const status = error.response?.status;
      let errorMessage;
      if (status === 401) {
        errorMessage = 'សេសម្ភារៈសុវត្ថិភាពមិនត្រឹមត្រូវ។ សូមឡុកអ៊ីនឡើងវិញ។';
        localStorage.removeItem('token');
        navigate('/login');
      } else if (status === 404 && !user) {
        errorMessage = 'រកមិនឃើញអ្នកប្រើ។ បានប្រើផ្នែកផ្ទាល់ខ្លួនរបស់អ្នកជំនួស។';
      } else {
        errorMessage = `បរាជ័យក្នុងការទាញយកទិន្នន័យ។ (កំហុស: ${errorDetail})`;
        setRetryCount((prev) => prev + 1);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [username, navigate, retryCount]);

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
      console.error('Error deleting listing:', error);
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
      console.error('Error updating profile:', error);
      setError(`បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រវត្តិ។ (កំហុស: ${error.response?.data?.detail || error.message})`);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="user-profile-wrapper">
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
    <div className="user-profile-container">
      <div className="user-profile-wrapper">
        
        {/* Header */}
        <div className="profile-header">
          <div className="header-content">
            <h1>ប្រវត្តិអ្នកប្រើ</h1>
            {user && (
              <p className="user-name">
                {user.firstname} {user.lastname || ''}
              </p>
            )}
          </div>
          {currentUser && currentUser.id === user?.id && (
            <Link to="/post-ad" className="post-button">
              បង្ហោះការផ្សាយថ្មី
            </Link>
          )}
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

        {user ? (
          <div className="main-content">
            
            {/* Profile Header */}
            <div className="profile-section-header">
              <h2 className="profile-title">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
              {currentUser && currentUser.id === user.id && (
                <button onClick={handleEditToggle} className="edit-toggle-button">
                  {isEditing ? 'បោះបង់' : 'កែប្រែ'}
                </button>
              )}
            </div>

            {/* Edit Form */}
            {isEditing && currentUser && currentUser.id === user.id ? (
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

                  {/* Address */}
                  <div className="form-group">
                    <label className="form-label">អាសយដ្ឋាន:</label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      className="form-input"
                    />
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
                    {formErrors.profile_picture && (
                      <p className="form-error">{formErrors.profile_picture}</p>
                    )}
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

                  {/* Cover Banner */}
                  <div className="form-group full-width">
                    <label className="form-label">រូបផ្ទាំង:</label>
                    <input
                      type="file"
                      name="cover_banner"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {formErrors.cover_banner && (
                      <p className="form-error">{formErrors.cover_banner}</p>
                    )}
                    {previewCoverBanner && (
                      <div className="image-preview-container">
                        <img
                          src={previewCoverBanner}
                          alt="Cover Preview"
                          className="cover-preview"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Object.keys(formErrors).some((key) => formErrors[key])}
                  className="submit-button"
                >
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
                      <span className="info-label">អាសយដ្ឋាន:</span>
                      <span className="info-value">{user.address || 'N/A'}</span>
                    </div>
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
                ការផ្សាយរបស់អ្នកប្រើ ({listings.length})
              </h3>
              
              {sortedListings.length > 0 ? (
                <div className="listings-grid">
                  {sortedListings.map((listing) => {
                    const imageUrl = getImageUrl(getFirstImage(listing));
                    const isOwner = currentUser && currentUser.id === user.id;
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
                          
                          {/* Action Buttons */}
                          {(
                            <div className="listing-actions">
                            <Link
                              to={`/listing/${listing.id}`}
                              className="action-button view-button"
                            >
                              មើលព័ត៌មាន
                            </Link>
                            {isOwner && (
                              <>
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
                              </>
                            )}
                          </div>
                          )}
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
                  {currentUser && currentUser.id === user.id && (
                    <Link to="/post-ad" className="post-button">
                      បង្ហោះការផ្សាយថ្មី
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="empty-state">
            <TimeIcon className="empty-icon" />
            <p className="empty-text">
              {error || 'រកមិនឃើញអ្នកប្រើ។ សូមពិនិត្យឈ្មោះអ្នកប្រើឡើងវិញ។'}
            </p>
            <div className="action-buttons">
              <button onClick={handleRetry} className="post-button">
                ព្យាយាមម្តងទៀត
              </button>
              <Link to="/" className="home-button">
                ត្រឡប់ទៅទំព័រដើម
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .user-profile-container {
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  padding: 2rem 1rem;
  min-height: 100vh;
  font-family: 'Inter', 'Khmer', sans-serif;
  color: #e2e8f0;
}

.user-profile-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.profile-header:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3);
  border-color: #00d9ff;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #00d9ff;
  margin: 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 1px;
}

.user-name {
  font-size: 0.9rem;
  color: #7b8cde;
  margin-top: 0.5rem;
  margin: 0;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.post-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
  color: #0a0e27;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  border: 3px solid #006699;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Khmer', monospace;
}

.post-button:hover {
  background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
  transform: translateY(-2px);
}

/* Error Message */
.error-alert {
  background: linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(199, 44, 65, 0.2) 100%);
  border: 4px solid #e94560;
  color: #e94560;
  padding: 1rem;
  border-radius: 0;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  font-family: 'Khmer', monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.error-strong {
  font-weight: 700;
  font-size: 0.9rem;
}

.error-message {
  font-size: 0.9rem;
}

.retry-button {
  margin-left: 1rem;
  color: #00d9ff;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  background: none;
  border: 2px solid #00d9ff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Khmer', monospace;
}

.retry-button:hover {
  background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
  color: #0a0e27;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
}

/* Main Content */
.main-content {
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  padding: 2rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  position: relative;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 48%, rgba(0, 217, 255, 0.1) 50%, transparent 52%);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.main-content:hover::before {
  opacity: 1;
}

.main-content:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3);
  border-color: #00d9ff;
}

/* Profile Header */
.profile-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 4px solid #533483;
  padding-bottom: 1rem;
}

.profile-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00d9ff;
  margin: 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 1px;
}

.edit-toggle-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #533483 0%, #3a2359 100%);
  border: 3px solid #7b8cde;
  color: #00d9ff;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Khmer', monospace;
}

.edit-toggle-button:hover {
  background: linear-gradient(180deg, #7b8cde 0%, #533483 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
  transform: translateY(-2px);
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
  font-weight: 700;
  color: #7b8cde;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 0.5px;
}

.form-input {
  padding: 0.75rem;
  border: 3px solid #533483;
  border-radius: 0;
  font-size: 0.9rem;
  color: #e2e8f0;
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

.form-input:focus {
  outline: none;
  border-color: #00d9ff;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
  transform: translate(-2px, -2px);
}

.form-input-error {
  border-color: #e94560;
  box-shadow: 4px 4px 0 rgba(233, 69, 96, 0.4);
}

.form-error {
  font-size: 0.75rem;
  color: #e94560;
  margin: 0.25rem 0 0 0;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
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
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237b8cde' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.file-input {
  padding: 0.75rem;
  border: 3px solid #533483;
  border-radius: 0;
  font-size: 0.9rem;
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  color: #e2e8f0;
  cursor: pointer;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.file-input:focus {
  outline: none;
  border-color: #00d9ff;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
}

.image-preview-container {
  margin-top: 0.5rem;
}

.image-preview {
  border-radius: 0;
  border: 3px solid #533483;
  max-width: 8rem;
  height: 8rem;
  object-fit: cover;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  image-rendering: pixelated;
}

.cover-preview {
  border-radius: 0;
  border: 3px solid #533483;
  max-width: 16rem;
  height: 6rem;
  object-fit: cover;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  image-rendering: pixelated;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
  color: #0a0e27;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 700;
  border: 3px solid #006699;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Khmer', monospace;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
  transform: translateY(-2px);
}

.submit-button:disabled {
  background: linear-gradient(180deg, #533483 0%, #3a2359 100%);
  border-color: #533483;
  cursor: not-allowed;
  transform: none;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
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
  border-radius: 0;
  overflow: hidden;
  border: 4px solid #533483;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  transition: transform 0.3s ease;
}

.cover-image:hover img {
  transform: scale(1.05);
}

.profile-avatar {
  position: absolute;
  bottom: -2rem;
  left: 1.5rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #533483;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #533483 0%, #3a2359 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d9ff;
  font-size: 1.25rem;
  font-weight: 700;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  transition: all 0.2s ease;
}

.profile-avatar:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
  border-color: #00d9ff;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-section h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #00d9ff;
  border-bottom: 3px solid #533483;
  padding-bottom: 0.5rem;
  margin: 0 0 1rem 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 1px;
}

.info-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: rgba(15, 52, 96, 0.3);
  border: 2px solid #533483;
  transition: all 0.2s;
}

.info-row:hover {
  background: rgba(15, 52, 96, 0.6);
  border-color: #00d9ff;
  transform: translateX(3px);
  box-shadow: -4px 4px 0 rgba(0, 0, 0, 0.3);
}

.info-label {
  width: 30%;
  font-size: 0.9rem;
  color: #7b8cde;
  font-weight: 600;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.info-value {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-weight: 500;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

/* Listings Section */
.listings-section {
  border-top: 4px solid #533483;
  padding-top: 2rem;
}

.listings-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #00d9ff;
  margin: 0 0 1.5rem 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 1px;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Listing Card */
.listing-card {
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
  position: relative;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(10px);
}

.listing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 48%, rgba(0, 217, 255, 0.1) 50%, transparent 52%);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.listing-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3);
  border-color: #00d9ff;
}

.listing-card:hover::before {
  opacity: 1;
}

.listing-image {
  height: 10rem;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  border-bottom: 4px solid #533483;
}

.listing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  transition: transform 0.3s ease;
}

.listing-card:hover .listing-image img {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.no-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.5rem;
  border: 3px dashed #533483;
}

.no-image-icon {
  width: 2rem;
  height: 2rem;
  color: #7b8cde;
  filter: drop-shadow(0 0 10px rgba(83, 52, 131, 0.5));
  image-rendering: pixelated;
}

.no-image-text {
  font-size: 0.75rem;
  color: #7b8cde;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
}

.listing-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.listing-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #00d9ff;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5rem;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
  letter-spacing: 0.5px;
}

.listing-price {
  font-size: 1rem;
  font-weight: 700;
  color: #e94560;
  margin: 0;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Press Start 2P', monospace;
  animation: priceFloat 2s ease-in-out infinite;
}

@keyframes priceFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.listing-description {
  font-size: 0.75rem;
  color: #7b8cde;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.1rem;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.listing-time {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: #7b8cde;
  gap: 0.25rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background: rgba(15, 52, 96, 0.3);
  border: 2px solid #533483;
}

.time-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #00d9ff;
  image-rendering: pixelated;
}

.listing-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.action-button {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 3px solid;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
  font-family: 'Khmer', monospace;
  text-transform: uppercase;
}

.action-button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
}

.view-button {
  background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
  color: #0a0e27;
  border-color: #006699;
  text-align: center;
}

.view-button:hover {
  background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 217, 255, 0.5);
}

.edit-button {
  background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
  color: #0a0e27;
  border-color: #006699;
}

.edit-button:hover {
  background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 217, 255, 0.5);
}

.delete-button {
  background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
  color: white;
  border-color: #a32035;
}

.delete-button:hover {
  background: linear-gradient(180deg, #ff5470 0%, #e94560 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(233, 69, 96, 0.5);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  margin-top: 2rem;
  backdrop-filter: blur(10px);
  position: relative;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #00d9ff;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.5));
  image-rendering: pixelated;
}

.empty-text {
  font-size: 0.9rem;
  color: #7b8cde;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  font-family: 'Khmer', monospace;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.home-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #533483 0%, #3a2359 100%);
  border: 3px solid #7b8cde;
  color: #00d9ff;
  border-radius: 0;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  font-family: 'Khmer', monospace;
  text-transform: uppercase;
}

.home-button:hover {
  background: linear-gradient(180deg, #7b8cde 0%, #533483 100%);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
  transform: translateY(-2px);
}

/* Loading States */
.loading-container {
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  padding: 2rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  position: relative;
}

.loading-header {
  height: 2rem;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  border-radius: 0;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
  border: 3px solid #533483;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
}

.loading-card {
  background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 4px solid #533483;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
}

.loading-image {
  height: 10rem;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  border-radius: 0;
  animation: pulse 2s infinite;
  border-bottom: 4px solid #533483;
}

.loading-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.loading-line {
  height: 0.875rem;
  background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
  border-radius: 0;
  animation: pulse 2s infinite;
  border: 2px solid #533483;
}

.loading-line.short {
  width: 60%;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
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
  .user-profile-container {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1.5rem;
  }
  
  .listings-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .profile-section-header {
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
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .profile-header,
  .main-content {
    border-width: 3px;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  }

  .profile-header:hover,
  .main-content:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
  }

  .listing-card {
    border-width: 3px;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
  }

  .listing-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
  }
}

/* Grid Layout Support */
@media (min-width: 641px) {
  .listing-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .listing-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .listing-actions {
    margin-top: auto;
  }
}

/* Pixel-perfect image rendering for icons */
.contact-icon,
.post-time-icon,
.image-error-icon,
.time-icon,
.empty-icon,
.no-image-icon {
  image-rendering: pixelated;
}

/* Glow effect on hover for interactive elements */
.info-row:hover .info-label,
.action-button:hover,
.post-button:hover,
.edit-toggle-button:hover,
.submit-button:hover {
  animation: elementGlow 1.5s ease-in-out infinite;
}

@keyframes elementGlow {
  0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
  50% { filter: drop-shadow(0 0 15px currentColor); }
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus,
.post-button:focus,
.home-button:focus {
  outline: 3px solid #00d9ff;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .profile-header,
  .main-content,
  .listing-card {
    border: 2px solid #000;
    box-shadow: none;
    break-inside: avoid;
  }

  .listing-actions {
    display: none;
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

export default UserProfile;