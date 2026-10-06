import React from 'react';

export default function Navbar({ onLoginClick, user = null }) {
  return (
    <nav className="bg-blue-600 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl tracking-tight">
              Student Growth Map
            </span>
          </div>
          
          <div className="flex items-center">
            {!user ? (
              <button
                onClick={onLoginClick}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Login
              </button>
            ) : (
              <span className="font-medium text-blue-50">
                Welcome, {user.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}