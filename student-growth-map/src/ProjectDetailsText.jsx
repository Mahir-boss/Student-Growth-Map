import React from 'react';

export default function ProjectDetailsText() {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-blue-100 my-8 overflow-hidden relative">
      {/* Decorative Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
      
      {/* Subtle Background Glows for visual interest without images */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-50 rounded-full opacity-70 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-70 blur-3xl pointer-events-none"></div>

      <div className="relative px-6 py-16 md:py-24 lg:px-12 flex flex-col items-center text-center max-w-4xl mx-auto">
        
        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">
          Platform Overview
        </span>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 leading-tight mb-6">
          Student Growth Map: <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">
            Precision Academic Pathfinding
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Our platform utilizes deterministic, rule-based algorithms to accurately map your current academic skills directly to your educational goals. Experience transparent, predictable pathfinding that puts you in complete control of your academic journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-center transform hover:-translate-y-0.5">
            Get Started
          </button>
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-8 rounded-lg transition-all border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-center transform hover:-translate-y-0.5">
            View Ruleset
          </button>
        </div>
        
      </div>
    </section>
  );
}