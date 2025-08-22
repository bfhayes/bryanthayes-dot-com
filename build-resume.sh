#!/bin/bash

# Build Resume Script
# Compiles resume.tex to PDF and copies it to public folder

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building resume...${NC}"

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

if [ ! -f "$RESUME_DIR/resume.tex" ]; then
    echo -e "${RED}Error: resume.tex not found in $RESUME_DIR!${NC}"
    exit 1
fi

cd "$RESUME_DIR"

echo -e "${BLUE}Cleaning previous build files...${NC}"
# Clean previous build artifacts
latexmk -c resume.tex 2>/dev/null || true

echo -e "${BLUE}Compiling resume.tex with XeLaTeX...${NC}"
# Compile the resume with XeLaTeX
if latexmk -xelatex -interaction=nonstopmode resume.tex; then
    echo -e "${GREEN}✓ Resume compiled successfully!${NC}"
else
    echo -e "${RED}✗ Error compiling resume. Check the LaTeX output above.${NC}"
    exit 1
fi

# Check if PDF was generated
if [ ! -f "resume.pdf" ]; then
    echo -e "${RED}✗ Error: resume.pdf was not generated!${NC}"
    exit 1
fi

# Go back to project root
cd ../..

# Ensure public/resume directory exists
mkdir -p public/resume

# Copy the PDF to public folder with proper name
echo -e "${BLUE}Copying PDF to public folder...${NC}"
cp src/resume/resume.pdf public/resume/Bryant_Hayes_Resume.pdf

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Resume copied to public/resume/Bryant_Hayes_Resume.pdf${NC}"
else
    echo -e "${RED}✗ Error copying resume to public folder!${NC}"
    exit 1
fi

# Clean up build artifacts
echo -e "${BLUE}Cleaning up build files...${NC}"
cd src/resume
latexmk -c resume.tex 2>/dev/null || true
cd ../..

echo -e "${GREEN}✓ Resume build complete!${NC}"
echo -e "${BLUE}Your resume is now available at: public/resume/Bryant_Hayes_Resume.pdf${NC}"