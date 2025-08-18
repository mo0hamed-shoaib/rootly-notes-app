# Rootly - Learning Tracker

A focused, elegant app to track your learning journey with question-based notes, progress meters, and gentle, gamified nudges.

## Features

✨ **Question-First Learning**: All notes are phrased as questions to promote active learning  
📊 **Progress Tracking**: Visual progress meters, topic mix charts, and study streaks  
🎯 **Smart Review Mode**: Pseudorandom sampling that prioritizes focus items and low understanding  
🏷️ **Flexible Organization**: Filter by topics, courses, status, and custom flags  
📈 **Mini Dashboard**: See your learning stats at a glance  
🎨 **Beautiful UI**: Built with Tailwind v4, shadcn/ui, and smooth animations

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Charts**: Recharts for mini-dashboard widgets
- **Animation**: Motion (Framer Motion successor)
- **Forms**: React Hook Form + Zod validation
- **Database**: MongoDB Atlas + Mongoose ODM
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- MongoDB Atlas account (free tier available)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd rootly
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rootly-notes?retryWrites=true&w=majority
   ```

3. **Start both frontend and backend:**
   ```bash
   npm run start:full
   ```
   
   Or run them separately:
   ```bash
   # Terminal 1 - Frontend (Vite)
   npm run dev
   
   # Terminal 2 - Backend (Express)
   npm run server:dev
   ```

4. **Open your browser:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001/api/health`

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/rootly)

### Manual Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variable: `MONGODB_URI`

3. **Deploy:**
   Vercel will automatically build and deploy your app

## Project Structure

```
src/
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── charts/            # Recharts widgets
│   ├── notes/             # Note-related components
│   ├── dashboard/         # Mini dashboard
│   └── navigation/        # Navigation bar
├── features/              # Feature-specific logic
├── hooks/                 # Custom React hooks
├── lib/
│   ├── zod/              # Validation schemas
│   ├── models/           # Mongoose schemas
│   └── mongodb.ts        # Database connection
├── pages/                # Main page components
├── types.ts              # TypeScript definitions
└── styles/
    └── index.css         # Custom CSS + Tailwind
```

## Key Components

### Core Types

- **Course**: Learning material with instructor, links, and topics
- **Note**: Question-based learning item with understanding level and flags
- **DailyEntry**: Study session logs with time, summary, and mood
- **Topic**: Predefined categories (hooks, reconciliation, rendering, etc.)

### UI Features

- **NoteCard**: Displays question with star rating and topic badges
- **NewNoteDialog**: Form for creating questions with validation
- **MiniDashboard**: Study stats, progress ring, topic mix chart
- **Review Mode**: Spaced repetition with understanding updates
- **Filtering**: Search, topic chips, course selection, status toggles

### Data Flow

1. **State Management**: React hooks with prop drilling (simple and clear)
2. **Validation**: Zod schemas for runtime type safety
3. **Database**: Mongoose models with MongoDB Atlas
4. **Persistence**: MongoDB with proper indexes for performance

## Configuration

### Tailwind v4 Theme

The app uses CSS-first theming with custom design tokens:

```css
@theme {
  --color-root-500: #2d5d4f;  /* Primary brand color */
  --color-root-100: #e8f3ef;  /* Light brand tint */
  /* ... more tokens */
}
```

### Validation Schemas

All forms use Zod schemas for type-safe validation:

- `courseSchema`: Course creation/editing
- `noteSchema`: Note creation/editing  
- `dailySchema`: Daily entry logging

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **Components**: Add to appropriate folder in `src/components/`
2. **Pages**: Add to `src/pages/` and update routing in `App.tsx`
3. **Types**: Extend interfaces in `src/types.ts`
4. **Validation**: Create Zod schemas in `src/lib/zod/`
5. **Database**: Add Mongoose models in `src/lib/models/`

## Performance

- **Code Splitting**: Components lazy-loaded with `React.lazy`
- **Animations**: 60fps animations with Motion
- **Database**: Proper indexes on user queries
- **Bundle Size**: Tree-shaking with Vite

## Accessibility

- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG 2.2 AA compliant
- **Focus Management**: Visible focus indicators

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- Styled with [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)
- Animations by [Motion](https://motion.dev/)
- Icons by [Lucide](https://lucide.dev/)