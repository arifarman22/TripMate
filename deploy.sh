#!/bin/bash

echo "🚀 TripMate Production Deployment Setup"

# Backend deployment preparation
echo "📦 Preparing backend for deployment..."
cd backend
npm run prisma:generate
npm run build 2>/dev/null || echo "No build script found"

# Frontend deployment preparation  
echo "🎨 Preparing frontend for deployment..."
cd ../frontend
npm run build

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database (Supabase/Neon/Railway)"
echo "2. Configure environment variables in Vercel"
echo "3. Deploy using: vercel --prod"