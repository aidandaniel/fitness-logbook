import { useNavigate } from 'react-router-dom';
import { Calendar, Dumbbell, TrendingUp, CalendarClock } from 'lucide-react';

interface BottomNavProps {
  currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: Calendar, label: 'Calendar' },
    { path: '/templates', icon: Dumbbell, label: 'Workouts' },
    { path: '/history', icon: TrendingUp, label: 'History' },
    {
      path: '/progress',
      icon: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Progress',
    },
    { path: '/scheduler', icon: CalendarClock, label: 'Scheduler' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pb-4 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors min-h-[60px] ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
