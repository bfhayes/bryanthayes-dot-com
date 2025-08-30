import { defineCollection, z } from 'astro:content';

// Base project schema that all hobby projects extend
const baseProjectSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  heroImage: z.string(),
  gallery: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  hidden: z.boolean().default(false),
  downloads: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    filename: z.string(),
    fileSize: z.string().optional(),
    fileType: z.enum(['pdf', 'svg', 'zip', 'jpg', 'png', 'dwg', 'stl', 'other']),
    category: z.enum(['pattern', 'template', 'instructions', 'reference', 'source']).optional(),
  })).optional(),
});

// Photography projects
const photography = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    category: z.enum(['landscapes', 'portraits', 'street', 'events', 'nature', 'macro', 'abstract']),
    camera: z.string().optional(),
    lens: z.string().optional(),
    settings: z.object({
      aperture: z.string().optional(),
      shutter: z.string().optional(),
      iso: z.number().optional(),
      focal_length: z.string().optional(),
    }).optional(),
    location: z.string().optional(),
    exifData: z.record(z.string()).optional(),
  }),
});

// Woodworking projects
const woodworking = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    duration: z.string(),
    materials: z.array(z.string()),
    tools: z.array(z.string()),
    dimensions: z.string().optional(),
    woodSpecies: z.string().optional(),
    finish: z.string().optional(),
    joinery: z.array(z.string()).optional(),
    cost: z.object({
      materials: z.number().optional(),
      total: z.number().optional(),
    }).optional(),
  }),
});

// Leatherwork projects
const leatherwork = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    type: z.enum(['wallet', 'bag', 'belt', 'accessory', 'other']),
    leather: z.string(),
    thickness: z.string().optional(),
    tanning: z.enum(['vegetable', 'chrome', 'combination']).optional(),
    hardware: z.array(z.string()).optional(),
    techniques: z.array(z.string()).optional(),
    duration: z.string(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    dimensions: z.string().optional(),
    care_instructions: z.string().optional(),
  }),
});

// Music projects
const music = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    type: z.enum(['composition', 'cover', 'arrangement', 'recording']),
    genre: z.array(z.string()),
    instruments: z.array(z.string()),
    duration: z.string().optional(),
    key: z.string().optional(),
    tempo: z.string().optional(),
    audioFile: z.string().optional(),
    sheetMusic: z.string().optional(),
    sheetMusicFormat: z.enum(['alphaTex', 'musicxml', 'gp']).optional(),
    tabs: z.string().optional(),
    tuning: z.string().optional(),
    capo: z.string().optional(),
    inspiration: z.string().optional(),
  }),
});

// Engineering projects (merged electronics + programming)
const engineering = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    type: z.enum(['software', 'hardware', 'embedded', 'web', 'mobile', 'other']),
    technologies: z.array(z.string()),
    languages: z.array(z.string()).optional(),
    frameworks: z.array(z.string()).optional(),
    status: z.enum(['completed', 'in_progress', 'paused', 'archived']),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    github_url: z.string().optional(),
    live_url: z.string().optional(),
    demo_video: z.string().optional(),
    components: z.array(z.string()).optional(),
    lessons_learned: z.string().optional(),
  }),
});

// Costuming projects
const costuming = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    type: z.enum(['halloween', 'cosplay', 'historical', 'fantasy', 'theatrical']),
    character: z.string().optional(),
    source_material: z.string().optional(),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    duration: z.string(),
    materials: z.array(z.string()),
    techniques: z.array(z.string()).optional(),
    size: z.string().optional(),
    budget: z.number().optional(),
    accessories: z.array(z.string()).optional(),
    makeup_notes: z.string().optional(),
  }),
});

// Food projects
const food = defineCollection({
  type: 'content',
  schema: baseProjectSchema.extend({
    type: z.enum(['recipe', 'technique', 'experiment', 'bbq', 'baking']),
    cuisine: z.string().optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    prep_time: z.string(),
    cook_time: z.string(),
    total_time: z.string(),
    servings: z.number(),
    ingredients: z.array(z.object({
      item: z.string(),
      amount: z.string(),
      notes: z.string().optional(),
    })),
    equipment: z.array(z.string()).optional(),
    temperature: z.string().optional(),
    dietary_tags: z.array(z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'])).optional(),
    nutritional_info: z.record(z.union([z.string(), z.number()])).optional(),
  }),
});

// Professional experience
const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    position: z.string(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    location: z.string(),
    description: z.string(),
    highlights: z.array(z.string()),
    technologies: z.array(z.string()),
    type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
    current: z.boolean().default(false),
  })
});

// Professional projects
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    client: z.string().optional(),
    role: z.string(),
    technologies: z.array(z.string()),
    challenges: z.array(z.string()).default([]),
    solutions: z.array(z.string()).default([]),
    results: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    thumbnail: z.string(),
    live_url: z.string().optional(),
    case_study: z.boolean().default(false),
    featured: z.boolean().default(false),
    confidential: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
});

export const collections = {
  photography,
  woodworking,
  leatherwork,
  music,
  engineering,
  costuming,
  food,
  experience,
  projects,
};

// Export category information for the project management script
export const CATEGORIES = {
  photography: {
    collection: 'photography',
    label: 'Photography',
    icon: '📷',
    description: 'Photos, collections, and photography projects'
  },
  woodworking: {
    collection: 'woodworking',
    label: 'Woodworking',
    icon: '🪵',
    description: 'Furniture and handcrafted wood pieces'
  },
  leatherwork: {
    collection: 'leatherwork',
    label: 'Leatherwork',
    icon: '👜',
    description: 'Custom bags, wallets, and leather accessories'
  },
  music: {
    collection: 'music',
    label: 'Music',
    icon: '🎸',
    description: 'Guitar compositions and recordings'
  },
  engineering: {
    collection: 'engineering',
    label: 'Engineering',
    icon: '⚙️',
    description: 'Software and hardware projects'
  },
  costuming: {
    collection: 'costuming',
    label: 'Costuming',
    icon: '🎭',
    description: 'Halloween costumes and cosplay'
  },
  food: {
    collection: 'food',
    label: 'Food',
    icon: '🍖',
    description: 'Recipes and cooking projects'
  }
} as const;

export type CategoryKey = keyof typeof CATEGORIES;