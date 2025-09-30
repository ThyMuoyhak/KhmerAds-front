import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const Hero = () => {
    const [stats, setStats] = useState({
        totalListings: '0',
        totalUsers: '0',
        satisfaction: '99%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all listings
                const listingsResponse = await apiClient.get('/listings/');
                const totalListings = listingsResponse.data.length;

                // Format numbers
                const formatNumber = (num) => {
                    if (num >= 1000) {
                        return (num / 1000).toFixed(1) + 'K+';
                    }
                    return num.toString();
                };

                setStats({
                    totalListings: formatNumber(totalListings),
                    totalUsers: formatNumber(Math.floor(totalListings / 2)), // Estimate
                    satisfaction: '99%'
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                // Keep default values on error
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const displayStats = [
        { number: loading ? '...' : stats.totalListings, label: 'ការផ្សាយសរុប' },
        { number: loading ? '...' : stats.totalUsers, label: 'អ្នកប្រើប្រាស់' },
        { number: stats.satisfaction, label: 'អត្រាពេញចិត្ត' }
    ];

    const images = {
        phone: 'https://cdn-icons-png.flaticon.com/512/0/191.png',
        computer: 'https://cdn-icons-png.flaticon.com/512/747/747310.png',
        car: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
        house: 'https://cdn-icons-png.flaticon.com/512/619/619032.png',
        target: 'https://cdn-icons-png.flaticon.com/512/1674/1674885.png',
        fire: 'https://cdn-icons-png.flaticon.com/512/599/599025.png',
        lightning: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png'
    };

    return (
        <div className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    {/* Text Content */}
                    <div className="hero-text">
                        <h1 className="hero-title">
                            ស្វាគមន៍មកកាន់{' '}
                            <span className="highlight">KhmerAds</span>
                        </h1>

                        <p className="hero-description">
                            វេទិកាលក់ទំនិញលើអ៊ីនធឺណិតដ៏ធំបំផុតសម្រាប់ខ្មែរ។
                            ស្វែងរក និងលក់ទំនិញដោយងាយស្រួល លឿន និងសុវត្ថិភាព។
                        </p>

                        {/* Action Buttons */}
                        <div className="hero-actions">
                            <Link to="/post-ad" className="btn btn-primary">
                                <PlusIcon />
                                បង្ហោះការផ្សាយឥឡូវនេះ
                            </Link>
                            <Link to="/products" className="btn btn-secondary">
                                <SearchIcon />
                                ស្វែងរកទំនិញ
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats">
                            {displayStats.map((stat, index) => (
                                <div key={index} className="stat">
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Card */}
                    <div className="hero-visual">
                        <div className="feature-card">
                            <div className="feature-grid">
                                {[
                                    { icon: images.phone, label: 'ទូរស័ព្ទ' },
                                    { icon: images.computer, label: 'កុំព្យូទ័រ' },
                                    { icon: images.car, label: 'ឡាន' },
                                    { icon: images.house, label: 'ផ្ទះ' }
                                ].map((item, index) => (
                                    <div key={index} className="feature-item">
                                        <div className="feature-icon">
                                            <img src={item.icon} alt={item.label} />
                                        </div>
                                        <div className="feature-label">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="feature-highlight">
                                <div className="highlight-icon">
                                    <img src={images.target} alt="Target" />
                                </div>
                                <div className="highlight-text">
                                    <h3>រកឃើញអ្វីដែលអ្នកត្រូវការ</h3>
                                    <p>រាប់ពាន់នាក់កំពុងរកទំនិញនៅលើ KhmerAds</p>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="badge popular">
                            <img src={images.fire} alt="Fire" className="badge-icon" />
                            ពេញនិយម
                        </div>
                        <div className="badge fast">
                            <img src={images.lightning} alt="Lightning" className="badge-icon" />
                            លឿនជាងគេ
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hero {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 3rem 1rem;
                    position: relative;
                    overflow: hidden;
                }

                .hero-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .hero-content {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    align-items: center;
                }

                .hero-text {
                    text-align: center;
                    max-width: 600px;
                }

                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 1.5rem;
                }

                .highlight {
                    color: #fbbf24;
                    background: linear-gradient(45deg, #fbbf24, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: 1.125rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                }

                .hero-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 3rem;
                }

                .btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .btn-primary {
                    background: #fbbf24;
                    color: #1f2937;
                }

                .btn-primary:hover {
                    background: #f59e0b;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(251, 191, 36, 0.3);
                }

                .btn-secondary {
                    background: transparent;
                    color: white;
                    border-color: white;
                }

                .btn-secondary:hover {
                    background: white;
                    color: #667eea;
                    transform: translateY(-2px);
                }

                .hero-stats {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .stat {
                    text-align: center;
                }

                .stat-number {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #fbbf24;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .hero-visual {
                    position: relative;
                    max-width: 400px;
                    width: 100%;
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .feature-item {
                    text-align: center;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    transition: transform 0.3s ease;
                }

                .feature-item:hover {
                    transform: translateY(-4px);
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .feature-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                }

                .feature-label {
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .feature-highlight {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(251, 191, 36, 0.1);
                    border-radius: 12px;
                    border: 1px solid rgba(251, 191, 36, 0.3);
                }

                .highlight-icon {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                }

                .highlight-icon img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .highlight-text h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .highlight-text p {
                    font-size: 0.8rem;
                    opacity: 0.8;
                    margin: 0;
                }

                .badge {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    background: rgba(255, 255, 255, 0.9);
                    color: #1f2937;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .badge-icon {
                    width: 16px;
                    height: 16px;
                }

                .popular {
                    top: -10px;
                    right: -10px;
                    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                    color: white;
                }

                .fast {
                    bottom: -10px;
                    left: -10px;
                    background: linear-gradient(45deg, #74b9ff, #0984e3);
                    color: white;
                }

                @media (min-width: 768px) {
                    .hero {
                        padding: 5rem 2rem;
                    }

                    .hero-content {
                        flex-direction: row;
                        justify-content: space-between;
                        text-align: left;
                    }

                    .hero-text {
                        text-align: left;
                        flex: 1;
                        max-width: 500px;
                    }

                    .hero-title {
                        font-size: 3rem;
                    }

                    .hero-actions {
                        justify-content: flex-start;
                    }

                    .hero-visual {
                        flex: 0 0 400px;
                    }
                }

                @media (min-width: 1024px) {
                    .hero-title {
                        font-size: 3.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-actions {
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        max-width: 300px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .hero-stats {
                        gap: 1.5rem;
                    }

                    .stat-number {
                        font-size: 1.5rem;
                    }

                    .feature-icon {
                        width: 40px;
                        height: 40px;
                    }

                    .badge {
                        font-size: 0.7rem;
                        padding: 0.4rem 0.8rem;
                    }
                }
            `}</style>
        </div>
    );
};

const PlusIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default Hero;