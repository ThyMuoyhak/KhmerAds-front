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

  // CSS Variables matching MyListings.jsx
  const cssVariables = {
    '--primary-color': '#1e40af',
    '--accent-color': '#3b82f6',
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--background': '#f8fafc',
    '--surface': '#ffffff',
    '--border': '#e5e7eb',
    '--shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
    '--shadow-md': '0 4px 12px rgba(0, 0, 0, 0.08)',
    '--transition': 'all 0.3s ease',
    '--error-color': '#dc2626'
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'មិនមានកាលបរិច្ឆេទ';
    try {
      const date = new Date(timestamp);
      const now = new Date(); // Current time: 09:26 PM, Sep 27, 2025
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

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    if (imagePath.startsWith('http')) return imagePath;
    const normalizedPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    return `${baseUrl}/${normalizedPath}`;
  }, []);

  const getFirstImage = useCallback((listing) => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0)
      return listing.images[0]?.image_url || null;
    if (listing.image_url) return listing.image_url;
    if (listing.image) return listing.image;
    return null;
  }, []);

  // Sort listings to show the last one first (reverse order)
  const getSortedListings = () => {
    return [...listings].reverse(); // Reverse the array to show last item first
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
      setError('បានឈានដល់ដែនកំណត់ការព្យាយាម�। សូមពិនិត្យការតភ្ជាប់ឬឡុកអ៊ីនឡើងវិញ។');
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
      setError(`បរាជ័យក្នុងការលុបការផ្សាយ�। (កំហុស: ${error.response?.data?.detail || error.message})`);
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
      <div style={{
        background: cssVariables['--background'],
        padding: '2rem 1rem',
        minHeight: '100vh',
        fontFamily: "'Kantumruy', 'Arial', sans-serif"
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            background: cssVariables['--surface'],
            border: `1px solid ${cssVariables['--border']}`,
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: cssVariables['--shadow-sm']
          }}>
            <div style={{
              height: '2rem',
              background: cssVariables['--border'],
              borderRadius: '8px',
              marginBottom: '2rem'
            }} />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1.5rem'
            }}>
              {[...Array(5)].map((_, index) => (
                <div key={index} style={{
                  background: cssVariables['--surface'],
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '10rem',
                    background: cssVariables['--border'],
                    borderRadius: '12px'
                  }} />
                  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      height: '0.875rem',
                      background: cssVariables['--border'],
                      borderRadius: '4px'
                    }} />
                    <div style={{
                      height: '0.875rem',
                      background: cssVariables['--border'],
                      borderRadius: '4px',
                      width: '60%'
                    }} />
                    <div style={{
                      height: '0.875rem',
                      background: cssVariables['--border'],
                      borderRadius: '4px'
                    }} />
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
    <div style={{
      background: cssVariables['--background'],
      padding: '2rem 1rem',
      minHeight: '100vh',
      fontFamily: "'Kantumruy', 'Arial', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: cssVariables['--text-primary'],
              margin: 0
            }}>
              ប្រវត្តិអ្នកប្រើ
            </h1>
            {user && (
              <p style={{
                fontSize: '0.9rem',
                color: cssVariables['--text-secondary'],
                marginTop: '0.5rem',
                margin: 0
              }}>
                {user.firstname} {user.lastname || ''}
              </p>
            )}
          </div>
          {currentUser && currentUser.id === user?.id && (
            <Link to="/post-ad" style={{
              padding: '0.75rem 1.5rem',
              background: cssVariables['--accent-color'],
              color: cssVariables['--surface'],
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: cssVariables['--transition']
            }}>
              បង្ហោះការផ្សាយថ្មី
            </Link>
          )}
        </div>

        {/* Error Message */}
        {(error || Object.keys(formErrors).length > 0) && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: cssVariables['--error-color'],
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <strong style={{ fontWeight: '600', fontSize: '0.9rem' }}>កំហុស:</strong>
            <span style={{ fontSize: '0.9rem' }}>
              {error || Object.values(formErrors).find((err) => err)}
            </span>
            {error && retryCount > 0 && (
              <button
                onClick={handleRetry}
                style={{
                  marginLeft: '1rem',
                  color: cssVariables['--accent-color'],
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ព្យាយាមម្តងទៀត
              </button>
            )}
          </div>
        )}

        {user ? (
          <div style={{
            background: cssVariables['--surface'],
            border: `1px solid ${cssVariables['--border']}`,
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: cssVariables['--shadow-sm']
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              borderBottom: `1px solid ${cssVariables['--border']}`,
              paddingBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: cssVariables['--text-primary'],
                margin: 0
              }}>
                ព័ត៌មានផ្ទាល់ខ្លួន
              </h2>
              {currentUser && currentUser.id === user.id && (
                <button
                  onClick={handleEditToggle}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: cssVariables['--surface'],
                    border: `1px solid ${cssVariables['--accent-color']}`,
                    color: cssVariables['--accent-color'],
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: cssVariables['--transition']
                  }}
                >
                  {isEditing ? 'បោះបង់' : 'កែប្រែ'}
                </button>
              )}
            </div>

            {isEditing && currentUser && currentUser.id === user.id ? (
              <form onSubmit={handleUpdateProfile} style={{ marginBottom: '2rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      ឈ្មោះ:
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={editForm.firstname}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${formErrors.firstname ? cssVariables['--error-color'] : cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface'],
                        transition: cssVariables['--transition']
                      }}
                    />
                    {formErrors.firstname && (
                      <p style={{ fontSize: '0.75rem', color: cssVariables['--error-color'], margin: '0.25rem 0 0 0' }}>
                        {formErrors.firstname}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      នាមគ្រួសារ:
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={editForm.lastname}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${formErrors.lastname ? cssVariables['--error-color'] : cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface'],
                        transition: cssVariables['--transition']
                      }}
                    />
                    {formErrors.lastname && (
                      <p style={{ fontSize: '0.75rem', color: cssVariables['--error-color'], margin: '0.25rem 0 0 0' }}>
                        {formErrors.lastname}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      ភេទ:
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface']
                      }}
                    >
                      <option value="">ជ្រើសរើស</option>
                      <option value="male">ប្រុស</option>
                      <option value="female">ស្រី</option>
                      <option value="other">ផ្សេងៗ</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      អាសយដ្ឋាន:
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface']
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      លេខទូរស័ព្ទ:
                    </label>
                    <input
                      type="text"
                      name="phonenumber"
                      value={editForm.phonenumber}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${formErrors.phonenumber ? cssVariables['--error-color'] : cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface']
                      }}
                    />
                    {formErrors.phonenumber && (
                      <p style={{ fontSize: '0.75rem', color: cssVariables['--error-color'], margin: '0.25rem 0 0 0' }}>
                        {formErrors.phonenumber}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      ប្រវត្តិ:
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: cssVariables['--text-primary'],
                        background: cssVariables['--surface'],
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      រូបផ្ទាល់ខ្លួន:
                    </label>
                    <input
                      type="file"
                      name="profile_picture"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${formErrors.profile_picture ? cssVariables['--error-color'] : cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        background: cssVariables['--surface']
                      }}
                    />
                    {formErrors.profile_picture && (
                      <p style={{ fontSize: '0.75rem', color: cssVariables['--error-color'], margin: '0.25rem 0 0 0' }}>
                        {formErrors.profile_picture}
                      </p>
                    )}
                    {previewProfilePic && (
                      <img
                        src={previewProfilePic}
                        alt="Profile Preview"
                        style={{
                          marginTop: '0.5rem',
                          borderRadius: '8px',
                          border: `1px solid ${cssVariables['--border']}`,
                          maxWidth: '8rem',
                          height: '8rem',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: '1 / -1' }}>
                    <label style={{
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: cssVariables['--text-secondary']
                    }}>
                      រូបផ្ទាំង:
                    </label>
                    <input
                      type="file"
                      name="cover_banner"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        padding: '0.75rem',
                        border: `1px solid ${formErrors.cover_banner ? cssVariables['--error-color'] : cssVariables['--border']}`,
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        background: cssVariables['--surface']
                      }}
                    />
                    {formErrors.cover_banner && (
                      <p style={{ fontSize: '0.75rem', color: cssVariables['--error-color'], margin: '0.25rem 0 0 0' }}>
                        {formErrors.cover_banner}
                      </p>
                    )}
                    {previewCoverBanner && (
                      <img
                        src={previewCoverBanner}
                        alt="Cover Preview"
                        style={{
                          marginTop: '0.5rem',
                          borderRadius: '8px',
                          border: `1px solid ${cssVariables['--border']}`,
                          maxWidth: '16rem',
                          height: '6rem',
                          objectFit: 'cover'
                        }}
                      />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={Object.keys(formErrors).some((key) => formErrors[key])}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: cssVariables['--accent-color'],
                    color: cssVariables['--surface'],
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: cssVariables['--transition'],
                    marginTop: '1.5rem'
                  }}
                >
                  រក្សាទុក
                </button>
              </form>
            ) : (
              <>
                <div style={{ position: 'relative', marginBottom: '3rem' }}>
                  <div style={{
                    height: '12rem',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: `1px solid ${cssVariables['--border']}`,
                    background: cssVariables['--background']
                  }}>
                    {user.cover_banner && (
                      <img
                        src={getImageUrl(user.cover_banner)}
                        alt="Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Cover image failed to load:', user.cover_banner);
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '-2rem',
                    left: '1.5rem',
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `4px solid ${cssVariables['--surface']}`,
                    boxShadow: cssVariables['--shadow-sm'],
                    background: cssVariables['--accent-color'],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cssVariables['--surface'],
                    fontSize: '1.25rem',
                    fontWeight: '500'
                  }}>
                    {user.profile_picture ? (
                      <img
                        src={getImageUrl(user.profile_picture)}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.error('Profile image failed to load:', user.profile_picture);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      `${user.firstname?.charAt(0)?.toUpperCase() || '?'}${user.lastname?.charAt(0)?.toUpperCase() || ''}`
                    )}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: cssVariables['--text-primary'],
                      borderBottom: `1px solid ${cssVariables['--border']}`,
                      paddingBottom: '0.5rem',
                      margin: 0
                    }}>
                      ព័ត៌មានមូលដ្ឋាន
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        ឈ្មោះ:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.firstname} {user.lastname || ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        ភេទ:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.gender || 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        អ៊ីមែល:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: cssVariables['--text-primary'],
                      borderBottom: `1px solid ${cssVariables['--border']}`,
                      paddingBottom: '0.5rem',
                      margin: 0
                    }}>
                      ព័ត៌មានបន្ថែម
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        អាសយដ្ឋាន:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.address || 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        លេខទូរស័ព្ទ:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.phonenumber || 'N/A'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ width: '30%', fontSize: '0.9rem', color: cssVariables['--text-secondary'] }}>
                        ប្រវត្តិ:
                      </span>
                      <span style={{ fontSize: '0.9rem', color: cssVariables['--text-primary'], fontWeight: '500' }}>
                        {user.bio || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div style={{
              borderTop: `1px solid ${cssVariables['--border']}`,
              paddingTop: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: cssVariables['--text-primary'],
                margin: '0 0 1.5rem 0'
              }}>
                ការផ្សាយរបស់អ្នកប្រើ ({listings.length})
              </h3>
              
              {sortedListings.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '1.5rem'
                }}>
                  {sortedListings.map((listing) => {
                    const imageUrl = getImageUrl(getFirstImage(listing));
                    const isOwner = currentUser && currentUser.id === user.id;
                    return (
                      <div key={listing.id} style={{
                        background: cssVariables['--surface'],
                        border: `1px solid ${cssVariables['--border']}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: cssVariables['--shadow-sm'],
                        transition: cssVariables['--transition']
                      }}>
                        <div style={{ height: '10rem', overflow: 'hidden' }}>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={listing.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                console.error('Listing image failed to load:', imageUrl);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              background: cssVariables['--background'],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}>
                              <svg
                                style={{ width: '2rem', height: '2rem', color: cssVariables['--text-secondary'] }}
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
                              <span style={{ fontSize: '0.75rem', color: cssVariables['--text-secondary'] }}>
                                គ្មានរូបភាព
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: cssVariables['--text-primary'],
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.5rem'
                          }}>
                            {listing.title}
                          </h4>
                          
                          {listing.price && (
                            <p style={{
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: cssVariables['--accent-color'],
                              margin: 0
                            }}>
                              ${Number(listing.price).toFixed(2)}
                            </p>
                          )}
                          
                          <p style={{
                            fontSize: '0.75rem',
                            color: cssVariables['--text-secondary'],
                            lineHeight: '1.4',
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.1rem'
                          }}>
                            {truncateDescription(listing.description)}
                          </p>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.7rem',
                            color: cssVariables['--text-secondary'],
                            gap: '0.25rem',
                            marginTop: '0.25rem'
                          }}>
                            <svg style={{ width: '0.75rem', height: '0.75rem', color: cssVariables['--accent-color'] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatTimestamp(listing.created_at)}</span>
                          </div>
                          
                          {isOwner && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                              <button
                                onClick={() => handleUpdate(listing.id)}
                                style={{
                                  flex: 1,
                                  padding: '0.5rem',
                                  background: cssVariables['--surface'],
                                  border: `1px solid ${cssVariables['--accent-color']}`,
                                  color: cssVariables['--accent-color'],
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: cssVariables['--transition']
                                }}
                              >
                                កែ
                              </button>
                              <button
                                onClick={() => handleDelete(listing.id)}
                                disabled={deletingId === listing.id}
                                style={{
                                  flex: 1,
                                  padding: '0.5rem',
                                  background: cssVariables['--surface'],
                                  border: `1px solid ${cssVariables['--error-color']}`,
                                  color: cssVariables['--error-color'],
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: cssVariables['--transition']
                                }}
                              >
                                {deletingId === listing.id ? 'កំពុងលុប...' : 'លុប'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  background: cssVariables['--surface'],
                  border: `1px solid ${cssVariables['--border']}`,
                  borderRadius: '8px',
                  boxShadow: cssVariables['--shadow-sm'],
                  marginTop: '2rem'
                }}>
                  <svg
                    style={{ width: '4rem', height: '4rem', color: cssVariables['--accent-color'], margin: '0 auto 1rem' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p style={{ fontSize: '0.9rem', color: cssVariables['--text-secondary'], marginBottom: '1rem' }}>
                    គ្មានការផ្សាយ
                  </p>
                  {currentUser && currentUser.id === user.id && (
                    <Link to="/post-ad" style={{
                      padding: '0.75rem 1.5rem',
                      background: cssVariables['--accent-color'],
                      color: cssVariables['--surface'],
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: cssVariables['--transition']
                    }}>
                      បង្ហោះការផ្សាយថ្មី
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: cssVariables['--surface'],
            border: `1px solid ${cssVariables['--border']}`,
            borderRadius: '8px',
            boxShadow: cssVariables['--shadow-sm']
          }}>
            <svg
              style={{ width: '4rem', height: '4rem', color: cssVariables['--accent-color'], margin: '0 auto 1rem' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ fontSize: '0.9rem', color: cssVariables['--text-secondary'], marginBottom: '1rem' }}>
              {error || 'រកមិនឃើញអ្នកប្រើ។ សូមពិនិត្យឈ្មោះអ្នកប្រើឡើងវិញ�।'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={handleRetry}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: cssVariables['--accent-color'],
                  color: cssVariables['--surface'],
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: cssVariables['--transition']
                }}
              >
                ព្យាយាមម្តងទៀត
              </button>
              <Link to="/" style={{
                padding: '0.75rem 1.5rem',
                background: cssVariables['--surface'],
                border: `1px solid ${cssVariables['--border']}`,
                color: cssVariables['--text-secondary'],
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                textDecoration: 'none',
                transition: cssVariables['--transition']
              }}>
                ត្រឡប់ទៅទំព័រដើម
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @media (max-width: 1400px) {
            .listings-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }

          @media (max-width: 1200px) {
            .listings-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }

          @media (max-width: 900px) {
            .listings-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 600px) {
            .listings-grid {
              grid-template-columns: 1fr !important;
            }
            
            .profile-info-grid {
              grid-template-columns: 1fr !important;
            }
            
            .edit-form-grid {
              grid-template-columns: 1fr !important;
            }
          }

          .edit-toggle-button:hover,
          .post-button:hover,
          .submit-button:hover,
          .retry-button:hover,
          .home-button:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          .edit-toggle-button:hover {
            background: ${cssVariables['--accent-color']};
            color: ${cssVariables['--surface']};
          }

          .post-button:hover,
          .submit-button:hover,
          .retry-button:hover {
            background: ${cssVariables['--primary-color']};
          }

          .home-button:hover {
            background: ${cssVariables['--border']};
            color: ${cssVariables['--text-primary']};
          }

          .action-button:hover {
            transform: translateY(-1px);
          }

          .action-button.edit:hover {
            background: ${cssVariables['--accent-color']};
            color: ${cssVariables['--surface']};
          }

          .action-button.delete:hover {
            background: ${cssVariables['--error-color']};
            color: ${cssVariables['--surface']};
          }

          .action-button.delete:disabled {
            background: ${cssVariables['--border']};
            color: ${cssVariables['--text-secondary']};
            cursor: not-allowed;
          }

          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: ${cssVariables['--accent-color']};
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }

          .listing-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
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
        `}
      </style>
    </div>
  );
};

export default UserProfile;