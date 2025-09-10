# Fusion Starter - Personal Finance Manager

## Overview
This is a full-stack TypeScript application featuring a React frontend with Vite and an Express backend. The app provides comprehensive personal finance management tools including budget planning, expense tracking, savings goals, stock exploration, and financial tips.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js with TypeScript  
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Build System**: Vite with separate client/server builds

## Recent Changes (2025-09-09)
- Successfully imported fresh GitHub clone and configured for Replit environment
- Installed all project dependencies with npm
- Updated Vite configuration to use allowedHosts: true for proper Replit proxy support
- Configured development server to run on host 0.0.0.0 and port 5000
- Set up development workflow running on port 5000 with integrated Express backend
- Configured deployment for production using autoscale target with proper build/run commands
- Verified application loads correctly with all routes and components working
- Removed unused pages (Stocks, Tips, Savings) and restructured navigation
- Combined expenses and savings into unified tracking system with analytics
- Created comprehensive Financial Education center with taxes, loans, inflation guides
- Built Career Connect platform for job seekers and students
- Enhanced news section with professional NewsAPI integration for US economics news
- Added authentication prompts throughout application
- Implemented budget simulator with personalized financial tips

## Development Setup
- Development server runs on port 5000 via `npm run dev`
- Frontend and backend are integrated in development mode
- API endpoints available at `/api/*` routes
- Static assets served from `dist/spa` in production

## Key Features
- Budget Planning with simulation and personalized tips
- Combined Expense Tracking & Savings Goals with analytics and charts
- Financial Education Center (taxes, loans, inflation, budgeting)
- Career Connect platform for job seekers and students
- Professional US Economics News with filtering and real-time updates
- Economic Policy Explainer covering major US policies
- User authentication with JWT tokens
- Responsive design with dark/light mode support

## User Preferences
- None specified yet

## Deployment
- Build command: `npm run build`
- Start command: `npm start`
- Deployment target: autoscale (suitable for stateless web applications)