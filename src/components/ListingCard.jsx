import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing, onUpdate, onDelete, isDeleting }) => {
  // Category mapping in Khmer
  const categoryMap = {
    'electronics': 'អេឡិចត្រូនិច',
    'fashion': 'ម៉ូដ',
    'house': 'ផ្ទះ',
    'photography': 'ការថតរូប',
    'car': 'ឡាន',
    'Other': 'ផ្សេងៗ'
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
      style={{ fontFamily: "'Kantumruy', sans-serif" }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {listing.image_url ? (
          <img 
            src={`http://localhost:8000${listing.image_url}`} // Assumes backend serves images from this URL
            alt={listing.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('រូបភាពមិនអាចផ្ទុកឡើង:', listing.image_url);
              e.target.style.display = 'none';
              const fallback = e.target.parentNode.querySelector('.image-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Image */}
        <div 
          className="image-fallback w-full h-full bg-gray-100 flex items-center justify-center"
          style={{ display: listing.image_url ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-500">គ្មានរូបភាព</span>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white text-gray-700 rounded-md shadow-sm">
            {categoryMap[listing.category] || listing.category}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-white px-2 py-1 rounded-md shadow-sm">
            <span className="text-sm font-semibold text-gray-900">${listing.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {listing.title}
        </h3>
        
        {/* Description - Truncated to 3 lines */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {listing.description || 'គ្មានការពិពណ៌នា'}
        </p>
        
        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          {listing.telegram_link && (
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16l-1.58 7.44c-.12.532-.432.66-.876.41l-2.436-1.8-1.176 1.128c-.132.132-.24.24-.492.24l.168-2.388L15.12 9.28c.192-.168-.048-.264-.288-.096l-3.3 2.08-2.22-.696c-.48-.156-.492-.48.108-.708l8.688-3.348c.408-.156.756.096.636.708z"/>
                </svg>
              </div>
              <a 
                href={listing.telegram_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors truncate"
              >
                ទំនាក់ទំនងតាម Telegram
              </a>
            </div>
          )}
          
          {listing.email && (
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <a 
                href={`mailto:${listing.email}`} 
                className="text-sm text-gray-600 hover:text-green-600 transition-colors truncate"
              >
                {listing.email}
              </a>
            </div>
          )}
        </div>
        
        {/* CTA Button */}
        <Link 
          to={`/listing/${listing.id}`} 
          className="block w-full"
        >
          <div className="w-full bg-blue-700 text-white text-center py-2.5 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-medium text-sm">
            មើលព័ត៌មានបន្ថែម
          </div>
        </Link>

        {/* Edit and Delete Buttons */}
        {(onUpdate || onDelete) && (
          <div className="flex gap-2 mt-3">
            {onUpdate && (
              <button
                onClick={onUpdate}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-all duration-300 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                disabled={isDeleting}
              >
                កែសម្រួល
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-all duration-300 text-sm"
                style={{ fontFamily: "'Kantumruy', sans-serif" }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    កំពុងលុប...
                  </span>
                ) : (
                  'លុប'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;