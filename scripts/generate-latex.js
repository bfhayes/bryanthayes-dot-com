#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// LaTeX escape function
function escapeLatex(text) {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[{}]/g, '\\$&')
    .replace(/[$]/g, '\\$')
    .replace(/[&%#]/g, '\\$&')
    .replace(/[~^]/g, '\\textasciitilde{}')
    .replace(/_/g, '\\_')
    .replace(/"/g, "''")
    .replace(/</g, '\\textless{}')
    .replace(/>/g, '\\textgreater{}');
}

// Safe escape - preserves some LaTeX commands we want to keep
function safeEscape(text) {
  // First escape everything
  let escaped = escapeLatex(text);
  
  // Then restore specific patterns we want to keep as LaTeX
  escaped = escaped.replace(/\\textbackslash\{\}%/g, '\\%'); // Restore \%
  
  return escaped;
}

function generateExperienceSection(experience) {
  let experienceLatex = '';
  
  experience.forEach((job, index) => {
    experienceLatex += `\\experienceitem
  {${escapeLatex(job.position)}}
  {${escapeLatex(job.company)} — ${escapeLatex(job.location)}}
  {}
  {${job.startDate} – ${job.endDate}}
\\begin{itemize}
`;
    
    job.highlights.forEach(highlight => {
      experienceLatex += `  \\item ${safeEscape(highlight)}\n`;
    });
    
    experienceLatex += '\\end{itemize}\n\n';
    
    if (index < experience.length - 1) {
      experienceLatex += '\\vspace{4pt}\n';
    }
  });
  
  return experienceLatex.trim();
}

function generateSkillsSection(skills) {
  let skillsLatex = '';
  
  const skillCategories = Object.entries(skills);
  skillCategories.forEach(([category, skillList], index) => {
    if (category === 'Domains') return; // Skip domains for LaTeX version
    
    skillsLatex += `\\textbf{${escapeLatex(category)}:} ${skillList.map(skill => escapeLatex(skill)).join(' · ')}`;
    
    if (index < skillCategories.length - 2) { // -2 because we skip Domains
      skillsLatex += '\\\\\n';
    }
  });
  
  return skillsLatex;
}

function generateEducationSection(education) {
  if (!education || education.length === 0) return '';
  
  const edu = education[0]; // Assuming single education entry
  return `\\educationitem
  {${escapeLatex(edu.degree)}}
  {${escapeLatex(edu.institution)}, ${escapeLatex(edu.location)}}
  {${edu.year}}
  {${escapeLatex(edu.honors)}}`;
}

function generateLatexFromJson() {
  try {
    log('blue', 'Generating LaTeX from JSON data...');
    
    // Read resume data
    const resumeDataPath = path.join(__dirname, '../src/data/resume.json');
    const templatePath = path.join(__dirname, '../src/resume/resume-template.tex');
    const outputPath = path.join(__dirname, '../src/resume/resume.tex');
    
    if (!fs.existsSync(resumeDataPath)) {
      log('red', `Error: Resume data not found at ${resumeDataPath}`);
      process.exit(1);
    }
    
    if (!fs.existsSync(templatePath)) {
      log('red', `Error: Template not found at ${templatePath}`);
      process.exit(1);
    }
    
    const resumeData = JSON.parse(fs.readFileSync(resumeDataPath, 'utf8'));
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    const replacements = {
      'PERSONAL_NAME': resumeData.personal.name,
      'PERSONAL_TITLE': resumeData.personal.title,
      'PERSONAL_PHONE': resumeData.personal.phone,
      'PERSONAL_EMAIL': resumeData.personal.email,
      'PERSONAL_LOCATION': resumeData.personal.location,
      'PERSONAL_LINKEDIN': resumeData.personal.linkedin,
      'PROFESSIONAL_SUMMARY': safeEscape(resumeData.summary),
      'EXPERIENCE_SECTION': generateExperienceSection(resumeData.experience),
      'SKILLS_SECTION': generateSkillsSection(resumeData.skills),
      'EDUCATION_SECTION': generateEducationSection(resumeData.education)
    };
    
    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      const pattern = new RegExp(`{{${placeholder}}}`, 'g');
      template = template.replace(pattern, value);
    });
    
    // Write generated LaTeX
    fs.writeFileSync(outputPath, template);
    log('green', `✓ LaTeX generated successfully at ${outputPath}`);
    
    return true;
  } catch (error) {
    log('red', `✗ Error generating LaTeX: ${error.message}`);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const success = generateLatexFromJson();
  process.exit(success ? 0 : 1);
}

module.exports = { generateLatexFromJson };