'use client';

import React, { useState, useMemo } from 'react';
import { CUSTOMERS, TRANSACTIONS, type Customer, type Transaction } from '@/lib/mockData';
import { TransactionBadge, CylinderTypeBadge } from '@/components/ui/StatusBadge';
import { Search, Users, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp, Package, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

interface CustomerWithStats extends Customer {
  totalSupplied: number;
  totalReturned: number;
  lastActivity: string | null;
  transactions: Transaction[];
}

export default function CustomerLogClient() {
  const [search, setSearch] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [pendingFilter, setPendingFilter] = useState<'all' | 'pending' | 'clear'>('all');

  const customersWithStats: CustomerWithStats[] = useMemo(() => {
    return CUSTOMERS.map((customer) => {
      const customerTxns = TRANSACTIONS.filter((t) => t.customerId === customer.id);
      const supplied = customerTxns
        .filter((t) => t.type === 'Sent to Customer')
        .reduce((sum, t) => sum + t.quantity, 0);
      const returned = customerTxns
        .filter((t) => t.type === 'Received from Customer')
        .reduce((sum, t) => sum + t.quantity, 0);
      const sorted = [...customerTxns].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return {
        ...customer,
        totalSupplied: supplied,
        totalReturned: returned,
        lastActivity: sorted[0]?.date ?? null,
        transactions: sorted,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    let result = customersWithStats;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    if (pendingFilter === 'pending') result = result.filter((c) => c.pendingEmpties > 0);
    if (pendingFilter === 'clear') result = result.filter((c) => c.pendingEmpties === 0);
    return result;
  }, [customersWithStats, search, pendingFilter]);

  const totalPending = customersWithStats.reduce((s, c) => s + c.pendingEmpties, 0);
  const pendingCount = customersWithStats.filter((c) => c.pendingEmpties > 0).length;
  const clearCount = customersWithStats.filter((c) => c.pendingEmpties === 0).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Customer Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity history, supply records, and pending empties per customer
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-[#0f4c81]" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{customersWithStats.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">With Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-red-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pending Empties</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{totalPending}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={16} className="text-green-500" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">All Clear</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{clearCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'clear'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setPendingFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-150 capitalize ${
                pendingFilter === f
                  ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                  : 'bg-card text-muted-foreground border-border hover:border-[#0f4c81]/40 hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All' : f === 'pending' ? 'Has Pending' : 'All Clear'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No customers match your search.
          </div>
        )}
        {filtered.map((customer) => {
          const isExpanded = expandedCustomer === customer.id;
          const lastDt = customer.lastActivity ? formatDateTime(customer.lastActivity) : null;

          return (
            <div
              key={customer.id}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              {/* Customer Row */}
              <button
                onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors duration-150"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#0f4c81]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#0f4c81]">
                    {customer.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{customer.name}</p>
                    {customer.pendingEmpties > 0 && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} />
                        {customer.pendingEmpties} pending
                      </span>
                    )}
                    {customer.pendingEmpties === 0 && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <CheckCircle size={10} />
                        Clear
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {customer.phone} · {customer.address}
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Supplied</p>
                    <p className="text-sm font-bold text-foreground">{customer.totalSupplied}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Returned</p>
                    <p className="text-sm font-bold text-foreground">{customer.totalReturned}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Last Activity</p>
                    <p className="text-xs font-medium text-foreground">
                      {lastDt ? lastDt.date : '—'}
                    </p>
                  </div>
                </div>

                {/* Expand icon */}
                <div className="ml-2 shrink-0 text-muted-foreground">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expanded Transaction History */}
              {isExpanded && (
                <div className="border-t border-border bg-muted/20 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Transaction History
                  </p>
                  {customer.transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No transactions recorded for this customer.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {customer.transactions.map((txn) => {
                        const dt = formatDateTime(txn.date);
                        const isSent = txn.type === 'Sent to Customer';
                        return (
                          <div
                            key={txn.id}
                            className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
                          >
                            {/* Direction icon */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                isSent
                                  ? 'bg-blue-50 text-blue-600' :'bg-green-50 text-green-600'
                              }`}
                            >
                              {isSent ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <TransactionBadge type={txn.type} />
                                <CylinderTypeBadge type={txn.cylinderType} />
                                <span className="text-xs text-muted-foreground">
                                  {txn.capacity} · {txn.brand}
                                </span>
                              </div>
                              {txn.notes && (
                                <p className="text-xs text-muted-foreground mt-1 truncate">{txn.notes}</p>
                              )}
                            </div>

                            {/* Quantity */}
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-foreground">
                                {isSent ? '-' : '+'}{txn.quantity}
                              </p>
                              <p className="text-[10px] text-muted-foreground">cylinders</p>
                            </div>

                            {/* Date */}
                            <div className="text-right shrink-0 hidden sm:block">
                              <p className="text-xs font-medium text-foreground">{dt.date}</p>
                              <div className="flex items-center gap-1 justify-end mt-0.5">
                                <Clock size={10} className="text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">{dt.time}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
