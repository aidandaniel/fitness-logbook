import { useNavigate } from 'react-router-dom';
import { Calendar, Dumbbell, TrendingUp, CalendarClock, Camera } from 'lucide-react';
import { useModal } from '../../contexts/ModalContext';

interface BottomNavProps {
  currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
  const navigate = useNavigate();
  const { isModalOpen } = useModal();

  const navItems = [
    { path: '/dashboard', icon: Calendar, label: 'Calendar' },
    { path: '/templates', icon: Dumbbell, label: 'Workouts' },
    { path: '/history', icon: TrendingUp, label: 'History' },
    { path: '/progress', icon: Camera, label: 'Progress' },
    { path: '/scheduler', icon: CalendarClock, label: 'Scheduler' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe pb-4 z-50 md:hidden transition-transform duration-300 ${
      isModalOpen ? 'translate-y-full' : 'translate-y-0'
    }`}>
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 transition-colors min-h-[60px] touch-manipulation ${
                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-label={item.label}
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
