# Spoona v2 - Smart Recipe & Meal Planning

A modern Next.js application for recipe management and meal planning with Instacart integration.

## Features

- 🍳 **Recipe Management** - Create, organize, and discover recipes
- 📅 **Meal Planning** - Weekly meal planning with drag-and-drop
- 🛒 **Smart Shopping** - Generate shopping lists with Instacart integration
- 🔐 **Authentication** - Secure user accounts with NextAuth.js
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Prisma ORM
- **Authentication:** NextAuth.js v5
- **Deployment:** Vercel
- **Integrations:** Instacart API

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm 10+

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-mongodb-connection-string
INSTACART_API_KEY=your-instacart-api-key
```

## Deployment

This app is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions
```

## License

MIT