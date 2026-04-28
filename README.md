# Invite Genie - Magical Event Management

A high-performance event management platform built with React, Vite, and AI integration.
**Primary Contact:** invitegenie.app@gmail.com

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`.
   - Populate the variables with your Supabase, Firebase, and Gemini API credentials.

2. **Configure Environment**
   Create a `.env.local` file in the root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📦 Infrastructure & Deployment

### Database & Auth (Supabase)
- Project managed via `invitegenie.app@gmail.com`.
- Uses Supabase for real-time data and authentication.

### Firebase Hosting
1. **Build the project**
   ```bash
   npm run build
   ```
2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

**Deployment Target:** Firebase Hosting (Project ID: `invitegenie-app`)