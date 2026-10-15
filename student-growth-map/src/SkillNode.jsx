import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Native SVGs
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SparkleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3Z"/></svg>;

const CATEGORY_STYLES = {
  'CS Core': { bg: 'bg-slate-500', border: 'border-slate-600', active: 'border-slate-500', text: 'text-slate-700', ring: 'ring-slate-100' },
  'Frontend & UI/UX': { bg: 'bg-blue-500', border: 'border-blue-600', active: 'border-blue-500', text: 'text-blue-700', ring: 'ring-blue-100' },
  'Backend & APIs': { bg: 'bg-emerald-500', border: 'border-emerald-600', active: 'border-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-100' },
  'Databases & Data Engineering': { bg: 'bg-amber-500', border: 'border-amber-600', active: 'border-amber-500', text: 'text-amber-700', ring: 'ring-amber-100' },
  'Data Science & AI': { bg: 'bg-purple-500', border: 'border-purple-600', active: 'border-purple-500', text: 'text-purple-700', ring: 'ring-purple-100' },
  'Cloud & DevOps': { bg: 'bg-cyan-500', border: 'border-cyan-600', active: 'border-cyan-500', text: 'text-cyan-700', ring: 'ring-cyan-100' },
  'Cybersecurity': { bg: 'bg-rose-500', border: 'border-rose-600', active: 'border-rose-500', text: 'text-rose-700', ring: 'ring-rose-100' },
  'Mobile, Game & Management': { bg: 'bg-indigo-500', border: 'border-indigo-600', active: 'border-indigo-500', text: 'text-indigo-700', ring: 'ring-indigo-100' },
};

export default function SkillNode({ data }) {
  const { skill, status, missingPrereqs } = data;
  const style = CATEGORY_STYLES[skill.category] || { bg: 'bg-gray-500', border: 'border-gray-600', active: 'border-gray-500', text: 'text-gray-700', ring: 'ring-gray-100' };

  if (status === 'completed') {
    return (
      <div className={`px-4 py-2 shadow-md rounded-md ${style.bg} border ${style.border} text-white flex items-center gap-2 w-[250px]`}>
        <CheckIcon />
        <div className="font-bold text-sm truncate">{skill.name}</div>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className="px-4 py-2 shadow-sm rounded-md bg-gray-100 border border-gray-300 text-gray-400 grayscale flex items-center gap-2 cursor-not-allowed group relative w-[250px]">
        <LockIcon />
        <div className="font-medium text-sm truncate">{skill.name}</div>
        
        {/* Prerequisite Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-xs p-2 bg-gray-800 text-white text-xs rounded z-50 whitespace-normal">
          Missing Prerequisites: {missingPrereqs.join(', ')}
        </div>
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    );
  }

  // Active (Ready to learn - pulse animation)
  return (
    <div className={`px-4 py-2 shadow-lg rounded-md bg-white border-2 ${style.active} ${style.text} flex items-center gap-2 animate-pulse ring-4 ${style.ring} cursor-pointer w-[250px]`}>
      <SparkleIcon />
      <div className="font-bold text-sm truncate">{skill.name}</div>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}