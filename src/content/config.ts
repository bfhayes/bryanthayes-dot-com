import { z, defineCollection } from 'astro:content';

const pageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    noIndex: z.boolean().default(false),
  }),
});

const siteCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    credentials: z.string(),
    tagline: z.string(),
    phone: z.string(),
    email: z.string(),
    practice_type: z.string().optional(),
    serving_areas: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }).optional(),
    hours: z.object({
      weekdays: z.string(),
      weekend: z.string(),
    }),
    license: z.string(),
    socialMedia: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).optional(),
    disclaimers: z.object({
      crisis: z.string(),
      emergency: z.string(),
      phi: z.string(),
    }),
  }),
});

const testimonialsCollection = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    id: z.string(),
    quote: z.string(),
    author: z.string(),
    context: z.string().optional(),
  })),
});

const specialtiesCollection = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    iconName: z.string(),
  })),
});

const navigationCollection = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    label: z.string(),
    href: z.string(),
    external: z.boolean().default(false),
  })),
});

export const collections = {
  pages: pageCollection,
  site: siteCollection,
  testimonials: testimonialsCollection,
  specialties: specialtiesCollection,
  navigation: navigationCollection,
};