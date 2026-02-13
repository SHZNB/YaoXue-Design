#!/bin/bash

# Lab Experiment Platform - One-Click Start Script
# Usage: ./start-lab.sh

set -e # Exit immediately if a command exits with a non-zero status

echo "🧪 Initializing Lab Experiment Platform..."

# --- Prerequisites Check ---
echo "🔍 Checking prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected."

# --- Environment Setup ---
echo "⚙️  Configuring environment..."
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
    echo "📝 .env created. Please update it with your Supabase credentials if needed."
else
    echo "✅ .env file found."
fi

# --- Dependencies ---
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed."
fi

# --- Development Server ---
echo "🚀 Starting development server..."
echo "👉 Application will be available at http://localhost:5173 (or next available port)"
echo "💡 Press Ctrl+C to stop."

# Run in dev mode (hot reloading)
npm run dev
