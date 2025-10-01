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
                <Link  to="/register" className="register-link-text">
                  ចុះឈ្មោះ
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          background: linear-gradient(135deg, #0a0e27 0%, #16213e 100%);
          min-height: 100vh;
          padding: 4rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', 'Khmer', sans-serif;
          color: #e2e8f0;
        }

        .form-container {
          max-width: 480px;
          width: 100%;
          margin: 0 auto;
        }

        .form-card {
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 4px solid #533483;
          border-radius: 0;
          padding: 2rem;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
          position: relative;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }

        .form-card::before {
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

        .form-card:hover::before {
          opacity: 1;
        }

        .form-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #00d9ff;
          margin: 0;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 1px;
        }

        .form-subtitle {
          font-size: 0.9rem;
          color: #7b8cde;
          margin-top: 0.5rem;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
        }

        .error-message {
          background: linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(199, 44, 65, 0.2) 100%);
          border: 4px solid #e94560;
          border-radius: 0;
          padding: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          font-family: 'Khmer', monospace;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
        }

        .error-text {
          font-size: 0.9rem;
          color: #e94560;
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
          font-weight: 700;
          color: #7b8cde;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
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
          color: #00d9ff;
          image-rendering: pixelated;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          border: 3px solid #533483;
          border-radius: 0;
          font-size: 0.9rem;
          color: #e2e8f0;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(5px);
        }

        .input-field:focus {
          outline: none;
          border-color: #00d9ff;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
          transform: translate(-2px, -2px);
        }

        .input-field::placeholder {
          color: #7b8cde;
        }

        .input-error {
          border-color: #e94560;
          box-shadow: 4px 4px 0 rgba(233, 69, 96, 0.4);
        }

        .input-error:focus {
          box-shadow: 4px 4px 0 rgba(233, 69, 96, 0.4), 0 0 20px rgba(233, 69, 96, 0.3);
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
          accent-color: #00d9ff;
          border: 2px solid #533483;
          border-radius: 0;
          background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked {
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          border-color: #006699;
        }

        .checkbox-label {
          font-size: 0.9rem;
          color: #7b8cde;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .forgot-password {
          font-size: 0.9rem;
          color: #00d9ff;
          text-decoration: none;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .forgot-password:hover {
          color: #7df9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          color: #0a0e27;
          font-size: 0.9rem;
          font-weight: 700;
          border: 3px solid #006699;
          border-radius: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
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

        .submit-button:hover:not(.loading) {
          background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        .submit-button.loading {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button:active:not(.loading) {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          animation: pixelSpin 0.8s linear infinite;
          image-rendering: pixelated;
        }

        .spinner-circle {
          opacity: 0.25;
        }

        .spinner-path {
          opacity: 0.75;
        }

        @keyframes pixelSpin {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(90deg); }
          50% { transform: rotate(180deg); }
          75% { transform: rotate(270deg); }
          100% { transform: rotate(360deg); }
        }

        .register-link {
          text-align: center;
          font-size: 0.9rem;
          color: #7b8cde;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          margin-top: 1rem;
        }

        .register-link-text {
          font-weight: 700;
          color: #00d9ff;
          text-decoration: none;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .register-link-text:hover {
          color: #7df9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 2rem 1rem;
          }

          .form-card {
            padding: 1.5rem;
            border-width: 3px;
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          }

          .form-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
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

        /* Pixel-perfect icons */
        .input-icon {
          image-rendering: pixelated;
        }

        /* Glow on focus/hover */
        .input-field:focus + .input-icon,
        .register-link-text:hover,
        .forgot-password:hover {
          animation: elementGlow 1.5s ease-in-out infinite;
        }

        @keyframes elementGlow {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor); }
          50% { filter: drop-shadow(0 0 15px currentColor); }
        }

        /* Focus states */
        .input-field:focus,
        select:focus {
          outline: 3px solid #00d9ff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default Login;