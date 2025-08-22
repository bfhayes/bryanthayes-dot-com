#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { input, select, checkbox, confirm } from '@inquirer/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category configuration
const CATEGORIES = {
  photography: {
    label: 'Photography',
    icon: '📷',
    description: 'Photos, collections, and photography projects',
    fields: {
      category: ['landscapes', 'portraits', 'street', 'events', 'nature', 'macro', 'abstract'],
      camera: 'string',
      lens: 'string',
      location: 'string'
    }
  },
  woodworking: {
    label: 'Woodworking',
    icon: '🪵',
    description: 'Furniture and handcrafted wood pieces',
    fields: {
      difficulty: ['Beginner', 'Intermediate', 'Advanced'],
      woodSpecies: 'string',
      finish: 'string',
      dimensions: 'string'
    }
  },
  leatherwork: {
    label: 'Leatherwork',
    icon: '👜',
    description: 'Custom bags, wallets, and leather accessories',
    fields: {
      type: ['wallet', 'bag', 'belt', 'accessory', 'other'],
      difficulty: ['Beginner', 'Intermediate', 'Advanced'],
      leather: 'string',
      thickness: 'string',
      tanning: ['vegetable', 'chrome', 'combination'],
      dimensions: 'string'
    }
  },
  music: {
    label: 'Music',
    icon: '🎸',
    description: 'Guitar compositions and recordings',
    fields: {
      type: ['composition', 'cover', 'arrangement', 'recording'],
      key: 'string',
      tempo: 'string',
      duration: 'string'
    }
  },
  engineering: {
    label: 'Engineering',
    icon: '⚙️',
    description: 'Software and hardware projects',
    fields: {
      type: ['software', 'hardware', 'embedded', 'web', 'mobile', 'other'],
      difficulty: ['Beginner', 'Intermediate', 'Advanced'],
      status: ['completed', 'in_progress', 'paused', 'archived'],
      github_url: 'string',
      live_url: 'string'
    }
  },
  costuming: {
    label: 'Costuming',
    icon: '🎭',
    description: 'Halloween costumes and cosplay',
    fields: {
      type: ['halloween', 'cosplay', 'historical', 'fantasy', 'theatrical'],
      difficulty: ['Beginner', 'Intermediate', 'Advanced'],
      character: 'string',
      source_material: 'string',
      size: 'string',
      budget: 'number'
    }
  },
  food: {
    label: 'Food',
    icon: '🍖',
    description: 'Recipes and cooking projects',
    fields: {
      type: ['recipe', 'technique', 'experiment', 'bbq', 'baking'],
      difficulty: ['Easy', 'Medium', 'Hard'],
      cuisine: 'string',
      prep_time: 'string',
      cook_time: 'string',
      servings: 'number',
      temperature: 'string'
    }
  }
};

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function collectBasicInfo() {
  console.log('\n🚀 Welcome to the Project Creator!\n');

  const category = await select({
    message: 'Which category is this project for?',
    choices: Object.entries(CATEGORIES).map(([key, config]) => ({
      name: `${config.icon} ${config.label}`,
      value: key,
      description: config.description
    }))
  });

  const title = await input({
    message: 'Project title:',
    validate: (input) => input.length > 0 || 'Please enter a title'
  });

  const description = await input({
    message: 'Project description:',
    validate: (input) => input.length > 0 || 'Please enter a description'
  });

  const slug = await input({
    message: 'Project slug (for URL):',
    default: createSlug(title),
    validate: (input) => {
      if (input.length === 0) return 'Please enter a slug';
      if (!/^[a-z0-9-]+$/.test(input)) return 'Slug can only contain lowercase letters, numbers, and hyphens';
      return true;
    }
  });

  const heroImage = await input({
    message: 'Hero image path (optional):',
    default: `/images/projects/${slug}-thumb.jpg`
  });

  const galleryInput = await input({
    message: 'Gallery image paths (comma-separated, optional):'
  });

  const gallery = galleryInput
    ? galleryInput.split(',').map(path => path.trim()).filter(path => path.length > 0)
    : [`/images/projects/${slug}-1.jpg`];

  const tagsInput = await input({
    message: 'Tags (comma-separated):'
  });

  const tags = tagsInput
    ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    : [];

  const featured = await confirm({
    message: 'Is this a featured project?',
    default: false
  });

  const draft = await confirm({
    message: 'Save as draft?',
    default: false
  });

  return {
    category,
    title,
    description,
    slug,
    heroImage,
    gallery,
    tags,
    featured,
    draft,
    publishDate: new Date()
  };
}

