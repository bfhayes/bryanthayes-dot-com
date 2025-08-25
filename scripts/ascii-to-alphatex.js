#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Convert ASCII guitar tablature to AlphaTex format
 * @param {string} asciiTabs - ASCII tablature text
 * @param {Object} options - Conversion options
 * @returns {string} AlphaTex formatted string
 */
function convertAsciiToAlphaTex(asciiTabs, options = {}) {
  const {
    title = 'Untitled',
    artist = '',
    tempo = 120,
    timeSignature = '4/4'
  } = options;

  // Parse ASCII tabs into structured data
  const measures = parseAsciiTabs(asciiTabs);
  
  // Convert to AlphaTex format
  let alphaTex = '';
  
  // Add metadata
  if (title) alphaTex += `\\title "${title}"\n`;
  if (artist) alphaTex += `\\artist "${artist}"\n`;
  if (tempo) alphaTex += `\\tempo ${tempo}\n`;
  
  // Start guitar track
  alphaTex += '.\n\n';
  
  // Convert measures to AlphaTex
  const alphaTexMeasures = measures.map(measure => {
    return convertMeasureToAlphaTex(measure);
  });
  
  alphaTex += alphaTexMeasures.join(' | ') + ' |';
  
  return alphaTex;
}

/**
 * Parse ASCII tablature into structured measure data
 * @param {string} asciiTabs - ASCII tablature text
 * @returns {Array} Array of measures with note data
 */
function parseAsciiTabs(asciiTabs) {
  const lines = asciiTabs.trim().split('\n');
  
  // Filter out non-tab lines (comments, section headers, etc.)
  const tabLines = lines.filter(line => {
    const trimmed = line.trim();
    return /^[eEbBgGdDaA][\|\-\[\]0-9\s]+/.test(trimmed);
  });
  
  if (tabLines.length === 0) {
    throw new Error('No valid tablature lines found');
  }
  
  // Group tab lines into sets of 6 (one per string)
  const tabGroups = [];
  for (let i = 0; i < tabLines.length; i += 6) {
    const group = tabLines.slice(i, i + 6);
    if (group.length === 6) {
      tabGroups.push(group);
    }
  }
  
  const allMeasures = [];
  
  // Process each group of 6 tab lines
  tabGroups.forEach(group => {
    const measures = parseTabGroup(group);
    allMeasures.push(...measures);
  });
  
  return allMeasures;
}

/**
 * Parse a group of 6 tab lines into measures
 * @param {Array} tabLines - Array of 6 tab lines (one per string)
 * @returns {Array} Array of measure objects
 */
function parseTabGroup(tabLines) {
  // Extract the tab content (remove string labels)
  const cleanLines = tabLines.map(line => {
    return line.replace(/^[eEbBgGdDaA]\|/, '');
  });
  
  // Split by measure separators
  const measureSeparators = /\|/g;
  const firstLine = cleanLines[0];
  const measureSplits = [];
  let lastIndex = 0;
  let match;
  
  while ((match = measureSeparators.exec(firstLine)) !== null) {
    measureSplits.push({
      start: lastIndex,
      end: match.index
    });
    lastIndex = match.index + 1;
  }
  
  // Add final measure if there's content after the last separator
  if (lastIndex < firstLine.length) {
    measureSplits.push({
      start: lastIndex,
      end: firstLine.length
    });
  }
  
  const measures = [];
  
  // Process each measure
  measureSplits.forEach(split => {
    const measureStrings = cleanLines.map(line => 
      line.substring(split.start, split.end).trim()
    );
    
    const measureNotes = parseMeasureStrings(measureStrings);
    if (measureNotes.length > 0) {
      measures.push(measureNotes);
    }
  });
  
  return measures;
}

/**
 * Parse measure strings into note positions with guitar techniques
 * @param {Array} measureStrings - Array of 6 measure strings (one per string)
 * @returns {Array} Array of note positions with timing and techniques
 */
function parseMeasureStrings(measureStrings) {
  if (measureStrings.length !== 6) {
    throw new Error('Expected 6 strings for measure parsing');
  }
  
  // Find the maximum length to normalize all strings
  const maxLength = Math.max(...measureStrings.map(s => s.length));
  
  const allNotes = [];
  
  // Parse each string separately to handle techniques
  measureStrings.forEach((stringContent, stringIndex) => {
    const alphaTabString = stringIndex + 1; // Convert to alphaTab string numbering
    const stringNotes = parseStringWithTechniques(stringContent, alphaTabString);
    allNotes.push(...stringNotes);
  });
  
  // Sort notes by position and group simultaneous notes
  allNotes.sort((a, b) => a.position - b.position);
  
  const groupedNotes = [];
  let currentPos = -1;
  let currentGroup = [];
  
  allNotes.forEach(note => {
    if (note.position !== currentPos) {
      // New position, save previous group and start new one
      if (currentGroup.length > 0) {
        if (currentGroup.length === 1) {
          groupedNotes.push(currentGroup[0].notation);
        } else {
          const noteStrings = currentGroup.map(n => n.notation);
          groupedNotes.push(`(${noteStrings.join(' ')})`);
        }
      }
      currentPos = note.position;
      currentGroup = [note];
    } else {
      // Same position, add to current group
      currentGroup.push(note);
    }
  });
  
  // Don't forget the last group
  if (currentGroup.length > 0) {
    if (currentGroup.length === 1) {
      groupedNotes.push(currentGroup[0].notation);
    } else {
      const noteStrings = currentGroup.map(n => n.notation);
      groupedNotes.push(`(${noteStrings.join(' ')})`);
    }
  }
  
  return groupedNotes;
}

