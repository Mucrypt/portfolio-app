#!/bin/bash

# Make all scripts executable
# Usage: ./scripts/make-scripts-executable.sh

echo "🔧 Making all scripts executable..."

chmod +x scripts/*.sh

echo "✅ Done! All scripts in scripts/ are now executable"
echo ""
echo "Available scripts:"
ls -1 scripts/*.sh | sed 's/^/  - /'
