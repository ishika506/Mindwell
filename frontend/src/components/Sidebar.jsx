// Sidebar.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  IoLogOutOutline,
  IoHomeOutline,
  IoCalendarOutline,
  IoListOutline,
  IoHappyOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
navigate("/");
  };

  return (
    <div
      className="
      fixed h-full w-[240px]
      bg-gradient-to-b from-[#0A0A0A] via-[#0d0d0d] to-[#111]
      text-white shadow-2xl flex flex-col
      border-r border-white/5
      backdrop-blur-xl
    "
    >

      {/* Decorative Glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#4FB3BF]/20 blur-[90px]" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3A8E99]/20 blur-[90px]" />

      {/* Profile Section */}
      <div className="relative p-5 flex flex-col items-center border-b border-white/10">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="cursor-pointer flex flex-col items-center"
        >
          <div className="bg-gradient-to-br from-[#B6F2DD] to-[#7CD8C0] text-[#0d0d0d] font-bold rounded-full w-14 h-14 flex justify-center items-center text-xl shadow-md">
            {user?.name?.charAt(0)}
          </div>

          <h2 className="mt-3 text-lg font-semibold tracking-wide text-[#E6FFFA]">
            {user?.name}
          </h2>
        </div>

        {dropdownOpen && (
          <div className="mt-3 w-full bg-[#1a1a1a]/60 backdrop-blur-md p-3 rounded-lg text-xs shadow-xl border border-white/5">
            <p><strong>Name:</strong> {user?.name}</p>
            <p className="mt-1"><strong>Email:</strong> {user?.email}</p>
          </div>
        )}
      </div>

      {/* SIDEBAR MENU */}
      <div className="flex flex-col gap-2 p-4 mt-2 font-medium">
        <SidebarBtn icon={<IoHomeOutline size={22} />} text="Dashboard" route="/dashboard" navigate={navigate} />
        <SidebarBtn icon={<IoListOutline size={22} />} text="Activities" route="/activities" navigate={navigate} />
        <SidebarBtn icon={<IoListOutline size={22} />} text="Journal" route="/journal" navigate={navigate} />
        <SidebarBtn icon={<IoHappyOutline size={22} />} text="Start Therapy" route="/chat" navigate={navigate} />
        <SidebarBtn icon={<IoHappyOutline size={22} />} text="Recommendations" route="/recommendations" navigate={navigate} />
        <SidebarBtn icon={<IoCalendarOutline size={22} />} text="Today's Goal" route="/today-goal" navigate={navigate} />
      </div>

      {/* LOGOUT */}
      <div className="mt-auto p-4">
        <button
          onClick={handleLogout}
          className="
          flex items-center justify-center gap-2 w-full py-3 rounded-xl
          bg-[#4FB3BF]/10 text-[#B6F2DD]
          border border-[#4FB3BF]/20
          hover:bg-[#4FB3BF]/20 transition-all shadow-md
        "
        >
          <IoLogOutOutline size={22} /> Logout
        </button>
      </div>
    </div>
  );
};

const SidebarBtn = ({ icon, text, route, navigate }) => (
  <button
    onClick={() => navigate(route)}
    className="
      flex items-center gap-3 p-3 
      rounded-lg transition-all 
      hover:bg-white/10 hover:shadow-lg
      text-[#E6FFFA]
    "
  >
    {icon} <span className="tracking-wide">{text}</span>
  </button>
);

export default Sidebar;
