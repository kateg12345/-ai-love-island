#!/bin/bash

echo "🚀 Deploying Love Island Prototype to GitHub Pages..."

# Build the project
echo "📦 Building Next.js project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create .nojekyll file to allow files starting with underscore
touch out/.nojekyll

echo "✅ Build complete!"
echo "📁 Output directory: out/"
echo ""
echo "📋 Next steps:"
echo "1. Create a new GitHub repository: love-island-prototype"
echo "2. Initialize git:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit: Love Island prototype'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/kateg12345/love-island-prototype.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to GitHub Pages:"
echo "   git subtree push --prefix out origin gh-pages"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://kateg12345.github.io/love-island-prototype/"
