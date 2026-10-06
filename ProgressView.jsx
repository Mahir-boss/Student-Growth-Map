import React from 'react';

export default function ProgressView({ milestones = [] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h2 className="text-xl font-semibold text-blue-900">
          Pathway Progress
        </h2>
      </div>

      {milestones.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-lg border-2 border-dashed border-blue-200 text-center transition-colors hover:bg-blue-50">
          <svg className="w-12 h-12 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-blue-900 font-medium mb-1">No rules mapped yet</p>
          <p className="text-sm text-blue-600/80">
            Awaiting deterministic pathway generation.
          </p>
        </div>
      ) : (
        <div className="flex-grow relative pl-4 mt-2">
          {/* Vertical tracking line */}
          <div className="absolute top-2 bottom-2 left-5 w-0.5 bg-blue-100"></div>
          
          <ul className="space-y-6 relative">
            {milestones.map((milestone, index) => (
              <li key={index} className="relative flex items-start gap-4">
                {/* Milestone Node */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${milestone.isCompleted ? 'border-blue-600' : 'border-blue-200'}`}>
                  {milestone.isCompleted ? (
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                  )}
                </div>
                
                {/* Milestone Content */}
                <div className="flex-1 pt-1 pb-2">
                  <h3 className="text-sm font-semibold text-blue-900">
                    {milestone.title}
                  </h3>
                  {milestone.date && (
                    <span className="inline-block px-2 py-0.5 mt-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                      {milestone.date}
                    </span>
                  )}
                  {milestone.details && (
                    <p className="text-sm text-gray-500 mt-2">
                      {milestone.details}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}