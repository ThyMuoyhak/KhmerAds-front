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
                /* Pixel Art Hero Section Styles */
.hero {
    background: linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1a2e 100%);
    color: white;
    padding: 3rem 1rem;
    position: relative;
    overflow: hidden;
    border-bottom: 4px solid #533483;
    font-family: 'Press Start 2P', 'Inter', 'Khmer', monospace;
}

/* Animated pixel background pattern */
.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(83, 52, 131, 0.1) 2px,
            rgba(83, 52, 131, 0.1) 4px
        ),
        repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(83, 52, 131, 0.1) 2px,
            rgba(83, 52, 131, 0.1) 4px
        );
    pointer-events: none;
    opacity: 0.5;
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
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
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    text-shadow: 4px 4px 0 #533483, 8px 8px 0 rgba(0, 0, 0, 0.3);
    animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
    0%, 100% {
        text-shadow: 4px 4px 0 #533483, 8px 8px 0 rgba(0, 0, 0, 0.3);
    }
    50% {
        text-shadow: 4px 4px 0 #533483, 8px 8px 0 rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 217, 255, 0.5);
    }
}

.highlight {
    color: #00d9ff;
    text-shadow: 
        3px 3px 0 #e94560,
        6px 6px 0 rgba(0, 0, 0, 0.3),
        0 0 20px rgba(0, 217, 255, 0.6);
    animation: highlightPulse 2s ease-in-out infinite;
}

@keyframes highlightPulse {
    0%, 100% {
        color: #00d9ff;
    }
    50% {
        color: #7df9ff;
    }
}

.hero-description {
    font-size: 0.85rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    opacity: 0.9;
    font-family: 'Inter', 'Khmer', sans-serif;
    color: #7b8cde;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
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
    padding: 1rem 1.5rem;
    border-radius: 0;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.1s ease;
    border: 3px solid;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 1px;
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.btn:hover::before {
    left: 100%;
}

.btn:active {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.4);
}

.btn-primary {
    background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
    color: white;
    border-color: #a32035;
}

.btn-primary:hover {
    background: linear-gradient(180deg, #ff5470 0%, #e94560 100%);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(233, 69, 96, 0.6);
}

.btn-secondary {
    background: transparent;
    color: #00d9ff;
    border-color: #00d9ff;
}

.btn-secondary:hover {
    background: rgba(0, 217, 255, 0.1);
    color: #7df9ff;
    border-color: #7df9ff;
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.6);
}

.btn svg {
    width: 18px;
    height: 18px;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.stat {
    text-align: center;
    padding: 1rem;
    background: rgba(15, 52, 96, 0.4);
    border: 3px solid #533483;
    border-radius: 0;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
    min-width: 100px;
    transition: all 0.2s;
}

.stat:hover {
    transform: translateY(-4px);
    box-shadow: 4px 8px 0 rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 217, 255, 0.3);
    border-color: #00d9ff;
}

.stat-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #00d9ff;
    margin-bottom: 0.5rem;
    text-shadow: 3px 3px 0 #533483, 0 0 10px rgba(0, 217, 255, 0.5);
    font-family: 'Press Start 2P', monospace;
}

.stat-label {
    font-size: 0.65rem;
    opacity: 0.8;
    color: #7b8cde;
    font-family: 'Inter', 'Khmer', sans-serif;
}

.hero-visual {
    position: relative;
    max-width: 400px;
    width: 100%;
    animation: floatVisual 6s ease-in-out infinite;
}

@keyframes floatVisual {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.feature-card {
    background: linear-gradient(135deg, rgba(15, 52, 96, 0.6) 0%, rgba(26, 26, 46, 0.6) 100%);
    backdrop-filter: blur(10px);
    border: 4px solid #533483;
    border-radius: 0;
    padding: 1.5rem;
    box-shadow: 
        8px 8px 0 rgba(0, 0, 0, 0.4),
        inset 0 0 20px rgba(0, 217, 255, 0.1);
    position: relative;
}

.feature-card::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, #00d9ff, #e94560, #533483, #00d9ff);
    background-size: 300% 300%;
    animation: borderGlow 4s linear infinite;
    z-index: -1;
    opacity: 0.3;
}

