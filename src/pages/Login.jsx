import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create form data instead of JSON
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      navigate('/');
    } catch (error) {
      console.error('ការចូលបរាជ័យ:', error);
      setError(error.response?.data?.detail || 'ការចូលបរាជ័យ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 
            className="mt-6 text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            ចូលគណនី
          </h2>
          <p 
            className="text-sm text-gray-600"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            បញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីចូល
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p 
                className="text-sm text-red-700"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                {error}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ឈ្មោះអ្នកប្រើប្រាស់
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                required
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ពាក្យសម្ងាត់
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                required
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-md'
              }`}
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  កំពុងចូល...
                </>
              ) : (
                'ចូលគណនី'
              )}
            </button>
          </form>
          
          {/* Register Link */}
          <div className="text-center">
            <p 
              className="text-sm text-gray-600"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              មិនទាន់មានគណនី?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-700 hover:text-blue-600 transition-colors duration-200"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
              >
                ចុះឈ្មោះ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;