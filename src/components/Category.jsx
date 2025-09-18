import React from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  const categories = [
    { name: 'Cars and Vehicles', nameKhmer: 'ឡាននិងយានជំនិះ', icon: '🚗', path: '/category/cars' },
    { name: 'Phones & Tablets', nameKhmer: 'ទូរស័ព្ទនិងថេប្លេត', icon: '📱', path: '/category/phones' },
    { name: 'Computers & Accessories', nameKhmer: 'កុំព្យូទ័រនិងគ្រឿងបន្លាស់', icon: '💻', path: '/category/computers' },
    { name: 'Electronics & Appliances', nameKhmer: 'អេឡិចត្រូនិចនិងឧបករណ៍', icon: '📺', path: '/category/electronics' },
    { name: 'House & Land', nameKhmer: 'ផ្ទះនិងដី', icon: '🏡', path: '/category/house' },
    { name: 'Jobs', nameKhmer: 'ការងារ', icon: '💼', path: '/category/jobs' },
    { name: 'Services', nameKhmer: 'សេវាកម្ម', icon: '🤝', path: '/category/services' },
    { name: 'Fashion & Beauty', nameKhmer: 'ម៉ូដនិងសម្ផស្ស', icon: '👗', path: '/category/fashion' },
    { name: 'Furniture & Decor', nameKhmer: 'គ្រឿងសង្ហារិមនិងការតុបតែង', icon: '🪑', path: '/category/furniture' },
    { name: 'Books, Sports & Hobbies', nameKhmer: 'សៀវភៅ កីឡា និងចំណង់ចំណូលចិត្ត', icon: '📚', path: '/category/books' },
    { name: 'Pets', nameKhmer: 'សត្វចិញ្ចឹម', icon: '🐶', path: '/category/pets' },
    { name: 'Foods', nameKhmer: 'អាហារ', icon: '🥦', path: '/category/foods' },
  ];

  return (
    <div><h1
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "'Kantumruy', sans-serif" }}
            >
              ប្រភេទសេវាកម្ម
            </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 bg-gray-50">
      {categories.map((category) => (
        <Link
          to={category.path}
          key={category.name}
          className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 text-center text-gray-800 hover:text-blue-700"
          style={{ fontFamily: "'Kantumruy', sans-serif", minHeight: '140px' }}
        >
          <span className="text-4xl mb-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">{category.icon}</span>
          <span className="text-base font-semibold text-gray-900 line-clamp-2">{category.nameKhmer}</span>
        </Link>
      ))}
    </div>
    </div>
  );
};

export default Category;