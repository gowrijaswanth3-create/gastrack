import React from 'react';
import type { TransactionType } from '@/lib/mockData';

const TYPE_CONFIG: Record<
  TransactionType,
  { label: string; className: string }
> = {
  'Sent to Customer': {
    label: 'Sent to Customer',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  'Received from Customer': {
    label: 'Received from Customer',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  'Sent for Refilling': {
    label: 'Sent for Refilling',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  'Received from Refilling': {
    label: 'Received from Refilling',
    className: 'bg-purple-50 text-purple-700 border border-purple-200',
  },
  Adjustment: {
    label: 'Adjustment',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  },
};

const BRAND_CONFIG: Record<string, string> = {
  Indane: 'bg-sky-50 text-sky-700 border border-sky-200',
  HP: 'bg-red-50 text-red-700 border border-red-200',
  'Bharat Gas': 'bg-orange-50 text-orange-700 border border-orange-200',
};

const CYLINDER_TYPE_CONFIG: Record<string, string> = {
  VOT: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  LOT: 'bg-teal-50 text-teal-700 border border-teal-200',
};

export function TransactionBadge({ type }: { type: TransactionType }) {
  const config = TYPE_CONFIG[type];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function BrandBadge({ brand }: { brand: string }) {
  const cls = BRAND_CONFIG[brand] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cls}`}>
      {brand}
    </span>
  );
}

export function CylinderTypeBadge({ type }: { type: string }) {
  const cls = CYLINDER_TYPE_CONFIG[type] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cls}`}>
      {type}
    </span>
  );
}