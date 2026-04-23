'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, ClipboardEdit, AlertTriangle } from 'lucide-react';
import type { AuditTarget } from './InventoryPageClient';

interface FormValues {
  newCount: number;
  reason: string;
  notes: string;
}

interface Props {
  target: AuditTarget;
  onSave: (rowId: string, field: 'filled' | 'empty', newValue: number, reason: string) => void;
  onClose: () => void;
}

const REASONS = [
  'Physical audit — cylinders found damaged',
  'Physical audit — count mismatch (unknown reason)',
  'Cylinders transferred to another depot',
  'Cylinders lost / stolen',
  'Data entry correction',
  'Other',
];

export default function AuditOverrideModal({ target, onSave, onClose }: Props) {
  const { row, field } = target;
  const currentValue = row[field];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      newCount: currentValue,
      reason: '',
      notes: '',
    },
  });

  const newCount = watch('newCount');
  const diff = (Number(newCount) || 0) - currentValue;

  const onSubmit = (data: FormValues) => {
    onSave(row.id, field, Number(data.newCount), `${data.reason}${data.notes ? ' — ' + data.notes : ''}`);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardEdit size={18} className="text-amber-600" />
            <h2 className="text-base font-semibold text-foreground">Audit Override</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* Context */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800">
                Adjusting <span className="font-mono">{field.toUpperCase()}</span> count for{' '}
                <span className="font-mono">{row.cylinderType} · {row.capacity}</span>
              </p>
              <p className="text-amber-700 mt-0.5">
                Current value: <span className="font-mono font-bold">{currentValue}</span>. This action logs an Adjustment transaction in the ledger.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          {/* New count */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              New {field === 'filled' ? 'Filled' : 'Empty'} Count
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Enter the physically verified count from the depot floor.
            </p>
            <input
              type="number"
              min={0}
              {...register('newCount', {
                required: 'New count is required',
                min: { value: 0, message: 'Count cannot be negative' },
              })}
              className="w-full px-3 py-2 text-sm font-mono border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81] transition-colors"
            />
            {errors.newCount && (
              <p className="mt-1 text-xs text-red-600">{errors.newCount.message}</p>
            )}
            {!errors.newCount && newCount !== undefined && Number(newCount) !== currentValue && (
              <p className={`mt-1 text-xs font-semibold ${diff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Adjustment: {diff > 0 ? '+' : ''}{diff} cylinders will be logged
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Reason for Adjustment <span className="text-red-500">*</span>
            </label>
            <select
              {...register('reason', { required: 'Please select a reason' })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81] transition-colors"
            >
              <option value="">Select a reason…</option>
              {REASONS.map((r) => (
                <option key={`reason-${r}`} value={r}>{r}</option>
              ))}
            </select>
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Additional Notes
            </label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Optional — describe any additional context…"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/70 transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-60 transition-colors duration-150 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging…
                </>
              ) : (
                'Log Adjustment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}