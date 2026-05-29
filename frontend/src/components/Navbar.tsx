import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { LogOut, User, CheckSquare, ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="glass sticky top-0 z-40 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 md:p-2.5 rounded-xl shadow-lg shadow-indigo-500/15 flex-shrink-0">
          <CheckSquare className="w-4.5 h-4.5 md:w-5 md:h-5 text-white" />
        </div>
        <span className="font-heading text-lg md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
          Kanggo Tasks
        </span>
      </div>

      {/* Profile & Controls */}
      <div
        className="flex items-center gap-3 md:gap-6 relative"
        ref={dropdownRef}
      >
        {user && (
          <div className="relative">
            {/* Clickable Profile Badge */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 md:gap-2 hover:bg-slate-850 border border-transparent hover:border-slate-800 p-1 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
              title="Menu Profil"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-850 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="hidden md:inline text-sm font-semibold text-slate-200 tracking-wide whitespace-nowrap">
                {user.name}
              </span>
              <ChevronDown
                className="w-3.5 h-3.5 text-slate-400 hidden md:block transition-transform duration-200"
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                }}
              />
            </button>

            {/* Premium Profile Dropdown Popover */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-4 flex flex-col gap-3.5 z-50 animate-slide-up">
                {/* User Info */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Akun Pengguna
                  </span>
                  <span
                    className="text-sm font-bold text-slate-100 truncate"
                    title={user.name}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-xs font-medium text-slate-400 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                </div>

                {/* Mobile logout inside dropdown */}
                <div className="border-t border-slate-800/80 pt-3 sm:hidden">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop Logout Button */}
        <button
          onClick={() => logout(false)}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 transition-all duration-200 cursor-pointer shadow-sm flex-shrink-0"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
