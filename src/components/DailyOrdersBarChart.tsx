import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { OrderRecord } from '../types/product';
import { formatNaira } from '../config/site';
import {
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  DollarSign,
  Package,
  RotateCcw,
} from 'lucide-react';

interface DailyOrdersBarChartProps {
  orders: OrderRecord[];
  onGenerateSampleData?: () => void;
  onClearSampleData?: () => void;
  hasSampleData?: boolean;
}

interface DayData {
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon 19"
  fullDate: string; // e.g. "Monday, Oct 19, 2026"
  orderCount: number;
  revenue: number;
  newCount: number;
  confirmedCount: number;
  deliveredCount: number;
  otherCount: number;
  isToday: boolean;
}

export const DailyOrdersBarChart: React.FC<DailyOrdersBarChartProps> = ({
  orders,
  onGenerateSampleData,
  onClearSampleData,
  hasSampleData = false,
}) => {
  const [metricMode, setMetricMode] = useState<'volume' | 'revenue'>('volume');
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);

  // Compute 7-day calendar array (Day 0 = Today, Day 6 = 6 days ago)
  const chartData = useMemo<DayData[]>(() => {
    const days: DayData[] = [];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];

      const dayLabel = d.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
      });
      const fullDate = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const isToday = i === 0;

      // Filter orders matching this calendar day
      const daysOrders = orders.filter((o) => {
        try {
          const ordDate = new Date(o.createdAt).toISOString().split('T')[0];
          return ordDate === dateKey;
        } catch {
          return false;
        }
      });

      const orderCount = daysOrders.length;
      const revenue = daysOrders.reduce((sum, ord) => sum + (ord.productTotal || 0), 0);
      const newCount = daysOrders.filter((o) => o.status === 'New').length;
      const confirmedCount = daysOrders.filter((o) => o.status === 'Confirmed' || o.status === 'Contacted').length;
      const deliveredCount = daysOrders.filter((o) => o.status === 'Delivered' || o.status === 'Dispatched').length;
      const otherCount = daysOrders.filter((o) => o.status === 'Cancelled').length;

      days.push({
        dateKey,
        dayLabel: isToday ? `${dayLabel} (Today)` : dayLabel,
        fullDate,
        orderCount,
        revenue,
        newCount,
        confirmedCount,
        deliveredCount,
        otherCount,
        isToday,
      });
    }

    return days;
  }, [orders]);

  // Aggregate stats
  const total7DayOrders = useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.orderCount, 0);
  }, [chartData]);

  const total7DayRevenue = useMemo(() => {
    return chartData.reduce((acc, d) => acc + d.revenue, 0);
  }, [chartData]);

  const peakDay = useMemo(() => {
    let max = chartData[0];
    for (const d of chartData) {
      if (d.orderCount > (max?.orderCount || 0)) {
        max = d;
      }
    }
    return max;
  }, [chartData]);

  const dailyAverage = useMemo(() => {
    return (total7DayOrders / 7).toFixed(1);
  }, [total7DayOrders]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayData = payload[0].payload;
      return (
        <div className="bg-[#1B1C1F] text-white p-3.5 rounded-xl border border-[#3A3C42] shadow-xl text-xs font-mono space-y-2 max-w-xs">
          <div className="flex items-center justify-between border-b border-[#2E3036] pb-2">
            <span className="font-bold text-white uppercase">{data.fullDate}</span>
            {data.isToday && (
              <span className="px-1.5 py-0.5 rounded bg-[#B51222] text-[10px] uppercase font-bold">
                Today
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
            <div className="text-[#A1A3A8]">Daily Orders:</div>
            <div className="font-bold text-right text-emerald-400">{data.orderCount} orders</div>

            <div className="text-[#A1A3A8]">Gross Value:</div>
            <div className="font-bold text-right text-white">{formatNaira(data.revenue)}</div>

            {data.orderCount > 0 && (
              <>
                <div className="text-[#A1A3A8]">New Pending:</div>
                <div className="text-right text-amber-400 font-semibold">{data.newCount}</div>

                <div className="text-[#A1A3A8]">Confirmed/Active:</div>
                <div className="text-right text-blue-400 font-semibold">{data.confirmedCount}</div>

                <div className="text-[#A1A3A8]">Dispatched/Delivered:</div>
                <div className="text-right text-emerald-400 font-semibold">{data.deliveredCount}</div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#D5D2CB] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E9E7E2] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#F6F4EF] border border-[#D5D2CB] text-[#B51222] font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Live Order Metrics
            </span>
            <span className="text-xs font-mono text-[#6E7075]">Last 7 Rolling Days</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
            Daily Order Volumes &amp; Revenue
          </h3>
        </div>

        {/* View Mode & Sample Data Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="inline-flex rounded-lg border border-[#D5D2CB] p-0.5 bg-[#F6F4EF] text-xs font-mono">
            <button
              type="button"
              onClick={() => setMetricMode('volume')}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                metricMode === 'volume'
                  ? 'bg-[#1B1C1F] text-white shadow-xs'
                  : 'text-[#6E7075] hover:text-[#1B1C1F]'
              }`}
            >
              Order Count
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('revenue')}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                metricMode === 'revenue'
                  ? 'bg-[#1B1C1F] text-white shadow-xs'
                  : 'text-[#6E7075] hover:text-[#1B1C1F]'
              }`}
            >
              Revenue (₦)
            </button>
          </div>

          {onGenerateSampleData && (
            <button
              type="button"
              onClick={hasSampleData && onClearSampleData ? onClearSampleData : onGenerateSampleData}
              className={`min-tap-target px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                hasSampleData
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'border-[#D5D2CB] bg-white text-[#2B2D31] hover:bg-[#F6F4EF]'
              }`}
              title={hasSampleData ? 'Revert to real orders' : 'Populate 7-day trend simulation for preview'}
            >
              {hasSampleData ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Revert to Live Orders</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#B51222]" />
                  <span>Preview 7-Day Trend</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 4 Summary Stat Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-[#6E7075] uppercase flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[#B51222]" />
            <span>7-Day Total Orders</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-[#1B1C1F]">
            {total7DayOrders}
            <span className="text-xs font-mono font-normal text-[#6E7075] ml-1.5">units</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-[#6E7075] uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            <span>7-Day Gross Value</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-emerald-800">
            {formatNaira(total7DayRevenue)}
          </div>
        </div>

        <div className="p-3.5 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-[#6E7075] uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
            <span>Peak Day Volume</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono text-[#1B1C1F] truncate">
            {peakDay && peakDay.orderCount > 0 ? (
              <span>
                {peakDay.dayLabel.replace(' (Today)', '')} ({peakDay.orderCount} ord)
              </span>
            ) : (
              <span className="text-[#6E7075] text-xs">No peak yet</span>
            )}
          </div>
        </div>

        <div className="p-3.5 bg-[#F6F4EF] border border-[#E9E7E2] rounded-xl space-y-1">
          <div className="text-[11px] font-mono text-[#6E7075] uppercase flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-700" />
            <span>Daily Average</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-display text-[#1B1C1F]">
            {dailyAverage}
            <span className="text-xs font-mono font-normal text-[#6E7075] ml-1">ord/day</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="w-full h-[280px] sm:h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
            onMouseMove={(state: any) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveBarIndex(state.activeTooltipIndex);
              } else {
                setActiveBarIndex(null);
              }
            }}
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E7E2" vertical={false} />
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: '#D5D2CB' }}
              tick={{ fill: '#6E7075', fontSize: 11, fontFamily: 'monospace' }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: '#6E7075', fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(val: number) => {
                if (metricMode === 'revenue') {
                  if (val >= 1000) return `₦${val / 1000}k`;
                  return `₦${val}`;
                }
                return String(val);
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(181, 18, 34, 0.05)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
            />
            <Bar
              name={metricMode === 'volume' ? 'Customer Orders' : 'Order Revenue (₦)'}
              dataKey={metricMode === 'volume' ? 'orderCount' : 'revenue'}
              radius={[6, 6, 0, 0]}
              maxBarSize={48}
            >
              {chartData.map((entry, index) => {
                let barFill = '#B51222'; // Brand red default for volume
                if (metricMode === 'revenue') {
                  barFill = '#059669'; // Emerald for revenue
                } else if (entry.isToday) {
                  barFill = '#1B1C1F'; // Dark slate for today's volume
                }

                // Hover highlight
                if (activeBarIndex === index) {
                  barFill = metricMode === 'revenue' ? '#047857' : '#8F0E1B';
                }

                return <Cell key={`cell-${index}`} fill={barFill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote / Context bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E9E7E2] text-xs font-mono text-[#6E7075]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B1C1F]"></span>
            <span>Today's Bar</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B51222]"></span>
            <span>Past 6 Days</span>
          </span>
        </div>
        <div>
          <span>Hover on bars to inspect status splits (New, Confirmed, Delivered).</span>
        </div>
      </div>
    </div>
  );
};
