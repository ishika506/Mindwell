import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // clean modern icons

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Define consistent color palette
    // These colors are defined outside the component for Tailwind clarity
    const bgPrimary = "bg-[#0A1517]"; // Deep dark color for mobile dropdown
    const bgBlur = "backdrop-blur-lg bg-[#0A1517]/90"; // Sticky nav background
    const border = "border-[#2A474A]"; // Border color
    const logoColor = "text-[#B6F2DD]"; // Logo highlight color
    const linkColor = "text-gray-300"; // Link text color
    const linkHoverColor = "hover:text-teal-300"; // Link hover effect
    const buttonBg = "bg-teal-700/30"; // Button background
    const buttonText = "text-teal-300"; // Button text color
    const buttonHover = "hover:bg-teal-600/50 hover:border-teal-400"; // Button hover effect

    const handleLinkClick = () => {
        // Closes the mobile menu when a link is clicked
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`${bgBlur} ${border} border-b px-6 md:px-12 py-4 z-50 sticky top-0 transition-shadow duration-300 shadow-xl`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo (App Name) */}
                <div className="flex items-center">
                    <Link 
                        to="/" 
                        className={`text-3xl font-extrabold tracking-wide ${logoColor} transition flex items-center`}
                    >
                        🧠 <span className="ml-2">Mindwell</span>
                    </Link>
                </div>

                {/* Desktop Links */}
                <ul className="hidden md:flex items-center space-x-8">
                    <li>
                        <Link
                            to="/"
                            className={`text-lg ${linkColor} ${linkHoverColor} transition font-medium tracking-wider`}
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/howitworks"
                            className={`text-lg ${linkColor} ${linkHoverColor} transition font-medium tracking-wider`}
                        >
                            How It Works
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/signin"
                            className={`px-6 py-2 rounded-full ${buttonBg} ${buttonText} font-semibold border border-teal-500/20 ${buttonHover} transition-all shadow-md text-lg uppercase tracking-widest`}
                        >
                            Sign In
                        </Link>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`text-white text-3xl p-1 rounded-md ${linkHoverColor} transition`}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu (Conditionally rendered dropdown) */}
            {isMobileMenuOpen && (
                <div className={`md:hidden mt-4 ${bgPrimary} rounded-lg p-5 ${border} border shadow-2xl space-y-4`}>
                    <Link
                        to="/"
                        className={`block ${linkColor} ${linkHoverColor} transition font-medium text-xl py-2 border-b border-[#2A474A]`}
                        onClick={handleLinkClick}
                    >
                        Home
                    </Link>

                    <Link
                        to="/howitworks"
                        className={`block ${linkColor} ${linkHoverColor} transition font-medium text-xl py-2 border-b border-[#2A474A]`}
                        onClick={handleLinkClick}
                    >
                        How It Works
                    </Link>

                    <Link
                        to="/signin"
                        className={`block px-5 py-3 mt-4 rounded-xl ${buttonBg} ${buttonText} font-semibold border border-teal-500/20 ${buttonHover} transition-all text-xl text-center uppercase tracking-wider`}
                        onClick={handleLinkClick}
                    >
                        Sign In
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;