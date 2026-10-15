import React, { useState, useEffect, useMemo } from 'react';
import { SKILLS, ROLES, PREREQUISITES } from './data';

// --- NATIVE SVGS ---
const ExternalLinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const MapIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

// --- TAXONOMY COLORS ---
const CATEGORY_STYLES = {
  'CS Core': { border: 'border-slate-800', bg: 'bg-slate-100', text: 'text-slate-800', badge: 'bg-slate-800 text-white' },
  'Frontend & UI/UX': { border: 'border-blue-700', bg: 'bg-blue-50', text: 'text-blue-900', badge: 'bg-blue-700 text-white' },
  'Backend & APIs': { border: 'border-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-900', badge: 'bg-emerald-700 text-white' },
  'Databases & Data Engineering': { border: 'border-amber-600', bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-600 text-white' },
  'Data Science & AI': { border: 'border-purple-700', bg: 'bg-purple-50', text: 'text-purple-900', badge: 'bg-purple-700 text-white' },
  'Cloud & DevOps': { border: 'border-cyan-700', bg: 'bg-cyan-50', text: 'text-cyan-900', badge: 'bg-cyan-700 text-white' },
  'Cybersecurity': { border: 'border-rose-700', bg: 'bg-rose-50', text: 'text-rose-900', badge: 'bg-rose-700 text-white' },
  'Mobile, Game & Management': { border: 'border-indigo-700', bg: 'bg-indigo-50', text: 'text-indigo-900', badge: 'bg-indigo-700 text-white' },
};
const DEFAULT_STYLE = { border: 'border-gray-800', bg: 'bg-gray-50', text: 'text-gray-900', badge: 'bg-gray-800 text-white' };
const TIER_ORDER = ['Foundation', 'Intermediate', 'Advanced', 'Specialized'];

const getArray = (data) => Array.isArray(data) ? data : [];

export default function App() {
  // ==========================================
  // ALL HOOKS AT THE VERY TOP (React Rule Fix)
  // ==========================================
  const [view, setView] = useState('landing'); 
  const [targetRole, setTargetRole] = useState(() => localStorage.getItem('targetRole') || '');
  const [userSkills, setUserSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('userSkills');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  const [selectedNode, setSelectedNode] = useState(null); // Moved up!

  useEffect(() => {
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
    localStorage.setItem('targetRole', targetRole);
  }, [userSkills, targetRole]);

  const safeSkills = useMemo(() => getArray(SKILLS).map((s, idx) => ({
    id: String(s.id || s['Skill ID'] || `sk-${idx}`),
    name: String(s.name || s['Name'] || 'Unknown'),
    category: String(s.category || s['Category'] || 'General'),
    tier: String(s.tier || s['Skill Tier'] || 'Foundation'),
    docUrl: String(s.docUrl || s['Learning Resource URL'] || '#')
  })), []);

  const safeRoles = useMemo(() => getArray(ROLES).map((r, idx) => {
    let reqs = r.requiredSkills || r['Required Skill IDs'] || [];
    if (typeof reqs === 'string') reqs = reqs.split(',').map(s => String(s.trim()));
    return {
      id: String(r.id || r['Role ID'] || `r-${idx}`),
      title: String(r.title || r['Title'] || 'Unknown'),
      domain: String(r.domain || r['Domain'] || 'IT'),
      requiredSkills: getArray(reqs)
    };
  }), []);

  const safePrereqs = useMemo(() => getArray(PREREQUISITES).map(p => ({
    source: String(p.source || p['Prerequisite Skill ID']),
    target: String(p.target || p['Unlocks Skill ID'])
  })).filter(p => p.source && p.target), []);

  const roadmapData = useMemo(() => { // Moved up!
    const grouped = {};
    safeSkills.forEach(skill => {
      if (!grouped[skill.tier]) grouped[skill.tier] = {};
      if (!grouped[skill.tier][skill.category]) grouped[skill.tier][skill.category] = [];
      
      const missingPrereqs = safePrereqs.filter(p => p.target === skill.id).map(p => p.source).filter(p => !userSkills.includes(p));

      grouped[skill.tier][skill.category].push({
        ...skill,
        isCompleted: userSkills.includes(skill.id),
        isLocked: missingPrereqs.length > 0 && !userSkills.includes(skill.id),
        missingPrereqs: missingPrereqs.map(id => safeSkills.find(s => s.id === id)?.name || id)
      });
    });

    return TIER_ORDER.filter(tier => grouped[tier]).map(tier => ({
      tier,
      categories: Object.entries(grouped[tier]).map(([category, skills]) => ({ category, skills }))
    }));
  }, [safeSkills, safePrereqs, userSkills]);

  const roleMatches = useMemo(() => { // Moved up!
    return safeRoles.map((role) => {
      const required = role.requiredSkills;
      const possessed = required.filter((id) => userSkills.includes(id));
      const missing = required.filter((id) => !userSkills.includes(id));
      const matchPercentage = required.length === 0 ? 0 : Math.round((possessed.length / required.length) * 100);
      return { ...role, matchPercentage, missing };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userSkills, safeRoles]);

  // --- ACTIONS ---
  const toggleSkill = (skillId) => {
    setUserSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleInspectSkill = (skillId) => {
    const rawData = safeSkills.find(s => s.id === skillId);
    if (!rawData) return;
    const prereqs = safePrereqs.filter(p => p.target === skillId).map(p => p.source);
    const missingPrereqs = prereqs.filter(p => !userSkills.includes(p));
    
    setSelectedNode({
      ...rawData,
      isCompleted: userSkills.includes(skillId),
      isLocked: missingPrereqs.length > 0 && !userSkills.includes(skillId),
      missingPrereqs: missingPrereqs.map(id => safeSkills.find(s => s.id === id)?.name || id)
    });
  };

  // ==========================================
  // VIEW 1: LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <header className="bg-blue-900 text-white p-6 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight">ACE IT DEPARTMENT</h1>
              <p className="text-blue-200 text-sm font-medium">Atharva College of Engineering</p>
            </div>
            <button onClick={() => setView('login')} className="bg-white text-blue-900 px-6 py-2 rounded-md font-bold hover:bg-blue-50 transition-colors">
              Student Login
            </button>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 font-bold rounded-full mb-6">
            A Deterministic Academic & Skill Progression Tracker
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            Student Growth Map
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Stop guessing your academic future. Our deterministic rule-based algorithms map your current skills directly to your dream career without the unreliability of AI.
          </p>
          
          <button 
            onClick={() => setView('login')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]"
          >
            Let's Get Started <ArrowRightIcon />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
              <h3 className="font-black text-lg mb-2 text-rose-600">The Problem</h3>
              <p className="text-slate-600 text-sm">Students struggle to translate vague career goals into daily tasks, treating progression like a maze instead of a climb.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
              <h3 className="font-black text-lg mb-2 text-emerald-600">The Solution</h3>
              <p className="text-slate-600 text-sm">A highly structured, relational database mapping prerequisite skills to exact curriculum nodes and industry roles.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
              <h3 className="font-black text-lg mb-2 text-blue-600">The Method</h3>
              <p className="text-slate-600 text-sm">Assess baseline skills, target a goal, map logic securely via backend, and track progress visually.</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 w-full text-slate-500 text-sm font-medium">
            Project Members: Aayur Mehrotra, Mahir Jada, Arjun Menon, Ayush Lad • Guide: Prof. Rashmi Pathak
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGIN
  // ==========================================
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 w-full max-w-md">
          <h2 className="text-3xl font-black mb-2 text-slate-900">Student Portal</h2>
          <p className="text-slate-500 mb-8 font-medium">Authenticate to access your roadmap.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); setView('onboarding'); }} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Student ID / Email</label>
              <input type="text" required className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="Enter ID"/>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-2">Password</label>
              <input type="password" required className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium" placeholder="••••••••"/>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-lg hover:bg-slate-800 transition-colors">
              Login & Continue
            </button>
          </form>
          <button onClick={() => setView('landing')} className="mt-4 text-sm font-bold text-slate-500 hover:text-slate-800 mx-auto block">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: ONBOARDING / BASELINE SETUP
  // ==========================================
  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white border-4 border-slate-800 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Set Your Baseline</h2>
          <p className="text-slate-600 mb-8 font-medium">Tell us where you're heading and what you already know to generate your customized roadmap.</p>
          
          <div className="mb-10">
            <label className="block font-black text-slate-900 mb-3 text-lg">1. Target Career Goal</label>
            <select 
              className="w-full p-4 border-2 border-slate-300 rounded-xl font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              <option value="" disabled>Select your dream role...</option>
              {safeRoles.map(r => <option key={r.id} value={r.id}>{r.title} ({r.domain})</option>)}
            </select>
          </div>

          <div className="mb-10">
            <label className="block font-black text-slate-900 mb-3 text-lg">2. Current Skills (Quick Select)</label>
            <p className="text-sm text-slate-500 mb-4 font-medium">Check off the foundational skills you have already mastered.</p>
            
            <div className="h-64 overflow-y-auto border-2 border-slate-200 rounded-xl p-4 bg-slate-50 custom-scrollbar">
              {safeSkills.filter(s => s.tier === 'Foundation').map(skill => (
                <label key={skill.id} className="flex items-center gap-3 p-2 hover:bg-slate-200 rounded cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-blue-600"
                    checked={userSkills.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  <span className="font-bold text-slate-700">{skill.name}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">{skill.category}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            disabled={!targetRole}
            onClick={() => setView('roadmap')}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Generate My Roadmap
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: ROADMAP DASHBOARD (Neo-Brutalist)
  // ==========================================
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* LEFT PANE: roadmap.sh Style CSS Layout */}
      <div className="flex-grow h-full overflow-y-auto p-8 lg:p-12 relative border-r border-slate-300 custom-scrollbar">
        <button onClick={() => setView('onboarding')} className="absolute top-4 left-4 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3 py-1 rounded border border-slate-300">
          ← Back to Setup
        </button>

        <div className="max-w-4xl mx-auto mt-8">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 uppercase">IT Career Roadmap</h1>
            {targetRole && (
              <p className="text-lg font-bold text-blue-600 bg-blue-100 inline-block px-4 py-1 rounded-full border border-blue-200">
                Target: {safeRoles.find(r => r.id === targetRole)?.title}
              </p>
            )}
          </header>

          <div className="relative">
            <div className="absolute left-8 top-4 bottom-0 w-1.5 bg-slate-300 rounded-full z-0 hidden md:block"></div>

            {roadmapData.map((tierGroup, tIdx) => (
              <div key={tierGroup.tier} className="mb-20 relative z-10">
                <div className="flex items-center gap-4 mb-8 sticky top-0 bg-slate-50/95 backdrop-blur py-4 z-20">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(100,116,139,1)] flex items-center justify-center font-black text-2xl border-2 border-slate-700">
                    {tIdx + 1}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-wider">{tierGroup.tier}</h2>
                </div>

                <div className="md:ml-24 space-y-8">
                  {tierGroup.categories.map((cat) => {
                    const style = CATEGORY_STYLES[cat.category] || DEFAULT_STYLE;
                    return (
                      <div key={cat.category} className={`border-4 ${style.border} ${style.bg} rounded-xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-1`}>
                        <div className="flex items-center gap-3 mb-5">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest ${style.badge}`}>{cat.category}</span>
                          <div className="h-0.5 flex-grow bg-slate-200 rounded-full"></div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {cat.skills.map(skill => (
                            <button
                              key={skill.id}
                              onClick={() => setSelectedNode(skill)}
                              className={`
                                relative px-4 py-2 rounded-lg border-2 font-bold text-sm flex items-center gap-2 transition-all
                                ${skill.isCompleted ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : skill.isLocked ? 'bg-white border-slate-200 text-slate-400 cursor-not-allowed opacity-75' : 'bg-white border-slate-800 text-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(30,41,59,1)]'}
                                ${selectedNode?.id === skill.id ? 'ring-4 ring-blue-400 ring-offset-2' : ''}
                              `}
                            >
                              {skill.isCompleted && <CheckIcon />}
                              {skill.isLocked && <LockIcon />}
                              {skill.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: The Inspector & Role Matcher */}
      <div className="w-[400px] flex-shrink-0 h-full bg-white flex flex-col shadow-2xl z-10 border-l-4 border-slate-800">
        
        {/* Top Half: Node Inspector */}
        <div className="p-8 border-b-4 border-slate-800 bg-slate-50 min-h-[35%] flex flex-col justify-center">
          {selectedNode ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-black uppercase rounded">{selectedNode.tier}</span>
                <span className="px-2 py-1 bg-slate-800 text-white text-xs font-black uppercase rounded">{selectedNode.category}</span>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-6 leading-tight">{selectedNode.name}</h2>
              
              <a href={selectedNode.docUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-slate-800 rounded-lg text-slate-900 font-bold hover:bg-slate-100 transition-colors mb-4 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]">
                <ExternalLinkIcon /> Official Documentation
              </a>

              <button 
                onClick={() => toggleSkill(selectedNode.id)}
                disabled={selectedNode.isLocked}
                className={`w-full py-4 rounded-lg font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-2 ${selectedNode.isCompleted ? 'bg-emerald-500 border-emerald-700 text-white shadow-[3px_3px_0px_0px_rgba(4,120,87,1)]' : selectedNode.isLocked ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed' : 'bg-blue-600 border-blue-800 text-white hover:bg-blue-700 shadow-[3px_3px_0px_0px_rgba(30,58,138,1)]'}`}
              >
                {selectedNode.isCompleted ? <><CheckIcon /> Learned</> : 'Mark as Learned'}
              </button>

              {selectedNode.isLocked && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded text-sm text-rose-800 font-medium">
                  <span className="font-bold block mb-1">Locked. Missing Prerequisites:</span>
                  {selectedNode.missingPrereqs.join(', ')}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center">
              <MapIcon />
              <p className="mt-4 font-bold uppercase tracking-wider">Select a skill to inspect</p>
            </div>
          )}
        </div>

        {/* Bottom Half: Closest Jobs Matcher */}
        <div className="p-8 flex-grow overflow-y-auto bg-white custom-scrollbar">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Job Matcher</h3>
          <div className="space-y-5">
            {roleMatches.map((role) => {
              const isTarget = role.id === targetRole;
              return (
                <div key={role.id} className={`bg-white p-5 rounded-xl border-2 ${isTarget ? 'border-blue-600 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] bg-blue-50' : 'border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]'}`}>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h4 className="font-bold text-slate-900 leading-tight">
                      {isTarget && <span className="text-blue-600 mr-1">★</span>}
                      {role.title}
                    </h4>
                    <span className={`px-2 py-1 text-white text-xs font-black rounded ${isTarget ? 'bg-blue-600' : 'bg-slate-900'}`}>
                      {role.matchPercentage}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-3 border border-slate-300 overflow-hidden">
                    <div className={`${isTarget ? 'bg-blue-600' : 'bg-slate-800'} h-full transition-all duration-500 ease-out`} style={{ width: `${role.matchPercentage}%` }}></div>
                  </div>

                  {role.missing.length > 0 ? (
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      <span className="font-bold text-rose-600">{role.missing.length} skills away:</span>{' '}
                      {role.missing.slice(0, 3).map((id, idx) => (
                        <span key={id}>
                          {idx > 0 && ', '}
                          <button onClick={() => handleInspectSkill(id)} className="text-blue-600 hover:text-blue-800 hover:underline font-bold">
                            {safeSkills.find(s => s.id === id)?.name || id}
                          </button>
                        </span>
                      ))}
                      {role.missing.length > 3 && ' ...'}
                    </p>
                  ) : (
                    <p className="text-sm font-black text-emerald-600 uppercase">Fully Qualified!</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}