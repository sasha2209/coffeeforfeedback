#!/bin/bash

# CoffeeForFeedback - Quick Setup Script
# This script automates the local development setup

echo "🚀 CoffeeForFeedback - Quick Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env file with your actual credentials!"
    echo ""
    echo "You need to add:"
    echo "  1. DATABASE_URL (from Supabase)"
    echo "  2. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET"
    echo "  3. NEXTAUTH_SECRET (run: openssl rand -base64 32)"
    echo "  4. STRIPE keys (optional for development)"
    echo ""
    read -p "Press Enter when you've updated .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npx prisma generate
npx prisma db push

echo ""
read -p "Do you want to seed the database with demo data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run db:seed
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 You're ready to go!"
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Sign in with Google"
echo ""
echo "For deployment to Vercel, see DEPLOYMENT_GUIDE.md"
echo ""
