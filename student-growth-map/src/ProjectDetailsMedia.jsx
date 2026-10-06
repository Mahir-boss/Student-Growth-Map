import React from 'react';

export default function ProjectDetailsMedia() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12 items-center">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 leading-tight mb-4">
            Student Growth Map: Precision Academic Pathfinding
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Our platform utilizes deterministic, rule-based algorithms to accurately map your current academic skills directly to your educational goals. Experience transparent, predictable pathfinding that puts you in complete control of your academic journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-center">
              Get Started
            </button>
            <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-6 rounded-lg transition-colors border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-center">
              View Ruleset
            </button>
          </div>
        </div>

        {/* Media Placeholder */}
        <div className="order-1 lg:order-2 w-full h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 group hover:bg-gray-50 transition-colors">
          <div className="flex space-x-4 mb-4">
            {/* Play Icon */}
            <svg 
              className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            {/* Image Icon */}
            <svg 
              className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <span className="font-medium text-sm text-center px-4">
            Video / Image Slideshow Placeholder
          </span>
          <span className="text-xs text-gray-500 mt-2">
            16:9 Aspect Ratio Recommended
          </span>
        </div>
        
      </div>
    </section>
  );
}