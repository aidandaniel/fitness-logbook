import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@insforge/react';
import { AuthGuard } from './components/auth/AuthGuard';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { Dashboard } from './pages/Dashboard';
import { Templates } from './pages/Templates';
import { WorkoutDetail } from './pages/WorkoutDetail';
import { LogWorkout } from './pages/LogWorkout';
import { History } from './pages/History';
import { Progress } from './pages/Progress';
import { Scheduler } from './pages/Scheduler';
import { Settings } from './pages/Settings';

// Handle OAuth redirects that might land on the wrong path
function OAuthRedirectHandler() {
  const location = useLocation();
  
  useEffect(() => {
    // If we're on the root path with OAuth params, redirect to the correct base path
    if (location.pathname === '/' && (location.search.includes('access_token') || location.search.includes('code'))) {
      const basePath = '/fitness-logbook';
      const newPath = basePath + location.pathname + location.search;
      window.history.replaceState({}, '', newPath);
      // Reload to trigger the auth flow
      window.location.reload();
    }
  }, [location]);
  
  return null;
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fitness Logbook</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Track your workouts, monitor progress, and achieve your fitness goals.</p>

        <SignedOut>
          <div className="space-y-3">
            <SignInButton>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[48px]">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[48px]">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <Navigate to="/dashboard" replace />
        </SignedIn>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/fitness-logbook">
      <OAuthRedirectHandler />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DesktopLayout><Dashboard /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/templates"
          element={
            <AuthGuard>
              <DesktopLayout><Templates /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/templates/:templateId"
          element={
            <AuthGuard>
              <DesktopLayout><WorkoutDetail /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/log/:templateId"
          element={
            <AuthGuard>
              <DesktopLayout><LogWorkout /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/history"
          element={
            <AuthGuard>
              <DesktopLayout><History /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/progress"
          element={
            <AuthGuard>
              <DesktopLayout><Progress /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/scheduler"
          element={
            <AuthGuard>
              <DesktopLayout><Scheduler /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/settings"
          element={
            <AuthGuard>
              <DesktopLayout><Settings /></DesktopLayout>
            </AuthGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
