#!/usr/bin/env node

/**
 * Verification script to ensure ASCII tab conversion is accurate and complete
 */

const { convertAsciiToAlphaTex } = require('./ascii-to-alphatex.js');

/**
 * Manually parse ASCII tabs to get expected output
 * @param {string} ascii - ASCII tablature
 * @returns {Object} Expected notes by measure and string
 */
function getExpectedNotes(ascii) {
  const lines = ascii.trim().split('\n');
  const tabLines = lines.filter(line => /^[eEbBgGdDaA]\|/.test(line));
  
  if (tabLines.length !== 6) {
    throw new Error('Expected 6 tab lines');
  }
  
  // String names in order
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const measures = [];
  
  // Find measure boundaries by looking at first line
  const firstLine = tabLines[0].substring(2); // Remove string label
  const measureBoundaries = [];
  let start = 0;
  
  for (let i = 0; i < firstLine.length; i++) {
    if (firstLine[i] === '|') {
      measureBoundaries.push({ start, end: i });
      start = i + 1;
    }
  }
  
  // Parse each measure
  measureBoundaries.forEach((boundary, measureIndex) => {
    const measureNotes = {};
    
    tabLines.forEach((line, stringIndex) => {
      const stringName = stringNames[stringIndex];
      const measureContent = line.substring(boundary.start + 2, boundary.end + 2);
      const notes = [];
      
      // Find all notes in this string for this measure
      for (let pos = 0; pos < measureContent.length; pos++) {
        const char = measureContent[pos];
        if (/\d/.test(char)) {
          // Check for techniques
          const nextChar = pos + 1 < measureContent.length ? measureContent[pos + 1] : '';
          const nextNextChar = pos + 2 < measureContent.length ? measureContent[pos + 2] : '';
          
          if (nextChar === 'h' || nextChar === 'p') {
            // It's a technique
            if (/\d/.test(nextNextChar)) {
              notes.push({
                position: pos,
                fret: parseInt(char, 10),
                technique: nextChar,
                targetFret: parseInt(nextNextChar, 10)
              });
            }
          } else if (pos === 0 || (measureContent[pos - 1] !== 'h' && measureContent[pos - 1] !== 'p')) {
            // Regular note (not part of a technique)
            notes.push({
              position: pos,
              fret: parseInt(char, 10)
            });
          }
        }
      }
      
      if (notes.length > 0) {
        measureNotes[stringName] = notes;
      }
    });
    
    measures.push(measureNotes);
  });
  
  return measures;
}

/**
 * Parse AlphaTex output to extract actual notes
 * @param {string} alphaTex - AlphaTex output
 * @returns {Array} Parsed measures
 */
function parseAlphaTexOutput(alphaTex) {
  const lines = alphaTex.split('\n');
  const measureLine = lines.find(line => line.includes('|'));
  
  if (!measureLine) {
    throw new Error('No measures found in AlphaTex output');
  }
  
  const measures = measureLine.split('|').filter(m => m.trim());
  
  return measures.map(measure => {
    const notes = [];
    const tokens = measure.trim().split(/\s+/);
    
    tokens.forEach(token => {
      // Parse individual notes or chords
      if (token.startsWith('(')) {
        // Chord - multiple simultaneous notes
        const chordNotes = token.replace(/[()]/g, '').split(' ');
        chordNotes.forEach(note => {
          if (note.includes('.')) {
            notes.push(note);
          }
        });
      } else if (token.includes('.')) {
        // Single note
        notes.push(token);
      }
    });
    
    return notes;
  });
}

/**
 * Verify conversion accuracy
 * @param {string} ascii - ASCII tablature
 * @returns {Object} Verification results
 */
function verifyConversion(ascii) {
  const expected = getExpectedNotes(ascii);
  const alphaTex = convertAsciiToAlphaTex(ascii, {
    title: 'Verification Test',
    artist: 'Test',
    tempo: 68
  });
  const actual = parseAlphaTexOutput(alphaTex);
  
  const results = {
    success: true,
    measures: [],
    errors: []
  };
  
  expected.forEach((expectedMeasure, measureIndex) => {
    const actualMeasure = actual[measureIndex] || [];
    const measureResult = {
      number: measureIndex + 1,
      expected: expectedMeasure,
      actual: actualMeasure,
      issues: []
    };
    
    // Count expected notes per string
    const stringMap = { 'e': 1, 'B': 2, 'G': 3, 'D': 4, 'A': 5, 'E': 6 };
    
    Object.entries(expectedMeasure).forEach(([stringName, expectedNotes]) => {
      const stringNum = stringMap[stringName];
      
      expectedNotes.forEach(note => {
        const expectedNotation = `${note.fret}.${stringNum}`;
        const found = actualMeasure.some(actualNote => 
          actualNote.includes(expectedNotation)
        );
        
        if (!found) {
          measureResult.issues.push(
            `Missing note: ${note.fret} on ${stringName} string (${expectedNotation})`
          );
          results.success = false;
        }
        
        if (note.technique) {
          const targetNotation = `${note.targetFret}.${stringNum}`;
          const targetFound = actualMeasure.some(actualNote =>
            actualNote.includes(targetNotation)
          );
          
          if (!targetFound) {
            measureResult.issues.push(
              `Missing technique target: ${note.targetFret} on ${stringName} string (${targetNotation})`
            );
            results.success = false;
          }
        }
      });
    });
    
    results.measures.push(measureResult);
  });
  
  return results;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ASCII to AlphaTex Conversion Verifier

Usage:
  node verify-ascii-conversion.js [input.txt]
  
This script verifies that the ASCII to AlphaTex conversion
captures all notes accurately and completely.
`);
    process.exit(0);
  }
  
  // Test with the problematic example
  const testAscii = `
e|-2----5----0h2------|------------------------|-----------------|-------------3-2-----|
B|----------------3---|---2-3-3h5----5p3p2h3---|-0---3---2h3-----|---------3-----------|
G|------------------2-|------------------------|-------------4---|-----0-----2---------|
D|-0-0----0-----------|------------------------|---------------0-|---0---0-------------|
A|--------------------|-0----------0---------0-|---2---2---------|---------------------|
E|--------------------|------------------------|-----------------|-3-------------------|
`;
  
  console.log('=== ASCII to AlphaTex Conversion Verification ===\n');
  
  try {
    const results = verifyConversion(testAscii);
    
    console.log(`Overall Success: ${results.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    results.measures.forEach(measure => {
      console.log(`Measure ${measure.number}:`);
      
      if (measure.issues.length === 0) {
        console.log('  ✅ All notes captured correctly');
      } else {
        console.log('  ❌ Issues found:');
        measure.issues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }
      
      console.log('  Expected notes:', JSON.stringify(measure.expected));
      console.log('  Actual output:', measure.actual.join(' '));
      console.log('');
    });
    
    if (!results.success) {
      console.log('⚠️  Conversion has errors that need to be fixed!');
      process.exit(1);
    } else {
      console.log('🎉 All notes converted successfully!');
    }
    
  } catch (error) {
    console.error('Verification error:', error.message);
    process.exit(1);
  }
}

module.exports = { verifyConversion, getExpectedNotes, parseAlphaTexOutput };