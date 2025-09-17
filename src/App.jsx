import React from 'react';
  import { Routes, Route } from 'react-router-dom';
  import Navbar from './components/Navbar';
  import Footer from './components/Footer';
  import Home from './pages/Home';
  import Login from './pages/Login';
  import Register from './pages/Register';
  import PostAd from './pages/PostAd';
  import MyListings from './components/MyListings';
  import ListingDetails from './pages/ListingDetails';
  import ProtectedRoute from './components/ProtectedRoute';
  import EditListing from './components/EditListing';
  import Listings from './pages/Listings';

  function App() {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            
          </Routes>
        </div>
        <Footer />
      </div>
    );
  }

  export default App;