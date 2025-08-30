#!/bin/bash

# Master Resume Update Script
# Updates all resume formats from single JSON source of truth

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Updating resume from JSON data...${NC}\n"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js.${NC}"
    exit 1
fi

# Check if required files exist
if [ ! -f "src/data/resume.json" ]; then
    echo -e "${RED}Error: Resume data not found at src/data/resume.json!${NC}"
    exit 1
fi

if [ ! -f "scripts/generate-latex.js" ]; then
    echo -e "${RED}Error: LaTeX generator script not found!${NC}"
    exit 1
fi

# Step 1: Generate LaTeX from JSON
echo -e "${BLUE}📝 Generating LaTeX from JSON data...${NC}"
if node scripts/generate-latex.js; then
    echo -e "${GREEN}✓ LaTeX generated successfully${NC}"
else
    echo -e "${RED}✗ Error generating LaTeX${NC}"
    exit 1
fi

# Step 2: Compile PDF
echo -e "\n${BLUE}📄 Compiling PDF...${NC}"

# Check if latexmk is available
if ! command -v latexmk &> /dev/null; then
    echo -e "${RED}Error: latexmk is not installed. Please install LaTeX with latexmk.${NC}"
    exit 1
fi

# Navigate to the resume directory
RESUME_DIR="src/resume"
if [ ! -d "$RESUME_DIR" ]; then
    echo -e "${RED}Error: Resume directory $RESUME_DIR not found!${NC}"
    exit 1
fi

cd "$RESUME_DIR"

echo -e "${BLUE}🧹 Cleaning previous build files...${NC}"
# Clean previous build artifacts
latexmk -c resume.tex 2>/dev/null || true

echo -e "${BLUE}⚙️ Compiling resume.tex with XeLaTeX...${NC}"
# Compile the resume with XeLaTeX
if latexmk -xelatex -interaction=nonstopmode resume.tex > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Resume compiled successfully!${NC}"
else
    echo -e "${RED}✗ Error compiling resume. Running with verbose output...${NC}"
    latexmk -xelatex -interaction=nonstopmode resume.tex
    exit 1
fi

# Check if PDF was generated
if [ ! -f "resume.pdf" ]; then
    echo -e "${RED}✗ Error: resume.pdf was not generated!${NC}"
    exit 1
fi

# Go back to project root
cd ../..

# Step 3: Copy PDF to public folder
echo -e "\n${BLUE}📂 Copying PDF to public folder...${NC}"
# Ensure public/resume directory exists
mkdir -p public/resume

# Copy the PDF to public folder with proper name
cp src/resume/resume.pdf public/resume/Bryant_Hayes_Resume.pdf

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Resume copied to public/resume/Bryant_Hayes_Resume.pdf${NC}"
else
    echo -e "${RED}✗ Error copying resume to public folder!${NC}"
    exit 1
fi

# Step 4: Clean up build artifacts
echo -e "\n${BLUE}🧹 Cleaning up build files...${NC}"
cd src/resume
latexmk -c resume.tex 2>/dev/null || true
cd ../..

# Step 5: Show summary
echo -e "\n${GREEN}🎉 Resume update complete!${NC}"
echo -e "${BLUE}Updated files:${NC}"
echo -e "  • ${YELLOW}src/resume/resume.tex${NC} (generated from JSON)"
echo -e "  • ${YELLOW}public/resume/Bryant_Hayes_Resume.pdf${NC} (ready for download)"
echo -e "\n${BLUE}💡 The website will automatically use the updated JSON data.${NC}"
echo -e "${BLUE}📄 Your resume is now available at: public/resume/Bryant_Hayes_Resume.pdf${NC}"

# Optional: Show file stats
if [ -f "public/resume/Bryant_Hayes_Resume.pdf" ]; then
    FILE_SIZE=$(ls -lh public/resume/Bryant_Hayes_Resume.pdf | awk '{print $5}')
    echo -e "${BLUE}📊 PDF size: ${FILE_SIZE}${NC}"
fi