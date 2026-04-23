'use client';

import React from 'react';
import { Plus, Trash2, ClipboardEdit, AlertTriangle } from 'lucide-react';
import type { InventoryRow, CylinderType } from '@/lib/mockData';

interface Props {
  title: string;
  type: CylinderType;
  rows: InventoryRow[];
  onAddRow: () => void;
  onDeleteRow: (id: string) => void;
  onCapacityChange: (id: string, value: string) => void;
  onAuditOverride: (row: InventoryRow, field: 'filled' | 'empty') => void;
}

export default function InventorySection({
  title,
  type,
  rows,
  onAddRow,
  onDeleteRow,
  onCapacityChange,
  onAuditOverride,
}: Props) {
  const sectionFilled = rows.reduce((a, r) => a + r.filled, 0);
  const sectionEmpty = rows.reduce((a, r) => a + r.empty, 0);
  const sectionInTransit = rows.reduce((a, r) => a + r.inTransit, 0);

  const headerColor = type === 'VOT' ? 'text-[#0f4c81]' : 'text-teal-700';
  const headerBg = type === 'VOT' ? 'bg-blue-50 border-blue-200' : 'bg-teal-50 border-teal-200';
  const addBtnColor = type === 'VOT' ? 'bg-[#0f4c81] hover:bg-[#0d3f6b]' : 'bg-teal-700 hover:bg-teal-800';

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Section header */}
      <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${headerBg}`}>
        <div>
          <h2 className={`text-base font-semibold ${headerColor}`}>{title}</h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-muted-foreground">
              Filled: <span className="font-mono font-semibold text-green-700">{sectionFilled}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Empty: <span className="font-mono font-semibold text-slate-600">{sectionEmpty}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              In Transit: <span className="font-mono font-semibold text-orange-600">{sectionInTransit}</span>
            </span>
          </div>
        </div>
        <button
          onClick={onAddRow}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-lg transition-colors duration-150 ${addBtnColor}`}
        >
          <Plus size={14} />
          Add Capacity Row
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-36">
                Capacity (kg)
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Filled Count
                <span className="ml-1 text-[10px] normal-case text-muted-foreground/70">(from ledger)</span>
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-16" />
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Empty Count
                <span className="ml-1 text-[10px] normal-case text-muted-foreground/70">(from ledger)</span>
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-16" />
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                In Transit
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Fill Rate
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle size={24} className="text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No capacity rows yet</p>
                    <p className="text-xs text-muted-foreground/70">Click &quot;Add Capacity Row&quot; to define cylinder sizes for this type</p>
                  </div>
                </td>
              </tr>
            )}
            {rows.map((row) => {
              const total = row.filled + row.empty + row.inTransit;
              const fillPct = total > 0 ? Math.round((row.filled / total) * 100) : 0;
              const isLow = row.filled > 0 && row.filled < 25;

              return (
                <tr
                  key={`inv-row-${row.id}`}
                  className="border-t border-border hover:bg-muted/30 transition-colors duration-100 group"
                >
                  {/* Capacity input */}
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={row.capacity}
                      onChange={(e) => onCapacityChange(row.id, e.target.value)}
                      placeholder="e.g. 19kg"
                      className="w-28 px-2 py-1.5 text-sm font-mono font-semibold border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81] transition-colors"
                    />
                  </td>

                  {/* Filled count */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-lg tabular-nums ${isLow ? 'text-red-600' : 'text-green-700'}`}>
                        {row.filled}
                      </span>
                      {isLow && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                          <AlertTriangle size={10} />
                          Low
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Audit filled */}
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={() => onAuditOverride(row, 'filled')}
                      title="Audit / Override filled count"
                      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors duration-150"
                    >
                      <ClipboardEdit size={11} />
                      Audit
                    </button>
                  </td>

                  {/* Empty count */}
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-lg tabular-nums text-slate-600">
                      {row.empty}
                    </span>
                  </td>

                  {/* Audit empty */}
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={() => onAuditOverride(row, 'empty')}
                      title="Audit / Override empty count"
                      className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors duration-150"
                    >
                      <ClipboardEdit size={11} />
                      Audit
                    </button>
                  </td>

                  {/* In transit */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm tabular-nums text-orange-600 font-semibold">
                      {row.inTransit}
                    </span>
                  </td>

                  {/* Fill rate */}
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${fillPct > 60 ? 'bg-green-500' : fillPct > 30 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground w-8 text-right">{fillPct}%</span>
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDeleteRow(row.id)}
                      title="Delete this capacity row — this cannot be undone"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-150"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 border-t border-border bg-muted/30">
        <p className="text-[11px] text-muted-foreground">
          Counts are read-only — calculated from the transaction ledger. Use <strong>Audit Override</strong> to log a manual adjustment if physical stock doesn&apos;t match.
        </p>
      </div>
    </div>
  );
}