import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setError('សូមបំពេញឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់។');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('token', response.data.access_token);
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      }
      navigate('/');
    } catch (error) {
      console.error('ការចូលបរាជ័យ:', error);
      let errorMsg = 'ការចូលបរាជ័យ។ សូមព្យាយាមម្តងទៀត។';

      if (error.response?.status === 401) {
        errorMsg = 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ។';
      } else if (error.response?.data?.detail) {
        errorMsg = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => err.msg).join(', ')
          : error.response.data.detail;
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill username if remembered
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">ចូលគណនី</h2>
            <p className="form-subtitle">
              បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់របស់អ្នក
            </p>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-content">
            {/* Username Field */}
            <div className="input-group">
              <label htmlFor="username" className="input-label">
                ឈ្មោះអ្នកប្រើប្រាស់ *
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                  className={`input-field ${error ? 'input-error' : ''}`}
                  required
                  aria-label="Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                ពាក្យសម្ងាត់ *
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m2-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-6 5a9 9 0 0112 0M3 12h2m14 0h2m-9-9v2m0 14v2"
                  />
                </svg>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="បញ្ចូលពាក្យសម្ងាត់"
                  className={`input-field ${error ? 'input-error' : ''}`}
                  required
                  aria-label="Password"
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="form-options">
              <div className="checkbox-group">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <label htmlFor="remember-me" className="checkbox-label">
                  ចងចាំខ្ញុំ
                </label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                ភ្លេចពាក្យសម្ងាត់?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              aria-label="Login"
            >
              {isLoading ? (
                <>
                  <svg
                    className="spinner"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="spinner-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="spinner-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  កំពុងចូល...
                </>
              ) : (
                'ចូលគណនី'
              )}
            </button>

            {/* Register Link */}
            <div className="register-link">
              <p>
                មិនទាន់មានគណនី?{' '}
                <Link to="/register" className="register-link-text">
                  ចុះឈ្មោះ
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          background: #f8fafc;
          min-height: 100vh;
          padding: 4rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Khmer', 'Arial', sans-serif;
        }

        .form-container {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
        }

        .form-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 0.5rem;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .error-text {
          font-size: 0.9rem;
          color: #dc2626;
        }

        .form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #1e293b;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #64748b;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #1e293b;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .input-field::placeholder {
          color: #9ca3af;
        }

        .input-error {
          border-color: #dc2626;
        }

        .input-error:focus {
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-input {
          width: 1rem;
          height: 1rem;
          accent-color: #2563eb;
          border-radius: 4px;
        }

        .checkbox-label {
          font-size: 0.9rem;
          color: #64748b;
        }

        .forgot-password {
          font-size: 0.9rem;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #1d4ed8;
        }

        .submit-button {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #2563eb;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .submit-button:hover:not(.loading) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .submit-button.loading {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: spin 1s linear infinite;
        }

        .spinner-circle {
          opacity: 0.25;
        }

        .spinner-path {
          opacity: 0.75;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .register-link {
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .register-link-text {
          font-weight: 500;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .register-link-text:hover {
          color: #1d4ed8;
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 2rem 1rem;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .form-content {
            gap: 1rem;
          }
        }

        @media (min-width: 768px) {
          .form-card {
            padding: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;