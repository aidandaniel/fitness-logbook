# Fitness Logbook

A comprehensive fitness tracking application built with React, TypeScript, and InsForge. Track your workouts, monitor progress, set goals, and achieve your fitness objectives.

## Features

- 📅 **Workout Calendar** - Visual calendar with workout tracking
- 💪 **Workout Templates** - Create and manage custom workout routines
- 📊 **Progress Tracking** - Monitor your fitness journey with charts and stats
- 📸 **Progress Photos** - Track visual progress over time
- 🎯 **Fitness Goals** - Set and track your fitness goals
- 🏆 **Personal Records** - Keep track of your personal bests
- 📅 **Workout Scheduler** - Plan your weekly workout routine
- ⚙️ **Settings** - Customize weight units and preferences

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **InsForge** - Backend (Database, Auth, Storage)
- **React Router** - Navigation
- **date-fns** - Date utilities

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- InsForge backend (see [BACKEND_SETUP.md](./BACKEND_SETUP.md))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/fitness-logbook.git
cd fitness-logbook
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_INSFORGE_BASE_URL=https://your-backend.insforge.app
VITE_INSFORGE_ANON_KEY=your-anon-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment to GitHub Pages

This app is configured to deploy to GitHub Pages securely without exposing API keys.

### Quick Setup

1. **Set up GitHub Secrets** (see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions):
   - Go to your repository Settings → Secrets and variables → Actions
   - Add `VITE_INSFORGE_BASE_URL` with your backend URL
   - Add `VITE_INSFORGE_ANON_KEY` with your anonymous key

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

3. **Push to main branch**:
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically build and deploy your app.

### Important Security Notes

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use GitHub Secrets for sensitive data
- ✅ API keys are only injected during build time, not in the repository

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Project Structure

```
fitness-logbook/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   └── contexts/       # React contexts
├── .github/
│   └── workflows/      # GitHub Actions workflows
├── public/             # Static assets
└── dist/               # Build output (not committed)
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Backend Setup

This app requires an InsForge backend. See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for complete backend setup instructions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
