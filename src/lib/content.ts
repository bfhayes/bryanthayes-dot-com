import { getEntry } from 'astro:content';

export async function getSiteConfig() {
  const siteConfig = await getEntry('site', 'config');
  return siteConfig.data;
}

export async function getNavigation() {
  const navigation = await getEntry('navigation', 'main');
  return navigation.data;
}

export async function getSpecialties() {
  const specialties = await getEntry('specialties', 'list');
  return specialties.data;
}

export async function getTestimonials() {
  const testimonials = await getEntry('testimonials', 'quotes');
  return testimonials.data;
}

export async function getPageContent(slug: string) {
  const page = await getEntry('pages', slug);
  if (!page) {
    throw new Error(`Page not found: ${slug}`);
  }
  return page;
}