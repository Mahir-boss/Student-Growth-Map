import React, { useState, useEffect, useMemo, useCallback } from 'react';
const API_BASE = import.meta.env.VITE_API_URL || 'https://student-growth-map.onrender.com';
import './App.css';


// --- NATIVE ICONS ---
const ExternalLinkIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const CheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const MapIcon = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const KeyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></svg>;
const VideoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>;
const CodeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const ChevronDownIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const ChevronUpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>;
const SunIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const MoonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const SgmLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Map Grid */}
    <path d="M10 0v40M30 0v40M0 10h40M0 30h40" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1"/>
    {/* Growth Pathway */}
    <path d="M8 32l8-12 6 4 10-14" className="stroke-amber-500" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Mastered Skill Nodes */}
    <circle cx="8" cy="32" r="3.5" className="fill-neutral-900 dark:fill-white"/>
    <circle cx="16" cy="20" r="3.5" className="fill-neutral-900 dark:fill-white"/>
    <circle cx="22" cy="24" r="3.5" className="fill-neutral-900 dark:fill-white"/>
    {/* Target Career Goal */}
    <circle cx="32" cy="10" r="4.5" className="fill-amber-500"/>
    <circle cx="32" cy="10" r="9" className="stroke-amber-500" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3"/>
  </svg>
);

