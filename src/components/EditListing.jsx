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
          ? 'ការផ្សាយមិនត្រូវបានរកឃើញទេ។'
          : error.response.status === 403
          ? 'អ្នកមិនមានសិទ្ធិកែសម្រួលការផ្សាយនេះទេ។'
          : `បរាជ័យក្នុងការកែសម្រួលការផ្សាយ។ (កំហុស: ${error.response.data?.detail || error.message})`;
      }
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="edit-listing-loading-container">
        <div className="edit-listing-loading-wrapper">
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

  return (
    <div className="edit-listing-container">
      <div className="edit-listing-wrapper">
        <div className="edit-listing-header">
          <h1 className="edit-listing-title">កែសម្រួលការផ្សាយ</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-alert">
            <div className="error-content">
              <strong className="error-strong">កំហុស:</strong>
              <span className="error-message">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">ចំណងជើង</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
              aria-label="ចំណងជើង"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ការពិពណ៌នា</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="4"
              aria-label="ការពិពណ៌នា"
            />
          </div>

          <div className="form-group">
            <label className="form-label">តម្លៃ (USD)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
              aria-label="តម្លៃ"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ប្រភេទ</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
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

          <div className="form-group">
            <label className="form-label">តំណភ្ជាប់ Telegram</label>
            <input
              type="url"
              name="telegram_link"
              value={formData.telegram_link}
              onChange={handleChange}
              className="form-input"
              required
              aria-label="តំណភ្ជាប់ Telegram"
            />
          </div>

          <div className="form-group">
            <label className="form-label">អ៊ីមែល</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              aria-label="អ៊ីមែល"
            />
          </div>

          <div className="form-group">
            <label className="form-label">រូបភាព</label>
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="file-input"
              aria-label="ជ្រើសរើសរូបភាព"
            />
            {previewImages.length > 0 && (
              <div className="image-preview-section">
                {/* Main Image */}
                <div className="main-image-container">
                  {previewImages[selectedImageIndex] && !imageErrors[selectedImageIndex] ? (
                    <img
                      src={previewImages[selectedImageIndex]}
                      alt={`Preview ${selectedImageIndex + 1}`}
                      className="main-image"
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
                    <div className="image-error">
                      <ImageIcon className="image-error-icon" />
                      <span className="image-error-text">រូបភាពមិនអាចបង្ហាញបាន</span>
                    </div>
                  )}
                </div>
                {/* Thumbnails */}
                <div className="thumbnails-container">
                  {previewImages.map((url, index) => (
                    <div key={index} className={`thumbnail ${selectedImageIndex === index ? 'selected' : ''}`}>
                      <button
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className="thumbnail-button"
                        aria-label={`ជ្រើសរូបភាព ${index + 1}`}
                      >
                        {url && !imageErrors[index] ? (
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail-image"
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
                          <div className="thumbnail-error">
                            <span className="thumbnail-error-text">មិនអាចផ្ទុក</span>
                          </div>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="delete-thumbnail-button"
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

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              aria-label="រក្សាទុកការផ្សាយ"
            >
              រក្សាទុក
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              className="cancel-button"
              aria-label="បោះបង់"
            >
              បោះបង់
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .edit-listing-container {
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          padding: 2rem 1rem;
          min-height: 100vh;
          font-family: 'Inter', 'Khmer', sans-serif;
          color: #e2e8f0;
        }

        .edit-listing-wrapper {
          max-width: 700px;
          margin: 0 auto;
        }

        .edit-listing-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .edit-listing-title {
          font-size: 2rem;
          font-weight: 700;
          color: #00d9ff;
          margin: 0;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 1px;
        }

        /* Error Alert */
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

        /* Edit Form */
        .edit-form {
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 4px solid #533483;
          border-radius: 0;
          padding: 2rem;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
          position: relative;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .edit-form::before {
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

        .edit-form:hover::before {
          opacity: 1;
        }

        .edit-form:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
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

        /* Image Preview Section */
        .image-preview-section {
          margin-top: 1rem;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          height: 12rem;
          border-radius: 0;
          overflow: hidden;
          border: 4px solid #533483;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          transition: all 0.3s ease;
        }

        .main-image-container:hover {
          border-color: #00d9ff;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: pixelated;
          transition: transform 0.3s ease;
        }

        .main-image-container:hover .main-image {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .image-error,
        .thumbnail-error {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.5rem;
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          border: 3px dashed #533483;
        }

        .image-error-icon,
        .thumbnail-error-icon {
          width: 2rem;
          height: 2rem;
          color: #7b8cde;
          filter: drop-shadow(0 0 10px rgba(83, 52, 131, 0.5));
          image-rendering: pixelated;
        }

        .image-error-text,
        .thumbnail-error-text {
          font-size: 0.75rem;
          color: #7b8cde;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
        }

        .thumbnails-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .thumbnail {
          position: relative;
          width: 4rem;
          height: 4rem;
          border-radius: 0;
          overflow: hidden;
          border: 3px solid #533483;
          transition: all 0.2s ease;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
        }

        .thumbnail.selected {
          border-color: #00d9ff;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 217, 255, 0.3);
        }

        .thumbnail:hover {
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
        }

        .thumbnail-button {
          width: 100%;
          height: 100%;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .thumbnail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: pixelated;
        }

        .delete-thumbnail-button {
          position: absolute;
          top: 0;
          right: 0;
          background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
          color: white;
          border-radius: 50%;
          width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transform: translate(50%, -50%);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
          font-family: 'Khmer', monospace;
        }

        .delete-thumbnail-button:hover {
          background: linear-gradient(180deg, #ff5470 0%, #e94560 100%);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4), 0 0 10px rgba(233, 69, 96, 0.5);
          transform: translate(50%, -50%) scale(1.1);
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .submit-button,
        .cancel-button {
          flex: 1;
          padding: 0.75rem;
          border-radius: 0;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 3px solid;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          letter-spacing: 0.5px;
          font-family: 'Khmer', monospace;
          text-transform: uppercase;
        }

        .submit-button {
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          color: #0a0e27;
          border-color: #006699;
        }

        .submit-button:hover {
          background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        .submit-button:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
        }

        .cancel-button {
          background: linear-gradient(180deg, #533483 0%, #3a2359 100%);
          color: #00d9ff;
          border-color: #7b8cde;
        }

        .cancel-button:hover {
          background: linear-gradient(180deg, #7b8cde 0%, #533483 100%);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        .cancel-button:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
        }

        /* Loading States */
        .edit-listing-loading-container {
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          padding: 2rem 1rem;
          min-height: 100vh;
          font-family: 'Inter', 'Khmer', sans-serif;
        }

        .edit-listing-loading-wrapper {
          max-width: 700px;
          margin: 0 auto;
        }

        .loading-container {
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 4px solid #533483;
          border-radius: 0;
          padding: 2rem;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
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
          grid-template-columns: repeat(2, 1fr);
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
        @media (max-width: 600px) {
          .edit-listing-container {
            padding: 1rem;
          }

          .edit-form {
            padding: 1.5rem;
          }

          .loading-grid {
            grid-template-columns: 1fr;
          }

          .thumbnails-container {
            justify-content: center;
          }

          .form-actions {
            flex-direction: column;
          }

          .edit-form {
            border-width: 3px;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          }

          .edit-form:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
          }
        }

        /* Pixel-perfect rendering */
        .thumbnail-image,
        .main-image {
          image-rendering: pixelated;
        }

        /* Glow effects */
        .thumbnail:hover .thumbnail-image,
        .submit-button:hover,
        .cancel-button:hover {
          animation: elementGlow 1.5s ease-in-out infinite;
        }

        @keyframes elementGlow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor); }
        }

        /* Focus states */
        .form-input:focus,
        .file-input:focus,
        select:focus,
        textarea:focus {
          outline: 3px solid #00d9ff;
          outline-offset: 2px;
        }

        /* Icon Component */
        .image-error-icon {
          image-rendering: pixelated;
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
      `}</style>
    </div>
  );
};

// Icon Component
const ImageIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default EditListing;