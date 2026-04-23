import React from 'react';
import { INVENTORY_DATA } from '@/lib/mockData';
import { CylinderTypeBadge } from '@/components/ui/StatusBadge';
import { AlertTriangle } from 'lucide-react';

export default function StockBreakdownTable() {
  const vot = INVENTORY_DATA.filter((r) => r.cylinderType === 'VOT');
  const lot = INVENTORY_DATA.filter((r) => r.cylinderType === 'LOT');

  const renderRows = (rows: typeof INVENTORY_DATA) =>
    rows.map((row) => {
      const total = row.filled + row.empty + row.inTransit;
      const filledPct = total > 0 ? Math.round((row.filled / total) * 100) : 0;
      const isLow = row.filled < 30;
      return (
        <tr
          key={`breakdown-${row.id}`}
          className="hover:bg-muted/40 transition-colors duration-100 border-t border-border"
        >
          <td className="px-4 py-3">
            <CylinderTypeBadge type={row.cylinderType} />
          </td>
          <td className="px-4 py-3 font-mono font-semibold text-sm text-foreground">
            {row.capacity}
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold text-base tabular-nums ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                {row.filled}
              </span>
              {isLow && <AlertTriangle size={14} className="text-amber-500" />}
            </div>
          </td>
          <td className="px-4 py-3 font-mono text-sm text-muted-foreground tabular-nums">{row.empty}</td>
          <td className="px-4 py-3 font-mono text-sm tabular-nums text-orange-600">{row.inTransit}</td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2 min-w-[60px]">
                <div
                  className="h-2 rounded-full bg-[#0f4c81] transition-all duration-500"
                  style={{ width: `${filledPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground w-8 text-right">{filledPct}%</span>
            </div>
          </td>
          <td className="px-4 py-3 font-mono text-sm tabular-nums text-foreground">{total}</td>
        </tr>
      );
    });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Stock Breakdown by SKU</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live counts derived from transaction ledger</p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 font-mono">
          {INVENTORY_DATA.length} SKUs
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Capacity</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Filled</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Empty</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">In Transit</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Fill Rate</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50/50">
              <td colSpan={7} className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#0f4c81]">
                VOT — Valve On Top
              </td>
            </tr>
            {renderRows(vot)}
            <tr className="bg-teal-50/50">
              <td colSpan={7} className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-teal-700">
                LOT — Liquid Off Take
              </td>
            </tr>
            {renderRows(lot)}
          </tbody>
        </table>
      </div>
    </div>
  );
}