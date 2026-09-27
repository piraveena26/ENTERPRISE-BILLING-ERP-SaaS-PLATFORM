import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatCurrency } from '../../utils/formatters';

export const RevenueChart: React.FC = () => {
  const { activeCurrency } = useERP();
  const [timeframe, setTimeframe] = useState<'6M' | '1Y'>('6M');

  // Realistic Monthly financial datasets (Revenue, Expense, Profit)
  const data6M = [
    { month: 'Apr', rev: 14200000, exp: 9800000, profit: 4400000 },
    { month: 'May', rev: 16800000, exp: 10400000, profit: 6400000 },
    { month: 'Jun', rev: 15400000, exp: 10100000, profit: 5300000 },
    { month: 'Jul', rev: 19200000, exp: 11800000, profit: 7400000 },
    { month: 'Aug', rev: 22400000, exp: 12600000, profit: 9800000 },
    { month: 'Sep', rev: 25800000, exp: 13900000, profit: 11900000 },
  ];

  const maxVal = Math.max(...data6M.map((d) => d.rev));
  const svgHeight = 220;
  const svgWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  // Compute SVG Points for Area & Line
  const getCoordinates = (values: number[]) => {
    return values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * (svgWidth - 2 * paddingX);
      const y = svgHeight - paddingY - (val / (maxVal * 1.15)) * (svgHeight - 2 * paddingY);
      return { x, y };
    });
  };

  const revCoords = getCoordinates(data6M.map((d) => d.rev));
  const expCoords = getCoordinates(data6M.map((d) => d.exp));
  const profitCoords = getCoordinates(data6M.map((d) => d.profit));

  const makePath = (coords: { x: number; y: number }[]) =>
    coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');

  const makeAreaPath = (coords: { x: number; y: number }[]) => {
    const line = makePath(coords);
    const lastX = coords[coords.length - 1].x;
    const firstX = coords[0].x;
    const bottomY = svgHeight - paddingY;
    return `${line} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  return (
    <div className="bg-white/90 dark:bg-[#0c1220]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue & Profit Performance</h3>
          <p className="text-xs text-slate-500">Gross revenue vs operational expenses vs net earnings</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs mr-4">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Profit
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Expenses
            </span>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              onClick={() => setTimeframe('6M')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                timeframe === '6M'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              6M
            </button>
            <button
              onClick={() => setTimeframe('1Y')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                timeframe === '1Y'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              1Y
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Graphic */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 min-w-[500px]">
          <defs>
            <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="profitAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = svgHeight - paddingY - pct * (svgHeight - 2 * paddingY);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Areas */}
          <path d={makeAreaPath(revCoords)} fill="url(#revAreaGrad)" />
          <path d={makeAreaPath(profitCoords)} fill="url(#profitAreaGrad)" />

          {/* Lines */}
          <path d={makePath(revCoords)} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={makePath(expCoords)} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
          <path d={makePath(profitCoords)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points on Revenue */}
          {revCoords.map((c, i) => (
            <g key={i}>
              <circle cx={c.x} cy={c.y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
              <text
                x={c.x}
                y={svgHeight - 4}
                textAnchor="middle"
                fill="currentColor"
                opacity="0.6"
                fontSize="11"
                fontWeight="600"
              >
                {data6M[i].month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Summary Metrics Bar below chart */}
      <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Monthly Revenue</p>
          <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(18900000, activeCurrency)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Current Month Profit</p>
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(11900000, activeCurrency)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Profit Margin</p>
          <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">46.1%</p>
        </div>
      </div>
    </div>
  );
};
