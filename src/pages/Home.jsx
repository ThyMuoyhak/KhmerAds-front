import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import ListingCard from '../components/ListingCard';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import './Home.css';

const Home = () => {
  
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { 
        name: '', 
        khName: 'មើលទាំងអស់', 
        icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png' 
    },
    { 
        name: 'Cars and Vehicles', 
        khName: 'ឡាននិងយានជំនិះ', 
        icon: 'https://cdn-icons-png.flaticon.com/512/744/744465.png' 
    },
    { 
        name: 'Phones & Tablets', 
        khName: 'ទូរស័ព្ទនិងថេប្លេត', 
        icon: 'https://cdn-icons-png.flaticon.com/512/0/191.png' 
    },
    { 
        name: 'Computers & Accessories', 
        khName: 'កុំព្យូទ័រនិងគ្រឿងបន្លាស់', 
        icon: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' 
    },
    { 
        name: 'Electronics & Appliances', 
        khName: 'អេឡិចត្រូនិចនិងឧបករណ៍', 
        icon: 'https://cdn-icons-png.flaticon.com/512/3242/3242257.png' 
    },
    { 
        name: 'House & Land', 
        khName: 'ផ្ទះនិងដី', 
        icon: 'https://cdn-icons-png.flaticon.com/512/619/619032.png' 
    },
    { 
        name: 'Jobs', 
        khName: 'ការងារ', 
        icon: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png' 
    },
    { 
        name: 'Services', 
        khName: 'សេវាកម្ម', 
        icon: 'https://cdn-icons-png.flaticon.com/512/3242/3242257.png' 
    },
    { 
        name: 'Fashion & Beauty', 
        khName: 'ម៉ូដនិងសម្ផស្ស', 
        icon: 'https://cdn-icons-png.flaticon.com/512/2116/2116899.png' 
    },
    { 
        name: 'Furniture & Decor', 
        khName: 'គ្រឿងសង្ហារិមនិងការតុបតែង', 
        icon: 'https://cdn-icons-png.flaticon.com/512/2374/2374888.png' 
    },
    { 
        name: 'Books, Sports & Hobbies', 
        khName: 'សៀវភៅ កីឡា និងចំណង់ចំណូលចិត្ត', 
        icon: 'https://cdn-icons-png.flaticon.com/512/857/857455.png' 
    },
    { 
        name: 'Pets', 
        khName: 'សត្វចិញ្ចឹម', 
        icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' 
    },
    { 
        name: 'Foods', 
        khName: 'អាហារ', 
        icon: 'https://cdn-icons-png.flaticon.com/512/878/878052.png' 
    },
    { 
        name: 'Electronics', 
        khName: 'អេឡិចត្រូនិច', 
        icon: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' 
    },
    { 
        name: 'Fashion', 
        khName: 'ម៉ូដ', 
        icon: 'https://cdn-icons-png.flaticon.com/512/235/235346.png' 
    },
    { 
        name: 'Home & Garden', 
        khName: 'ផ្ទះ និងសួន', 
        icon: 'https://cdn-icons-png.flaticon.com/512/2541/2541973.png' 
    },
    { 
        name: 'Vehicles', 
        khName: 'យានយន្ត', 
        icon: 'https://cdn-icons-png.flaticon.com/512/3079/3079035.png' 
    },
    { 
        name: 'Sports', 
        khName: 'កីឡា', 
        icon: 'https://cdn-icons-png.flaticon.com/512/857/857455.png' 
    },
    { 
        name: 'Hobbies', 
        khName: 'ចំណង់ចំណូលចិត្ត', 
        icon: 'https://cdn-icons-png.flaticon.com/512/2936/2936737.png' 
    },
    { 
        name: 'Other', 
        khName: 'ផ្សេងៗ', 
        icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png' 
    },
];
  const categoryMap = {
    'Cars and Vehicles': 'ឡាននិងយានជំនិះ',
    'Phones & Tablets': 'ទូរស័ព្ទនិងថេប្លេត',
    'Computers & Accessories': 'កុំព្យូទ័រនិងគ្រឿងបន្លាស់',
    'Electronics & Appliances': 'អេឡិចត្រូនិចនិងឧបករណ៍',
    'House & Land': 'ផ្ទះនិងដី',
    'Jobs': 'ការងារ',
    'Services': 'សេវាកម្ម',
    'Fashion & Beauty': 'ម៉ូដនិងសម្ផស្ស',
    'Furniture & Decor': 'គ្រឿងសង្ហារិមនិងការតុបតែង',
    'Books, Sports & Hobbies': 'សៀវភៅ កីឡា និងចំណង់ចំណូលចិត្ត',
    'Pets': 'សត្វចិញ្ចឹម',
    'Foods': 'អាហារ',
    'Electronics': 'អេឡិចត្រូនិច',
    'Fashion': 'ម៉ូដ',
    'Home & Garden': 'ផ្ទះ និងសួន',
    'Vehicles': 'យានយន្ត',
    'Sports': 'កីឡា',
    'Hobbies': 'ចំណង់ចំណូលចិត្ត',
    'Other': 'ផ្សេងៗ',
  };

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/listings/')
      .then((response) => {
        console.log('Listings fetched from /listings:', response.data);

        const validListings = response.data
          .filter((listing) => {
            if (!listing || !listing.id || typeof listing !== 'object') {
              console.warn('Invalid listing detected:', listing);
              return false;
            }
            return true;
          })
          .sort((a, b) => b.id - a.id);

        validListings.forEach((listing) => {
          console.log(`Listing ${listing.id} image data:`, {
            images: listing.images,
            image_url: listing.image_url,
            image: listing.image,
          });
        });

        setListings(validListings);
        setFilteredListings(validListings);
        setError(null);
      })
      .catch((error) => {
        console.error('កំហុសក្នុងការទាញយកការផ្សាយ:', error);
        setError('បរាជ័យក្នុងការទាញយកការផ្សាយ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត ឬទាក់ទងអ្នកគ្រប់គ្រង។');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = listings.filter((listing) => listing.category === selectedCategory);
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [selectedCategory, listings]);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  if (loading) {
    return (
      <div className="home-container home-loading">
        <div className="home-content-wrapper">
          <h1 className="home-title">ការផ្សាយពិសេស</h1>
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="loading-card">
                <div className="loading-image" />
                <div className="loading-title" />
                <div className="loading-subtitle" />
                <div className="loading-footer">
                  <div className="loading-price" />
                  <div className="loading-button" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <div className="home-container">
        <div className="home-content-wrapper">
          <div className="category-section">
            <h2 className="section-title">ប្រភេទការផ្សាយ</h2>
            <div className="category-grid">
              {categories.map((category) => (
                <button
    key={category.name}
    onClick={() => handleCategoryClick(category.name)}
    className={`category-button ${selectedCategory === category.name ? 'category-button--selected' : ''}`}
>
    <div className="category-icon">
        <img src={category.icon} alt={category.khName} />
    </div>
    <span className="category-name">{category.khName}</span>
</button>
              ))}
            </div>
            <div className="all-categories-container">
              <button
                onClick={() => setSelectedCategory('')}
                className={`all-categories-button ${selectedCategory === '' ? 'all-categories-button--selected' : ''}`}
              >
                ប្រភេទទាំងអស់
              </button>
            </div>
          </div>

          <div className="listings-section">
            <div className="listings-header">
              <h1 className="listings-title">
                {selectedCategory
                  ? `${
                      categories.find((cat) => cat.name === selectedCategory)?.khName || selectedCategory
                    } (${filteredListings.length})`
                  : 'ការផ្សាយពិសេស'}
              </h1>
              <div className="listings-controls">
                <span className="listing-count">
                  {filteredListings.length} {filteredListings.length === 1 ? 'ទំនិញ' : 'ទំនិញ'}
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">គ្រប់ប្រភេទ</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.khName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="error-alert" role="alert">
                <strong className="error-strong">កំហុស:</strong>
                <span className="error-message">{error}</span>
              </div>
            )}

            {filteredListings.length > 0 ? (
              <div className="listings-grid">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="listing-card-wrapper">
                    <ListingCard
                      listing={listing}
                      onUpdate={null}
                      onDelete={null}
                      isDeleting={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-listings-message">
                <svg
                  className="no-listings-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="no-listings-title">គ្មានការផ្សាយ</h3>
                <p className="no-listings-text">
                  {selectedCategory
                    ? `មិនមានការផ្សាយសម្រាប់ប្រភេទ "${
                        categories.find((cat) => cat.name === selectedCategory)?.khName || selectedCategory
                      }"`
                    : 'ពិនិត្យម្តងទៀតនៅពេលក្រោយសម្រាប់ទំនិញថ្មី។'}
                </p>
                <Link to="/post-ad" className="post-ad-button">
                  <svg
                    className="post-ad-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  បង្ហោះការផ្សាយថ្មី
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;