import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css'; // Import the dedicated CSS file

const Hero = () => {
    const stats = [
        { number: '10K+', label: 'ការផ្សាយសរុប' },
        { number: '5K+', label: 'អ្នកប្រើប្រាស់' },
        { number: '99%', label: 'អត្រាពេញចិត្ត' }
    ];

    return (
        <div className="hero">
            <div
                className="hero-background-overlay"
                style={{
                    background: 'linear-gradient(45deg, rgba(30, 64, 175, 0.7) 0%, rgba(59, 130, 246, 0.6) 100%)',
                }}
            />

            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            ស្វាគមន៍មកកាន់{' '}
                            <span className="hero-title-highlight">
                                KhmerAds
                            </span>
                        </h1>

                        <p className="hero-subtitle">
                            វេទិកាលក់ទំនិញលើអ៊ីនធឺណិតដ៏ធំគ្រប់គ្រាន់សម្រាប់ខ្មែរ។
                            ស្វែងរក និងលក់ទំនិញដោយងាយស្រួល លឿន និងសុវត្ថិភាព។
                        </p>

                        <div className="hero-buttons">
                            <Link
                                to="/post-ad"
                                className="button button-primary"
                            >
                                <svg
                                    className="button-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                បង្ហោះការផ្សាយឥឡូវនេះ
                            </Link>

                            <Link
                                to="/products"
                                className="button button-secondary"
                            >
                                <svg
                                    className="button-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                ស្វែងរកទំនិញ
                            </Link>
                        </div>

                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="hero-stat-item">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-image-wrapper">
                        <div className="glass-card">
                            <div className="glass-card-grid">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="grid-item">
                                        <div className="grid-icon">
                                            {['📱', '💻', '🚗', '🏠'][item - 1]}
                                        </div>
                                        <div className="grid-label">
                                            {['ទូរស័ព្ទ', 'កុំព្យូទ័រ', 'ឡាន', 'ផ្ទះ'][item - 1]}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-card-footer">
                                <div className="footer-icon">
                                    🎯
                                </div>
                                <h3 className="footer-title">
                                    រកឃើញអ្វីដែលអ្នកត្រូវការ
                                </h3>
                                <p className="footer-subtitle">
                                    រាប់ពាន់នាក់កំពុងរកទំនិញនៅលើ Khmer365
                                </p>
                            </div>
                        </div>

                        <div className="floating-badge badge-top-right">
                            🔥 ពេញនិយម
                        </div>

                        <div className="floating-badge badge-bottom-left">
                            ⚡ លឿនជាងគេ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;