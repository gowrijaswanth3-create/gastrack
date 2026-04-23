import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardKPIs from './components/DashboardKPIs';
import DashboardCharts from './components/DashboardCharts';
import ActivityFeed from './components/ActivityFeed';
import StockBreakdownTable from './components/StockBreakdownTable';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Operations Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live cylinder stock and today&apos;s activity — Depot #1
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Last updated: 23 Apr 2026, 05:42</span>
          </div>
        </div>

        {/* KPI Cards */}
        <DashboardKPIs />

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DashboardCharts />
          </div>
          <div className="xl:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Stock Breakdown Table */}
        <StockBreakdownTable />
      </div>
    </AppLayout>
  );
}