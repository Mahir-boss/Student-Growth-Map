import React, { useState, useEffect, useMemo } from 'react';
import { SKILLS, ROLES, PREREQUISITES } from './data';

// --- NATIVE SVGS ---
const ExternalLinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const MapIcon = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const KeyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>;
const VideoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const CodeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const ChevronDownIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronUpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;

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
  // GLOBAL STATE
  // ==========================================
  const [view, setView] = useState('landing'); 
  
  // Auth State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginType, setLoginType] = useState(''); // 'teacher', 'student', or 'individual'
  const [newPassword, setNewPassword] = useState(''); 

  // Admin State
  const [customIdInput, setCustomIdInput] = useState(''); 
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('sgm_students');
      return saved ? JSON.parse(saved) : [{ id: 'STU-101', hasAccess: true, password: null, targetRole: '', userSkills: [] }];
    } catch (e) { return [{ id: 'STU-101', hasAccess: true, password: null, targetRole: '', userSkills: [] }]; }
  });

  // Student State
  const [targetRole, setTargetRole] = useState(() => {
    const saved = localStorage.getItem('targetRole');
    return (saved && saved !== 'undefined' && saved !== 'null') ? saved : '';
  });
  
  const [skillSearch, setSkillSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState(''); 
  const [userSkills, setUserSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('userSkills');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  // UI State
  const [selectedNode, setSelectedNode] = useState(null);
  const [showResources, setShowResources] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
    localStorage.setItem('targetRole', targetRole);
    localStorage.setItem('sgm_students', JSON.stringify(students));
  }, [userSkills, targetRole, students]);

  // Instantly sync active student progress back to teacher's roster
  useEffect(() => {
    if (view !== 'landing' && view !== 'login' && view !== 'login-selection' && view !== 'admin' && view !== 'setup-password' && loginId) {
      setStudents(prev => prev.map(s => 
        s.id === loginId ? { ...s, targetRole, userSkills } : s
      ));
    }
  }, [userSkills, targetRole, loginId, view]);

  // ==========================================
  // DATA SANITIZATION (Extracting all 4 URLs)
  // ==========================================
  const safeSkills = useMemo(() => getArray(SKILLS).map((s, idx) => ({
    id: String(s.id || s['Skill ID'] || `sk-${idx}`).trim(), 
    name: String(s.name || s['Name'] || 'Unknown'),
    category: String(s.category || s['Category'] || 'General'),
    tier: String(s.tier || s['Skill Tier'] || 'Foundation'),
    docUrl: s['Learning Resource URL'] ? String(s['Learning Resource URL']) : null,
    tutorialUrl: s['Tutorial & Guide URL'] ? String(s['Tutorial & Guide URL']) : null,
    videoUrl: s['Video Course URL'] ? String(s['Video Course URL']) : null,
    practiceUrl: s['Practice & Cheatsheet URL'] ? String(s['Practice & Cheatsheet URL']) : null
  })), []);

  const safeRoles = useMemo(() => getArray(ROLES).map((r, idx) => {
    let reqs = r.requiredSkills || r['Required Skill IDs'] || [];
    if (typeof reqs === 'string') reqs = reqs.split(',');
    return {
      id: String(r.id || r['Role ID'] || `r-${idx}`).trim(),
      title: String(r.title || r['Title'] || 'Unknown'),
      domain: String(r.domain || r['Domain'] || 'IT'),
      requiredSkills: getArray(reqs).map(s => String(s).trim()).filter(Boolean) 
    };
  }), []);

  const safePrereqs = useMemo(() => getArray(PREREQUISITES).map(p => ({
    source: String(p.source || p['Prerequisite Skill ID']).trim(),
    target: String(p.target || p['Unlocks Skill ID']).trim()
  })).filter(p => p.source && p.target), []);

  // ==========================================
  // EXACT PATH FINDER & FILTER
  // ==========================================
  const requiredPath = useMemo(() => {
    if (!targetRole) return new Set(safeSkills.map(s => s.id));
    
    const role = safeRoles.find(r => r.id === targetRole);
    if (!role) return new Set(safeSkills.map(s => s.id)); 
    
    const needed = new Set(role.requiredSkills);
    let added = true;
    
    while (added) {
      added = false;
      safePrereqs.forEach(p => {
        if (needed.has(p.target) && !needed.has(p.source)) {
          needed.add(p.source);
          added = true;
        }
      });
    }
    return needed;
  }, [targetRole, safeRoles, safePrereqs, safeSkills]);

  // ==========================================
  // ROADMAP GROUPING
  // ==========================================
  const roadmapData = useMemo(() => { 
    const grouped = {};
    safeSkills.forEach(skill => {
      if (!requiredPath.has(skill.id)) return;
      
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
  }, [safeSkills, safePrereqs, userSkills, requiredPath]); 

  // ==========================================
  // ROLE MATCHER ENGINE
  // ==========================================
  const roleMatches = useMemo(() => { 
    return safeRoles.map((role) => {
      const required = role.requiredSkills;
      const possessed = required.filter((id) => userSkills.includes(id));
      const missing = required.filter((id) => !userSkills.includes(id));
      const matchPercentage = required.length === 0 ? 0 : Math.round((possessed.length / required.length) * 100);
      return { ...role, matchPercentage, missing };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userSkills, safeRoles]);

  // ==========================================
  // ACTIONS
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // --- TEACHER LOGIN ---
    if (loginType === 'teacher') {
      if (loginId === 'admin' && loginPass === 'admin') {
        setView('admin');
      } else {
        setLoginError('Invalid Teacher credentials.');
      }
      return;
    }

    // --- INDIVIDUAL LOGIN (Self-Registration) ---
    if (loginType === 'individual') {
      let user = students.find(s => s.id === loginId);
      if (!user) {
        user = { id: loginId, hasAccess: true, password: loginPass, targetRole: '', userSkills: [] };
        setStudents(prev => [...prev, user]);
        setTargetRole('');
        setUserSkills([]);
        setView('onboarding');
        return;
      }
      if (user.password !== loginPass && user.password !== null) {
        setLoginError('Incorrect password.');
        return;
      }
      setTargetRole(user.targetRole || '');
      setUserSkills(user.userSkills || []);
      setView(user.targetRole ? 'roadmap' : 'onboarding');
      return;
    }

    // --- STUDENT LOGIN ---
    const student = students.find(s => s.id === loginId);
    if (student) {
      if (!student.hasAccess) {
        setLoginError('Access Denied: Your teacher has revoked your access to the portal.');
        return;
      }
      
      if (student.password) {
        if (loginPass !== student.password) {
          setLoginError('Incorrect password.');
          return;
        }
      } else {
        setView('setup-password');
        return;
      }

      setTargetRole(student.targetRole || '');
      setUserSkills(student.userSkills || []);
      setView(student.targetRole ? 'roadmap' : 'onboarding'); 
    } else {
      setLoginError('Invalid Access ID. Please ask your teacher to generate one for you.');
    }
  };

  const saveNewPassword = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => s.id === loginId ? { ...s, password: newPassword } : s));
    setView('onboarding'); 
  };

  const generateStudent = () => {
    const newId = customIdInput.trim() || `STU-${Math.floor(Math.random() * 900 + 100)}`; 
    if (students.find(s => s.id === newId)) {
      alert("This ID already exists!");
      return;
    }
    setStudents([...students, { id: newId, hasAccess: true, password: null, targetRole: '', userSkills: [] }]);
    setCustomIdInput(''); 
  };

  const toggleStudentAccess = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, hasAccess: !s.hasAccess } : s));
  };

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
    
    setShowResources(false); // Close resource dropdown when changing skills
    setSelectedNode({
      ...rawData,
      isCompleted: userSkills.includes(skillId),
      isLocked: missingPrereqs.length > 0 && !userSkills.includes(skillId),
      missingPrereqs: missingPrereqs.map(id => safeSkills.find(s => s.id === id)?.name || id)
    });
  };

  useEffect(() => {
    if (selectedNode) {
      const prereqs = safePrereqs.filter(p => p.target === selectedNode.id).map(p => p.source);
      const missingPrereqs = prereqs.filter(p => !userSkills.includes(p));
      
      setSelectedNode(prev => ({
        ...prev,
        isCompleted: userSkills.includes(prev.id),
        isLocked: missingPrereqs.length > 0 && !userSkills.includes(prev.id),
        missingPrereqs: missingPrereqs.map(id => safeSkills.find(s => s.id === id)?.name || id)
      }));
    }
  }, [userSkills, safePrereqs, safeSkills]);

  // ==========================================
  // VIEW 1: LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <header className="bg-blue-900 text-white p-6 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Student Growth Map</h1>
              <p className="text-blue-200 text-sm font-medium">Track your academic and skill progression with confidence </p>
            </div>
            <button onClick={() => { setLoginId(''); setLoginPass(''); setLoginError(''); setView('login-selection'); }} className="bg-white text-blue-900 px-6 py-2 rounded-md font-bold hover:bg-blue-50 transition-colors">
              Portal Login
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
            onClick={() => { setLoginId(''); setLoginPass(''); setLoginError(''); setView('login-selection'); }}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(30,58,138,1)]"
          >
            Let's Get Started <ArrowRightIcon />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-slate-200">
              <h3 className="font-black text-lg mb-2 text-rose-600">The Problem</h3>
              <p className="text-slate-600 text-sm">Students struggle to translate vague career goals into daily tasks, treating progression like a maze instead of a manageable climb.</p>
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
  // VIEW 1.5: LOGIN SELECTION
  // ==========================================
  if (view === 'login-selection') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-black mb-8 text-slate-900 uppercase tracking-tight">Select Portal</h2>
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
          
          <button onClick={() => { setLoginType('teacher'); setView('login'); }} className="bg-white p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 text-left hover:-translate-y-1 transition-transform w-full md:w-1/3">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Teacher</h3>
            <p className="text-slate-600 font-medium text-sm">Manage student tokens, track class progress, and control platform access.</p>
          </button>

          <button onClick={() => { setLoginType('student'); setView('login'); }} className="bg-white p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 text-left hover:-translate-y-1 transition-transform w-full md:w-1/3">
            <h3 className="text-2xl font-black text-blue-600 mb-2">Student</h3>
            <p className="text-slate-600 font-medium text-sm">Log in using a secure token provided by your institution or professor.</p>
          </button>

          <button onClick={() => { setLoginType('individual'); setView('login'); }} className="bg-white p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 text-left hover:-translate-y-1 transition-transform w-full md:w-1/3">
            <h3 className="text-2xl font-black text-emerald-600 mb-2">Individual</h3>
            <p className="text-slate-600 font-medium text-sm">Create a personal roadmap without a teacher token. Auto-registers on login.</p>
          </button>

        </div>
        <button onClick={() => setView('landing')} className="mt-10 text-sm font-bold text-slate-500 hover:text-slate-800">
          ← Back to Home
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: DYNAMIC LOGIN FORM
  // ==========================================
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 w-full max-w-md">
          <h2 className="text-3xl font-black mb-2 text-slate-900 capitalize">{loginType} Portal</h2>
          <p className="text-slate-500 mb-6 font-medium">
            {loginType === 'teacher' && "Enter your admin credentials."}
            {loginType === 'student' && "Enter the access token provided by your teacher."}
            {loginType === 'individual' && "Enter a username. We will create an account if it doesn't exist."}
          </p>
          
          {loginError && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-600 text-rose-800 font-bold rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-700 mb-2">
                {loginType === 'teacher' ? 'Admin ID' : loginType === 'student' ? 'Teacher Access ID' : 'Username'}
              </label>
              <input 
                type="text" 
                required 
                className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                placeholder={loginType === 'individual' ? "e.g. johndoe99" : "Enter ID"}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                required={loginType === 'teacher' || loginType === 'individual'} 
                className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                placeholder={loginType === 'student' ? "Leave blank if first time logging in" : "••••••••"}
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-lg hover:bg-slate-800 transition-colors">
              {loginType === 'individual' ? 'Login / Register' : 'Login & Continue'}
            </button>
          </form>

          {loginType === 'teacher' && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 font-medium text-center">
              <p><strong>Demo:</strong> ID: admin | Pass: admin</p>
            </div>
          )}

          <button onClick={() => setView('login-selection')} className="mt-6 text-sm font-bold text-slate-500 hover:text-slate-800 mx-auto block">
            ← Change Login Type
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2.5: STUDENT PASSWORD SETUP
  // ==========================================
  if (view === 'setup-password') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] border-4 border-slate-800 w-full max-w-md">
          <h2 className="text-3xl font-black mb-2 text-slate-900">Welcome, {loginId}</h2>
          <p className="text-slate-500 mb-8 font-medium">Since this is your first time logging in, please set a password to secure your roadmap.</p>
          
          <form onSubmit={saveNewPassword} className="space-y-6">
            <div>
              <label className="block font-bold text-slate-700 mb-2">Create Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium" 
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
              Save Password & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: TEACHER ADMIN DASHBOARD
  // ==========================================
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <header className="bg-slate-900 text-white p-6 shadow-md border-b-4 border-slate-700">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight">TEACHER DASHBOARD</h1>
              <p className="text-slate-400 text-sm font-medium">Student Access Management</p>
            </div>
            <button onClick={() => setView('landing')} className="bg-white text-slate-900 px-6 py-2 rounded-md font-bold hover:bg-slate-200 transition-colors">
              Logout
            </button>
          </div>
        </header>
        
        <main className="flex-grow p-8 max-w-5xl mx-auto w-full mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Access Control</h2>
              <p className="text-slate-600 font-medium">Generate unique IDs to grant students access to the Growth Map platform.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Custom ID (e.g. 101)" 
                className="p-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none font-bold"
                value={customIdInput}
                onChange={(e) => setCustomIdInput(e.target.value)}
              />
              <button onClick={generateStudent} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-[4px_4px_0px_0px_rgba(30,58,138,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(30,58,138,1)] transition-all border-2 border-blue-800 flex-shrink-0">
                <KeyIcon /> Create Token
              </button>
            </div>
          </div>
          
          <div className="bg-white border-4 border-slate-800 rounded-xl shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-4 border-slate-800 text-slate-900">
                  <th className="p-5 font-black uppercase tracking-wider">Student ID</th>
                  <th className="p-5 font-black uppercase tracking-wider">Target Goal</th>
                  <th className="p-5 font-black uppercase tracking-wider">Progress</th>
                  <th className="p-5 font-black uppercase tracking-wider text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const roleName = safeRoles.find(r => r.id === student.targetRole)?.title || 'Not Set';
                  const skillCount = student.userSkills?.length || 0;
                  return (
                  <tr key={student.id} className={idx !== students.length - 1 ? 'border-b-2 border-slate-200' : ''}>
                    <td className="p-5 font-bold text-xl font-mono text-blue-700">
                      {student.id}
                      {!student.password && <span className="block text-xs text-rose-500 mt-1 font-bold">Password not set</span>}
                    </td>
                    <td className="p-5 font-bold text-slate-700">{roleName}</td>
                    <td className="p-5 font-bold text-slate-700">
                      <span className="px-3 py-1 bg-slate-200 rounded-md border border-slate-300">{skillCount} Skills Learned</span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => toggleStudentAccess(student.id)}
                        className={`px-4 py-2 rounded-lg font-bold border-2 text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-px ${student.hasAccess ? 'bg-white border-rose-600 text-rose-600 hover:bg-rose-50' : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'}`}
                      >
                        {student.hasAccess ? 'Revoke Access' : 'Grant Access'}
                      </button>
                    </td>
                  </tr>
                )})}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-500 font-bold text-lg">No students generated yet. Click the button above to begin.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: ONBOARDING / BASELINE SETUP
  // ==========================================
  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-white border-4 border-slate-800 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl font-black uppercase tracking-tight">Set Your Baseline</h2>
            <button onClick={() => setView('landing')} className="text-sm font-bold text-slate-500 hover:text-slate-900 border border-slate-300 px-3 py-1 rounded">Logout</button>
          </div>
          <p className="text-slate-600 mb-8 font-medium">Tell us where you're heading and what you already know to generate your customized roadmap.</p>
          
          <div className="mb-10">
            <label className="block font-black text-slate-900 mb-3 text-lg">1. Target Career Goal (Search & Select)</label>
            <input 
              type="text" 
              placeholder="Search for a career (e.g. 'Data', 'Engineer')..." 
              className="w-full p-4 mb-4 border-2 border-slate-300 rounded-xl font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
            />
            <div className="h-48 overflow-y-auto border-2 border-slate-200 rounded-xl p-2 bg-slate-50 custom-scrollbar flex flex-col gap-2">
              {safeRoles
                .filter(r => roleSearch ? r.title.toLowerCase().includes(roleSearch.toLowerCase()) || r.domain.toLowerCase().includes(roleSearch.toLowerCase()) : true)
                .map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setTargetRole(role.id)}
                    className={`text-left p-3 rounded-lg border-2 font-bold transition-all ${
                      targetRole === role.id 
                        ? 'bg-blue-600 border-blue-800 text-white shadow-[2px_2px_0px_0px_rgba(30,58,138,1)]' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {role.title} <span className={`text-xs font-bold uppercase ml-2 ${targetRole === role.id ? 'text-blue-200' : 'text-slate-400'}`}>({role.domain})</span>
                  </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block font-black text-slate-900 mb-3 text-lg">2. Current Skills (Search & Select)</label>
            <p className="text-sm text-slate-500 mb-4 font-medium">Search and check off the skills you have already mastered.</p>
            
            <input 
              type="text" 
              placeholder="Search for a skill (e.g. 'Python', 'AWS')..." 
              className="w-full p-4 mb-4 border-2 border-slate-300 rounded-xl font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />

            <div className="h-64 overflow-y-auto border-2 border-slate-200 rounded-xl p-4 bg-slate-50 custom-scrollbar">
              {safeSkills
                .filter(s => skillSearch ? s.name.toLowerCase().includes(skillSearch.toLowerCase()) : s.tier === 'Foundation')
                .map(skill => (
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
  // VIEW 5: ROADMAP DASHBOARD (Neo-Brutalist)
  // ==========================================
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* LEFT PANE: Roadmap Map */}
      <div className="flex-grow h-full overflow-y-auto p-8 lg:p-12 relative border-r border-slate-300 custom-scrollbar">
        <button onClick={() => setView('onboarding')} className="absolute top-4 left-4 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3 py-1 rounded border border-slate-300">
          ← Back to Setup
        </button>

        <div className="max-w-4xl mx-auto mt-8">
          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 uppercase">Career Roadmap</h1>
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
      <div className="w-[480px] flex-shrink-0 h-full bg-white flex flex-col shadow-2xl z-20 border-l-[6px] border-slate-800">
        
        {/* Top Half: Node Inspector */}
        <div className="p-10 border-b-[6px] border-slate-800 bg-slate-100 flex flex-col justify-center relative shadow-[inset_0_-8px_20px_rgba(0,0,0,0.05)] z-20">
          {selectedNode ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-black uppercase rounded">{selectedNode.tier}</span>
                <span className="px-2 py-1 bg-slate-800 text-white text-xs font-black uppercase rounded">{selectedNode.category}</span>
              </div>
              
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight break-words">{selectedNode.name}</h2>
              
              <div className="relative mb-6">
                <button 
                  onClick={() => setShowResources(!showResources)} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-slate-800 rounded-lg text-slate-900 font-bold hover:bg-slate-50 transition-colors shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]"
                >
                  <div className="flex items-center gap-2">
                    <BookIcon /> Learning Resources
                  </div>
                  {showResources ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {showResources && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-slate-800 rounded-lg shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] z-50 overflow-hidden flex flex-col">
                    {selectedNode.docUrl && selectedNode.docUrl !== '#' && selectedNode.docUrl !== 'null' && (
                      <a href={selectedNode.docUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 border-b border-slate-200 text-slate-800 font-bold transition-colors">
                        <ExternalLinkIcon /> Suggested Resources
                      </a>
                    )}
                    {selectedNode.tutorialUrl && selectedNode.tutorialUrl !== '#' && selectedNode.tutorialUrl !== 'null' && (
                      <a href={selectedNode.tutorialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 border-b border-slate-200 text-slate-800 font-bold transition-colors">
                        <BookIcon /> Tutorials & Guides
                      </a>
                    )}
                    {selectedNode.videoUrl && selectedNode.videoUrl !== '#' && selectedNode.videoUrl !== 'null' && (
                      <a href={selectedNode.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 border-b border-slate-200 text-slate-800 font-bold transition-colors">
                        <VideoIcon /> Video Courses
                      </a>
                    )}
                    {selectedNode.practiceUrl && selectedNode.practiceUrl !== '#' && selectedNode.practiceUrl !== 'null' && (
                      <a href={selectedNode.practiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 text-slate-800 font-bold transition-colors">
                        <CodeIcon /> Practice & Cheatsheets
                      </a>
                    )}
                  </div>
                )}
              </div>

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
        <div className="p-8 flex-grow overflow-y-auto bg-white custom-scrollbar z-10">
          <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Job Matcher</h3>
          <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">Click a job to update your roadmap</p>
          <div className="space-y-5">
            {roleMatches.map((role) => {
              const isTarget = role.id === targetRole;
              return (
                <div 
                  key={role.id} 
                  onClick={() => setTargetRole(role.id)}
                  className={`bg-white p-5 rounded-xl border-2 cursor-pointer transition-all ${isTarget ? 'border-blue-600 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] bg-blue-50' : 'border-slate-800 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:-translate-y-1'}`}
                >
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
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleInspectSkill(id); }} 
                            className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                          >
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