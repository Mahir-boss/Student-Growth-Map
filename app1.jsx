import React, { useState } from 'react';
import Navbar from './Navbar';

export default function App({ pathwayData = [], activeTasks = [] }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onLoginClick={handleLoginClick} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Academic Pathway
          </h1>
          <p className="text-gray-600 mt-2">
            Deterministic rule-based tracking for your academic milestones.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pathway Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 flex flex-col">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Current Pathway
            </h2>
            
            {pathwayData.length === 0 ? (
              <div className="flex-grow flex items-center justify-center p-8 bg-blue-50 rounded-md border-2 border-dashed border-blue-200">
                <p className="text-blue-600 font-medium text-center">
                  Awaiting backend connection...
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {pathwayData.map((item, index) => (
                  <li key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
                    {/* Structure ready for actual backend data props */}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Tasks Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 flex flex-col">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Active Tasks
            </h2>
            
            {activeTasks.length === 0 ? (
              <div className="flex-grow flex items-center justify-center p-8 bg-blue-50 rounded-md border-2 border-dashed border-blue-200">
                <p className="text-blue-600 font-medium text-center">
                  No active tasks.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {activeTasks.map((task, index) => (
                  <li key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
                    {/* Structure ready for actual backend task props */}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* Login Modal Overlay */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Connect to the deterministic backend to load your academic profile.
              </p>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={closeLoginModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={closeLoginModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}