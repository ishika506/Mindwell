import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { IoLeafOutline, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";

// --- Password Rules Configuration ---
const passwordRules = [
    { regex: /.{8,}/, message: "8 characters minimum" },
    { regex: /[A-Z]/, message: "1 uppercase letter" },
    { regex: /[a-z]/, message: "1 lowercase letter" },
    { regex: /[0-9]/, message: "1 number" },
    { regex: /[\W_]/, message: "1 special character (@!$%)" },
];

// --- Sub-Component: Password Strength Indicator ---
const PasswordStrength = ({ password }) => {
    const passedCount = passwordRules.filter((rule) => rule.regex.test(password)).length;
    const allPassed = passedCount === passwordRules.length;

    const getColorClass = (passed) => {
        if (password.length === 0) return "text-gray-500";
        return passed ? "text-green-500" : "text-yellow-500";
    };

    return (
        <div className="mt-2 space-y-1 p-3 bg-[#0A1517] rounded-lg border border-[#2A474A]">
            <p className="text-xs font-semibold text-gray-400 mb-1">Password Requirements:</p>
            {passwordRules.map((rule, index) => {
                const passed = rule.regex.test(password);
                return (
                    <motion.div 
                        key={index} 
                        className={`flex items-center text-xs ${getColorClass(passed)}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {passed ? (
                            <IoCheckmarkCircle className="mr-2" />
                        ) : (
                            <IoAlertCircle className="mr-2" />
                        )}
                        {rule.message}
                    </motion.div>
                );
            })}
             {allPassed && password.length > 0 && (
                <p className="text-sm font-bold text-green-500 mt-2 pt-2 border-t border-gray-700">
                    Strong Password! ✅
                </p>
            )}
        </div>
    );
};


const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordValid, setPasswordValid] = useState(false); // New state for overall password validity
    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    // THEME
    const primaryBg = "bg-gradient-to-b from-[#0e2124] to-[#0a1517]";
    const cardBg = "bg-[#152D30]";
    const inputBg = "bg-[#0A1517]";
    const inputBorder = "border-[#2A474A]";
    const focusRing = "focus:ring-teal-400";
    const highlightText = "text-teal-300";
    const buttonPrimary = "bg-teal-500 hover:bg-teal-400 text-[#0a1517]";

    // Email validator
    const validateEmail = (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            setEmailError("Enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    // Password validator (Sets overall valid state)
    const validatePassword = (value) => {
        const allPassed = passwordRules.every(rule => rule.regex.test(value));
        setPasswordValid(allPassed);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final check on current state
        validateEmail(email);
        validatePassword(password);

        if (emailError || !passwordValid) return;

        setError("");
        setIsLoading(true);
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axios.post("http://localhost:8800/api/auth/signup", {
                name,
                email,
                password,
            });

            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...res.data.user, token: res.data.token },
            });

            navigate("/welcome");
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Registration failed. Please try again.";
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
                    Create Your Account
                </h2>

                {error && (
                    <div className="bg-red-800/50 text-red-300 p-3 mb-4 rounded-xl text-center border border-red-700/50">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* NAME */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`w-full px-5 py-3 ${inputBorder} ${inputBg} rounded-xl text-gray-200 focus:ring-2 ${focusRing}`}
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="user@mindwell.app"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            required
                            className={`w-full px-5 py-3 ${inputBorder} ${inputBg} rounded-xl text-gray-200 focus:ring-2 ${focusRing}`}
                        />
                        {emailError && (
                            <p className="text-red-400 text-sm mt-1">{emailError}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value);
                            }}
                            required
                            className={`w-full px-5 py-3 ${inputBorder} ${inputBg} rounded-xl text-gray-200 focus:ring-2 ${focusRing}`}
                        />
                        {/* Live Password Strength Indicator */}
                        {password.length > 0 && <PasswordStrength password={password} />}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || emailError || !passwordValid}
                        className={`w-full ${buttonPrimary} font-bold py-3 rounded-xl shadow-lg text-lg tracking-wider disabled:bg-gray-600`}
                    >
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to="/signin" className={`${highlightText} font-medium hover:underline`}>
                        Sign In here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUp;