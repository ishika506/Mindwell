import React from "react";
import { Link } from "react-router-dom";
import { 
    IoLogoTwitter, 
    IoLogoInstagram, 
    IoLeafOutline, // Logo icon
    IoHeartOutline, // Alternative Logo icon
} from "react-icons/io5";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // --- Theme Constants ---
    const primaryBg = "bg-[#0A1517]"; // Deep dark color
    const highlightColor = "text-teal-300"; // Primary accent
    const glowColor = "bg-teal-400/15"; // Adjusted glow
    const dividerColor = "bg-[#2A474A]";

    return (
        <footer className={`relative mt-28 ${primaryBg}`}>
            
            {/* Soft Ambient Glow (Refined) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1517] via-[#0A1517]/95 to-transparent pointer-events-none" />
            <div className={`absolute left-1/2 -translate-x-1/2 -top-24 w-[420px] h-[160px] ${glowColor} blur-[130px] rounded-full`} />

            <div className="relative max-w-6xl mx-auto px-6 py-16 flex flex-col items-center text-center">

                {/* BRAND */}
                <h2 className={`text-4xl font-extrabold tracking-tight text-white flex items-center gap-2`}>
                    <IoLeafOutline className={highlightColor.replace('text-', 'text-')} size={30} />
                    Mindwell
                </h2>
                <p className="text-gray-400 max-w-sm mt-3 text-sm leading-relaxed">
                    A serene space for emotional clarity, reflection, and inner growth.
                </p>

                {/* NAV LINKS */}
                <div className="flex space-x-8 mt-10 text-gray-400 text-base font-medium">
                    <Link
                        to="/"
                        onClick={scrollToTop}
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        Home
                    </Link>

                    <Link
                        to="/about"
                        onClick={scrollToTop}
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        About Us
                    </Link>

                    <Link
                        to="/howitworks"
                        onClick={scrollToTop}
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        How It Works
                    </Link>
                    
                    <Link
                        to="/policy"
                        onClick={scrollToTop}
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        Privacy Policy
                    </Link>
                </div>

                {/* SOCIAL ICONS (Standardized to React Icons) */}
                <div className="flex space-x-6 mt-10 text-2xl text-gray-500">
                    <a
                        href="#"
                        aria-label="Twitter"
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        <IoLogoTwitter />
                    </a>

                    <a
                        href="#"
                        aria-label="Instagram"
                        className={`hover:${highlightColor} transition-colors`}
                    >
                        <IoLogoInstagram />
                    </a>
                </div>

                {/* DIVIDER */}
                <div className={`w-full h-px ${dividerColor} mt-12`} />

                {/* COPYRIGHT */}
                <p className="text-gray-600 text-xs mt-6 tracking-wide">
                    © {new Date().getFullYear()} Mindwell. All rights reserved. | Built for lasting well-being.
                </p>
            </div>
        </footer>
    );
};

export default Footer;