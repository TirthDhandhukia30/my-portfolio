import { useMemo } from 'react';
import { format, startOfWeek, addDays, getMonth } from 'date-fns';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  data: ContributionDay[];
  blockSize?: number;
  blockMargin?: number;
  blockRadius?: number;
}

// Month labels
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Day labels (Sunday = 0)
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Level colors using CSS custom properties with opacity
const LEVEL_COLORS = {
  0: 'var(--contribution-level-0)',
  1: 'var(--contribution-level-1)',
  2: 'var(--contribution-level-2)',
  3: 'var(--contribution-level-3)',
  4: 'var(--contribution-level-4)',
};

export function ContributionGraph({
  data,
  blockSize = 11,
  blockMargin = 3,
  blockRadius = 2,
}: ContributionGraphProps) {
  // Organize data into weeks
  const { weeks, monthLabels } = useMemo(() => {
    if (!data || data.length === 0) {
      return { weeks: [], monthLabels: [] };
    }

    // Create a map of date -> contribution
    const contributionMap = new Map<string, ContributionDay>();
    data.forEach((day) => {
      contributionMap.set(day.date, day);
    });

    // Sort dates and get the range
    const sortedDates = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const startDate = new Date(sortedDates[0].date);
    const endDate = new Date(sortedDates[sortedDates.length - 1].date);

    // Get the start of the first week (Sunday)
    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    // Build weeks array
    const weeksArr: ContributionDay[][] = [];
    const monthLabelsArr: { label: string; weekIndex: number }[] = [];

    let currentDate = weekStart;
    let currentWeek: ContributionDay[] = [];
    let lastMonth = -1;

    while (currentDate <= endDate || currentWeek.length > 0) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = currentDate.getDay();
      const month = getMonth(currentDate);

      // Track month labels (on first day of each week for new months)
      if (dayOfWeek === 0 && month !== lastMonth && currentDate <= endDate) {
        monthLabelsArr.push({
          label: MONTHS[month],
          weekIndex: weeksArr.length,
        });
        lastMonth = month;
      }

      // Get contribution data or default to level 0
      const contribution = contributionMap.get(dateStr);
      currentWeek.push(
        contribution || {
          date: dateStr,
          count: 0,
          level: 0,
        }
      );

      // Move to next day
      currentDate = addDays(currentDate, 1);

      // If we completed a week (Saturday), push it
      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = [];

        // Stop if we've passed the end date
        if (currentDate > endDate) break;
      }
    }

    // Don't forget the last partial week
    if (currentWeek.length > 0) {
      weeksArr.push(currentWeek);
    }

    return { weeks: weeksArr, monthLabels: monthLabelsArr };
  }, [data]);

  const cellSize = blockSize + blockMargin;
  const graphWidth = weeks.length * cellSize;
  const graphHeight = 7 * cellSize;
  const labelOffset = 30; // Space for day labels
  const monthLabelHeight = 15; // Space for month labels

  if (weeks.length === 0) {
    return null;
  }

  return (
    <div className="contribution-graph-wrapper">
      <svg
        width={graphWidth + labelOffset}
        height={graphHeight + monthLabelHeight}
        className="contribution-graph-svg"
      >
        {/* Month labels */}
        <g className="month-labels">
          {monthLabels.map(({ label, weekIndex }, index) => (
            <text
              key={`${label}-${index}`}
              x={labelOffset + weekIndex * cellSize + cellSize / 2}
              y={10}
              className="contribution-month-label"
            >
              {label}
            </text>
          ))}
        </g>

        {/* Day labels (show Mon, Wed, Fri) */}
        <g className="day-labels">
          {[1, 3, 5].map((dayIndex) => (
            <text
              key={dayIndex}
              x={labelOffset - 6}
              y={monthLabelHeight + dayIndex * cellSize + cellSize / 2 + 4}
              className="contribution-day-label"
            >
              {DAY_LABELS[dayIndex].substring(0, 3)}
            </text>
          ))}
        </g>

        {/* Contribution blocks */}
        <g className="contribution-blocks" transform={`translate(${labelOffset}, ${monthLabelHeight})`}>
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const x = weekIndex * cellSize;
              const y = dayIndex * cellSize;
              const tooltipText =
                day.count === 0
                  ? 'No contributions'
                  : `${day.count} contribution${day.count !== 1 ? 's' : ''}`;

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={blockSize}
                  height={blockSize}
                  rx={blockRadius}
                  ry={blockRadius}
                  fill={LEVEL_COLORS[day.level]}
                  className="contribution-block"
                  data-tooltip={tooltipText}
                  data-date={day.date}
                  data-count={day.count}
                  data-level={day.level}
                />
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
}
