import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import './PostAd.css';

const PostAd = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [email, setEmail] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState([]);
  const [submissionTime, setSubmissionTime] = useState(null);
  const navigate = useNavigate();

  const categories = [
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

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'ចំណងជើងត្រូវបំពេញ';
    if (!description.trim()) newErrors.description = 'ការពិពណ៌នាត្រូវបំពេញ';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'តម្លៃត្រឹមត្រូវត្រូវបំពេញ';
    if (!category) newErrors.category = 'ប្រភេទត្រូវបំពេញ';
    if (!telegramLink.trim()) newErrors.telegramLink = 'តំណភ្ជាប់ Telegram ត្រូវបំពេញ';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'អ៊ីមែលត្រឹមត្រូវត្រូវបំពេញ';
    if (imageFiles.length === 0) newErrors.image = 'យ៉ាងហោចណាស់មួយរូបភាពត្រូវបានទាមទារ';
    if (imageFiles.length > 10) newErrors.image = 'អតិបរមា 10 រូបភាពត្រូវបានអនុញ្ញាត';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
    
    for (const file of files) {
      if (imageFiles.length >= 10) {
        setErrors(prev => ({ 
          ...prev, 
          image: 'អតិបរមា 10 រូបភាពត្រូវបានអនុញ្ញាត' 
        }));
        break;
      }
      
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType || !isValidSize) {
        setErrors(prev => ({ 
          ...prev, 
          image: 'មានឯកសារខ្លះមិនត្រឹមត្រូវ (ត្រូវជា PNG, JPG, GIF និងតិចជាង 5MB)' 
        }));
        continue;
      }
      
      setUploadingImages(prev => [...prev, file.name]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setImageFiles(prev => [...prev, file]);
      
      setUploadingImages(prev => prev.filter(name => name !== file.name));
    }
    
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    
    if (newFiles.length <= 10 && newFiles.length >= 1) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' });
    setSubmissionTime(now);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('category', category);
    formData.append('telegram_link', telegramLink);
    formData.append('email', email);

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('token');
    try {
      const response = await apiClient.post('/listings/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Listing created:', response.data);
      navigate('/my-listings');
    } catch (error) {
      console.error('កំហុសក្នុងការបង្ហោះការផ្សាយ:', error);
      console.error('កំហុសឆ្លើយតប:', error.response?.data);
      
      if (error.response?.status === 422) {
        setErrors({ submit: error.response.data.detail || 'កំហុសក្នុងការបញ្ជូនទិន្នន័យ' });
      } else if (error.response?.status === 401) {
        setErrors({ submit: 'សេសម្ភារៈសុវត្ថិភាពមិនត្រឹមត្រូវ។ សូមឡុកអ៊ីនឡើងវិញ។' });
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setErrors({ submit: 'បរាជ័យក្នុងការបង្ហោះការផ្សាយ។ សូមព្យាយាមម្តងទៀត។' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSubmissionTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Phnom_Penh',
    };
    return date.toLocaleString('km-KH', options);
  };

  return (
    <div className="post-ad-container">
      <div className="post-ad-wrapper">
        <div className="post-ad-form">
          <div className="form-header">
            <h1 className="form-title">បង្កើតការផ្សាយថ្មី</h1>
            <p className="form-subtitle">បំពេញទម្រង់ខាងក្រោមដើម្បីបង្ហោះការផ្សាយរបស់អ្នក</p>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-group">
              <label htmlFor="title" className="form-label">ចំណងជើង *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ឧ. ទូរស័ព្ទ iPhone 13 ថ្មី"
                className={`form-input ${errors.title ? 'form-input-error' : ''}`}
                required
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">ការពិពណ៌នា *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ពិពណ៌នាអំពីទំនិញរបស់អ្នកលម្អិត..."
                rows={5}
                className={`form-input ${errors.description ? 'form-input-error' : ''}`}
                required
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="price" className="form-label">តម្លៃ ($) *</label>
                <div className="input-icon-wrapper">
                  <span className="input-icon">$</span>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`form-input ${errors.price ? 'form-input-error' : ''}`}
                    required
                  />
                </div>
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">ប្រភេទ *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`form-input ${errors.category ? 'form-input-error' : ''}`}
                  required
                >
                  <option value="">ជ្រើសរើសប្រភេទ</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="error-text">{errors.category}</p>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="telegramLink" className="form-label">តំណភ្ជាប់ Telegram *</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <input
                    id="telegramLink"
                    type="url"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="https://t.me/username"
                    className={`form-input ${errors.telegramLink ? 'form-input-error' : ''}`}
                    required
                  />
                </div>
                {errors.telegramLink && <p className="error-text">{errors.telegramLink}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">អ៊ីមែល *</label>
                <div className="input-icon-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    required
                  />
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="images" className="form-label">រូបភាពទំនិញ (1-10 រូប) *</label>
              <div className="image-upload-wrapper">
                <label htmlFor="images" className="image-upload-label">
                  <div className="image-upload-content">
                    <svg className="image-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="image-upload-text">
                      <span className="font-semibold">ចុចដើម្បីផ្ទុកឡើង</span> ឬអូសទម្លាក់
                    </p>
                    <p className="image-upload-subtext">PNG, JPG, GIF (អតិបរមា 5MB ក្នុងមួយរូប)</p>
                  </div>
                  <input 
                    id="images" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                  />
                </label>
              </div>

              {uploadingImages.length > 0 && (
                <div className="image-upload-section">
                  <p className="section-label">កំពុងផ្ទុកឡើង:</p>
                  <div className="image-grid">
                    {uploadingImages.map((fileName, index) => (
                      <div key={index} className="image-preview">
                        <div className="image-placeholder">
                          <svg className="image-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className="image-spinner" />
                        </div>
                        <p className="image-filename">{fileName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageFiles.length > 0 && (
                <div className="image-upload-section">
                  <p className="section-label">រូបភាពដែលបានជ្រើសរើស ({imageFiles.length}/10):</p>
                  <div className="image-grid">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="image-preview">
                        <div className="image-preview-wrapper">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="image-preview-img"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="image-remove-button"
                          >
                            ×
                          </button>
                        </div>
                        <p className="image-filename">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>

            {errors.submit && (
              <div className="error-alert">
                <p className="error-text">{errors.submit}</p>
              </div>
            )}

            {submissionTime && (
              <div className="submission-time">
                <p className="submission-time-text">
                  បានបង្ហោះនៅម៉ោង: {formatSubmissionTime(submissionTime)}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || uploadingImages.length > 0}
              className={`submit-button ${isSubmitting || uploadingImages.length > 0 ? 'submit-button-disabled' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="submit-spinner" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="spinner-circle" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="spinner-path" />
                  </svg>
                  កំពុងបង្ហោះ...
                </>
              ) : (
                'បង្ហោះការផ្សាយ'
              )}
            </button>

            <div className="cancel-link-wrapper">
              <Link to="/my-listings" className="cancel-link">បោះបង់</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAd;