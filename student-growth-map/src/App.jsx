import React, { useState } from 'react';
import Navbar from './Navbar';
import ProjectDetailsMedia from './ProjectDetailsMedia';
import DiagnosticChecklist from './DiagnosticChecklist';
import ProgressView from './ProgressView';
import LoginModal from './LoginModal';

export default function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Empty arrays to strictly enforce the "empty-state" UI rendering
  const diagnosticTasks = []; 
  const progressMilestones = [];

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSubmit = (credentials) => {
    // In a real app, backend authentication would happen here
    setUser({ name: credentials.username || 'Student' });
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onLoginClick={handleLoginClick} user={user} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Project Introduction Section */}
        <ProjectDetailsMedia />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <DiagnosticChecklist tasks={diagnosticTasks} />
          <ProgressView milestones={progressMilestones} />
        </div>
        
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onLogin={handleLoginSubmit}
      />
    </div>
  );
}