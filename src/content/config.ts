import { defineCollection, z } from 'astro:content';

// Photography collection
const photography = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['landscape', 'portrait', 'street', 'macro', 'abstract']),
    location: z.string().optional(),
    camera: z.string(),
    lens: z.string().optional(),
    settings: z.object({
      aperture: z.string(),
      shutter: z.string(),
      iso: z.number(),
      focal_length: z.string().optional(),
    }),
    image: z.string(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  })
});

// Woodworking projects
const woodworking = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    duration: z.string(), // e.g., "2 weeks"
    materials: z.array(z.string()),
    tools: z.array(z.string()),
    techniques: z.array(z.string()),
    images: z.array(z.string()),
    thumbnail: z.string(),
    featured: z.boolean().default(false),
    completed: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  })
});

// Leatherwork projects
const leatherwork = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['wallet', 'bag', 'belt', 'accessory', 'custom']),
    leather_type: z.string(),
    techniques: z.array(z.string()),
    tools: z.array(z.string()),
    images: z.array(z.string()),
    thumbnail: z.string(),
    duration: z.string(),
    featured: z.boolean().default(false),
    for_sale: z.boolean().default(false),
    price: z.number().optional(),
    tags: z.array(z.string()).default([]),
  })
});

// Music tracks/compositions
const music = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['original', 'cover', 'improvisation']),
    genre: z.string().optional(),
    audio_file: z.string().optional(),
    video_file: z.string().optional(),
    sheet_music: z.string().optional(),
    tabs: z.string().optional(),
    instruments: z.array(z.string()),
    duration: z.string(), // e.g., "3:45"
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
});

// Electronics projects
const electronics = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    components: z.array(z.string()),
    tools: z.array(z.string()),
    schematic: z.string().optional(),
    code: z.string().optional(), // GitHub link or embedded code
    images: z.array(z.string()),
    thumbnail: z.string(),
    duration: z.string(),
    featured: z.boolean().default(false),
    open_source: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  })
});

// Programming projects
const programming = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    languages: z.array(z.string()),
    frameworks: z.array(z.string()).default([]),
    github_url: z.string().optional(),
    live_url: z.string().optional(),
    images: z.array(z.string()).default([]),
    thumbnail: z.string(),
    status: z.enum(['completed', 'in-progress', 'archived']),
    featured: z.boolean().default(false),
    open_source: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
  })
});

// Golf content
const golf = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(['round', 'lesson', 'equipment', 'course-review']),
    course: z.string().optional(),
    score: z.number().optional(),
    handicap: z.number().optional(),
    weather: z.string().optional(),
    equipment: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
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
  electronics,
  programming,
  golf,
  experience,
  projects,
};