@keyframes borderGlow {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
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
    background: rgba(15, 52, 96, 0.5);
    border: 2px solid #533483;
    border-radius: 0;
    transition: all 0.2s;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

.feature-item:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 217, 255, 0.4);
    border-color: #00d9ff;
}

.feature-item:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.feature-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.6));
}

.feature-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
    image-rendering: pixelated;
}

.feature-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #00d9ff;
    font-family: 'Inter', 'Khmer', sans-serif;
}

.feature-highlight {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(83, 52, 131, 0.2) 100%);
    border-radius: 0;
    border: 3px solid #e94560;
    box-shadow: inset 0 0 20px rgba(233, 69, 96, 0.2);
    animation: highlightPulseBox 2s ease-in-out infinite;
}

@keyframes highlightPulseBox {
    0%, 100% {
        box-shadow: inset 0 0 20px rgba(233, 69, 96, 0.2), 0 0 10px rgba(233, 69, 96, 0.3);
    }
    50% {
        box-shadow: inset 0 0 30px rgba(233, 69, 96, 0.3), 0 0 20px rgba(233, 69, 96, 0.5);
    }
}

.highlight-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    filter: drop-shadow(0 0 10px #e94560);
}

.highlight-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
}

.highlight-text h3 {
    font-size: 0.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #00d9ff;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

.highlight-text p {
    font-size: 0.65rem;
    opacity: 0.9;
    margin: 0;
    color: #7b8cde;
    font-family: 'Inter', 'Khmer', sans-serif;
}

.badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    border-radius: 0;
    font-size: 0.65rem;
    font-weight: 700;
    border: 3px solid;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.4);
    text-transform: uppercase;
    letter-spacing: 1px;
    animation: badgeBounce 2s ease-in-out infinite;
}

@keyframes badgeBounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

.badge-icon {
    width: 18px;
    height: 18px;
    filter: drop-shadow(0 0 5px currentColor);
    image-rendering: pixelated;
}

.popular {
    top: -15px;
    right: -15px;
    background: linear-gradient(180deg, #e94560 0%, #c72c41 100%);
    color: white;
    border-color: #a32035;
}

.popular:hover {
    animation: badgeBounce 0.5s ease-in-out infinite;
}

.fast {
    bottom: -15px;
    left: -15px;
    background: linear-gradient(180deg, #00d9ff 0%, #0099cc 100%);
    color: #0a0e27;
    border-color: #006699;
}

.fast:hover {
    animation: badgeBounce 0.5s ease-in-out infinite;
}

/* Floating particles effect */
@keyframes floatParticle {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
    }
}

/* Responsive Styles */
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
        font-size: 2.2rem;
    }

    .hero-actions {
        justify-content: flex-start;
    }

    .hero-visual {
        flex: 0 0 400px;
    }

    .hero-stats {
        justify-content: flex-start;
    }
}

@media (min-width: 1024px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-description {
        font-size: 0.9rem;
    }

    .btn {
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.4rem;
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
        gap: 1rem;
    }

    .stat {
        min-width: 80px;
        padding: 0.75rem;
    }

    .stat-number {
        font-size: 1.3rem;
    }

    .stat-label {
        font-size: 0.6rem;
    }

    .feature-icon {
        width: 40px;
        height: 40px;
    }

    .feature-label {
        font-size: 0.65rem;
    }

    .badge {
        font-size: 0.6rem;
        padding: 0.5rem 0.75rem;
    }

    .badge-icon {
        width: 14px;
        height: 14px;
    }

    .highlight-text h3 {
        font-size: 0.7rem;
    }

    .highlight-text p {
        font-size: 0.6rem;
    }
}

/* Pixel perfect rendering */
* {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
}

/* Remove pixel rendering from text */
.hero-description,
.stat-label,
.feature-label,
.highlight-text {
    image-rendering: auto;
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