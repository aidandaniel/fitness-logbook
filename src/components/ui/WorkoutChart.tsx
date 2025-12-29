import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface WorkoutChartProps {
  logs: Array<{ date: string }>;
  days?: number; // Number of days to show (default: 30)
}

export function WorkoutChart({ logs, days = 30 }: WorkoutChartProps) {
  const chartData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    // Get each day in the range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Count workouts per day
    const workoutsPerDay = dateRange.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const count = logs.filter(log => log.date === dateStr).length;
      return {
        date,
        dateStr,
        count,
        isToday: dateStr === endDate.toISOString().split('T')[0],
      };
    });

    // Group by week for weekly stats
    const weeklyData = [];
    for (let i = 0; i < Math.ceil(days / 7); i++) {
      const weekStart = subDays(endDate, (i + 1) * 7);
      const weekEnd = subDays(endDate, i * 7);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      const weekCount = weekDays.reduce((sum, day) => {
        const dateStr = day.toISOString().split('T')[0];
        return sum + logs.filter(log => log.date === dateStr).length;
      }, 0);
      weeklyData.unshift({ weekIndex: i, count: weekCount });
    }

    // Calculate stats
    const totalWorkouts = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    }).length;

    const avgPerWeek = weeklyData.length > 0
      ? (weeklyData.reduce((sum, w) => sum + w.count, 0) / weeklyData.length).toFixed(1)
      : 0;

    const maxDayCount = Math.max(...workoutsPerDay.map(d => d.count), 1);

    return {
      workoutsPerDay,
      weeklyData,
      totalWorkouts,
      avgPerWeek,
      maxDayCount,
      startDate,
      endDate,
    };
  }, [logs, days]);

  const { workoutsPerDay, weeklyData, totalWorkouts, avgPerWeek, maxDayCount, startDate, endDate } = chartData;

  const chartHeight = 120;
  const barWidth = Math.max(2, Math.floor(280 / days));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workout Activity</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last {days} days
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalWorkouts}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgPerWeek}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg Per Week</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {weeklyData.filter(w => w.count >= 3).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">3+ Workout Weeks</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-1">
          <span>{maxDayCount}</span>
          <span>{Math.floor(maxDayCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <svg
          viewBox={`0 0 ${days * barWidth} ${chartHeight}`}
          className="w-full h-auto ml-6"
          style={{ maxHeight: '200px' }}
        >
          {/* Grid lines */}
          <line
            x1="0"
            y1={chartHeight - 20}
            x2={days * barWidth}
            y2={chartHeight - 20}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
          <line
            x1="0"
            y1={chartHeight / 2}
            x2={days * barWidth}
            y2={chartHeight / 2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4"
            className="text-gray-100 dark:text-gray-800"
          />

          {/* Bars */}
          {workoutsPerDay.map((day, index) => {
            const barHeightPx = Math.max((day.count / maxDayCount) * (chartHeight - 30), 2);
            const x = index * barWidth;
            const y = chartHeight - 20 - barHeightPx;

            return (
              <g key={day.dateStr}>
                <rect
                  x={x + 1}
                  y={y}
                  width={barWidth - 2}
                  height={barHeightPx}
                  rx="2"
                  className={
                    day.count > 0
                      ? day.isToday
                        ? 'fill-blue-500'
                        : 'fill-blue-400 dark:fill-blue-500'
                      : 'fill-gray-100 dark:fill-gray-800'
                  }
                />
                {day.count > 1 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 2}
                    textAnchor="middle"
                    className="text-[8px] fill-gray-600 dark:fill-gray-400"
                  >
                    {day.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between ml-6 mt-1 text-xs text-gray-400">
          <span>{format(startDate, 'MMM d')}</span>
          <span>{format(endDate, 'MMM d')}</span>
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Weekly Breakdown</div>
        <div className="flex gap-1 h-2">
          {weeklyData.map((week, index) => {
            const maxWeekCount = Math.max(...weeklyData.map(w => w.count), 1);
            const widthPercent = (week.count / maxWeekCount) * 100;
            return (
              <div
                key={index}
                className="flex-1 rounded-full bg-blue-400 dark:bg-blue-500"
                style={{ width: `${Math.max(widthPercent, 5)}%` }}
                title={`Week ${index + 1}: ${week.count} workouts`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Week 1</span>
          <span>Week {weeklyData.length}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>Workout day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700" />
          <span>Rest day</span>
        </div>
      </div>
    </div>
  );
}
