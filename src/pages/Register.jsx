import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverBanner, setCoverBanner] = useState(null);
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('សូមជ្រើសរើសឯកសាររូបភាពប៉ុណ្ណោះ។');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('ទំហំរូបភាពមិនហួស ៥MB ទេ។');
        return;
      }
      if (type === 'profile') {
        setProfilePicture(file);
        setPreviewProfile(URL.createObjectURL(file));
      } else if (type === 'cover') {
        setCoverBanner(file);
        setPreviewCover(URL.createObjectURL(file));
      }
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់មិនត្រូវគ្នា');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('firstname', firstname.trim());
    formData.append('lastname', lastname.trim());
    formData.append('username', username.trim());
    formData.append('gender', gender);
    formData.append('email', email.trim());
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('phonenumber', phonenumber.trim());
    formData.append('address', address.trim());
    if (profilePicture) formData.append('profile_picture', profilePicture);
    if (coverBanner) formData.append('cover_banner', coverBanner);
    formData.append('bio', bio.trim());

    try {
      await apiClient.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsLoading(false);
      navigate('/login');
    } catch (error) {
      setIsLoading(false);
      console.error('ការចុះឈ្មោះបរាជ័យ:', error.response || error);
      let errorMsg = 'ការចុះឈ្មោះបរាជ័យ។ សូមព្យាយាមម្តងទៀត។';
      if (error.response?.status === 400 || error.response?.status === 422) {
        errorMsg = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => err.msg).join(', ')
          : error.response.data.detail || errorMsg;
      } else if (error.response?.status === 401) {
        errorMsg = 'សេសម្ភារៈមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។';
      }
      setError(errorMsg);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <h2 className="form-title">ចុះឈ្មោះ</h2>
            <p className="form-subtitle">
              បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតគណនីថ្មី
            </p>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-text">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-grid">
              {/* First Name */}
              <div className="input-group">
                <label htmlFor="firstname" className="input-label">
                  ឈ្មោះដំបូង *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    id="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="បញ្ចូលឈ្មោះដំបូង"
                    className="input-field"
                    required
                    aria-label="First Name"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="input-group">
                <label htmlFor="lastname" className="input-label">
                  នាមគ្រួសារ *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="បញ្ចូលនាមគ្រួសារ"
                    className="input-field"
                    required
                    aria-label="Last Name"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="input-group">
                <label htmlFor="username" className="input-label">
                  ឈ្មោះអ្នកប្រើប្រាស់ *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
                    className="input-field"
                    required
                    aria-label="Username"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="input-group">
                <label htmlFor="gender" className="input-label">
                  ភេទ *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-field"
                  required
                  aria-label="Gender"
                >
                  <option value="">ជ្រើសរើសភេទ</option>
                  <option value="male">ប្រុស</option>
                  <option value="female">ស្រី</option>
                  <option value="other">ផ្សេងៗ</option>
                </select>
              </div>

              {/* Email */}
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  អ៊ីមែល *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="input-field"
                    required
                    aria-label="Email"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="input-group">
                <label htmlFor="phonenumber" className="input-label">
                  លេខទូរស័ព្ទ
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <input
                    id="phonenumber"
                    type="text"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ (ឧ. +85512345678)"
                    className="input-field"
                    aria-label="Phone Number"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="input-group">
                <label htmlFor="address" className="input-label">
                  អាសយដ្ឋាន
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="បញ្ចូលអាសយដ្ឋានរបស់អ្នក"
                    className="input-field"
                    aria-label="Address"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              {/* Password */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  ពាក្យសម្ងាត់ *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m2-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-6 5a9 9 0 0112 0M3 12h2m14 0h2m-9-9v2m0 14v2"
                    />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ (យ៉ាងហោចណាស់ ៦ តួអក្សរ)"
                    className="input-field"
                    required
                    aria-label="Password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label htmlFor="confirmPassword" className="input-label">
                  បញ្ជាក់ពាក្យសម្ងាត់ *
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m2-4c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-6 5a9 9 0 0112 0M3 12h2m14 0h2m-9-9v2m0 14v2"
                    />
                  </svg>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                    className="input-field"
                    required
                    aria-label="Confirm Password"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="input-group">
                <label htmlFor="bio" className="input-label">
                  ព័ត៌មានបន្ថែម (ស្រេច)
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="បញ្ចូលព័ត៌មានបន្ថែមអំពីអ្នក..."
                  className="input-field textarea"
                  rows={3}
                  aria-label="Bio"
                />
              </div>

              {/* Profile Picture and Cover Banner */}
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="profilePicture" className="input-label">
                    រូបភាពផ្ទាល់ខ្លួន (ស្រេច)
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'profile')}
                    className="input-field file-input"
                    aria-label="Profile Picture"
                  />
                  {previewProfile && (
                    <img
                      src={previewProfile}
                      alt="Profile Preview"
                      className="image-preview profile"
                    />
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="coverBanner" className="input-label">
                    រូបផ្ទាំង (ស្រេច)
                  </label>
                  <input
                    id="coverBanner"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'cover')}
                    className="input-field file-input"
                    aria-label="Cover Banner"
                  />
                  {previewCover && (
                    <img
                      src={previewCover}
                      alt="Cover Preview"
                      className="image-preview cover"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              aria-label="Register"
            >
              {isLoading ? (
                <>
                  <svg className="spinner" fill="none" viewBox="0 0 24 24">
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
                  កំពុងចុះឈ្មោះ...
                </>
              ) : (
                <>
                  <svg
                    className="button-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  ចុះឈ្មោះ
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              <p>
                មានគណនីរួចហើយ?{' '}
                <Link to="/login" className="login-link-text">
                  ចូលទៅក្នុងគណនី
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .register-container {
          background: #f8fafc;
          min-height: 100vh;
          padding: 4rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Khmer', 'Arial', sans-serif;
        }

        .form-container {
          max-width: 768px;
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

        .header-icon {
          width: 3rem;
          height: 3rem;
          color: #2563eb;
          margin: 0 auto 1rem;
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
          gap: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-section {
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
          padding: 0.75rem 1rem;
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

        .input-field.textarea {
          padding: 0.75rem 1rem;
          resize: vertical;
        }

        .input-field.file-input {
          padding: 0.75rem 1rem;
        }

        .input-field.file-input::file-selector-button {
          background: #2563eb;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .input-field.file-input::file-selector-button:hover {
          background: #1d4ed8;
        }

        .image-preview {
          margin-top: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          object-fit: cover;
        }

        .image-preview.profile {
          width: 8rem;
          height: 8rem;
          border-radius: 50%;
        }

        .image-preview.cover {
          width: 100%;
          height: 8rem;
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

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
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

        .login-link {
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .login-link-text {
          font-weight: 500;
          color: #2563eb;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .login-link-text:hover {
          color: #1d4ed8;
        }

        @media (max-width: 640px) {
          .register-container {
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

          .form-grid {
            gap: 1rem;
          }

          .image-preview.profile {
            width: 6rem;
            height: 6rem;
          }

          .image-preview.cover {
            height: 6rem;
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

export default Register;