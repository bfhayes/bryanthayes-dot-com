# Hailey Gonnerman Counseling Website

A professional therapist website for Hailey Gonnerman, LMFT, built with Astro (static generation) and Tailwind CSS. Features Cloudflare Pages Functions for server-side functionality, with a focus on clean design, fast performance, and accessibility. 

**Practice Focus:** Telehealth-only therapy services in Oregon for individuals (preteens through adults), families, and couples, specializing in anxiety and relationship stress.

## 🎨 Design Philosophy

This website prioritizes **clean, professional aesthetics** with **subtle interactions** over flashy animations. After extensive user testing, we removed scroll-triggered animations in favor of:
- Smooth hover effects on interactive elements
- Immediate content loading without jarring transitions  
- Focus on content readability and professional presentation
- Subtle visual enhancements that don't distract from the therapeutic message

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will be available at `http://localhost:4321`

## 📁 Project Structure

```
hailey-counseling-website/
├── functions/            # Cloudflare Pages Functions
│   └── api/
│       └── contact.js    # Contact form API endpoint (Resend integration)
├── public/
│   ├── images/           # Professional photos and assets
│   │   └── headshot.jpg  # Hailey's professional photo (replace as needed)
│   └── icons/            # Favicon and app icons
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.astro         # Enhanced with hover animations
│   │   ├── Card.astro          # Hover effects, multiple variants
│   │   ├── ContactForm.jsx     # Interactive form island
│   │   ├── Footer.astro        # Site footer with practice info
│   │   ├── Modal.astro         # Modal component
│   │   ├── Nav.astro           # Main navigation
│   │   ├── PageHeader.astro    # Page headers with breadcrumbs
│   │   ├── Section.astro       # Layout sections
│   │   ├── TestimonialCarousel.jsx  # Interactive carousel island
│   │   ├── AnimatedIcon.jsx    # Therapeutic-themed icons (available)
│   │   ├── FloatingElements.jsx # Background animations (available)
│   │   └── ScrollAnimation.jsx  # Scroll animations (available, unused)
│   ├── content/          # Content collections with type safety
│   │   ├── navigation/   # Navigation structure
│   │   ├── pages/        # Page content (Markdown)
│   │   │   ├── home.md   # Homepage content
│   │   │   ├── about.md  # About page content  
│   │   │   ├── services.md # Services and pricing
│   │   │   └── contact.md  # Contact page content
│   │   ├── site/         # Site configuration
│   │   │   └── config.yaml # Practice info, contact details, hours
│   │   ├── specialties/  # Therapy specializations
│   │   │   └── list.json # Treatment areas and descriptions
│   │   ├── testimonials/ # Client testimonials
│   │   │   └── quotes.json # Client feedback (anonymized)
│   │   └── config.ts     # Content schema definitions (Zod validation)
│   ├── layouts/
│   │   └── Base.astro    # Main site layout with SEO, metadata
│   ├── lib/
│   │   ├── content.ts    # Content loading utilities
│   │   └── seo.ts        # SEO, Open Graph, JSON-LD generation
│   ├── pages/            # File-based routing (Astro convention)
│   │   ├── index.astro   # Homepage - clean layout, no scroll animations
│   │   ├── about.astro   # About page - professional bio, credentials
│   │   ├── services.astro # Services page - therapy types, pricing
│   │   ├── contact.astro  # Contact page - form, practice details
│   │   └── 404.astro     # Error page
│   └── styles/
│       └── globals.css   # Global styles, hover effects, utilities
├── astro.config.mjs      # Astro configuration (static + functions)
├── tailwind.config.cjs   # Tailwind CSS configuration (custom brand colors)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies including animation libraries
```

## ✏️ Editing Content

This website is designed for easy content updates by the therapist without technical knowledge:

### 🏢 Practice Information
Edit your name, credentials, contact info, and office hours in:
```yaml
src/content/site/config.yaml
```
**Current setup:**
- **Name:** Hailey Gonnerman
- **Credentials:** LMFT, MA  
- **Practice:** Telehealth Only (Oregon licensed)
- **Phone:** (503) 555-0123
- **Serves:** Preteens (10-13), Teens (13-18), Adults (18-65), Families, Couples

### 📄 Page Content  
Update the main text on each page by editing these Markdown files:
- **Homepage:** `src/content/pages/home.md` - Hero text, intro messaging
- **About page:** `src/content/pages/about.md` - Professional bio, background, philosophy
- **Services page:** `src/content/pages/services.md` - Therapy types, pricing, approaches  
- **Contact page:** `src/content/pages/contact.md` - Contact instructions, policies

### 🎯 Therapy Specialties
Add, remove, or edit your therapy specializations in:
```json
src/content/specialties/list.json
```
**Current specialties:** Anxiety & stress management, relationship stress, life transitions, family dynamics, trauma & PTSD, teen & preteen issues

