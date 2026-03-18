import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { IoLeafOutline } from "react-icons/io5";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- Theme Constants ---
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const inputBg = "bg-[#0A1517]";
    const inputBorder = "border-[#2A474A]";
    const focusRing = "focus:ring-teal-400";
    const highlightText = "text-teal-300";
    const buttonPrimary = "bg-teal-500 hover:bg-teal-400 text-[#0a1517]";
    const loadingColor = "border-teal-400"; // Teal for the spinner border

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axios.post("http://localhost:8800/api/auth/signin", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...res.data.user, token: res.data.token }, // Ensure token is in payload
            });

            navigate("/dashboard");
        } catch (err) {
            const msg = err.response?.data?.message || "Authentication failed. Check your credentials.";
            setError(msg);
            dispatch({ type: "LOGIN_FAILURE", payload: msg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen ${primaryBg} px-4`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`${cardBg} shadow-2xl rounded-3xl max-w-md w-full p-8 md:p-12 border border-[#2A474A]`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                    <h1 className={`text-4xl font-extrabold ${highlightText} flex items-center gap-2`}>
                        <IoLeafOutline className="text-teal-400" /> Mindwell
                    </h1>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-2">
                    Welcome Back!
                </h2>
                <p className="text-center text-gray-400 mb-8 text-base">
                    Sign in to continue your journey toward emotional clarity
                </p>

                {error && (
                    <div className="bg-red-800/50 text-red-300 p-3 mb-4 rounded-lg text-center text-sm font-medium border border-red-700/50">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="user@mindwell.app"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Email Address"
                            className={`w-full px-5 py-3 ${inputBorder} ${inputBg} rounded-xl focus:outline-none focus:ring-2 ${focusRing} text-gray-200 transition placeholder:text-gray-500`}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-semibold text-gray-300 mb-2" htmlFor="password">
                                Password
                            </label>
                            
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            aria-label="Password"
                            className={`w-full px-5 py-3 ${inputBorder} ${inputBg} rounded-xl focus:outline-none focus:ring-2 ${focusRing} text-gray-200 transition placeholder:text-gray-500`}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${buttonPrimary} font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] text-lg uppercase tracking-wider disabled:bg-gray-600 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                {/* Custom Teal Loading Spinner */}
                                <span className={`animate-spin h-5 w-5 border-t-2 border-b-2 ${loadingColor} rounded-full mr-3`}></span>
                                Signing In...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don’t have an account?{" "}
                    <Link
                        to="/signup"
                        className={`${highlightText} font-medium hover:underline`}
                    >
                        Create an account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;