// --- CATEGORY STYLES (Refined for High Contrast in Light & Dark) ---
const CATEGORY_STYLES = {
  'CS Core': { bg: 'bg-neutral-50 dark:bg-neutral-900/60', border: 'border-neutral-200 dark:border-neutral-800', badge: 'bg-neutral-800 text-white dark:bg-neutral-800 dark:text-neutral-200' },
  'Frontend & UI/UX': { bg: 'bg-blue-50/50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900/50', badge: 'bg-blue-700 text-white dark:bg-blue-900 dark:text-blue-200' },
  'Backend & APIs': { bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-900/50', badge: 'bg-emerald-700 text-white dark:bg-emerald-900 dark:text-emerald-200' },
  'Databases & Data Engineering': { bg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-900/50', badge: 'bg-amber-700 text-white dark:bg-amber-900 dark:text-amber-200' },
  'Data Science & AI': { bg: 'bg-purple-50/50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-900/50', badge: 'bg-purple-700 text-white dark:bg-purple-900 dark:text-purple-200' },
  'Cloud & DevOps': { bg: 'bg-cyan-50/50 dark:bg-cyan-950/20', border: 'border-cyan-200 dark:border-cyan-900/50', badge: 'bg-cyan-700 text-white dark:bg-cyan-900 dark:text-cyan-200' },
  'Cybersecurity': { bg: 'bg-rose-50/50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-900/50', badge: 'bg-rose-700 text-white dark:bg-rose-900 dark:text-rose-200' },
  'Mobile, Game & Management': { bg: 'bg-indigo-50/50 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-900/50', badge: 'bg-indigo-700 text-white dark:bg-indigo-900 dark:text-indigo-200' },
};
const DEFAULT_STYLE = { bg: 'bg-neutral-50 dark:bg-neutral-900/60', border: 'border-neutral-200 dark:border-neutral-800', badge: 'bg-neutral-800 text-white dark:bg-neutral-800 dark:text-neutral-200' };
const TIER_ORDER = ['Foundation', 'Intermediate', 'Advanced', 'Specialized'];

const getArray = (data) => Array.isArray(data) ? data : [];

// ==========================================
// MEMOIZED SKILL NODE COMPONENT
// ==========================================
const SkillButton = React.memo(({ skill, isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick(skill)}
      className={`
        relative px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-150
        ${skill.isCompleted 
          ? 'bg-amber-600 dark:bg-amber-500 border-amber-600 dark:border-amber-500 text-white dark:text-neutral-950 shadow-sm' 
          : skill.isLocked 
            ? 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-75' 
            : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 dark:hover:border-amber-400 shadow-sm'}
        ${isSelected ? 'ring-2 ring-amber-500 dark:ring-amber-400 ring-offset-2 dark:ring-offset-neutral-950 border-amber-500' : ''}
      `}
    >
      {skill.isCompleted && <CheckIcon />}
      {skill.isLocked && <LockIcon />}
      {skill.name}
    </button>
  );
});

export default function App() {
  // Database State
  const [SKILLS, setSkills] = useState([]);
  const [ROLES, setRoles] = useState([]);
  const [PREREQUISITES, setPrereqs] = useState([]);

  // Global State
  const [view, setView] = useState(() => {
    if (localStorage.getItem('sgm_jwt_token')) {
      const role = localStorage.getItem('sgm_user_role');
      if (role === 'ADMIN' || role === 'teacher') return 'admin';
      return localStorage.getItem('targetRole') ? 'roadmap' : 'onboarding';
    }
    return 'landing';
  }); 
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('sgm_theme') === 'dark';
    } catch { return false; }
  });
  
  // Auth State
  const [loginId, setLoginId] = useState(() => localStorage.getItem('sgm_login_id') || '');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginType, setLoginType] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 

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

  // Fetch data from Spring Boot Backend on load
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/skills`).then(res => res.json()),
      fetch(`${API_BASE}/api/roles`).then(res => res.json()),
      fetch(`${API_BASE}/api/prerequisites`).then(res => res.json())
    ]).then(([skillsData, rolesData, prereqsData]) => {
      setSkills(skillsData);
      setRoles(rolesData);
      setPrereqs(prereqsData);
    }).catch(err => console.error("Could not reach Spring Boot API:", err));
  }, []);

  // Sync state to LocalStorage & update Dark Mode Document Element
  useEffect(() => {
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
    localStorage.setItem('targetRole', targetRole);
    localStorage.setItem('sgm_students', JSON.stringify(students));
    localStorage.setItem('sgm_theme', darkMode ? 'dark' : 'light');

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSkills, targetRole, students, darkMode]);

  // Sync active student progress to teacher roster
  useEffect(() => {
    if (view !== 'landing' && view !== 'login' && view !== 'login-selection' && view !== 'admin' && view !== 'setup-password' && loginId) {
      setStudents(prev => prev.map(s => 
        s.id === loginId ? { ...s, targetRole, userSkills } : s
      ));
    }
  }, [userSkills, targetRole, loginId, view]);

  // Data Sanitization
  const safeSkills = useMemo(() => getArray(SKILLS).map((s, idx) => {
    const skillName = String(s.name || s['Name'] || 'Unknown');
    const safeUrl = (url) => (url && url !== 'null' && url !== 'undefined' && url !== '#') ? String(url) : null;
    return {
      id: String(s.id || s['Skill ID'] || `sk-${idx}`).trim(), 
      name: skillName,
      category: String(s.category || s['Category'] || 'General'),
      tier: String(s.tier || s['Skill Tier'] || 'Foundation'),
      docUrl: safeUrl(s.docUrl || s['Learning Resource URL']) || `https://www.google.com/search?q=${encodeURIComponent(skillName)}+official+documentation`,
      tutorialUrl: safeUrl(s.tutorialUrl || s['Tutorial & Guide URL']) || `https://www.google.com/search?q=${encodeURIComponent(skillName)}+tutorial+guide`,
      videoUrl: safeUrl(s.videoUrl || s['Video Course URL']) || `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName)}+course+tutorial`,
      practiceUrl: safeUrl(s.practiceUrl || s['Practice & Cheatsheet URL']) || `https://www.google.com/search?q=${encodeURIComponent(skillName)}+cheatsheet+practice+exercises`
    };
  }), [SKILLS]); // <-- Added SKILLS dependency here

  const safeRoles = useMemo(() => getArray(ROLES).map((r, idx) => {
    let reqs = r.requiredSkills || r['Required Skill IDs'] || [];
    if (typeof reqs === 'string') reqs = reqs.split(',');
    return {
      id: String(r.id || r['Role ID'] || `r-${idx}`).trim(),
      title: String(r.title || r['Title'] || 'Unknown'),
      domain: String(r.domain || r['Domain'] || 'IT'),
      requiredSkills: getArray(reqs).map(s => String(s).trim()).filter(Boolean) 
    };
  }), [ROLES]); // <-- Added ROLES dependency here

  const safePrereqs = useMemo(() => getArray(PREREQUISITES).map(p => ({
    source: String(p.source || p['Prerequisite Skill ID']).trim(),
    target: String(p.target || p['Unlocks Skill ID']).trim()
  })).filter(p => p.source && p.target), [PREREQUISITES]); // <-- Added PREREQUISITES dependency here
  // Exact Path Finder
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

  // Roadmap Grouping
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

  // Role Matcher Engine
  const roleMatches = useMemo(() => { 
    return safeRoles.map((role) => {
      const required = role.requiredSkills;
      const possessed = required.filter((id) => userSkills.includes(id));
      const missing = required.filter((id) => !userSkills.includes(id));
      const matchPercentage = required.length === 0 ? 0 : Math.round((possessed.length / required.length) * 100);
      return { ...role, matchPercentage, missing };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [userSkills, safeRoles]);

  // Actions
  const handleLogout = () => {
    localStorage.removeItem('sgm_jwt_token');
    localStorage.removeItem('sgm_login_id');
    localStorage.removeItem('sgm_user_role');
    setLoginId('');
    setLoginPass('');
    setView('landing');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      // 1. Send credentials to your Spring Boot Auth Controller
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           id: loginId.trim(), 
           password: loginPass,
           loginType: loginType  // <--- Tells the backend which portal is being used
         })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials or unauthorized access.');
      }

      // 2. Parse the JWT token from the backend response
      const data = await response.json();
      const token = data.token || data.accessToken; // Adjust based on your Spring Boot DTO

      if (token) {
        // 3. Save the token to use in future secured requests
        localStorage.setItem('sgm_jwt_token', token);
        localStorage.setItem('sgm_login_id', loginId.trim());
        localStorage.setItem('sgm_user_role', data.role || loginType);

        // 4. Route the user based on their role
        if (loginType === 'teacher' || data.role === 'ADMIN') {
          setView('admin');
        } else if (loginType === 'student' && !loginPass) {
          // Triggers first-login flow if password was left blank
          setView('setup-password'); 
        } else {
          // Check if they have a target role set in the database
          setView(data.targetRole ? 'roadmap' : 'onboarding');
        }
      } else {
        setLoginError('Login succeeded, but no token was received.');
      }

    } catch (error) {
      console.error("Login Error:", error);
      setLoginError('Login failed: Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveNewPassword = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/api/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: loginId, password: newPassword })
      });
      setStudents(prev => prev.map(s => s.id === loginId ? { ...s, password: newPassword } : s));
      setView('onboarding'); 
    } catch (error) {
      console.error(error);
    }
  };

  const generateStudent = async () => {
    const newId = customIdInput.trim() || `STU-${Math.floor(Math.random() * 900 + 100)}`; 
    if (students.find(s => s.id === newId)) {
      alert("This ID already exists locally!");
      return;
    }

    try {
      // Send the new student ID to the Spring Boot backend
      const response = await fetch(`${API_BASE}/api/auth/register-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId })
      });

      if (!response.ok) {
        throw new Error("Failed to save student to database. Ensure backend is running.");
      }

      // If successful, update the React UI
      setStudents([...students, { id: newId, hasAccess: true, password: null, targetRole: '', userSkills: [] }]);
      setCustomIdInput(''); 

    } catch (error) {
      alert(error.message);
    }
  };

  const toggleStudentAccess = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, hasAccess: !s.hasAccess } : s));
  };

  const deleteStudent = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${id}?`)) return;
    try {
      // Tell the backend to delete it (if it exists there)
      await fetch(`${API_BASE}/api/auth/delete-student/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Backend check failed, but removing from UI anyway.", error);
    }
    // ALWAYS remove it from the React UI and memory, even if it was a ghost
    setStudents(students.filter(s => s.id !== id));
  };

  const toggleSkill = (skillId) => {
    setUserSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleInspectSkill = useCallback((skill) => {
    setShowResources(false); 
    setSelectedNode(skill);
  }, []);

  const handleInspectSkillById = (skillId) => {
    const rawData = safeSkills.find(s => s.id === skillId);
    if (!rawData) return;
    const prereqs = safePrereqs.filter(p => p.target === skillId).map(p => p.source);
    const missingPrereqs = prereqs.filter(p => !userSkills.includes(p));
    
    setShowResources(false); 
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

  // Theme Toggle Button
  const ThemeToggle = () => (
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  // ==========================================
  // VIEW 1: LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-neutral-900 p-2 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
                <SgmLogo className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Student Growth Map</h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Track your academic and skill progression with confidence</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={() => { setLoginId(''); setLoginPass(''); setLoginError(''); setView('login-selection'); }} className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                Portal Login
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold rounded-full mb-8 border border-amber-300 dark:border-amber-800/80 text-sm">
            Deterministic Academic & Skill Progression Tracker
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            Map Your Journey.<br/>
            <span className="text-amber-600 dark:text-amber-400">Master Your Career.</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl leading-relaxed">
            Eliminate guesswork from your career path. A structured, relational prerequisite engine connecting coursework directly to industry jobs.
          </p>
          
          <button 
            onClick={() => { setLoginId(''); setLoginPass(''); setLoginError(''); setView('login-selection'); }}
            className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 px-8 py-4 rounded-xl font-extrabold text-lg flex items-center gap-3 transition-all shadow-md hover:-translate-y-0.5"
          >
            Get Started <ArrowRightIcon />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg mb-2 text-amber-600 dark:text-amber-500">The Problem</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Students struggle to translate vague career goals into daily tasks, treating progression like a maze instead of a manageable climb.</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg mb-2 text-amber-600 dark:text-amber-500">The Solution</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">A highly structured, relational database mapping prerequisite skills to exact curriculum nodes and industry roles.</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg mb-2 text-amber-600 dark:text-amber-500">The Method</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">Assess baseline skills, target a goal, map logic securely via backend, and track progress visually.</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 w-full text-neutral-500 dark:text-neutral-400 text-sm font-semibold">
            Project Members: Aayur Mehrotra, Mahir Jada, Arjun Menon, Ayush Lad • Guide: Prof. Aruna Gupta
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
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Select Portal</h2>
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full justify-center">
          
          <button onClick={() => { setLoginType('teacher'); setView('login'); }} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left hover:border-amber-500 dark:hover:border-amber-400 transition-all shadow-sm hover:shadow-md w-full md:w-1/3">
            <h3 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Teacher</h3>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">Manage student tokens, track class progress, and control platform access.</p>
          </button>

          <button onClick={() => { setLoginType('student'); setView('login'); }} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border-2 border-amber-500 dark:border-amber-400 text-left hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md w-full md:w-1/3">
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">Student</h3>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">Log in using a secure token provided by your institution or professor.</p>
          </button>

          <button onClick={() => { setLoginType('individual'); setView('login'); }} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left hover:border-amber-500 dark:hover:border-amber-400 transition-all shadow-sm hover:shadow-md w-full md:w-1/3">
            <h3 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white">Individual</h3>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">Create a personal roadmap without a teacher token. Auto-registers on login.</p>
          </button>

        </div>
        <button onClick={() => setView('landing')} className="mt-10 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
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
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
          <h2 className="text-3xl font-extrabold mb-2 capitalize text-neutral-900 dark:text-white">{loginType} Portal</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-medium">
            {loginType === 'teacher' && "Enter your admin credentials."}
            {loginType === 'student' && "Enter the access token provided by your teacher."}
            {loginType === 'individual' && "Enter a username. We will create an account if it doesn't exist."}
          </p>
          
          {loginError && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-semibold rounded-xl text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-bold mb-2 text-neutral-800 dark:text-neutral-200">
                {loginType === 'teacher' ? 'Admin ID' : loginType === 'student' ? 'Teacher Access ID' : 'Username'}
              </label>
              <input 
                type="text" 
                required 
                className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all" 
                placeholder={loginType === 'individual' ? "e.g. johndoe99" : "Enter ID"}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block font-bold mb-2 text-neutral-800 dark:text-neutral-200">Password</label>
              <input 
                type="password" 
                required={loginType === 'teacher' || loginType === 'individual'} 
                className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all" 
                placeholder={loginType === 'student' ? "Leave blank if first time logging in" : "••••••••"}
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 font-extrabold py-4 rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Waking up server...
                </>
              ) : (
                loginType === 'individual' ? 'Login / Register' : 'Login & Continue'
              )}
            </button>
          </form>

          {loginType === 'teacher' && (
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 font-medium text-center">
              <p><strong>Demo:</strong> ID: admin | Pass: admin</p>
            </div>
          )}

          <button onClick={() => setView('login-selection')} className="mt-6 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white mx-auto block transition-colors">
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
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 w-full max-w-md">
          <h2 className="text-3xl font-extrabold mb-2 text-neutral-900 dark:text-white">Welcome, {loginId}</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-medium">Please set a password to secure your roadmap.</p>
          
          <form onSubmit={saveNewPassword} className="space-y-6">
            <div>
              <label className="block font-bold mb-2 text-neutral-800 dark:text-neutral-200">Create Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all" 
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 font-extrabold py-4 rounded-xl transition-colors shadow-md">
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
      <div className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">TEACHER DASHBOARD</h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Student Access Management</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button onClick={handleLogout} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
               Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow p-8 max-w-5xl mx-auto w-full mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Access Control</h2>
              <p className="text-neutral-600 dark:text-neutral-400 font-medium">Generate unique tokens to grant students access to the Growth Map platform.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Custom ID (e.g. 101)" 
                className="p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white font-bold focus:border-amber-500 focus:outline-none"
                value={customIdInput}
                onChange={(e) => setCustomIdInput(e.target.value)}
              />
              <button onClick={generateStudent} className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-sm transition-all flex-shrink-0">
                <KeyIcon /> Create Token
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Student ID</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Target Goal</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs">Progress</th>
                  <th className="p-5 font-bold uppercase tracking-wider text-xs text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {students.map((student) => {
                  const roleName = safeRoles.find(r => r.id === student.targetRole)?.title || 'Not Set';
                  const skillCount = student.userSkills?.length || 0;
                  return (
                  <tr key={student.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="p-5 font-bold text-lg font-mono text-amber-600 dark:text-amber-400">
                      {student.id}
                      {!student.password && <span className="block text-xs text-rose-500 font-semibold mt-0.5">Password not set</span>}
                    </td>
                    <td className="p-5 font-semibold text-neutral-800 dark:text-neutral-200">{roleName}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-lg text-sm border border-neutral-200 dark:border-neutral-700">{skillCount} Skills Mastered</span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-3">
                      <button 
                        onClick={() => toggleStudentAccess(student.id)}
                        className={`px-4 py-2 rounded-xl font-bold border text-sm transition-all ${student.hasAccess ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100' : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'}`}
                      >
                        {student.hasAccess ? 'Revoke' : 'Grant'}
                      </button>
                      <button 
                        onClick={() => deleteStudent(student.id)}
                        className="px-4 py-2 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )})}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-neutral-500 font-medium">No students registered yet.</td>
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
      <div className={`min-h-screen p-8 flex flex-col items-center transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="absolute top-6 right-6"><ThemeToggle /></div>
        <div className="max-w-3xl w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-10 shadow-xl mt-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">Set Your Baseline</h2>
            <button onClick={handleLogout} className="text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors">Logout</button>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 font-medium">Select your dream career path and any foundational skills you already have.</p>
          
          <div className="mb-10">
            <label className="block font-bold mb-3 text-lg text-neutral-900 dark:text-white">1. Target Career Goal</label>
            <input 
              type="text" 
              placeholder="Search careers (e.g. 'Backend', 'Data Scientist')..." 
              className="w-full p-4 mb-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-semibold text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
            />
            <div className="h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 bg-neutral-50 dark:bg-neutral-950 custom-scrollbar flex flex-col gap-2">
              {safeRoles
                .filter(r => roleSearch ? r.title.toLowerCase().includes(roleSearch.toLowerCase()) || r.domain.toLowerCase().includes(roleSearch.toLowerCase()) : true)
                .map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setTargetRole(role.id)}
                    className={`text-left p-4 rounded-xl border font-bold transition-all ${
                      targetRole === role.id 
                        ? 'bg-amber-600 dark:bg-amber-500 border-amber-600 dark:border-amber-500 text-white dark:text-neutral-950 shadow-sm' 
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-amber-400'
                    }`}
                  >
                    {role.title} <span className={`text-xs uppercase font-extrabold ml-2 ${targetRole === role.id ? 'text-amber-200 dark:text-neutral-800' : 'text-neutral-400 dark:text-neutral-500'}`}>({role.domain})</span>
                  </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <label className="block font-bold mb-3 text-lg text-neutral-900 dark:text-white">2. Current Skills Mastered</label>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 font-medium">Search and select the foundational skills you already understand.</p>
            
            <input 
              type="text" 
              placeholder="Search skills (e.g. 'Python', 'SQL')..." 
              className="w-full p-4 mb-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl font-semibold text-neutral-900 dark:text-white focus:border-amber-500 focus:outline-none transition-all"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
            />

            <div className="h-60 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 bg-neutral-50 dark:bg-neutral-950 custom-scrollbar">
              {safeSkills
                .filter(s => skillSearch ? s.name.toLowerCase().includes(skillSearch.toLowerCase()) : s.tier === 'Foundation')
                .map(skill => (
                <label key={skill.id} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-neutral-900 rounded-xl cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-amber-600 dark:accent-amber-500 rounded"
                    checked={userSkills.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                  />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{skill.name}</span>
                  <span className="text-xs font-bold uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2.5 py-0.5 rounded-md border border-neutral-300 dark:border-neutral-700">{skill.category}</span>
                </label>
              ))}
            </div>
          </div>

          <button 
            disabled={!targetRole}
            onClick={() => setView('roadmap')}
            className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 font-black py-4 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            Generate My Roadmap
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: ROADMAP DASHBOARD (Fixed Header & High-Contrast Colors)
  // ==========================================
  return (
    <div className={`flex flex-col lg:flex-row h-screen w-full font-sans overflow-hidden transition-colors duration-200 ${darkMode ? 'dark bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
      
      {/* LEFT PANE: Roadmap Map (Hardware Accelerated, Clean Scrolling) */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 relative lg:border-r border-neutral-200 dark:border-neutral-800 custom-scrollbar transform-gpu will-change-scroll">
        
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setView('onboarding')} 
            className="text-xs font-bold bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 rounded-xl hover:border-amber-500 dark:hover:border-amber-400 transition-colors shadow-sm"
          >
            ← Back to Setup
          </button>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto">
          <header className="mb-14 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Career Progression Map</h1>
            {targetRole && (
              <p className="text-base font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/50 inline-block px-5 py-2 rounded-full border border-amber-300 dark:border-amber-800">
                Target Role: {safeRoles.find(r => r.id === targetRole)?.title}
              </p>
            )}
          </header>

          <div className="relative">
            {/* Visual connector line */}
            <div className="absolute left-8 top-4 bottom-0 w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full z-0 hidden md:block"></div>

            {roadmapData.map((tierGroup, tIdx) => (
              <div key={tierGroup.tier} className="mb-16 relative z-10">
                
                {/* Fixed Non-Sticky Header: Scrolls naturally without getting stuck in the air */}
                <div className="flex items-center gap-4 mb-6 py-2">
                  <div className="w-14 h-14 bg-amber-600 dark:bg-amber-500 text-white dark:text-neutral-950 rounded-2xl shadow-md flex items-center justify-center font-black text-2xl flex-shrink-0">
                    {tIdx + 1}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">{tierGroup.tier} Tier</h2>
                </div>

                {/* Categories inside Tier */}
                <div className="md:ml-20 space-y-6">
                  {tierGroup.categories.map((cat) => {
                    const style = CATEGORY_STYLES[cat.category] || DEFAULT_STYLE;
                    return (
                      <div key={cat.category} className={`border ${style.border} ${style.bg} rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-0.5`}>
                        <div className="flex items-center gap-4 mb-5">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${style.badge}`}>{cat.category}</span>
                          <div className="h-px flex-grow bg-neutral-200 dark:bg-neutral-800"></div>
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                          {cat.skills.map(skill => (
                            <SkillButton 
                              key={skill.id} 
                              skill={skill} 
                              isSelected={selectedNode?.id === skill.id}
                              onClick={handleInspectSkill}
                            />
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

      {/* RIGHT SIDEBAR: Inspector & Job Matcher */}
      <div className="w-full lg:w-[480px] h-[45vh] lg:h-full flex-shrink-0 bg-white dark:bg-neutral-900 flex flex-col shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:shadow-2xl z-20 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800">
        
        {/* Top Half: Node Inspector */}
        <div className="p-5 lg:p-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/70 flex flex-col justify-center relative z-20">
          {selectedNode ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-extrabold uppercase rounded-md">{selectedNode.tier}</span>
                <span className="px-2.5 py-1 bg-neutral-800 dark:bg-neutral-700 text-white text-xs font-extrabold uppercase rounded-md">{selectedNode.category}</span>
              </div>
              
              <h2 className="text-3xl font-black mb-5 leading-tight break-words text-neutral-900 dark:text-white">{selectedNode.name}</h2>
              
              {/* Learning Resources Dropdown */}
              <div className="relative mb-6">
                <button 
                  onClick={() => setShowResources(!showResources)} 
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl font-bold text-neutral-900 dark:text-white hover:border-amber-500 dark:hover:border-amber-400 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <BookIcon /> Learning Resources
                  </div>
                  {showResources ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {showResources && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
                    <a href={selectedNode.docUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors">
                      <ExternalLinkIcon /> Academic Resources
                    </a>
                    <a href={selectedNode.tutorialUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors">
                      <BookIcon /> Tutorials & Guides
                    </a>
                    <a href={selectedNode.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors">
                      <VideoIcon /> Video Courses
                    </a>
                    <a href={selectedNode.practiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-5 py-3.5 hover:bg-amber-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-amber-700 dark:hover:text-amber-300 font-semibold transition-colors">
                      <CodeIcon /> Practice & Cheatsheets
                    </a>
                  </div>
                )}
              </div>

              {/* Master Button */}
              <button 
                onClick={() => toggleSkill(selectedNode.id)}
                disabled={selectedNode.isLocked}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border ${
                  selectedNode.isCompleted 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                    : selectedNode.isLocked 
                      ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed' 
                      : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 shadow-md'
                }`}
              >
                {selectedNode.isCompleted ? <><CheckIcon /> Mastered</> : 'Mark as Mastered'}
              </button>

              {selectedNode.isLocked && (
                <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                  <span className="font-bold block mb-1">Locked. Missing Prerequisites:</span>
                  {selectedNode.missingPrereqs.join(', ')}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-neutral-400 dark:text-neutral-500 flex flex-col items-center py-8">
              <MapIcon />
              <p className="mt-3 font-bold uppercase tracking-wider text-xs">Select a skill node to inspect</p>
            </div>
          )}
        </div>

        {/* Bottom Half: Closest Jobs Matcher */}
        <div className="p-5 lg:p-8 flex-grow overflow-y-auto bg-white dark:bg-neutral-900 custom-scrollbar z-10 transform-gpu will-change-scroll">
          <h3 className="text-xl font-black mb-1 tracking-tight text-neutral-900 dark:text-white">Role Matcher</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-bold uppercase tracking-wider">Click any role to update your targeted path</p>
          <div className="space-y-4">
            {roleMatches.map((role) => {
              const isTarget = role.id === targetRole;
              return (
                <div 
                  key={role.id} 
                  onClick={() => setTargetRole(role.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isTarget 
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500 dark:border-amber-500 shadow-md ring-1 ring-amber-500' 
                      : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h4 className="font-bold text-neutral-900 dark:text-white leading-tight">
                      {isTarget && <span className="text-amber-600 dark:text-amber-400 mr-1.5">★</span>}
                      {role.title}
                    </h4>
                    <span className={`px-2.5 py-1 text-xs font-black rounded-lg ${isTarget ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
                      {role.matchPercentage}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 mb-3 overflow-hidden">
                    <div className={`${isTarget ? 'bg-amber-600 dark:bg-amber-500' : 'bg-neutral-400 dark:bg-neutral-600'} h-full transition-all duration-500 ease-out`} style={{ width: `${role.matchPercentage}%` }}></div>
                  </div>

                  {role.missing.length > 0 ? (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                      <span className="font-bold text-amber-700 dark:text-amber-400">{role.missing.length} skills away:</span>{' '}
                      {role.missing.slice(0, 3).map((id, idx) => (
                        <span key={id}>
                          {idx > 0 && ', '}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleInspectSkillById(id); }} 
                            className="text-neutral-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 hover:underline font-semibold transition-colors"
                          >
                            {safeSkills.find(s => s.id === id)?.name || id}
                          </button>
                        </span>
                      ))}
                      {role.missing.length > 3 && ' ...'}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Target Achieved!</p>
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