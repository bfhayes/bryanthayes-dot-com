# Guitar Tablature System: Complete Guide

This comprehensive guide documents the complete guitar tablature system used in this Astro-based portfolio site, covering alphaTab integration, ASCII-to-AlphaTex conversion, and content management.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [alphaTab Integration](#alphatab-integration)
3. [ASCII-to-AlphaTex Conversion](#ascii-to-alphatex-conversion)
4. [AlphaTex Notation Reference](#alphatex-notation-reference)
5. [Verification System](#verification-system)
6. [Content Creation Workflow](#content-creation-workflow)
7. [SheetMusicViewer Component](#sheetmusicviewer-component)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Examples & Templates](#examples--templates)

---

## Architecture Overview

### System Components

The guitar tablature system consists of four main components:

1. **alphaTab Library** (`@coderline/alphatab` v1.6.2) - Professional music notation rendering
2. **ASCII-to-AlphaTex Converter** (`scripts/ascii-to-alphatex.js`) - Converts ASCII tabs to AlphaTex format
3. **SheetMusicViewer Component** (`src/components/music/SheetMusicViewer.tsx`) - React component for rendering
4. **Verification System** (`scripts/verify-ascii-conversion.js`) - Quality assurance and testing

### Technology Stack

- **Frontend**: Astro + React + TypeScript + Tailwind CSS
- **Music Notation**: alphaTab with AlphaTex format
- **Content**: Markdown with frontmatter + Astro content collections
- **Font**: Bravura music notation font (public/font/)

---

## alphaTab Integration

### Installation & Dependencies

```json
{
  "dependencies": {
    "@coderline/alphatab": "^1.6.2"
  }
}
```

### Font Setup

alphaTab requires the Bravura music font, which is included in `/public/font/`:
- `Bravura.woff2` - Primary web font
- `Bravura.woff` - Fallback web font  
- `Bravura.otf` - Desktop font
- `Bravura.eot` - Legacy browser support

### Configuration

The alphaTab engine is configured for tablature-only display:

```typescript
const settings = {
  core: {
    engine: 'svg',           // SVG rendering for high quality
    logLevel: 1,             // Info level logging
    useWorkers: false,       // Disabled for stability
    fontDirectory: '/font/', // Bravura font location
  },
  display: {
    staveProfile: 3,         // Tablature only (no standard notation)
  },
  notation: {
    notationMode: 0,         // Standard notation mode
    elements: {
      scoreTitle: true,      // Show song title
      scoreArtist: true,     // Show artist name
      guitarTuning: true,    // Show tuning info
    }
  }
};
```

---

## ASCII-to-AlphaTex Conversion

### Overview

The converter (`scripts/ascii-to-alphatex.js`) transforms traditional ASCII guitar tablature into alphaTab's AlphaTex format, supporting advanced guitar techniques.

### Usage

#### Command Line Interface

```bash
# Basic conversion
node scripts/ascii-to-alphatex.js input.txt

# With metadata
node scripts/ascii-to-alphatex.js tabs.txt --title "Song Title" --artist "Artist" --tempo 120

# Interactive mode
node scripts/ascii-to-alphatex.js --interactive

# Help
node scripts/ascii-to-alphatex.js --help
```

#### Programmatic Usage

```javascript
const { convertAsciiToAlphaTex } = require('./scripts/ascii-to-alphatex.js');

const alphaTex = convertAsciiToAlphaTex(asciiTabs, {
  title: 'Song Title',
  artist: 'Artist Name', 
  tempo: 120,
  timeSignature: '4/4'
});
```

### Supported Guitar Techniques

#### 1. Basic Notes
```
ASCII: e|--5--7--3--0--|
AlphaTex: 5.1 7.1 3.1 0.1
```

#### 2. Slides
```
ASCII: E|--5/7--7\3--|
AlphaTex: 5.6{sl} 7.6 7.6{sl} 3.6
```

#### 3. Muted Strings (Dead Notes)
```
ASCII: e|--x--3--x--|
AlphaTex: x.1 3.1 x.1
```

#### 4. Hammer-ons/Pull-offs
```
ASCII: E|--5h7p5--|
AlphaTex: 5.6{h} 7.6 5.6
```

#### 5. Chained Techniques
```
ASCII: B|--5p3p2h3--|
AlphaTex: 5.2{h} 3.2{h} 2.2{h} 3.2
```

#### 6. Simultaneous Notes (Chords)
```
ASCII: 
e|--5--
B|--5--
G|--6--
D|--7--
A|--7--
E|--5--

AlphaTex: (5.1 5.2 6.3 7.4 7.5 5.6)
```

### Conversion Algorithm

#### Step 1: Parse ASCII Input
- Filter valid tablature lines (starts with string names: e, B, G, D, A, E)
- Group lines into sets of 6 strings
- Identify measure boundaries (|)

#### Step 2: Extract Notes and Techniques
- Process each string individually
- Detect fret numbers (0-9+)
- Identify technique patterns:
  - `h` = hammer-on
  - `p` = pull-off  
  - `/` = slide up
  - `\` = slide down
  - `x` = muted string

#### Step 3: Generate AlphaTex
- Convert string positions to alphaTab numbering (e=1, B=2, G=3, D=4, A=5, E=6)
- Apply technique notation (`{sl}`, `{h}`)
- Group simultaneous notes in parentheses
- Add metadata headers

---

## AlphaTex Notation Reference

### String Numbering
- **1**: High E string (e)
- **2**: B string
- **3**: G string  
- **4**: D string
- **5**: A string
- **6**: Low E string (E)

### Basic Syntax

#### Single Notes
```
fret.string
Examples: 0.1 (open high E), 5.6 (5th fret low E)
```

#### Chords (Simultaneous Notes)
```
(note1 note2 note3)
Example: (0.1 2.2 2.3) - E major chord partial
```

#### Rests
```
r     - quarter rest
r.2   - half rest
r.4   - whole rest
```

### Technique Notation

#### Legato/Slides
```
{sl}  - Slide (legato)
Example: 5.6{sl} 7.6 (slide from 5th to 7th fret)
```

#### Hammer-ons/Pull-offs  
```
{h}   - Hammer-on/Pull-off
Example: 5.6{h} 7.6 (hammer from 5th to 7th fret)
```

#### Muted Strings
```
x.string
Example: x.1 (muted high E string)
```

### Metadata Commands
```
\title "Song Title"
\artist "Artist Name"  
\tempo 120
\time 4 4
```

### Track Definition
```
.
```
Starts a new guitar track (required after metadata).

---

## Verification System

### Overview

The verification script (`scripts/verify-ascii-conversion.js`) ensures conversion accuracy by comparing expected vs. actual output.

### Usage

```bash
# Run verification on test data
node scripts/verify-ascii-conversion.js

# Verify specific file
node scripts/verify-ascii-conversion.js tabs.txt

# Help
node scripts/verify-ascii-conversion.js --help
```

### Verification Process

#### 1. Parse Expected Output
- Extract notes from original ASCII tabs
- Identify frets, strings, and techniques
- Map to expected AlphaTex notation

#### 2. Convert and Parse Actual Output
- Run ASCII-to-AlphaTex conversion
- Parse resulting AlphaTex measures
- Extract individual notes and chords

#### 3. Compare Results
- Match expected vs. actual notes by position
- Verify technique targets are present
- Report missing or incorrect notes

### Example Output

```
=== ASCII to AlphaTex Conversion Verification ===

Overall Success: ✅ PASS

Measure 1:
  ✅ All notes captured correctly
  Expected notes: {"e":[{"position":2,"fret":5}],"B":[{"position":5,"fret":7}]}
  Actual output: 5.1 7.2

Measure 2:
  ❌ Issues found:
    - Missing note: 3 on G string (3.3)
  Expected notes: {"G":[{"position":0,"fret":3}]}
  Actual output: 

🎉 All notes converted successfully!
```

---

## Content Creation Workflow

### File Structure

Music content is stored in `src/content/music/` with the following structure:

```
src/content/music/
├── song-name.md          # Individual song files
└── ...
```

### Frontmatter Schema

```yaml
---
title: "Song Title - Arrangement Type"
description: "Brief description of the arrangement"
publishDate: 2024-03-25T00:00:00.000Z
heroImage: "/images/projects/song-thumb.jpg"
gallery:
  - "/images/projects/song-1.jpg"
  - "/images/projects/song-2.jpg"
type: "arrangement" | "cover" | "original"
genre: ["acoustic", "folk", "rock"]
instruments: ["acoustic guitar"]
duration: "3:45"
key: "G"
tempo: "92 BPM"
audioFile: "/audio/sample.m4a"
tuning: "E A D G B E"
capo: "no capo" | "3rd fret"
sheetMusic: |
  # AlphaTex notation here
sheetMusicFormat: "alphaTex"
tabs: |
  # ASCII tablature here
tags: ["fingerstyle", "strumming", "technique"]
featured: false
draft: false
---
```

### Step-by-Step Creation Process

#### 1. Prepare ASCII Tablature
Create clean ASCII tablature with proper string labels:

```
e|--0--3--0--|
B|--1--1--1--|
G|--0--0--0--|
D|--2--2--2--|
A|--3--3--3--|
E|-----------|
```

#### 2. Convert to AlphaTex
```bash
node scripts/ascii-to-alphatex.js input.txt --title "Song Name" --artist "Artist" --tempo 120
```

#### 3. Create Content File
- Copy conversion output to `sheetMusic` field
- Add original ASCII tabs to `tabs` field
- Fill in all required frontmatter

#### 4. Verify Results
```bash
# Test the specific conversion
echo "your-ascii-tabs" | node scripts/ascii-to-alphatex.js --interactive

# Run verification
node scripts/verify-ascii-conversion.js
```

#### 5. Test in Browser
- Start dev server: `npm run dev`
- Navigate to `/music/your-song-slug`
- Verify rendering and functionality

---

## SheetMusicViewer Component

### Overview

React component that integrates alphaTab for rendering guitar tablature in the browser.

### Props Interface

```typescript
interface SheetMusicViewerProps {
  musicData: string;           // AlphaTex notation
  title?: string;              // Display title
  format?: 'alphaTex' | 'musicxml' | 'gp'; // Format type
}
```

### Usage in Astro

```tsx
import SheetMusicViewer from '@/components/music/SheetMusicViewer';

<SheetMusicViewer 
  musicData={frontmatter.sheetMusic}
  title={frontmatter.title}
  format="alphaTex"
  client:load
/>
```

### Features

#### 1. Rendering Engine
- SVG-based high-quality rendering
- Tablature-only display (no standard notation)
- Responsive design with mobile support

#### 2. User Controls
- **Print**: Direct printing of tablature
- **Download**: Export as image/PDF
- **Loading States**: Visual feedback during rendering
- **Error Handling**: Graceful error display

#### 3. Styling
- Clean, professional appearance
- Print-friendly layout
- Dark header with controls
- Light tablature background

### Error Handling

The component handles several error scenarios:

```typescript
// alphaTab initialization error
api.error.on((error) => {
  setError(`alphaTab error: ${error}`);
});

// Music data loading error
try {
  api.tex(musicData);
} catch (loadError) {
  setError(`Error loading music data: ${loadError}`);
}
```

### Performance Considerations

- Workers disabled for stability (`useWorkers: false`)
- Lazy loading with `client:load` directive
- Proper cleanup on component unmount

---

## Troubleshooting Guide

### Common Issues

#### 1. Font Loading Problems

**Symptoms**: Missing musical symbols, rendering errors
**Cause**: Bravura font not loaded properly

**Solutions**:
- Verify font files exist in `/public/font/`
- Check `fontDirectory: '/font/'` in alphaTab settings
- Ensure font MIME types are configured correctly

#### 2. Conversion Errors

**Symptoms**: Missing notes, incorrect techniques
**Cause**: ASCII parsing issues

**Solutions**:
- Verify ASCII format with proper string labels (e|, B|, G|, D|, A|, E|)
- Check measure separators (|) are properly placed
- Run verification script to identify specific issues

**Debug Commands**:
```bash
# Test conversion with verbose output
node scripts/ascii-to-alphatex.js input.txt --title "Test"

# Run verification
node scripts/verify-ascii-conversion.js input.txt
```

#### 3. alphaTab Rendering Issues

**Symptoms**: Component not loading, blank display
**Cause**: Configuration or data problems

**Solutions**:
- Check browser console for JavaScript errors
- Verify AlphaTex syntax is valid
- Test with simple notation first
- Ensure React component has `client:load` directive

**Debug Process**:
```javascript
// Enable detailed logging
const settings = {
  core: {
    logLevel: 0, // Debug level
    // ... other settings
  }
};
```

#### 4. Performance Issues

**Symptoms**: Slow loading, browser freezing
**Cause**: Complex notation or configuration issues

**Solutions**:
- Disable workers: `useWorkers: false`
- Simplify notation for testing
- Optimize image loading and caching

### Debugging Tools

#### 1. Browser Console
Check for alphaTab errors and warnings:
```javascript
console.log('alphaTab version:', alphaTab.Environment.version);
```

#### 2. Network Tab
Verify font files are loading:
- Check `/font/Bravura.woff2` returns 200 status
- Verify correct MIME type: `application/font-woff2`

#### 3. Elements Inspector
Examine rendered SVG output:
- Look for `<svg>` elements in DOM
- Check for proper dimensions and content

---

## Examples & Templates

### Example 1: Simple Chord Progression

#### ASCII Input
```
e|--0--3--0--2--|
B|--1--0--1--3--|
G|--0--0--0--2--|
D|--2--0--2--0--|
A|--3--2--3-----|
E|--------3-----|
```

#### AlphaTex Output
```
\title "Simple Chords"
\tempo 120
.

(0.1 1.2 0.3 2.4 3.5) (3.1 0.2 0.3 0.4 2.5 3.6) (0.1 1.2 0.3 2.4 3.5) (2.1 3.2 2.3 0.4)
```

### Example 2: Fingerpicking Pattern (Blackbird Style)

#### ASCII Input
```
e|---------------------|
B|------0---1---3------|
G|----0---0---0---0----|
D|---------------------|
A|---------------------|
E|--3------------------|
```

#### AlphaTex Output
```
\title "Fingerpicking Pattern"
\tempo 92
.

3.6 0.3 0.2 0.3 1.2 0.3 3.2 0.3
```

### Example 3: Advanced Techniques (Slide + Hammer-on)

#### ASCII Input
```
e|------------------------|
B|------------------------|
G|------------------------|
D|------------------------|
A|---------5--------------|
E|---5/7-------7---5\3----|
```

#### AlphaTex Output
```
\title "Advanced Techniques"
\tempo 120
.

5.6{sl} 7.6 5.5 7.6 5.6{sl} 3.6
```

### Content File Template

```yaml
---
title: "Song Name - Arrangement Type"
description: "Brief description focusing on techniques or style"
publishDate: 2024-03-25T00:00:00.000Z
heroImage: "/images/projects/song-thumb.jpg"
gallery:
  - "/images/projects/song-1.jpg"
type: "arrangement"
genre: ["acoustic", "folk"]
instruments: ["acoustic guitar"]
duration: "3:30"
key: "G"
tempo: "120 BPM"
audioFile: "/audio/sample.m4a"
tuning: "E A D G B E"
capo: "no capo"
sheetMusic: |
  \title "Song Name"
  \artist "Artist Name"
  \tempo 120
  .

  # AlphaTex notation goes here
sheetMusicFormat: "alphaTex"
tabs: |
  # ASCII tablature goes here
  e|------------|
  B|------------|
  G|------------|
  D|------------|
  A|------------|
  E|------------|
tags: ["technique-tags", "style-tags"]
featured: false
draft: false
---

## About This Arrangement

Brief description of the song, arrangement choices, and playing techniques.

## Playing Tips

### Technique Notes
- Specific technical guidance
- Fingering suggestions
- Common challenges

### Performance Notes
- Tempo and feel guidance
- Dynamic suggestions
- Practice recommendations

The arrangement captures [specific musical elements] while remaining accessible to [skill level] players.
```

---

## Quick Reference

### File Locations
- **ASCII Converter**: `scripts/ascii-to-alphatex.js`
- **Verifier**: `scripts/verify-ascii-conversion.js`
- **React Component**: `src/components/music/SheetMusicViewer.tsx`
- **Music Content**: `src/content/music/*.md`
- **Fonts**: `public/font/Bravura.*`

### Key Commands
```bash
# Convert ASCII to AlphaTex
node scripts/ascii-to-alphatex.js input.txt --title "Song" --artist "Artist"

# Verify conversion
node scripts/verify-ascii-conversion.js

# Start development server
npm run dev

# Add new project (interactive)
npm run add-project
```

### alphaTab String Numbers
1=e, 2=B, 3=G, 4=D, 5=A, 6=E

### Common Techniques
- **Slide**: `5.6{sl} 7.6`
- **Hammer-on**: `5.6{h} 7.6`
- **Muted**: `x.1`
- **Chord**: `(0.1 1.2 0.3)`

---

This guide provides complete documentation for working with the guitar tablature system. For additional help or questions, refer to the alphaTab documentation at [alphaTab.net](https://www.alphatab.net/) or examine existing song files in `src/content/music/`.