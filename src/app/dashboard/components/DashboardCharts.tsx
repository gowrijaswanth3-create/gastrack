'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { DAILY_FLOW_DATA, STOCK_BY_CAPACITY } from '@/lib/mockData';

const TABS = [
  { key: 'tab-flow', label: 'Daily Cylinder Flow' },
  { key: 'tab-stock', label: 'Stock by Capacity' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={`tt-${i}`} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-mono font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardCharts() {
  const [activeTab, setActiveTab] = useState('tab-flow');

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {activeTab === 'tab-flow' ? 'Cylinder Movement — Last 14 Days' : 'Current Stock by Capacity'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeTab === 'tab-flow' ? 'Dispatched vs Returned vs Refilled' : 'Filled / Empty / In Transit per SKU'}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px]">
        {activeTab === 'tab-flow' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DAILY_FLOW_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradDispatched" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f4c81" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0f4c81" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradReturned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRefilled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="dispatched" name="Dispatched" stroke="#0f4c81" strokeWidth={2} fill="url(#gradDispatched)" />
              <Area type="monotone" dataKey="returned" name="Empties Returned" stroke="#16a34a" strokeWidth={2} fill="url(#gradReturned)" />
              <Area type="monotone" dataKey="refilled" name="Refilled Received" stroke="#f97316" strokeWidth={2} fill="url(#gradRefilled)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={STOCK_BY_CAPACITY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" />
              <XAxis dataKey="capacity" tick={{ fontSize: 10, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 10% 50%)' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="filled" name="Filled" fill="#0f4c81" radius={[3, 3, 0, 0]} />
              <Bar dataKey="empty" name="Empty" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="inTransit" name="In Transit" fill="#f97316" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}