async function collectCategoryFields(category, categoryConfig) {
  const fields = {};
  
  console.log(`\n📝 ${categoryConfig.label}-specific fields:\n`);

  for (const [fieldName, fieldType] of Object.entries(categoryConfig.fields)) {
    if (Array.isArray(fieldType)) {
      // Multiple choice field
      const value = await select({
        message: `${fieldName}:`,
        choices: fieldType.map(option => ({ name: option, value: option }))
      });
      fields[fieldName] = value;
    } else if (fieldType === 'string') {
      // String field
      const value = await input({
        message: `${fieldName} (optional):`
      });
      if (value) fields[fieldName] = value;
    } else if (fieldType === 'number') {
      // Number field
      const value = await input({
        message: `${fieldName} (optional):`,
        validate: (input) => {
          if (!input) return true;
          return !isNaN(input) || 'Please enter a number';
        }
      });
      if (value) fields[fieldName] = parseInt(value);
    }
  }

  // Collect arrays based on category
  if (category === 'woodworking') {
    const materialsInput = await input({
      message: 'Materials (comma-separated):'
    });
    if (materialsInput) {
      fields.materials = materialsInput.split(',').map(m => m.trim()).filter(m => m.length > 0);
    }

    const toolsInput = await input({
      message: 'Tools used (comma-separated):'
    });
    if (toolsInput) {
      fields.tools = toolsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    const joineryInput = await input({
      message: 'Joinery techniques (comma-separated, optional):'
    });
    if (joineryInput) {
      fields.joinery = joineryInput.split(',').map(j => j.trim()).filter(j => j.length > 0);
    }

    const duration = await input({
      message: 'Duration (e.g., "2 weeks"):',
      validate: (input) => input.length > 0 || 'Please enter duration'
    });
    fields.duration = duration;

  } else if (category === 'leatherwork') {
    const duration = await input({
      message: 'Duration (e.g., "1 week"):',
      validate: (input) => input.length > 0 || 'Please enter duration'
    });
    fields.duration = duration;

    const techniquesInput = await input({
      message: 'Techniques used (comma-separated, optional):'
    });
    if (techniquesInput) {
      fields.techniques = techniquesInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

    const hardwareInput = await input({
      message: 'Hardware used (comma-separated, optional):'
    });
    if (hardwareInput) {
      fields.hardware = hardwareInput.split(',').map(h => h.trim()).filter(h => h.length > 0);
    }

  } else if (category === 'engineering') {
    const techInput = await input({
      message: 'Technologies used (comma-separated):',
      validate: (input) => input.length > 0 || 'Please enter at least one technology'
    });
    fields.technologies = techInput.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const langInput = await input({
      message: 'Programming languages (comma-separated, optional):'
    });
    if (langInput) {
      fields.languages = langInput.split(',').map(l => l.trim()).filter(l => l.length > 0);
    }

    const frameworkInput = await input({
      message: 'Frameworks used (comma-separated, optional):'
    });
    if (frameworkInput) {
      fields.frameworks = frameworkInput.split(',').map(f => f.trim()).filter(f => f.length > 0);
    }

  } else if (category === 'music') {
    const genreInput = await input({
      message: 'Genre (comma-separated):',
      validate: (input) => input.length > 0 || 'Please enter at least one genre'
    });
    fields.genre = genreInput.split(',').map(g => g.trim()).filter(g => g.length > 0);

    const instrumentsInput = await input({
      message: 'Instruments (comma-separated):',
      validate: (input) => input.length > 0 || 'Please enter at least one instrument'
    });
    fields.instruments = instrumentsInput.split(',').map(i => i.trim()).filter(i => i.length > 0);

  } else if (category === 'costuming') {
    const materialsInput = await input({
      message: 'Materials used (comma-separated):',
      validate: (input) => input.length > 0 || 'Please enter materials'
    });
    fields.materials = materialsInput.split(',').map(m => m.trim()).filter(m => m.length > 0);

    const duration = await input({
      message: 'Duration (e.g., "2 weeks"):',
      validate: (input) => input.length > 0 || 'Please enter duration'
    });
    fields.duration = duration;

    const techniquesInput = await input({
      message: 'Techniques used (comma-separated, optional):'
    });
    if (techniquesInput) {
      fields.techniques = techniquesInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    }

  } else if (category === 'food') {
    const ingredientsInput = await input({
      message: 'Main ingredients (item:amount format, comma-separated):',
      validate: (input) => input.length > 0 || 'Please enter ingredients'
    });
    
    fields.ingredients = ingredientsInput.split(',').map(ingredient => {
      const parts = ingredient.trim().split(':');
      return {
        item: parts[0]?.trim() || ingredient.trim(),
        amount: parts[1]?.trim() || '1 unit'
      };
    });

    const equipmentInput = await input({
      message: 'Equipment needed (comma-separated, optional):'
    });
    if (equipmentInput) {
      fields.equipment = equipmentInput.split(',').map(e => e.trim()).filter(e => e.length > 0);
    }

    const total_time = await input({
      message: 'Total time (e.g., "2 hours"):',
      validate: (input) => input.length > 0 || 'Please enter total time'
    });
    fields.total_time = total_time;
  }

  return fields;
}

function generateFrontmatter(basicInfo, categoryFields) {
  const frontmatter = {
    title: basicInfo.title,
    description: basicInfo.description,
    publishDate: formatDate(basicInfo.publishDate),
    heroImage: basicInfo.heroImage,
    gallery: basicInfo.gallery,
    tags: basicInfo.tags,
    featured: basicInfo.featured,
    draft: basicInfo.draft,
    ...categoryFields
  };

  let yaml = '---\n';
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === null || value === undefined) continue;
    
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      yaml += `${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          yaml += `  - item: "${item.item}"\n`;
          yaml += `    amount: "${item.amount}"\n`;
          if (item.notes) yaml += `    notes: "${item.notes}"\n`;
        } else {
          yaml += `  - "${item}"\n`;
        }
      }
    } else if (typeof value === 'boolean') {
      yaml += `${key}: ${value}\n`;
    } else if (typeof value === 'number') {
      yaml += `${key}: ${value}\n`;
    } else {
      yaml += `${key}: "${value}"\n`;
    }
  }
  
  yaml += '---\n\n';
  return yaml;
}

function generateTemplate(category, basicInfo) {
  const templates = {
    woodworking: `## The Project

[Describe the inspiration and goals for this woodworking project]

## Construction Process

1. **Preparation**: [Describe material preparation]
2. **Assembly**: [Describe the build process]
3. **Finishing**: [Describe finishing techniques]

## Lessons Learned

[What did you learn from this project? Any tips for future builds?]`,

    leatherwork: `## Design Philosophy

[Describe the design approach and goals for this leather piece]

## Construction Details

[Describe the materials, techniques, and construction process]

## Results

[How did the finished piece turn out? How does it perform in use?]`,

    photography: `## The Shot

[Describe the circumstances, location, or inspiration for this photograph]

## Technical Details

[Discuss the technical approach, settings, and equipment used]

## Post Processing

[Describe any editing or processing techniques applied]`,

    music: `## The Composition

[Describe the inspiration and musical ideas behind this piece]

## Musical Elements

[Discuss the musical structure, harmony, melody, and arrangement]

## Recording Notes

[If applicable, describe the recording process and equipment used]`,

    engineering: `## Project Overview

[Describe the problem this project solves and your approach]

## Technical Implementation

[Detail the technical architecture and key implementation decisions]

## Challenges and Solutions

[Discuss any interesting problems you encountered and how you solved them]

## Results and Future Work

[What were the outcomes? What would you do differently or add next?]`,

    costuming: `## Character Research

[Describe the character or historical period you're representing]

## Construction Process

[Detail the pattern making, fabric selection, and construction techniques]

## Final Result

[How did the finished costume look and perform? Include any performance notes]`,

    food: `## The Recipe

[Describe the inspiration for this dish and what makes it special]

## Cooking Process

[Walk through the preparation and cooking steps in detail]

## Tips and Variations

[Share any tips you learned and possible variations of the recipe]`
  };

  return templates[category] || `## About This Project

[Write about your project here - what inspired it, how you approached it, and what you learned.]`;
}

async function main() {
  try {
    // Collect basic project information
    const basicInfo = await collectBasicInfo();
    const categoryConfig = CATEGORIES[basicInfo.category];
    
    // Collect category-specific fields
    const categoryFields = await collectCategoryFields(basicInfo.category, categoryConfig);
    
    // Generate the markdown file
    const frontmatter = generateFrontmatter(basicInfo, categoryFields);
    const template = generateTemplate(basicInfo.category, basicInfo);
    const content = frontmatter + template;
    
    // Ensure the content directory exists
    const contentDir = path.join(__dirname, '..', 'src', 'content', basicInfo.category);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Write the file
    const filePath = path.join(contentDir, `${basicInfo.slug}.md`);
    
    if (fs.existsSync(filePath)) {
      const overwrite = await confirm({
        message: `File ${basicInfo.slug}.md already exists. Overwrite?`,
        default: false
      });
      
      if (!overwrite) {
        console.log('\n❌ Project creation cancelled.\n');
        return;
      }
    }
    
    fs.writeFileSync(filePath, content);
    
    console.log(`\n✅ Successfully created project: ${filePath}`);
    console.log(`🔗 Project URL will be: /${basicInfo.category}/${basicInfo.slug}`);
    
    if (basicInfo.heroImage || basicInfo.gallery.length > 0) {
      console.log(`\n📸 Don't forget to add your images:`);
      if (basicInfo.heroImage) console.log(`   - ${basicInfo.heroImage}`);
      basicInfo.gallery.forEach(img => console.log(`   - ${img}`));
    }
    
    console.log(`\n🎯 Next steps:`);
    console.log(`   1. Edit the project content in: ${filePath}`);
    console.log(`   2. Add your images to the public/images/projects/ directory`);
    console.log(`   3. Set draft: false when ready to publish`);
    console.log(`\nHappy creating! 🚀\n`);
    
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log('\n👋 Project creation cancelled.\n');
    } else {
      console.error('\n❌ Error creating project:', error.message);
    }
  }
}

main();