import React from 'react';
import { AlertTriangle, TruckIcon, ArrowUpRight, ArrowDownRight, PackageCheck, PackageX,  } from 'lucide-react';
import { INVENTORY_DATA } from '@/lib/mockData';
import Icon from '@/components/ui/AppIcon';


function sumInventory(type: 'VOT' | 'LOT' | 'all', field: 'filled' | 'empty' | 'inTransit') {
  return INVENTORY_DATA
    .filter((r) => type === 'all' || r.cylinderType === type)
    .reduce((acc, r) => acc + r[field], 0);
}

const totalFilledVOT = sumInventory('VOT', 'filled');
const totalFilledLOT = sumInventory('LOT', 'filled');
const totalEmptyVOT = sumInventory('VOT', 'empty');
const totalEmptyLOT = sumInventory('LOT', 'empty');
const totalInTransit = sumInventory('all', 'inTransit');
const totalPendingEmpties = 3 + 7 + 2 + 12; // from customer data

const CARDS = [
  {
    id: 'kpi-filled-vot',
    label: 'Filled — VOT',
    value: totalFilledVOT,
    sub: 'Valve On Top cylinders ready',
    icon: PackageCheck,
    trend: '+12 from yesterday',
    trendUp: true,
    variant: 'positive',
  },
  {
    id: 'kpi-filled-lot',
    label: 'Filled — LOT',
    value: totalFilledLOT,
    sub: 'Liquid Off Take cylinders ready',
    icon: PackageCheck,
    trend: '+5 from yesterday',
    trendUp: true,
    variant: 'positive',
  },
  {
    id: 'kpi-empty-vot',
    label: 'Empty — VOT',
    value: totalEmptyVOT,
    sub: 'Awaiting refill dispatch',
    icon: PackageX,
    trend: '-3 from yesterday',
    trendUp: false,
    variant: 'neutral',
  },
  {
    id: 'kpi-empty-lot',
    label: 'Empty — LOT',
    value: totalEmptyLOT,
    sub: 'Awaiting refill dispatch',
    icon: PackageX,
    trend: 'Same as yesterday',
    trendUp: null,
    variant: 'neutral',
  },
  {
    id: 'kpi-pending-empties',
    label: 'Pending Empties',
    value: totalPendingEmpties,
    sub: 'Customers yet to return cylinders',
    icon: AlertTriangle,
    trend: '+7 from yesterday',
    trendUp: false,
    variant: 'warning',
  },
  {
    id: 'kpi-in-transit',
    label: 'In Transit / At Plant',
    value: totalInTransit,
    sub: 'Sent for refilling, not returned',
    icon: TruckIcon,
    trend: '3 batches active',
    trendUp: null,
    variant: 'info',
  },
];

const VARIANT_STYLES: Record<string, { card: string; icon: string; value: string }> = {
  positive: {
    card: 'bg-card border border-border',
    icon: 'bg-green-50 text-green-600',
    value: 'text-foreground',
  },
  neutral: {
    card: 'bg-card border border-border',
    icon: 'bg-slate-100 text-slate-500',
    value: 'text-foreground',
  },
  warning: {
    card: 'bg-amber-50 border border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    value: 'text-amber-700',
  },
  info: {
    card: 'bg-card border border-border',
    icon: 'bg-blue-50 text-blue-600',
    value: 'text-foreground',
  },
};

export default function DashboardKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const styles = VARIANT_STYLES[card.variant];
        return (
          <div
            key={card.id}
            className={`rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${styles.card}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${styles.icon}`}>
                <Icon size={18} />
              </div>
              {card.trendUp === true && (
                <div className="flex items-center gap-0.5 text-green-600 text-xs font-medium">
                  <ArrowUpRight size={14} />
                </div>
              )}
              {card.trendUp === false && (
                <div className="flex items-center gap-0.5 text-red-500 text-xs font-medium">
                  <ArrowDownRight size={14} />
                </div>
              )}
            </div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {card.label}
            </p>
            <p className={`text-3xl font-bold tabular-nums font-mono ${styles.value}`}>
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground truncate">{card.sub}</p>
            <p className={`mt-2 text-[11px] font-medium ${
              card.trendUp === true ? 'text-green-600' :
              card.trendUp === false && card.variant === 'warning' ? 'text-amber-600' :
              card.trendUp === false ? 'text-red-500': 'text-muted-foreground'
            }`}>
              {card.trend}
            </p>
          </div>
        );
      })}
    </div>
  );
}