'use client';

import React, { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import InventorySection from './InventorySection';
import AuditOverrideModal from './AuditOverrideModal';
import { INVENTORY_DATA, type InventoryRow, type CylinderType } from '@/lib/mockData';

export interface AuditTarget {
  row: InventoryRow;
  field: 'filled' | 'empty';
}

export default function InventoryPageClient() {
  const [votRows, setVotRows] = useState<InventoryRow[]>(
    INVENTORY_DATA.filter((r) => r.cylinderType === 'VOT')
  );
  const [lotRows, setLotRows] = useState<InventoryRow[]>(
    INVENTORY_DATA.filter((r) => r.cylinderType === 'LOT')
  );
  const [auditTarget, setAuditTarget] = useState<AuditTarget | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddRow = (type: CylinderType) => {
    const newRow: InventoryRow = {
      id: `inv-${type.toLowerCase()}-new-${Date.now()}`,
      cylinderType: type,
      capacity: '',
      filled: 0,
      empty: 0,
      inTransit: 0,
    };
    if (type === 'VOT') setVotRows((prev) => [...prev, newRow]);
    else setLotRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (type: CylinderType, id: string) => {
    if (type === 'VOT') setVotRows((prev) => prev.filter((r) => r.id !== id));
    else setLotRows((prev) => prev.filter((r) => r.id !== id));
    toast.success('Capacity row removed');
  };

  const handleCapacityChange = (type: CylinderType, id: string, value: string) => {
    const updater = (rows: InventoryRow[]) =>
      rows.map((r) => (r.id === id ? { ...r, capacity: value } : r));
    if (type === 'VOT') setVotRows(updater);
    else setLotRows(updater);
  };

  const handleAuditSave = (rowId: string, field: 'filled' | 'empty', newValue: number, reason: string) => {
    // Backend integration point: POST /api/transactions with type='Adjustment'
    const updater = (rows: InventoryRow[]) =>
      rows.map((r) => (r.id === rowId ? { ...r, [field]: newValue } : r));
    if (auditTarget?.row.cylinderType === 'VOT') setVotRows(updater);
    else setLotRows(updater);
    setAuditTarget(null);
    toast.success(`Audit adjustment logged — ${field} count updated to ${newValue}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Backend integration point: GET /api/inventory to recalculate from ledger
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Inventory recalculated from transaction ledger');
    }, 1200);
  };

  const totalFilled = [...votRows, ...lotRows].reduce((a, r) => a + r.filled, 0);
  const totalEmpty = [...votRows, ...lotRows].reduce((a, r) => a + r.empty, 0);
  const totalInTransit = [...votRows, ...lotRows].reduce((a, r) => a + r.inTransit, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inventory Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live counts derived from transaction ledger · Use Audit Override to correct physical discrepancies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-150 disabled:opacity-60"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Recalculating…' : 'Recalculate from Ledger'}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-150">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'sum-filled', label: 'Total Filled', value: totalFilled, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
          { key: 'sum-empty', label: 'Total Empty', value: totalEmpty, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
          { key: 'sum-transit', label: 'In Transit', value: totalInTransit, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
        ].map((s) => (
          <div key={s.key} className={`rounded-xl border px-5 py-4 ${s.bg}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-3xl font-bold font-mono tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">All types combined</p>
          </div>
        ))}
      </div>

      {/* VOT Section */}
      <InventorySection
        title="VOT — Valve On Top Cylinders"
        type="VOT"
        rows={votRows}
        onAddRow={() => handleAddRow('VOT')}
        onDeleteRow={(id) => handleDeleteRow('VOT', id)}
        onCapacityChange={(id, val) => handleCapacityChange('VOT', id, val)}
        onAuditOverride={(row, field) => setAuditTarget({ row, field })}
      />

      {/* LOT Section */}
      <InventorySection
        title="LOT — Liquid Off Take Cylinders"
        type="LOT"
        rows={lotRows}
        onAddRow={() => handleAddRow('LOT')}
        onDeleteRow={(id) => handleDeleteRow('LOT', id)}
        onCapacityChange={(id, val) => handleCapacityChange('LOT', id, val)}
        onAuditOverride={(row, field) => setAuditTarget({ row, field })}
      />

      {/* Audit modal */}
      {auditTarget && (
        <AuditOverrideModal
          target={auditTarget}
          onSave={handleAuditSave}
          onClose={() => setAuditTarget(null)}
        />
      )}
    </div>
  );
}