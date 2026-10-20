import fs from 'fs';
// Import your existing data (ensure data.js has "export const SKILLS = ..." etc.)
import { SKILLS, ROLES, PREREQUISITES } from './data.js';

// Helper to escape single quotes for SQL compatibility
const escapeSQL = (str) => {
    if (!str) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
};

let sql = `-- SGM Database Migration Script\n\n`;

// 1. Process Skills (Maps to 'skills' table)
sql += `-- =================== SKILLS ===================\n`;
SKILLS.forEach(s => {
    sql += `INSERT INTO skills (skill_id, name, category, tier, doc_url, tutorial_url, video_url, practice_url) VALUES (` +
        `${escapeSQL(s['Skill ID'] || s.id)}, ` +
        `${escapeSQL(s['Name'] || s.name)}, ` +
        `${escapeSQL(s['Category'] || s.category)}, ` +
        `${escapeSQL(s['Skill Tier'] || s.tier)}, ` +
        `${escapeSQL(s['Learning Resource URL'] || s.docUrl)}, ` +
        `${escapeSQL(s['Tutorial & Guide URL'] || s.tutorialUrl)}, ` +
        `${escapeSQL(s['Video Course URL'] || s.videoUrl)}, ` +
        `${escapeSQL(s['Practice & Cheatsheet URL'] || s.practiceUrl)});\n`;
});

// 2. Process Roles (Maps to 'roles' and 'role_requirements' tables)
sql += `\n-- =================== ROLES ===================\n`;
if (typeof ROLES !== 'undefined') {
    ROLES.forEach(r => {
        const roleId = r['Role ID'] || r.id;
        sql += `INSERT INTO roles (role_id, title, domain) VALUES (` +
            `${escapeSQL(roleId)}, ` +
            `${escapeSQL(r['Title'] || r.title)}, ` +
            `${escapeSQL(r['Domain'] || r.domain)});\n`;

        // Handle the @ElementCollection join table
        let reqs = r['Required Skill IDs'] || r.requiredSkills || [];
        if (typeof reqs === 'string') reqs = reqs.split(',');
        
        reqs.forEach(skillId => {
            const cleanSkillId = skillId.trim();
            if (cleanSkillId) {
                sql += `INSERT INTO role_requirements (role_id, skill_id) VALUES (${escapeSQL(roleId)}, ${escapeSQL(cleanSkillId)});\n`;
            }
        });
    });
}

// 3. Process Prerequisites (Maps to 'prerequisites' table)
sql += `\n-- =============== PREREQUISITES ===============\n`;
if (typeof PREREQUISITES !== 'undefined') {
    PREREQUISITES.forEach(p => {
        const sourceId = p['Prerequisite Skill ID'] || p.source;
        const targetId = p['Unlocks Skill ID'] || p.target;
        sql += `INSERT INTO prerequisites (source_skill_id, target_skill_id) VALUES (${escapeSQL(sourceId)}, ${escapeSQL(targetId)});\n`;
    });
}

// Write the output file
fs.writeFileSync('data.sql', sql);
console.log('✅ Successfully generated data.sql with ' + SKILLS.length + ' skills!');