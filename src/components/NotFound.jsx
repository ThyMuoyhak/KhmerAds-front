import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <svg
          className="not-found-icon"
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
        <h1 className="not-found-title">ទំព័រមិនត្រូវបានរកឃើញ</h1>
        <h2 className="not-found-subtitle">404 - Page Not Found</h2>
        <p className="not-found-text">
          សូមអភ័យទោស ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ។ សូមត្រលប់ទៅទំព័រដើម ឬស្វែងរកផលិតផលផ្សេងទៀត។
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <svg
              className="btn-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>ត្រលប់ទៅទំព័រដើម</span>
          </Link>
          <Link to="/products" className="btn btn-outline">
            <svg
              className="btn-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>ស្វែងរកផលិតផល</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .not-found-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', 'Khmer', sans-serif;
          background: #0a0e27;
        }

        .not-found-content {
          text-align: center;
          color: #7b8cde;
          padding: 2rem;
        }

        .not-found-icon {
          width: 64px;
          height: 64px;
          margin-bottom: 1.5rem;
          color: #00d9ff;
          filter: drop-shadow(2px 2px 0 #533483);
        }

        .not-found-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #00d9ff;
          text-shadow: 3px 3px 0 #533483;
          margin-bottom: 0.5rem;
        }

        .not-found-subtitle {
          font-size: 1.2rem;
          font-weight: 600;
          color: #e94560;
          margin-bottom: 1rem;
        }

        .not-found-text {
          font-size: 1rem;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .not-found-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 3px solid;
          border-radius: 0;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
        }

        .btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }

        .btn-primary {
          background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
          color: white;
          border-color: #a32035;
        }

        .btn-primary:hover {
          background: linear-gradient(180deg, #ff5470 0%, #e94560 100%);
          border-color: #c72c41;
          transform: translate(-2px, -2px);
        }

        .btn-outline {
          background: transparent;
          color: #00d9ff;
          border-color: #00d9ff;
        }

        .btn-outline:hover {
          background: rgba(0, 217, 255, 0.1);
          color: #7df9ff;
          border-color: #7df9ff;
          transform: translate(-2px, -2px);
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 768px) {
          .not-found-container {
            min-height: calc(100vh - 160px);
            padding-bottom: 80px;
          }

          .not-found-title {
            font-size: 1.5rem;
          }

          .not-found-subtitle {
            font-size: 1rem;
          }

          .not-found-text {
            font-size: 0.9rem;
          }

          .not-found-icon {
            width: 48px;
            height: 48px;
          }
        }

        @keyframes pixelGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor);
          }
        }

        .btn:hover .btn-icon {
          animation: pixelGlow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;