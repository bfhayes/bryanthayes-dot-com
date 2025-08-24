# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
npm run dev              # Start Astro dev server with hot reload
npm run start            # Alias for npm run dev

# Building
npm run build            # Build for production
npm run build:cloudflare # Build specifically for Cloudflare Pages
npm run preview          # Preview production build locally
npm run preview:cloudflare # Preview Cloudflare build with Wrangler

# Type checking and validation
npm run check            # Run Astro type checking
astro check             # Direct Astro check command

# Content management
npm run add-project     # Interactive script to create new project content
```

## Architecture Overview

This is a modern portfolio website built with **Astro's Islands Architecture**, featuring a dual-mode interface (professional/creative) and type-safe content management.

### Key Architectural Patterns

**Dual-Mode System**: The site switches between professional and creative presentations using:
- Mode state management in components
- URL parameter support (`?mode=creative`)
- LocalStorage persistence
- Conditional navigation and content display

**Content Collections Architecture**: All project content is managed through Astro's type-safe content collections defined in `src/content/config.ts`:
- **Hobby Collections**: photography, woodworking, leatherwork, music, engineering, costuming, food
- **Professional Collections**: experience, projects
- **Shared Base Schema**: All hobby projects extend `baseProjectSchema` with common fields
- **Category-Specific Fields**: Each collection adds specialized metadata and validation

**Component Organization**:
- `src/components/layout/` - Site-wide layout components (Header, Footer)
- `src/components/home/` - Homepage sections with mode-aware content
- `src/components/professional/` - Career-focused components (resume viewer)
- `src/components/gallery/` - Photo gallery with lightbox functionality
- `src/components/projects/` - Reusable project display components
- `src/components/audio/` - Music player components with custom controls

### Routing Strategy

**Dynamic Category Pages**: Uses `[category]/[slug].astro` pattern for all hobby content with shared layout and styling.

**Static Pages**: Individual pages for each category (`woodworking.astro`, `music.astro`, etc.) that query their respective collections.

**Content Management Script**: The `scripts/add-project.js` provides an interactive CLI for creating new content with proper frontmatter and templates.

## Styling System

**Custom Design System**: Built on Tailwind CSS with a carefully crafted color palette:
- **Primary**: Space Cadet (#22223b)
- **Secondary**: Ultra Violet (#4a4e69)  
- **Accent**: Rose Quartz (#9a8c98)
- **Highlight**: Pale Dogwood (#c9ada7)
- **Background**: Isabelline (#f2e9e4)

**Typography Stack**:
- Sans: Inter (body text)
- Serif: Crimson Text (headings)
- Mono: JetBrains Mono (code)

**Component Styles**: Located in `src/styles/global.css` with utility classes for common patterns like `.btn-primary`, `.card`, `.container-custom`.

## Content Management

**Adding New Projects**: Use `npm run add-project` for guided project creation with:
- Category selection with emoji icons
- Type-safe field validation based on collection schemas
- Automatic slug generation and image path setup
- Custom templates for each project type

**Content Structure**: Each category has specific metadata requirements defined in the content config:
- Photography: camera settings, EXIF data, location
- Woodworking: materials, tools, joinery techniques, dimensions
- Engineering: technologies, languages, frameworks, GitHub links
- Music: genre, instruments, key, tempo, audio files

**Image Organization**: Images stored in `public/images/projects/` with naming convention `{slug}-{number}.jpg`.

## Deployment

**Cloudflare Pages Integration**: 
- Build command: `npm run build:cloudflare`
- Functions API in `functions/api/contact.js` for contact form
- Environment variables for Resend email service
- Wrangler configuration for local development

**Contact Form**: Serverless contact form using Cloudflare Functions with Resend API integration, includes client-side validation and mode-aware field customization.

## Development Notes

**Type Safety**: Full TypeScript implementation with Zod schemas for content validation. Always run `npm run check` before deployment.

**React Integration**: Uses selective hydration with Astro Islands - React components only for interactive features like photo galleries, audio players, and forms.

**Performance**: Static site generation with minimal JavaScript, optimized images, and careful bundle splitting.

**SEO**: Meta tags, structured data (Person schema), auto-generated sitemap, and social media optimization built into base layout.

## Claude Code Workflow Rules

**Git Workflow**: Always commit work as a git commit when done with a request. This ensures progress is saved and changes are properly tracked.

**Browser Testing**: Use Playwright MCP services when necessary for testing UI functionality, taking screenshots, and verifying user interactions.

**Image Generation**: When using imagegen MCP services:
- Use text-to-image for creating new, original images
- Use image-to-image when making similar images to ensure consistency (e.g., keeping the same item/object across multiple images)
- This maintains visual consistency across project galleries and related content