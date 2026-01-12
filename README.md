# التيسير للعقارات | El Taiseer Real Estate

منصة عقارية متكاملة للبحث عن العقارات في دمياط الجديدة - شقق، فيلات، محلات تجارية، وأراضي.

## About

This is a [Next.js](https://nextjs.org) project for **El Taiseer Real Estate** (التيسير للعقارات), a comprehensive real estate platform for New Damietta, Egypt.

## Features

- 🏠 **Property Management**: Full CRUD operations with Firebase integration
- 🔐 **Admin Authentication**: Secure admin panel with Firestore security rules
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔍 **Advanced Search**: Filter properties by type, district, and features
- 💰 **Price Calculator**: Built-in installment calculator
- 🖼️ **Image Gallery**: Multiple property images support
- ⭐ **Favorites System**: Save and manage favorite properties

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build Commands

- `npm run dev` - Development server
- `npm run build` - Production build with SSR support
- `npm run build:static` - Static export for hosting
- `npm run start` - Production server

## Firebase Deployment

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
npm run build:static
firebase deploy --only hosting
```

## Live Site

🌐 **Website**: https://eltaiseer-properties.web.app

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **Language**: TypeScript
