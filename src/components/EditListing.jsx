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
    file: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const categoryOptions = [
    { value: 'electronics', label: 'អេឡិចត្រូនិច' },
    { value: 'fashion', label: 'ម៉ូដ' },
    { value: 'house', label: 'ផ្ទះ' },
    { value: 'photography', label: 'ការថតរូប' },
    { value: 'car', label: 'ឡាន' },
    { value: 'other', label: 'ផ្សេងៗ' }
  ];

  useEffect(() => {
    apiClient.get(`/listings/${id}`)
      .then(response => {
        const listing = response.data;
        setFormData({
          title: listing.title,
          description: listing.description || '',
          price: listing.price.toString(),
          category: listing.category,
          telegram_link: listing.telegram_link || '',
          email: listing.email || '',
          file: null
        });
        setPreviewImage(listing.image_url ? `http://localhost:8000${listing.image_url}` : null);
        setLoading(false);
      })
      .catch(error => {
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, file }));
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      } else {
        setPreviewImage(formData.image_url ? `http://localhost:8000${formData.image_url}` : null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const data = new FormData();
    if (formData.title) data.append('title', formData.title);
    if (formData.description) data.append('description', formData.description);
    if (formData.price) data.append('price', parseFloat(formData.price));
    if (formData.category) data.append('category', formData.category);
    if (formData.telegram_link) data.append('telegram_link', formData.telegram_link);
    if (formData.email) data.append('email', formData.email);
    if (formData.file) data.append('image', formData.file); // Changed from 'file' to 'image'

    try {
      const response = await apiClient.put(`/listings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Update response:', response.data); // Debug
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <h1 
          className="text-3xl font-bold text-gray-900 mb-6"
          style={{ fontFamily: "'Kantumruy', sans-serif" }}
        >
          កែសម្រួលការផ្សាយ
        </h1>
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
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ចំណងជើង
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ការពិពណ៌នា
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              តម្លៃ (USD)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ប្រភេទ
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              required
            >
              <option value="">ជ្រើសរើសប្រភេទ</option>
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              តំណភ្ជាប់ Telegram
            </label>
            <input
              type="url"
              name="telegram_link"
              value={formData.telegram_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              អ៊ីមែល
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-gray-700 text-sm font-medium mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              រូបភាព
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            />
            {previewImage && (
              <div className="mt-4">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-700 text-white py-2.5 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              រក្សាទុក
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-listings')}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium text-sm"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              បោះបង់
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;