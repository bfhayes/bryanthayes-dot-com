export interface WoodworkingProject {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  gallery: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  materials: string[];
  tools: string[];
  dimensions?: string;
  story: string;
  process: string[];
  specifications: Record<string, string>;
  lessonsLearned?: string;
  tags: string[];
}

export const woodworkingProjects: WoodworkingProject[] = [
  {
    slug: 'oak-coffee-table',
    title: 'Live Edge Oak Coffee Table',
    description: 'A stunning coffee table crafted from a single live edge oak slab with industrial steel tube legs',
    heroImage: '/images/woodworking/oak-table/hero.jpg',
    gallery: [
      '/images/woodworking/oak-table/hero.jpg',
      '/images/woodworking/oak-table/process-1.jpg',
      '/images/woodworking/oak-table/process-2.jpg',
      '/images/woodworking/oak-table/detail-1.jpg',
      '/images/woodworking/oak-table/detail-2.jpg',
      '/images/woodworking/oak-table/finished-1.jpg',
    ],
    difficulty: 'Intermediate',
    duration: '3 weeks',
    materials: [
      '8/4 Live edge white oak slab (6 feet long)',
      '1" steel tube (4 pieces at 16" each)',
      'Steel table leg brackets',
      'Watco Danish Oil (Natural)',
      '220-400 grit sandpaper',
      'Wood filler',
      'Steel wool (#0000)'
    ],
    tools: [
      'Belt sander',
      'Random orbital sander',
      'Router with flush trim bit',
      'Drill press',
      'Table saw',
      'Chisels',
      'Hand plane',
      'Measuring tools'
    ],
    dimensions: '60" L × 18" W × 16" H',
    story: `This project began when I found an incredible live edge white oak slab at a local sawmill. The natural edge had beautiful character with subtle curves that spoke to me immediately. I knew it would make a perfect coffee table for my living room.

The challenge was preserving the natural beauty of the wood while creating a piece that was both functional and modern. I decided to pair the organic curves of the live edge with clean, industrial steel legs to create an interesting contrast between natural and manufactured elements.

The oak slab had been air-dried for over two years, but still needed significant preparation work. There were a few small checks and some rough areas that needed attention before I could begin the finishing process.`,
    process: [
      'Flattened the slab using a belt sander and hand plane',
      'Filled small checks and imperfections with wood filler',
      'Progressive sanding from 120 to 400 grit',
      'Routed and cleaned up the live edges',
      'Fabricated and attached steel tube legs',
      'Applied multiple coats of Danish oil finish',
      'Final polish with steel wool'
    ],
    specifications: {
      'Wood Species': 'White Oak (Quercus alba)',
      'Finish': 'Watco Danish Oil, Natural',
      'Leg Material': '1" Steel Tubing, Powder Coated',
      'Weight': 'Approximately 85 lbs',
      'Grain Pattern': 'Straight grain with cathedral figure'
    },
    lessonsLearned: `Working with live edge slabs requires patience and careful planning. The natural imperfections are part of the charm, but knowing when to preserve them versus when to correct them is crucial. I learned that taking time with the sanding process really pays off in the final finish quality.

The steel legs were a new challenge for me, requiring precise drilling and mounting. Next time, I'd consider having the metal work done professionally for an even cleaner result.`,
    tags: ['live edge', 'oak', 'coffee table', 'steel legs', 'danish oil', 'intermediate']
  },
  {
    slug: 'walnut-cutting-board',
    title: 'Walnut End Grain Cutting Board',
    description: 'A beautiful end grain cutting board made from premium black walnut',
    heroImage: '/images/woodworking/cutting-board/hero.jpg',
    gallery: [
      '/images/woodworking/cutting-board/hero.jpg',
      '/images/woodworking/cutting-board/process-1.jpg',
      '/images/woodworking/cutting-board/finished-1.jpg'
    ],
    difficulty: 'Beginner',
    duration: '1 week',
    materials: ['Black walnut lumber', 'Mineral oil', 'Beeswax finish'],
    tools: ['Table saw', 'Planer', 'Random orbital sander', 'Clamps'],
    dimensions: '12" × 16" × 1.5"',
    story: 'A practical project that showcases the beautiful grain patterns of black walnut in an end grain configuration.',
    process: [
      'Cut walnut strips to size',
      'Glued up initial panel',
      'Cross-cut and rotated for end grain',
      'Final glue-up and clamping',
      'Sanded to 220 grit',
      'Applied mineral oil and beeswax finish'
    ],
    specifications: {
      'Wood Species': 'Black Walnut',
      'Finish': 'Mineral Oil & Beeswax',
      'Construction': 'End Grain Glue-up'
    },
    tags: ['walnut', 'cutting board', 'end grain', 'food safe', 'beginner']
  },
  {
    slug: 'cherry-bookshelf',
    title: 'Cherry Bookshelf with Traditional Joinery',
    description: 'A five-shelf bookcase featuring traditional mortise and tenon joinery',
    heroImage: '/images/woodworking/bookshelf/hero.jpg',
    gallery: [
      '/images/woodworking/bookshelf/hero.jpg',
      '/images/woodworking/bookshelf/joinery-1.jpg',
      '/images/woodworking/bookshelf/finished-1.jpg'
    ],
    difficulty: 'Advanced',
    duration: '6 weeks',
    materials: ['Cherry lumber', 'Traditional joinery', 'Danish oil finish'],
    tools: ['Hand chisels', 'Mortiser', 'Hand saws', 'Hand planes'],
    dimensions: '72" H × 36" W × 12" D',
    story: 'An advanced project focusing on traditional woodworking techniques and joinery methods.',
    process: [
      'Milled all lumber to dimension',
      'Cut mortise and tenon joints',
      'Test fitted all joints',
      'Assembled in stages',
      'Applied Danish oil finish'
    ],
    specifications: {
      'Wood Species': 'Cherry',
      'Joinery': 'Mortise and Tenon',
      'Finish': 'Danish Oil'
    },
    tags: ['cherry', 'bookshelf', 'traditional joinery', 'mortise and tenon', 'advanced']
  }
];

export function getProjectBySlug(slug: string): WoodworkingProject | undefined {
  return woodworkingProjects.find(project => project.slug === slug);
}

export function getAllProjects(): WoodworkingProject[] {
  return woodworkingProjects;
}