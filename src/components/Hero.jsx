import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {   
    return (
      <div 
        className="min-h-[60vh] bg-cover bg-center bg-no-repeat text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
        style={{
          fontFamily: "'Kantumruy', sans-serif",
          backgroundImage: 'url("https://img.freepik.com/free-photo/excited-girl-looking-left-with-magnifying-glass-found-interesting-promo-investigating-searching-s_1258-164346.jpg?t=st=1758136300~exp=1758139900~hmac=7a338f6c0179ae1506753e3945563c24f4c8c106e9b51b41dfd41f1d0c0d881c&w=1480")',
          backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue overlay for better text readability
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div> {/* Dark overlay */}
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            សូមស្វាគមន៍មកកាន់ KhmerAds
          </h1>
          <p 
            className="text-xl sm:text-2xl mb-8 leading-relaxed"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            ទីផ្សារទិញលក់អនឡាញដ៏ងាយស្រួលបំផុតសម្រាប់ប្រជាជនខ្មែរ។ បង្ហោះការផ្សាយថ្មី ឬស្វែងរកទំនិញតាមតម្រូវការរបស់អ្នក។
          </p>
          <Link 
            to="/post-ad"
            className="bg-white text-blue-700 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 text-lg relative z-10"
            style={{ fontFamily: "'Kantumruy', sans-serif" }}
          >
            បង្ហោះការផ្សាយថ្មី
          </Link>
        </div>
      </div>
    );
}

export default Hero;