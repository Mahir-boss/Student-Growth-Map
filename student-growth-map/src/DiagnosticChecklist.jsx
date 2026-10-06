import React from 'react';

export default function DiagnosticChecklist({ tasks = [] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h2 className="text-xl font-semibold text-blue-900">
          Diagnostic Checklist
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-blue-50/50 rounded-lg border-2 border-dashed border-blue-200 text-center transition-colors hover:bg-blue-50">
          <svg className="w-12 h-12 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-blue-900 font-medium mb-1">No diagnostic tasks loaded</p>
          <p className="text-sm text-blue-600/80">
            Connect to the database to load your checklist.
          </p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto pr-2">
          {tasks.map((task, index) => (
            <li 
              key={index} 
              className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-blue-50/50 rounded-lg border border-gray-100 transition-colors group"
            >
              <div className="mt-0.5">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 focus:ring-2 cursor-pointer"
                  checked={task.isCompleted || false}
                  readOnly
                />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-blue-900'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}