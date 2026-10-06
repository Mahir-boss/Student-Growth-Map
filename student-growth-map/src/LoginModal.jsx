import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      // Pass credentials up to a higher-level state/auth handler
      onLogin({ username, password });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm p-4 transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      {/* Modal Content Container - Stop propagation so clicking inside doesn't close it */}
      <div 
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 id="modal-headline" className="text-2xl font-bold text-blue-900">
              Welcome Back
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full p-1"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white/80 transition-shadow"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white/80 transition-shadow"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-blue-50/50 px-8 py-4 border-t border-blue-100 flex justify-center">
          <p className="text-sm text-blue-700">
            Secure, deterministic authentication.
          </p>
        </div>
      </div>
    </div>
  );
}