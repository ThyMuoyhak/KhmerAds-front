import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const PostAd = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [telegramLink, setTelegramLink] = useState('');
  const [email, setEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const categories = [
    { value: 'Electronics', label: 'អេឡិចត្រូនិច' },
    { value: 'Fashion', label: 'ម៉ូដ' },
    { value: 'Home & Garden', label: 'ផ្ទះ និងសួន' },
    { value: 'Vehicles', label: 'យានយន្ត' },
    { value: 'Sports', label: 'កីឡា' },
    { value: 'Hobbies', label: 'ចំណង់ចំណូលចិត្ត' },
    { value: 'Services', label: 'សេវាកម្ម' },
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', parseFloat(price));
    formData.append('category', category);
    formData.append('telegram_link', telegramLink);
    formData.append('email', email);

    if (imageFile) {
      formData.append('image', imageFile); // Match backend parameter
    }

    const token = localStorage.getItem('token'); // Assume token is stored after login
    try {
      const response = await apiClient.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add authentication
        },
      });
      console.log('Listing created:', response.data);
      navigate('/my-listings');
    } catch (error) {
      console.error('កំហុសក្នុងការបង្ហោះការផ្សាយ:', error);
      console.error('កំហុសឆ្លើយតប:', error.response?.data);
      setErrors({ submit: 'បរាជ័យក្នុងការបង្ហោះការផ្សាយ។ សូមព្យាយាមម្តងទៀត។' });
      if (error.response?.data?.detail) {
        setErrors({ submit: error.response.data.detail });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              បង្កើតការផ្សាយថ្មី
            </h1>
            <p 
              className="text-sm text-gray-600"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              បំពេញទម្រង់ខាងក្រោមដើម្បីបង្ហោះការផ្សាយរបស់អ្នក
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ចំណងជើង *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ឧ. ទូរស័ព្ទ iPhone 13 ថ្មី"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                  errors.title ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                required
              />
              {errors.title && (
                <p 
                  className="mt-1 text-sm text-red-600"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ការពិពណ៌នា *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ពិពណ៌នាអំពីទំនិញរបស់អ្នកលម្អិត..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                  errors.description ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                }`}
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                required
              />
              {errors.description && (
                <p 
                  className="mt-1 text-sm text-red-600"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Field */}
              <div>
                <label 
                  htmlFor="price" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  តម្លៃ ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                      errors.price ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    required
                  />
                </div>
                {errors.price && (
                  <p 
                    className="mt-1 text-sm text-red-600"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Category Field */}
              <div>
                <label 
                  htmlFor="category" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  ប្រភេទ *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                    errors.category ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  required
                >
                  <option value="">ជ្រើសរើសប្រភេទ</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p 
                    className="mt-1 text-sm text-red-600"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telegram Field */}
              <div>
                <label 
                  htmlFor="telegramLink" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  តំណភ្ជាប់ Telegram *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.14.141-.259.259-.374.261l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                    </svg>
                  </span>
                  <input
                    id="telegramLink"
                    type="url"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    placeholder="https://t.me/username"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                      errors.telegramLink ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    required
                  />
                </div>
                {errors.telegramLink && (
                  <p 
                    className="mt-1 text-sm text-red-600"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    {errors.telegramLink}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  អ៊ីមែល *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm transition-all duration-300 ${
                      errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    required
                  />
                </div>
                {errors.email && (
                  <p 
                    className="mt-1 text-sm text-red-600"
                    style={{ fontFamily: "'Kantumruy', sans-serif" }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Image Upload Field */}
            <div>
              <label 
                htmlFor="image" 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                រូបភាពទំនិញ
              </label>
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="image" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p 
                      className="mb-2 text-sm text-gray-600"
                      style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    >
                      <span className="font-semibold">ចុចដើម្បីផ្ទុកឡើង</span> ឬអូសទម្លាក់
                    </p>
                    <p 
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "'Kantumruy', sans-serif" }}
                    >
                      PNG, JPG, GIF (អតិបរមា 5MB)
                    </p>
                  </div>
                  <input 
                    id="image" 
                    type="file" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </label>
              </div>
              {imageFile && (
                <p 
                  className="mt-2 text-sm text-green-600"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  បានជ្រើសរើស: {imageFile.name}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p 
                  className="text-sm text-red-700"
                  style={{ fontFamily: "'Kantumruy', sans-serif" }}
                >
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  កំពុងបង្ហោះ...
                </>
              ) : (
                'បង្ហោះការផ្សាយ'
              )}
            </button>

            {/* Cancel Link */}
            <div className="text-center">
              <Link 
                to="/my-listings" 
                className="text-sm text-gray-600 hover:text-blue-700 transition-colors duration-200"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                បោះបង់
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAd;