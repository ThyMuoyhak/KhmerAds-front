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
    }
  };

  const handleSubmit = (e) => {
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
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('username', username);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('phonenumber', phonenumber);
    formData.append('address', address);
    if (profilePicture) formData.append('profile_picture', profilePicture);
    if (coverBanner) formData.append('cover_banner', coverBanner);
    formData.append('bio', bio);

    apiClient.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        setIsLoading(false);
        navigate('/login');
      })
      .catch(error => {
        setIsLoading(false);
        console.error('ការចុះឈ្មោះបរាជ័យ:', error.response || error);
        setError(error.response?.data?.detail || 'ការចុះឈ្មោះបរាជ័យ។ សូមព្យាយាមម្តងទៀត។');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Kantumruy', sans-serif" }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-900">ចុះឈ្មោះ</h2>
          <p className="mt-2 text-sm text-gray-600">សូមបំពេញព័ត៌មានដើម្បីបង្កើតគណនីថ្មី</p>
        </div>
        <form className="mt-8 space-y-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div><label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះដំបូង</label><input id="firstname" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="បញ្ចូលឈ្មោះដំបូង" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">នាមខ្លួន</label><input id="lastname" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="បញ្ចូលនាមខ្លួន" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះអ្នកប្រើប្រាស់</label><input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">ភេទ</label><select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" required><option value="">ជ្រើសរើសភេទ</option><option value="male">ប្រុស</option><option value="female">ស្រី</option><option value="other">ផ្សេងៗ</option></select></div>
          <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">អ៊ីមែល</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែល" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">ពាក្យសម្ងាត់</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="បញ្ចូលពាក្យសម្ងាត់" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label><input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត" required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700 mb-1">លេខទូរស័ព្ទ</label><input id="phonenumber" type="text" value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} placeholder="បញ្ចូលលេខទូរស័ព្ទ (ឧ. +85512345678)" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">អាសយដ្ឋាន</label><input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="បញ្ចូលអាសយដ្ឋាន" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /></div>
          <div><label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">រូបភាព profile</label><input id="profilePicture" type="file" accept="image/jpeg,image/png" onChange={(e) => handleImageChange(e, 'profile')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /><br/>{previewProfile && <div className="mt-2"><img src={previewProfile} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full mt-2" /></div>}</div>
          <div><label htmlFor="coverBanner" className="block text-sm font-medium text-gray-700 mb-1">រូបភាពផ្ទាំង</label><input id="coverBanner" type="file" accept="image/jpeg,image/png" onChange={(e) => handleImageChange(e, 'cover')} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" /><br/>{previewCover && <div className="mt-2"><img src={previewCover} alt="Cover Preview" className="w-full h-24 object-cover rounded-lg mt-2" /></div>}</div>
          <div><label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">ព័ត៌មានបន្ថែម</label><textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="បញ្ចូលព័ត៌មានបន្ថែមអំពីអ្នក" className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300" rows="3" /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">{isLoading ? <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>កំពុងចុះឈ្មោះ...</span></> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg><span>ចុះឈ្មោះ</span></>}</button>
          <div className="text-center"><p className="text-sm text-gray-600">មានគណនីរួចហើយ? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">ចូលទៅក្នុងគណនី</Link></p></div>
        </form>
      </div>
    </div>
  );
};

export default Register;