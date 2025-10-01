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
            
            <h2 style={{color:'white'
            }} className="form-title">ចុះឈ្មោះ</h2>
            <p style={{color:'white'}} className="form-subtitle">
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
          max-width: 768px;
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

        .header-icon {
          width: 3rem;
          height: 3rem;
          color: #00d9ff;
          margin: 0 auto 1rem;
          filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.5));
          image-rendering: pixelated;
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

        .input-field.textarea {
          padding: 0.75rem 1rem 0.75rem 3rem;
          resize: vertical;
        }

        .input-field.file-input {
          padding: 0.75rem 1rem;
          cursor: pointer;
        }

        .input-field.file-input::file-selector-button {
          background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
          color: #0a0e27;
          border: 3px solid #006699;
          border-radius: 0;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          font-family: 'Khmer', monospace;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-field.file-input::file-selector-button:hover {
          background: linear-gradient(180deg, #7df9ff 0%, #00d9ff 100%);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
          transform: translateY(-2px);
        }

        .image-preview {
          margin-top: 1rem;
          border: 3px solid #533483;
          border-radius: 0;
          object-fit: cover;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
          image-rendering: pixelated;
          transition: all 0.2s ease;
        }

        .image-preview:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
          border-color: #00d9ff;
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

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
          image-rendering: pixelated;
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

        .login-link {
          text-align: center;
          font-size: 0.9rem;
          color: #7b8cde;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          margin-top: 1rem;
        }

        .login-link-text {
          font-weight: 700;
          color: #00d9ff;
          text-decoration: none;
          transition: all 0.2s ease;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
          font-family: 'Khmer', monospace;
          letter-spacing: 0.5px;
        }

        .login-link-text:hover {
          color: #7df9ff;
          text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }

        @media (max-width: 640px) {
          .register-container {
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

        /* Pixel-perfect icons */
        .input-icon,
        .button-icon {
          image-rendering: pixelated;
        }

        /* Glow on focus/hover */
        .input-field:focus + .input-icon,
        .login-link-text:hover {
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

export default Register;