/**
 * Parse a single string with guitar techniques (hammer-ons, pull-offs)
 * @param {string} stringContent - The content of one guitar string
 * @param {number} alphaTabString - The alphaTab string number (1-6)
 * @returns {Array} Array of note objects with position, fret, and techniques
 */
function parseStringWithTechniques(stringContent, alphaTabString) {
  const notes = [];
  const length = stringContent.length;
  const processedPositions = new Set(); // Track positions we've already processed
  
  for (let pos = 0; pos < length; pos++) {
    // Skip if we've already processed this position as part of a technique
    if (processedPositions.has(pos)) {
      continue;
    }
    
    const char = stringContent[pos];
    
    // Check if it's a fret number
    if (/\d/.test(char)) {
      const fret = parseInt(char, 10);
      
      // Look ahead for hammer-on or pull-off
      let techniques = [];
      let nextPos = pos + 1;
      
      // Check for technique patterns like "0h2", "5p3", "3h5p3"
      while (nextPos < length) {
        const nextChar = stringContent[nextPos];
        
        if (nextChar === 'h' || nextChar === 'p') {
          // Found a technique, look for the target fret
          processedPositions.add(nextPos); // Mark the h/p as processed
          nextPos++;
          if (nextPos < length && /\d/.test(stringContent[nextPos])) {
            const targetFret = parseInt(stringContent[nextPos], 10);
            techniques.push({
              type: nextChar,
              targetFret: targetFret,
              targetPos: nextPos
            });
            processedPositions.add(nextPos); // Mark the target fret position as processed
            nextPos++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Create the note notation
      let notation = `${fret}.${alphaTabString}`;
      
      if (techniques.length > 0) {
        // Add hammer-on notation (AlphaTex uses {h} for both hammer-ons and pull-offs)
        notation += '{h}';
        
        // Add the technique target notes sequentially after the source note
        techniques.forEach((tech, index) => {
          // Check if this target note is also the source of another technique (chained techniques)
          const isChained = index < techniques.length - 1; // Not the last technique in the chain
          const targetNotation = isChained 
            ? `${tech.targetFret}.${alphaTabString}{h}` // Add {h} for chained techniques
            : `${tech.targetFret}.${alphaTabString}`;    // No {h} for final target
          
          // For techniques, place them right after the source note
          notes.push({
            position: pos + 0.1 * (index + 1), // Use fractional positions for sequential ordering
            notation: targetNotation,
            fret: tech.targetFret,
            string: alphaTabString
          });
        });
      }
      
      notes.push({
        position: pos,
        notation: notation,
        fret: fret,
        string: alphaTabString
      });
    }
  }
  
  return notes;
}

/**
 * Convert a measure to AlphaTex format
 * @param {Array} measure - Array of notes in the measure
 * @returns {string} AlphaTex representation of the measure
 */
function convertMeasureToAlphaTex(measure) {
  if (measure.length === 0) {
    return 'r r r r'; // Full measure rest
  }
  
  return measure.join(' ');
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ASCII to AlphaTex Converter

Usage:
  node ascii-to-alphatex.js [input.txt] [options]
  
Options:
  --title "Song Title"     Set the song title
  --artist "Artist Name"   Set the artist name
  --tempo 120             Set the tempo (BPM)
  --interactive           Interactive mode
  --help, -h              Show this help message

Examples:
  node ascii-to-alphatex.js tabs.txt
  node ascii-to-alphatex.js tabs.txt --title "Blackbird" --artist "The Beatles" --tempo 92
  node ascii-to-alphatex.js --interactive
`);
    return;
  }
  
  if (args.includes('--interactive')) {
    // Interactive mode - read from stdin
    console.log('Enter ASCII tablature (press Ctrl+D when finished):');
    let input = '';
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    
    process.stdin.on('end', () => {
      try {
        const result = convertAsciiToAlphaTex(input);
        console.log('\nAlphaTex output:');
        console.log(result);
      } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
      }
    });
    
    return;
  }
  
  // File input mode
  const inputFile = args[0];
  if (!inputFile) {
    console.error('Error: Please provide an input file or use --interactive mode');
    console.error('Use --help for usage information');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File ${inputFile} not found`);
    process.exit(1);
  }
  
  // Parse options
  const options = {};
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--title':
        options.title = value;
        break;
      case '--artist':
        options.artist = value;
        break;
      case '--tempo':
        options.tempo = parseInt(value, 10);
        break;
    }
  }
  
  try {
    const input = fs.readFileSync(inputFile, 'utf8');
    const result = convertAsciiToAlphaTex(input, options);
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export functions for testing
if (require.main === module) {
  main();
} else {
  module.exports = {
    convertAsciiToAlphaTex,
    parseAsciiTabs,
    parseTabGroup,
    parseMeasureStrings,
    convertMeasureToAlphaTex
  };
}