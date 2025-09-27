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
    <div className=" py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Effects */}
 
      

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <h1
          className="text-4xl sm:text-5xl font-black text-center mb-10 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 bg-clip-text text-transparent animate-fade-in"
          style={{ fontFamily: "'Kantumruy', sans-serif" }}
        >
          ប្រភេទសេវាកម្ម
        </h1>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              to={category.path}
              key={category.name}
              className="group relative flex flex-col items-center justify-center bg-black/30 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-8 text-center text-gray-300 hover:text-white transition-all duration-500 overflow-hidden shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-2"
              style={{ fontFamily: "'Kantumruy', sans-serif", minHeight: '180px' }}
            >
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Category Icon */}
              <span className="text-5xl mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 transform group-hover:scale-110">
                {category.icon}
              </span>
              
              {/* Category Name */}
              <span className="text-lg font-semibold line-clamp-2 group-hover:text-cyan-300">
                {category.nameKhmer}
              </span>
              
              {/* Decorative Dot */}
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;