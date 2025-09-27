import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    telegram_link: '',
    email: '',
    files: [], // Multiple images
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // Store existing image URLs
  const [previewImages, setPreviewImages] = useState([]); // Store preview URLs
  const [imageErrors, setImageErrors] = useState([]); // Track image errors
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track main image
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

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
    '--error-color': '#dc2626',
  };

  const categoryOptions = [
    { value: 'Cars and Vehicles', label: 'ឡាននិងយានជំនិះ' },
    { value: 'Phones & Tablets', label: 'ទូរស័ព្ទនិងថេប្លេត' },
    { value: 'Computers & Accessories', label: 'កុំព្យូទ័រនិងគ្រឿងបន្លាស់' },
    { value: 'Electronics & Appliances', label: 'អេឡិចត្រូនិចនិងឧបករណ៍' },
    { value: 'House & Land', label: 'ផ្ទះនិងដី' },
    { value: 'Jobs', label: 'ការងារ' },
    { value: 'Services', label: 'សេវាកម្ម' },
    { value: 'Fashion & Beauty', label: 'ម៉ូដនិងសម្ផស្ស' },
    { value: 'Furniture & Decor', label: 'គ្រឿងសង្ហារិមនិងការតុបតែង' },
    { value: 'Books, Sports & Hobbies', label: 'សៀវភៅ កីឡា និងចំណង់ចំណូលចិត្ត' },
    { value: 'Pets', label: 'សត្វចិញ្ចឹម' },
    { value: 'Foods', label: 'អាហារ' },
    { value: 'Electronics', label: 'អេឡិចត្រូនិច' },
    { value: 'Fashion', label: 'ម៉ូដ' },
    { value: 'Home & Garden', label: 'ផ្ទះ និងសួន' },
    { value: 'Vehicles', label: 'យានយន្ត' },
    { value: 'Sports', label: 'កីឡា' },
    { value: 'Hobbies', label: 'ចំណង់ចំណូលចិត្ត' },
    { value: 'Other', label: 'ផ្សេងៗ' },
  ];

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') {
      console.warn('Invalid or missing imagePath:', imagePath);
      return null;
    }
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    if (imagePath.startsWith('http')) {
      console.log('Absolute URL detected:', imagePath);
      return imagePath;
    }
    let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    if (cleanPath.startsWith('uploads/')) {
      cleanPath = cleanPath.slice(8);
    }
    const finalUrl = `${baseUrl}/uploads/${cleanPath}`;
    console.log('Final URL constructed:', finalUrl);
    return finalUrl;
  };

  // Fetch listing details
  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/listings/${id}`)
      .then((response) => {
        const listing = response.data;
        console.log('Listing response:', response.data);
        setFormData({
          title: listing.title,
          description: listing.description || '',
          price: listing.price.toString(),
          category: listing.category,
          telegram_link: listing.telegram_link || '',
          email: listing.email || '',
          files: [],
        });
        // Handle existing images
        const images = listing.images && Array.isArray(listing.images) && listing.images.length > 0
          ? listing.images.map((img) => ({
              id: img.id,
              url: getImageUrl(img.image_url),
            }))
          : listing.image_url
          ? [{ id: null, url: getImageUrl(listing.image_url) }]
          : [];
        setExistingImages(images);
        setPreviewImages(images.map((img) => img.url));
        // Set the last image as the default main image
        setSelectedImageIndex(Math.max(0, images.length - 1));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching listing:', error.response || error);
        let errorMessage = `បរាជ័យក្នុងការទាញយកការផ្សាយ។ (កំហុស: ${error.message})`;
        if (error.response) {
          errorMessage = error.response.status === 404
            ? 'ការផ្សាយមិនត្រូវបានរកឃើញទេ។'
            : `បរាជ័យក្នុងការទាញយកការផ្សាយ។ (កំហុស: ${error.response.data?.detail || error.message})`;
        }
        setError(errorMessage);
        setLoading(false);
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      const newFiles = Array.from(files);
      // Validate file size and type
      const validFiles = newFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          setError('ទំហំរូបភាពមិនហួស ៥MB ទេ។');
          return false;
        }
        if (!file.type.startsWith('image/')) {
          setError('សូមជ្រើសរើសឯកសាររូបភាពប៉ុណ្ណោះ។');
          return false;
        }
        return true;
      });
      setFormData((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
      // Set the last uploaded image as the main image
      setSelectedImageIndex(previewImages.length + newPreviews.length - 1);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image deletion
  const handleDeleteImage = (index) => {
    if (index < existingImages.length) {
      setImagesToDelete((prev) => [...prev, existingImages[index].id].filter(Boolean));
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageErrors((prev) => prev.filter((_, i) => i !== index));
    // Update selected image index
    if (selectedImageIndex >= previewImages.length - 1) {
      setSelectedImageIndex(Math.max(0, previewImages.length - 2));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.title || !formData.price || !formData.category || !formData.telegram_link || !formData.email) {
      setError('សូមបំពេញគ្រប់វាលដែលតម្រូវឱ្យបំពេញ។');
      return;
    }
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', parseFloat(formData.price));
    data.append('category', formData.category);
    data.append('telegram_link', formData.telegram_link);
    data.append('email', formData.email);
    formData.files.forEach((file) => data.append('images', file));
    if (imagesToDelete.length > 0) {
      data.append('images_to_delete', JSON.stringify(imagesToDelete));
    }

    try {
      const response = await apiClient.put(`/listings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Update response:', response.data);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error.response || error);
      let errorMessage = `បរាជ័យក្នុងការកែសម្រួលការផ្សាយ។ (កំហុស: ${error.message})`;
      if (error.response) {
        errorMessage = error.response.status === 404
          ? 'ការផ្សាយមិនត្រូវបានរកឃើញទេ�।'
          : error.response.status === 403
          ? 'អ្នកមិនមានសិទ្ធិកែសម្រួលការផ្សាយនេះទេ។'
          : `បរាជ័យក្នុងការកែសម្រួលការផ្សាយ។ (កំហុស: ${error.response.data?.detail || error.message})`;
      }
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: cssVariables['--background'],
        padding: '2rem 1rem',
        minHeight: '100vh',
        fontFamily: "'Kantumruy', 'Arial', sans-serif",
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            background: cssVariables['--surface'],
            border: `1px solid ${cssVariables['--border']}`,
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: cssVariables['--shadow-sm'],
          }}>
            <div style={{
              height: '2rem',
              background: cssVariables['--border'],
              borderRadius: '8px',
              marginBottom: '2rem',
            }} />
            <div style={{ spaceY: '1rem' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  height: '2.5rem',
                  background: cssVariables['--border'],
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: cssVariables['--background'],
      padding: '2rem 1rem',
      minHeight: '100vh',
      fontFamily: "'Kantumruy', 'Arial', sans-serif",
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: cssVariables['--text-primary'],
          marginBottom: '1.5rem',
        }}>
          កែសម្រួលការផ្សាយ
        </h1>
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: cssVariables['--error-color'],
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <strong style={{ fontWeight: '600', fontSize: '0.9rem' }}>កំហុស:</strong>
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} style={{
          background: cssVariables['--surface'],
          border: `1px solid ${cssVariables['--border']}`,
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: cssVariables['--shadow-sm'],
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              ចំណងជើង
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                transition: cssVariables['--transition'],
              }}
              required
              aria-label="ចំណងជើង"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              ការពិពណ៌នា
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                minHeight: '100px',
                resize: 'vertical',
                transition: cssVariables['--transition'],
              }}
              rows="4"
              aria-label="ការពិពណ៌នា"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              តម្លៃ (USD)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                transition: cssVariables['--transition'],
              }}
              step="0.01"
              min="0"
              required
              aria-label="តម្លៃ"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              ប្រភេទ
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                transition: cssVariables['--transition'],
              }}
              required
              aria-label="ប្រភេទ"
            >
              <option value="">ជ្រើសរើសប្រភេទ</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              តំណភ្ជាប់ Telegram
            </label>
            <input
              type="url"
              name="telegram_link"
              value={formData.telegram_link}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                transition: cssVariables['--transition'],
              }}
              required
              aria-label="តំណភ្ជាប់ Telegram"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              អ៊ីមែល
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: cssVariables['--text-primary'],
                background: cssVariables['--surface'],
                transition: cssVariables['--transition'],
              }}
              required
              aria-label="អ៊ីមែល"
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: cssVariables['--text-secondary'],
              marginBottom: '0.5rem',
            }}>
              រូបភាព
            </label>
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${cssVariables['--border']}`,
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: cssVariables['--surface'],
              }}
              aria-label="ជ្រើសរើសរូបភាព"
            />
            {previewImages.length > 0 && (
              <div style={{ marginTop: '1rem', spaceY: '1rem' }}>
                {/* Main Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '12rem',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `1px solid ${cssVariables['--border']}`,
                  boxShadow: cssVariables['--shadow-sm'],
                }}>
                  {previewImages[selectedImageIndex] && !imageErrors[selectedImageIndex] ? (
                    <img
                      src={previewImages[selectedImageIndex]}
                      alt={`Preview ${selectedImageIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: cssVariables['--transition'],
                      }}
                      onError={() => {
                        console.error('Main image failed to load:', previewImages[selectedImageIndex]);
                        setImageErrors((prev) => {
                          const newErrors = [...prev];
                          newErrors[selectedImageIndex] = true;
                          return newErrors;
                        });
                      }}
                      onLoad={() => console.log('Main image loaded successfully:', previewImages[selectedImageIndex])}
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
                      gap: '0.5rem',
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
                        រូបភាពមិនអាចបង្ហាញបាន
                      </span>
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                }}>
                  {previewImages.map((url, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: `2px solid ${selectedImageIndex === index ? cssVariables['--accent-color'] : cssVariables['--border']}`,
                      transition: cssVariables['--transition'],
                    }}>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                        }}
                        aria-label={`ជ្រើសរូបភាព ${index + 1}`}
                      >
                        {url && !imageErrors[index] ? (
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={() => {
                              console.error('Thumbnail failed to load:', url);
                              setImageErrors((prev) => {
                                const newErrors = [...prev];
                                newErrors[index] = true;
                                return newErrors;
                              });
                            }}
                            onLoad={() => console.log('Thumbnail loaded successfully:', url)}
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: cssVariables['--background'],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <span style={{ fontSize: '0.6rem', color: cssVariables['--text-secondary'] }}>
                              មិនអាចផ្ទុក
                            </span>
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          background: cssVariables['--error-color'],
                          color: cssVariables['--surface'],
                          borderRadius: '50%',
                          width: '1.25rem',
                          height: '1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          transform: 'translate(50%, -50%)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                        aria-label={`លុបរូបភាព ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
          }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: cssVariables['--accent-color'],
                color: cssVariables['--surface'],
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: cssVariables['--transition'],
              }}
              aria-label="រក្សាទុកការផ្សាយ"
            >
              រក្សាទុក
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: cssVariables['--surface'],
                border: `1px solid ${cssVariables['--border']}`,
                color: cssVariables['--text-secondary'],
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: cssVariables['--transition'],
              }}
              aria-label="បោះបង់"
            >
              បោះបង់
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @media (max-width: 600px) {
            .form-container {
              padding: 1rem !important;
            }
          }

          .submit-button:hover,
          .cancel-button:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          .submit-button:hover {
            background: ${cssVariables['--primary-color']};
          }

          .cancel-button:hover {
            background: ${cssVariables['--border']};
            color: ${cssVariables['--text-primary']};
          }

          .thumbnail:hover {
            border-color: ${cssVariables['--accent-color']} !important;
          }

          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: ${cssVariables['--accent-color']};
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          }

          /* Animation for new images */
          @keyframes highlightNew {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.02); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          .main-image {
            animation: highlightNew 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default EditListing;