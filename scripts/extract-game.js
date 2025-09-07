#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function extractGame(zipFilename, gameSlug) {
  try {
    log('blue', `🎮 Extracting HTML5 game: ${zipFilename}`);
    
    // Paths
    const zipPath = path.join(__dirname, '../public/games', zipFilename);
    const extractDir = path.join(__dirname, '../public/games/extracted');
    const gameDir = path.join(extractDir, gameSlug);
    
    // Validate input
    if (!fs.existsSync(zipPath)) {
      log('red', `❌ Error: ZIP file not found at ${zipPath}`);
      process.exit(1);
    }
    
    // Create extraction directories
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
      log('blue', `📁 Created extraction directory: ${extractDir}`);
    }
    
    // Remove existing game directory if it exists
    if (fs.existsSync(gameDir)) {
      log('yellow', `🗑️ Removing existing game directory: ${gameDir}`);
      fs.rmSync(gameDir, { recursive: true, force: true });
    }
    
    // Create fresh game directory
    fs.mkdirSync(gameDir, { recursive: true });
    
    // Extract ZIP file
    log('blue', '📦 Extracting ZIP file...');
    try {
      execSync(`cd "${gameDir}" && unzip -q "${zipPath}"`, { stdio: 'inherit' });
    } catch (error) {
      log('red', '❌ Error extracting ZIP file. Make sure unzip is installed.');
      log('red', `Command: cd "${gameDir}" && unzip -q "${zipPath}"`);
      process.exit(1);
    }
    
    // Find index.html
    const findIndexHtml = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && file.toLowerCase() === 'index.html') {
          return fullPath;
        } else if (stat.isDirectory()) {
          const found = findIndexHtml(fullPath);
          if (found) return found;
        }
      }
      return null;
    };
    
    const indexPath = findIndexHtml(gameDir);
    
    if (!indexPath) {
      log('red', '❌ Error: No index.html found in the extracted game');
      process.exit(1);
    }
    
    // If index.html is in a subdirectory, move everything up
    const relativePath = path.relative(gameDir, indexPath);
    if (relativePath !== 'index.html') {
      const subDir = path.dirname(indexPath);
      log('blue', `📁 Moving game files from subdirectory to root...`);
      
      // Move all files from subdirectory to root
      const files = fs.readdirSync(subDir);
      for (const file of files) {
        const srcPath = path.join(subDir, file);
        const destPath = path.join(gameDir, file);
        fs.renameSync(srcPath, destPath);
      }
      
      // Remove empty subdirectory
      fs.rmSync(subDir, { recursive: true, force: true });
    }
    
    // Verify final structure
    const finalIndexPath = path.join(gameDir, 'index.html');
    if (!fs.existsSync(finalIndexPath)) {
      log('red', '❌ Error: index.html not found at root level after extraction');
      process.exit(1);
    }
    
    // Create .gitkeep for version control
    fs.writeFileSync(path.join(gameDir, '.gitkeep'), '');
    
    // Get game info
    const stats = fs.statSync(zipPath);
    const fileSize = (stats.size / (1024 * 1024)).toFixed(2);
    
    log('green', '✅ Game extraction completed successfully!');
    log('blue', `📊 Game Info:`);
    log('blue', `   • Slug: ${gameSlug}`);
    log('blue', `   • ZIP Size: ${fileSize} MB`);
    log('blue', `   • Extracted to: /games/extracted/${gameSlug}/`);
    log('blue', `   • Game URL: /games/extracted/${gameSlug}/`);
    
    // Show next steps
    log('yellow', '\n🎯 Next Steps:');
    log('yellow', `1. Test the game at: http://localhost:4321/games/extracted/${gameSlug}/`);
    log('yellow', `2. Create content file: src/content/games/${gameSlug}.md`);
    log('yellow', `3. Add screenshots to: public/images/projects/`);
    
    return {
      slug: gameSlug,
      extractedPath: `/games/extracted/${gameSlug}/`,
      fileSize: `${fileSize} MB`
    };
    
  } catch (error) {
    log('red', `❌ Error extracting game: ${error.message}`);
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    log('yellow', '🎮 HTML5 Game Extractor');
    log('blue', 'Usage: node extract-game.js <zip-filename> [game-slug]');
    log('blue', 'Example: node extract-game.js mustachemax_html_v1.2.zip mustache-max');
    log('blue', '');
    log('blue', 'If game-slug is not provided, it will be derived from the filename.');
    process.exit(1);
  }
  
  const zipFilename = args[0];
  let gameSlug = args[1];
  
  // Auto-generate slug if not provided
  if (!gameSlug) {
    gameSlug = path.basename(zipFilename, path.extname(zipFilename))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  extractGame(zipFilename, gameSlug);
}

module.exports = { extractGame };