### 💬 Client Testimonials
Update client testimonials in:
```json
src/content/testimonials/quotes.json
```
**Important:** Ensure all testimonials are properly anonymized and have client consent for website use.

### 🧭 Navigation Menu
Modify the main navigation menu in:
```json
src/content/navigation/main.json
```

### 📸 Professional Images
Replace images in the `public/images/` folder:
- **Headshot:** Replace `headshot.jpg` with your professional photo
  - **Recommended size:** 400x500px
  - **Format:** JPG or WebP
  - **Style:** Professional, warm, approachable
  - **Background:** Neutral or simple

### 🔄 Making Changes Live
After making content changes:
1. **Preview locally:** Run `npm run dev` 
2. **Build for production:** Run `npm run build:cloudflare`
3. **Deploy:** Push to GitHub (triggers automatic Cloudflare Pages deployment)

### ⚠️ Important Notes for Therapists
- **HIPAA Compliance:** Never include client names or identifying information
- **Professional Images:** Use high-quality, professional photos
- **Contact Information:** Keep phone numbers and email current
- **Licensing:** Update license numbers and expiration dates as needed
- **Specialties:** Only list areas where you have proper training/credentials

## 🎨 Design System

### Colors
The website uses a cozy, neutral color palette:
- **Primary:** `#CB997E` (warm brown)
- **Secondary:** `#6B705C` (sage green)
- **Background:** `#FFE8D6` (cream)
- **Neutral tones:** Various grays for text and borders

### Typography
- **Font:** System font stack for fast loading and native feel
- **Headings:** Bold, with generous spacing
- **Body text:** Readable sizes with proper contrast

### Components
All UI components follow consistent patterns:
- **Buttons:** Multiple variants (primary, secondary, outline, subtle)
- **Cards:** Clean, rounded containers with subtle shadows
- **Sections:** Consistent spacing and background options

## 🚢 Features

### Performance
- **Static site generation** for fast loading from CDN
- **Cloudflare Pages Functions** for server-side functionality
- **Zero JavaScript by default** except for interactive components
- **Optimized images** with proper sizing and alt text
- **Minimal CSS** with utility classes
- **Edge functions** for low-latency API responses

### SEO & Accessibility
- **Meta tags** and Open Graph images for all pages
- **JSON-LD structured data** for search engines
- **Semantic HTML** with proper heading hierarchy
- **Keyboard navigation** and screen reader support
- **Focus indicators** that meet accessibility standards

### Interactive Elements
**Current active components:**
- **Testimonial carousel** with autoplay, keyboard controls, and accessibility features
- **Contact form** with validation, email sending via Cloudflare Pages Function
- **Hover effects** on buttons and cards for subtle user feedback

**Available but unused (for future use):**
- **ScrollAnimation.jsx** - Scroll-triggered animations (removed for better UX)
- **AnimatedIcon.jsx** - Therapeutic-themed animated icons
- **FloatingElements.jsx** - Background animated elements
- **Framer Motion & AOS libraries** - Advanced animation capabilities

**Design Decision:** After user testing, scroll animations were removed as they were found to be distracting and jarring. The site now uses only hover effects and smooth transitions for a professional, clean experience.

### Local-Only Design
- **No external dependencies** or API calls
- **System fonts** instead of web fonts
- **Local placeholder images** instead of external services
- **No analytics or tracking** scripts

## 🛠️ Technical Details

### Built With
- **Astro 4.15+** - Static site generator with islands architecture
- **Cloudflare Pages Functions** - Serverless backend functionality (contact form)
- **Tailwind CSS 3.4+** - Utility-first CSS framework with custom therapy brand colors
- **TypeScript** - Type safety and better development experience
- **React 18+** - For interactive components only (testimonial carousel, contact form)
- **Resend API** - Professional email delivery service
- **Framer Motion 12+** - Animation library (available, mostly unused by design)
- **AOS & React Intersection Observer** - Animation utilities (available, unused)

### Animation Libraries (Available but Minimal Use)
The project includes several animation libraries for future flexibility:
```json
"framer-motion": "^12.23.12",
"aos": "^2.3.4", 
"react-intersection-observer": "^9.16.0"
```
**Current usage:** Only hover effects and smooth transitions. Scroll animations were intentionally removed after UX testing showed they were distracting for therapy website visitors seeking calm, professional presentation.

### Content Management
- **Astro Content Collections** with Zod validation
- **Markdown support** for long-form content
- **YAML/JSON** for structured data
- **Type-safe** content loading and rendering

### Development
```bash
# Install dependencies
npm install

# Start development server (Astro only)
npm run dev

# Start with Cloudflare Pages Functions
npm run dev:cloudflare

# Build for production
npm run build:cloudflare

# Preview production build with Functions
npm run preview:cloudflare

# Type checking
npx astro check
```

## 🔧 Customization

