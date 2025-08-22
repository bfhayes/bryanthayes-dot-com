# Bryant Hayes Portfolio Website

A modern, dual-purpose portfolio website built with Astro, React, and Tailwind CSS. Features both professional and creative modes to showcase technical skills and artistic hobbies.

## ✨ Features

- **Dual Mode Interface**: Switch between professional and creative presentations
- **Responsive Design**: Mobile-first approach with beautiful layouts
- **Custom Color Palette**: Carefully crafted color scheme with space cadet, ultra violet, and complementary tones
- **Performance Optimized**: Static site generation with minimal JavaScript
- **Contact Form**: Serverless contact form with Resend email integration
- **Content Collections**: Type-safe content management for projects and hobbies
- **SEO Optimized**: Meta tags, structured data, and social media optimization

## 🎨 Sections

### Professional Mode
- Interactive resume with download functionality
- Project showcases with case studies
- Technical skills visualization
- LinkedIn integration

### Creative Mode
- Photography gallery with lightbox
- Woodworking project documentation
- Leather crafting showcases
- Music compositions and recordings
- Electronics and programming projects
- Golf content and reviews

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build/) with Islands Architecture
- **UI Library**: React 18+ (selective hydration)
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Cloudflare Pages with Functions
- **Email**: Resend API for contact form
- **Type Safety**: TypeScript throughout

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/bryanthayes/bryanthayes-dotcom.git
cd bryanthayes-dotcom

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file for local development:

```env
# Resend API (for contact form)
RESEND_API_KEY=your_resend_api_key_here
TO_EMAIL=hello@bryanthayes.com
FROM_EMAIL=Contact Form <noreply@bryanthayes.com>
DOMAIN=bryanthayes.com
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:cloudflare # Build for Cloudflare Pages
npm run preview          # Preview production build
npm run check            # Run Astro type checking
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Navigation
│   ├── professional/    # Resume, skills, projects
│   ├── gallery/         # Photo galleries
│   ├── home/           # Homepage sections
│   └── common/         # Reusable components
├── content/            # Content collections
│   ├── photography/    # Photo metadata
│   ├── woodworking/    # Project write-ups
│   ├── leatherwork/    # Craft projects
│   ├── music/          # Compositions
│   ├── electronics/    # DIY projects
│   ├── programming/    # Code projects
│   ├── golf/          # Golf content
│   ├── experience/    # Work history
│   └── projects/      # Professional projects
├── layouts/           # Page layouts
├── pages/            # Routes
├── styles/           # Global styles
└── utils/            # Utility functions

public/
├── images/           # Static images
├── resume/          # Resume PDF
└── favicon.svg      # Site icon

functions/
└── api/
    └── contact.js   # Serverless contact form
```

## 🎨 Design System

### Color Palette
- **Space Cadet**: `#22223b` (Primary)
- **Ultra Violet**: `#4a4e69` (Secondary)
- **Rose Quartz**: `#9a8c98` (Accent)
- **Pale Dogwood**: `#c9ada7` (Highlight)
- **Isabelline**: `#f2e9e4` (Background)

### Typography
- **Sans Serif**: Inter (body text)
- **Serif**: Crimson Text (headings)
- **Monospace**: JetBrains Mono (code)

## 🚀 Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build:cloudflare`
   - Output directory: `dist`
3. Set environment variables in Cloudflare Pages dashboard
4. Deploy!

### Environment Variables (Production)

In Cloudflare Pages dashboard, add:
- `RESEND_API_KEY`
- `TO_EMAIL`
- `FROM_EMAIL`
- `DOMAIN`

## 📧 Email Setup

### Resend Configuration
1. Sign up for [Resend](https://resend.com)
2. Verify your domain
3. Get API key and add to environment variables

### Email Routing (Optional)
Set up Cloudflare Email Routing for custom email addresses:
1. Add MX records in Cloudflare DNS
2. Configure forwarding rules
3. Update contact information

## 🎯 SEO & Analytics

- **Meta Tags**: Optimized for search engines and social media
- **Structured Data**: Person schema for Google
- **Sitemap**: Auto-generated
- **Analytics**: Cloudflare Web Analytics (privacy-focused)

## 📱 Features

### Mode Toggle
Switch between professional and creative modes:
- Persisted in localStorage
- Changes navigation and content presentation
- URL parameter support (`?mode=creative`)

### Contact Form
- Client-side validation
- Serverless backend with Cloudflare Functions
- Email delivery via Resend API
- Context-aware form fields based on mode

### Photo Gallery
- Lightbox viewer with navigation
- EXIF data display
- Responsive masonry layout
- Lazy loading optimization

### Resume
- Interactive online version
- PDF download functionality
- Print-optimized styles
- ATS-friendly format

## 🔧 Customization

### Adding New Hobbies
1. Create new collection in `src/content/config.ts`
2. Add content files in `src/content/[hobby-name]/`
3. Create page in `src/pages/hobbies/[hobby-name].astro`
4. Update navigation in Header component

### Customizing Colors
Edit the color palette in `tailwind.config.mjs`:

```javascript
colors: {
  'your-primary': {
    DEFAULT: '#your-color',
    // ... variants
  }
}
```

### Adding Content
Use the defined content collections in `src/content/`:
- Woodworking: Markdown with frontmatter
- Photography: JSON with metadata
- All content is type-safe with Zod schemas

## 🤝 Contributing

This is a personal portfolio, but feel free to:
- Report bugs or issues
- Suggest improvements
- Use as inspiration for your own portfolio

## 📄 License

MIT License - feel free to use this code for your own portfolio projects.

## 📞 Contact

- **Website**: [bryanthayes.com](https://bryanthayes.com)
- **Email**: hello@bryanthayes.com
- **LinkedIn**: [linkedin.com/in/bryanthayes](https://linkedin.com/in/bryanthayes)
- **GitHub**: [github.com/bryanthayes](https://github.com/bryanthayes)

---

Built with ❤️ using Astro, React, and Tailwind CSS