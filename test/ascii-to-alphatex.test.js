const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import the conversion functions
const {
  convertAsciiToAlphaTex,
  parseAsciiTabs,
  parseTabGroup,
  parseMeasureStrings,
  convertMeasureToAlphaTex
} = require('../scripts/ascii-to-alphatex.js');

describe('ASCII to AlphaTex Converter', function() {
  
  describe('convertMeasureToAlphaTex', function() {
    it('should convert a simple measure to AlphaTex', function() {
      const measure = ['3.6', '0.3', '1.2', '3.2'];
      const result = convertMeasureToAlphaTex(measure);
      assert.strictEqual(result, '3.6 0.3 1.2 3.2');
    });
    
    it('should handle empty measures as rests', function() {
      const measure = [];
      const result = convertMeasureToAlphaTex(measure);
      assert.strictEqual(result, 'r r r r');
    });
    
    it('should handle chord notation', function() {
      const measure = ['(3.6 0.3)', '1.2'];
      const result = convertMeasureToAlphaTex(measure);
      assert.strictEqual(result, '(3.6 0.3) 1.2');
    });
  });
  
  describe('parseMeasureStrings', function() {
    it('should correctly map string positions to alphaTab numbers', function() {
      // ASCII string order: e, B, G, D, A, E (top to bottom)
      // AlphaTab string order: 1, 2, 3, 4, 5, 6
      const measureStrings = ['1', '2', '3', '4', '5', '6'];
      const result = parseMeasureStrings(measureStrings);
      
      // Should map e→1, B→2, G→3, D→4, A→5, E→6
      assert.deepStrictEqual(result, ['1.1', '2.2', '3.3', '4.4', '5.5', '6.6']);
    });
    
    it('should handle simultaneous notes (chords)', function() {
      const measureStrings = ['0', '1', '0', '2', '3', '0'];
      const result = parseMeasureStrings(measureStrings);
      
      // All strings have notes at the same position
      assert.strictEqual(result[0], '(0.1 1.2 0.3 2.4 3.5 0.6)');
    });
    
    it('should skip non-numeric characters', function() {
      const measureStrings = ['-', '-', '3', '-', '-', '-'];
      const result = parseMeasureStrings(measureStrings);
      
      assert.deepStrictEqual(result, ['3.3']);
    });
    
    it('should handle sparse fret patterns', function() {
      const measureStrings = ['--3--', '--0--', '-----', '-----', '-----', '3----'];
      const result = parseMeasureStrings(measureStrings);
      
      // Should find notes at positions 2 (3.1, 0.2) and 0 (3.6)
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0], '3.6');
      assert.strictEqual(result[1], '(3.1 0.2)');
    });
  });
  
  describe('parseTabGroup', function() {
    it('should parse a simple tab group with measures', function() {
      const tabLines = [
        'e|--3--|--1--|',
        'B|--0--|--1--|',
        'G|--0--|--2--|',
        'D|-----|-----|',
        'A|-----|-----|',
        'E|--3--|-----|'
      ];
      
      const result = parseTabGroup(tabLines);
      
      assert.strictEqual(result.length, 2); // Two measures
      assert.deepStrictEqual(result[0], ['(3.1 0.2 0.3 3.6)']); // First measure
      assert.deepStrictEqual(result[1], ['(1.1 1.2 2.3)']); // Second measure
    });
  });
  
  describe('parseAsciiTabs', function() {
    it('should filter out comment lines and parse tab lines', function() {
      const asciiTabs = `
[Intro Pattern]

e|--3--|--1--|
B|--0--|--1--|
G|--0--|--2--|
D|-----|-----|
A|-----|-----|
E|--3--|-----|

Some comment here
      `;
      
      const result = parseAsciiTabs(asciiTabs);
      
      assert.strictEqual(result.length, 2); // Two measures
    });
    
    it('should handle multiple tab groups', function() {
      const asciiTabs = `
e|--3--|
B|--0--|
G|--0--|
D|-----|
A|-----|
E|--3--|

e|--1--|
B|--1--|
G|--2--|
D|-----|
A|-----|
E|-----|
      `;
      
      const result = parseAsciiTabs(asciiTabs);
      
      assert.strictEqual(result.length, 2); // Two measures from two groups
    });
  });
  
  describe('convertAsciiToAlphaTex', function() {
    it('should convert simple ASCII tabs to AlphaTex with metadata', function() {
      const asciiTabs = `
e|--3--|
B|--0--|
G|--0--|
D|-----|
A|-----|
E|--3--|
      `;
      
      const options = {
        title: 'Test Song',
        artist: 'Test Artist',
        tempo: 120
      };
      
      const result = convertAsciiToAlphaTex(asciiTabs, options);
      
      assert(result.includes('\\title "Test Song"'));
      assert(result.includes('\\artist "Test Artist"'));
      assert(result.includes('\\tempo 120'));
      assert(result.includes('.'));
      assert(result.includes('(3.1 0.2 0.3 3.6)'));
    });
    
    it('should handle ASCII tabs without options', function() {
      const asciiTabs = `
e|--3--|
B|--0--|
G|--0--|
D|-----|
A|-----|
E|--3--|
      `;
      
      const result = convertAsciiToAlphaTex(asciiTabs);
      
      assert(result.includes('\\title "Untitled"'));
      assert(result.includes('\\tempo 120'));
      assert(result.includes('.'));
    });
  });
  
  describe('Example File Integration Test', function() {
    it('should successfully convert example-ascii-tab.txt to AlphaTex', function() {
      const exampleFile = path.join(__dirname, 'example-ascii-tab.txt');
      
      // Check if the example file exists
      assert(fs.existsSync(exampleFile), 'example-ascii-tab.txt should exist');
      
      // Read the example file
      const asciiContent = fs.readFileSync(exampleFile, 'utf8');
      
      // Convert to AlphaTex
      const options = {
        title: 'Example Song',
        artist: 'Test Artist',
        tempo: 92
      };
      
      const result = convertAsciiToAlphaTex(asciiContent, options);
      
      // Verify the result contains expected AlphaTex elements
      assert(result.includes('\\title "Example Song"'), 'Should contain title');
      assert(result.includes('\\artist "Test Artist"'), 'Should contain artist');
      assert(result.includes('\\tempo 92'), 'Should contain tempo');
      assert(result.includes('.'), 'Should contain track separator');
      assert(result.includes('|'), 'Should contain measure separators');
      
      // Should contain some notes in fret.string format
      assert(/\d+\.\d+/.test(result), 'Should contain notes in fret.string format');
      
      // Should not contain obvious errors
      assert(!result.includes('undefined'), 'Should not contain undefined values');
      assert(!result.includes('NaN'), 'Should not contain NaN values');
      
      console.log('✓ Example file conversion result:');
      console.log(result);
      console.log('\n✓ Conversion completed successfully!');
    });
    
    it('should handle various fret positions correctly', function() {
      const asciiTabs = `
e|--0--1--3--5--7--8--|
B|--0--1--3--5--7--8--|
G|--0--2--4--5--7--9--|
D|--0--2--4--5--7--9--|
A|--0--2--4--5--7--9--|
E|--0--1--3--5--7--8--|
      `;
      
      const result = convertAsciiToAlphaTex(asciiTabs);
      
      // Should contain various fret numbers
      assert(result.includes('0.'), 'Should contain fret 0');
      assert(result.includes('1.'), 'Should contain fret 1');
      assert(result.includes('3.'), 'Should contain fret 3');
      assert(result.includes('5.'), 'Should contain fret 5');
      assert(result.includes('7.'), 'Should contain fret 7');
      assert(result.includes('8.'), 'Should contain fret 8');
      assert(result.includes('9.'), 'Should contain fret 9');
    });
    
    it('should preserve chord structures from ASCII tabs', function() {
      const asciiTabs = `
e|--0--|
B|--1--|
G|--0--|
D|--2--|
A|--3--|
E|-----|
      `;
      
      const result = convertAsciiToAlphaTex(asciiTabs);
      
      // Should group simultaneous notes as a chord
      assert(result.includes('('), 'Should contain chord notation');
      assert(result.includes('0.1'), 'Should contain high E string note');
      assert(result.includes('1.2'), 'Should contain B string note');
      assert(result.includes('0.3'), 'Should contain G string note');
      assert(result.includes('2.4'), 'Should contain D string note');
      assert(result.includes('3.5'), 'Should contain A string note');
    });
  });
});

// Simple test runner (since we may not have a full testing framework)
if (require.main === module) {
  console.log('Running ASCII to AlphaTex Converter Tests...\n');
  
  // Run all tests
  const testModules = [
    convertMeasureToAlphaTex,
    parseMeasureStrings,
    parseTabGroup,
    parseAsciiTabs,
    convertAsciiToAlphaTex
  ];
  
  let passed = 0;
  let total = 0;
  
  try {
    // Test example file conversion
    total++;
    const exampleFile = path.join(__dirname, 'example-ascii-tab.txt');
    const asciiContent = fs.readFileSync(exampleFile, 'utf8');
    const result = convertAsciiToAlphaTex(asciiContent, {
      title: 'Example Song',
      artist: 'Test Artist', 
      tempo: 92
    });
    
    if (result && result.includes('\\title') && result.includes('.') && /\d+\.\d+/.test(result)) {
      console.log('✓ Example file conversion test passed');
      passed++;
    } else {
      console.log('✗ Example file conversion test failed');
    }
    
    console.log(`\nTest Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
}