### Colors
Edit the color palette in `tailwind.config.cjs`:
```javascript
theme: {
  extend: {
    colors: {
      brand: {
        // Your custom colors here
      }
    }
  }
}
```

### Layout
Modify the overall layout in `src/layouts/Base.astro`

### Components
All components are in `src/components/` and can be customized as needed

### Content Schema
Add new content types by editing `src/content/config.ts`

## 📱 Responsive Design

The website is fully responsive with:
- **Mobile-first** approach
- **Touch-friendly** button sizes (44px minimum)
- **Readable text** on all screen sizes
- **Optimized images** for different devices

## 🔍 SEO Features

- **Unique titles and descriptions** for all pages
- **Canonical URLs** to prevent duplicate content
- **Open Graph tags** for social media sharing
- **JSON-LD structured data** for rich search results
- **Sitemap generation** (automatic with Astro)
- **robots.txt** support

## 🩺 Practice-Specific Features

### HIPAA Considerations
- **No client data storage** on website
- **Secure contact form** warns against including PHI  
- **Professional disclaimers** included for crisis situations
- **Resend email service** for secure message delivery
- **No tracking scripts** or third-party analytics

### Telehealth-Specific Features
- **Oregon licensing** prominently displayed
- **Geographic restrictions** clearly stated (Oregon only)
- **Telehealth benefits** highlighted throughout site
- **Technical requirements** mentioned for video sessions
- **No physical address** displayed (telehealth-only practice)

### Professional Compliance
- **License numbers** displayed with credentials
- **Professional affiliations** (OAMFT) mentioned
- **Scope of practice** clearly defined (preteens-adults, individuals, families, couples)
- **Specialization areas** accurately represented
- **Crisis disclaimers** prominently featured

## 🔧 Maintenance Guide

### Regular Updates (Monthly)
- [ ] **Review contact information** for accuracy
- [ ] **Check license numbers** and renewal dates
- [ ] **Update specialties** if training or certifications change
- [ ] **Review testimonials** for continued consent and relevance
- [ ] **Test contact form** to ensure email delivery works

### Content Updates (As Needed)
- [ ] **Professional photo** - update every 2-3 years or as needed
- [ ] **Bio content** - add new training, credentials, or experience
- [ ] **Service offerings** - update therapy types or approaches
- [ ] **Pricing** - update fees as needed (services.md)
- [ ] **Office hours** - update availability (config.yaml)

### Technical Maintenance (Quarterly)
- [ ] **Dependency updates** - `npm update` to get latest packages
- [ ] **Security updates** - check for Astro and framework updates
- [ ] **Performance testing** - test site speed and mobile responsiveness
- [ ] **Link checking** - verify all internal and external links work
- [ ] **SSL certificate** - Cloudflare handles this automatically

### SEO & Marketing (As Needed)
- [ ] **Google My Business** - keep consistent with website info
- [ ] **Professional directories** - ensure information matches website
- [ ] **Meta descriptions** - update if services or focus areas change
- [ ] **Local SEO** - maintain Oregon-specific keywords and content

## 🚀 Deployment

This website is ready for deployment to Cloudflare Pages:

### Initial Setup
1. **Push to GitHub:** Connect your repository
2. **Cloudflare Pages:** Link GitHub repo for automatic deployments
3. **Environment variables:** Add `RESEND_API_KEY` in Cloudflare dashboard
4. **Custom domain:** Connect your domain with free SSL certificate
5. **Build settings:** 
   - Build command: `npm run build:cloudflare`
   - Build output directory: `dist`

### Ongoing Deployment
- **Automatic:** Push to main branch triggers deployment
- **Build time:** ~2-3 minutes for full site rebuild
- **Global CDN:** Site served from Cloudflare's edge locations
- **Functions:** Contact form runs on Cloudflare's edge network

### Environment Variables Required
```
RESEND_API_KEY=your_resend_api_key_here
```

## 🎛️ Enabling/Disabling Animations

If you want to add more visual effects in the future:

### To Enable Scroll Animations
1. **Import components** in page files:
```astro
import ScrollAnimation from '../components/ScrollAnimation.jsx';
```

2. **Wrap content** with animation components:
```astro
<ScrollAnimation client:visible animation="fade-in-up">
  <div>Your content here</div>
</ScrollAnimation>
```

### Available Animation Types
- `fade-in-up`, `fade-in-left`, `fade-in-right`
- `fade-in` (simple fade)
- Custom delays and thresholds supported

### To Add Therapeutic Icons
```astro
import AnimatedIcon from '../components/AnimatedIcon.jsx';

<AnimatedIcon client:visible type="anxiety" animate="pulse" />
```
Available icon types: anxiety, relationship, growth, family, healing, mindfulness, teen, trauma

## 📄 License

This project is provided as a demo for educational purposes. Customize as needed for your practice.

---

**Built with ❤️ for mental health professionals**