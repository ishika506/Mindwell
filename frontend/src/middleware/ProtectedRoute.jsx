import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/" replace />; // redirect to Landing if not logged in
  }

  return children;
};

export default ProtectedRoute;
