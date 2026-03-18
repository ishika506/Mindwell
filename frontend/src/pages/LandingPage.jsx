import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1b1d] to-[#071012] text-white flex flex-col">
      {/* Navbar/Header */}
      <Navbar />

      {/* Main Hero/Header Section */}
      <Header />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
