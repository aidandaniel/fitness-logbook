import { useNavigate } from 'react-router-dom';
import { Calendar, Dumbbell, TrendingUp, Settings, Target, CalendarClock } from 'lucide-react';
import { useUser } from '@insforge/react';
import { useLogs } from '../../hooks/useLogs';

interface SidebarNavProps {
  currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  const navigate = useNavigate();
  const { user } = useUser();
  const { logs } = useLogs(user?.id);

  const navItems = [
    { path: '/dashboard', icon: Calendar, label: 'Calendar' },
    { path: '/templates', icon: Dumbbell, label: 'Workouts' },
    { path: '/history', icon: TrendingUp, label: 'History' },
    { path: '/progress', icon: TrendingUp, label: 'Progress' },
    { path: '/scheduler', icon: CalendarClock, label: 'Scheduler' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Calculate this month's workouts toward 15-day goal
  const calculateMonthlyProgress = (): { current: number; goal: number; percentage: number } => {
    const today = new Date();
    const monthlyGoal = 15;

    const thisMonthCount = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === today.getMonth() &&
             logDate.getFullYear() === today.getFullYear();
    }).length;

    const percentage = Math.min((thisMonthCount / monthlyGoal) * 100, 100);

    return { current: thisMonthCount, goal: monthlyGoal, percentage };
  };

  // Calculate this week's workouts
  const calculateThisWeek = (): number => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekAgo;
    }).length;
  };

  const { current: monthlyCount, goal: monthlyGoal, percentage: monthlyPercentage } = calculateMonthlyProgress();
  const thisWeek = calculateThisWeek();

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    const remaining = monthlyGoal - monthlyCount;
    if (monthlyCount >= monthlyGoal) return "Goal reached! 🔥";
    if (remaining === 1) return "One more workout!";
    if (remaining <= 3) return "Almost there!";
    if (remaining <= 7) return "Keep pushing!";
    if (monthlyCount >= 5) return "Great start!";
    if (monthlyCount >= 2) return "Building momentum!";
    return "Start today!";
  };

  return (
    <aside className="hidden md:flex md:flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span>Fitness Logbook</span>
        </h1>
      </div>

      {/* Monthly Goal Panel */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        {/* Monthly Goal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${monthlyCount >= monthlyGoal ? 'bg-green-500' : 'bg-blue-500'}`}>
                <Target className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Monthly Goal</p>
                <p className={`text-lg font-bold ${monthlyCount >= monthlyGoal ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {monthlyCount} / {monthlyGoal}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{thisWeek}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${monthlyCount >= monthlyGoal ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
              style={{ width: `${monthlyPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {getMotivationalMessage()}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {user?.email?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {monthlyCount >= monthlyGoal ? 'Goal Crusher!' : monthlyCount >= 10 ? 'On Fire!' : monthlyCount >= 5 ? 'Rising Star' : 'Getting Started'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
