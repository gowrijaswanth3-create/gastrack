import React from 'react';
import { TRANSACTIONS } from '@/lib/mockData';
import { TransactionBadge } from '@/components/ui/StatusBadge';
import { Clock } from 'lucide-react';

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date('2026-04-23');
  const diff = today.getDate() - d.getDate();
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

const recent = TRANSACTIONS.slice(0, 8);

export default function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Latest 8 transactions</p>
        </div>
        <Clock size={16} className="text-muted-foreground" />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin">
        {recent.map((txn) => (
          <div
            key={`feed-${txn.id}`}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-100 cursor-default"
          >
            <div className="mt-0.5 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#0f4c81] mt-1.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <TransactionBadge type={txn.type} />
              </div>
              <p className="text-xs text-foreground font-medium truncate">
                {txn.cylinderType} · {txn.capacity} · {txn.brand}
                {' '}— <span className="font-mono font-semibold">{txn.quantity}</span> cyl
              </p>
              {txn.customerName && (
                <p className="text-[11px] text-muted-foreground truncate">{txn.customerName}</p>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {formatDate(txn.date)} · {formatTime(txn.date)} · {txn.staffName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}