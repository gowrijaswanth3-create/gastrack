'use client';

import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, type Transaction, type TransactionType } from '@/lib/mockData';
import { TransactionBadge, BrandBadge, CylinderTypeBadge } from '@/components/ui/StatusBadge';
import { Search, Filter, Download, Image as ImageIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X,  } from 'lucide-react';
import ImageLightbox from './ImageLightbox';

const ALL_TYPES: TransactionType[] = [
  'Sent to Customer',
  'Received from Customer',
  'Sent for Refilling',
  'Received from Refilling',
  'Adjustment',
];

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

type SortField = 'date' | 'type' | 'cylinderType' | 'capacity' | 'brand' | 'quantity' | 'customerName';
type SortDir = 'asc' | 'desc';

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export default function TransactionLedgerClient() {
  const [search, setSearch] = useState('');
  const [typeFilters, setTypeFilters] = useState<TransactionType[]>([]);
  const [cylinderTypeFilter, setCylinderTypeFilter] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const toggleTypeFilter = (t: TransactionType) => {
    setTypeFilters((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    // Backend integration point: Replace with GET /api/transactions?filters=...
    let result = [...TRANSACTIONS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.customerName?.toLowerCase().includes(q) ||
          t.brand.toLowerCase().includes(q) ||
          t.capacity.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.staffName.toLowerCase().includes(q) ||
          t.notes.toLowerCase().includes(q)
      );
    }

    if (typeFilters.length > 0) {
      result = result.filter((t) => typeFilters.includes(t.type));
    }

    if (cylinderTypeFilter) {
      result = result.filter((t) => t.cylinderType === cylinderTypeFilter);
    }

    if (capacityFilter) {
      result = result.filter((t) => t.capacity === capacityFilter);
    }

    if (dateFrom) {
      result = result.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((t) => t.date <= dateTo + 'T23:59:59');
    }

    result.sort((a, b) => {
      let av: string | number = a[sortField as keyof Transaction] as string | number ?? '';
      let bv: string | number = b[sortField as keyof Transaction] as string | number ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, typeFilters, cylinderTypeFilter, capacityFilter, dateFrom, dateTo, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-muted-foreground/40" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-[#0f4c81]" />
      : <ChevronDown size={12} className="text-[#0f4c81]" />;
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilters([]);
    setCylinderTypeFilter('');
    setCapacityFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasActiveFilters = search || typeFilters.length > 0 || cylinderTypeFilter || capacityFilter || dateFrom || dateTo;

  const uniqueCapacities = Array.from(new Set(TRANSACTIONS.map((t) => t.capacity))).sort();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Transaction Ledger</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Master record of all cylinder movements · Event-sourced, immutable history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((f) => !f)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-150 ${
              showFilters || hasActiveFilters
                ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            <Filter size={15} />
            Filters
            {hasActiveFilters && (
              <span className="bg-white/20 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {typeFilters.length + (cylinderTypeFilter ? 1 : 0) + (capacityFilter ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
              </span>
            )}
          </button>
          <button
            // Backend integration point: GET /api/transactions/export
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-150"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl shadow-sm p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Filter Transactions</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-600 transition-colors"
              >
                <X size={12} />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Date from */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81]"
              />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81]"
              />
            </div>

            {/* Cylinder type */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Cylinder Type</label>
              <select
                value={cylinderTypeFilter}
                onChange={(e) => { setCylinderTypeFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81]"
              >
                <option value="">All types</option>
                <option value="VOT">VOT</option>
                <option value="LOT">LOT</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Capacity</label>
              <select
                value={capacityFilter}
                onChange={(e) => { setCapacityFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81]"
              >
                <option value="">All capacities</option>
                {uniqueCapacities.map((c) => (
                  <option key={`cap-${c}`} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transaction type chips */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Transaction Type</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map((t) => (
                <button
                  key={`chip-${t}`}
                  onClick={() => toggleTypeFilter(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-150 ${
                    typeFilters.includes(t)
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                      : 'bg-card text-muted-foreground border-border hover:border-[#0f4c81] hover:text-[#0f4c81]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search + count row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search customer, brand, ID, staff…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 focus:border-[#0f4c81] transition-colors"
          />
        </div>
        <p className="text-sm text-muted-foreground ml-auto">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{' '}
          <span className="font-semibold text-foreground">{TRANSACTIONS.length}</span> transactions
        </p>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  { key: 'th-id', label: 'Txn ID', field: null, w: 'w-24' },
                  { key: 'th-date', label: 'Date & Time', field: 'date' as SortField, w: 'w-36' },
                  { key: 'th-type', label: 'Type', field: 'type' as SortField, w: '' },
                  { key: 'th-ctype', label: 'Cyl. Type', field: 'cylinderType' as SortField, w: 'w-20' },
                  { key: 'th-cap', label: 'Capacity', field: 'capacity' as SortField, w: 'w-24' },
                  { key: 'th-brand', label: 'Brand', field: 'brand' as SortField, w: 'w-28' },
                  { key: 'th-qty', label: 'Qty', field: 'quantity' as SortField, w: 'w-16' },
                  { key: 'th-customer', label: 'Customer', field: 'customerName' as SortField, w: '' },
                  { key: 'th-staff', label: 'Staff', field: null, w: 'w-28' },
                  { key: 'th-images', label: 'Proof', field: null, w: 'w-20' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${col.w} ${col.field ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                    onClick={col.field ? () => handleSort(col.field!) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.field && <SortIcon field={col.field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={28} className="text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">No transactions match your filters</p>
                      <p className="text-xs text-muted-foreground/70">Try adjusting the date range or clearing filters</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-2 text-xs text-[#0f4c81] font-semibold hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map((txn) => {
                const { date, time } = formatDateTime(txn.date);
                const isNegative = txn.quantity < 0;
                return (
                  <tr
                    key={`ledger-${txn.id}`}
                    className="border-t border-border hover:bg-muted/40 transition-colors duration-100 group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{txn.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-foreground">{date}</p>
                      <p className="text-[11px] text-muted-foreground">{time}</p>
                    </td>
                    <td className="px-4 py-3">
                      <TransactionBadge type={txn.type} />
                    </td>
                    <td className="px-4 py-3">
                      <CylinderTypeBadge type={txn.cylinderType} />
                    </td>
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-foreground">
                      {txn.capacity}
                    </td>
                    <td className="px-4 py-3">
                      <BrandBadge brand={txn.brand} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono font-bold text-base tabular-nums ${isNegative ? 'text-red-600' : 'text-foreground'}`}>
                        {isNegative ? '' : '+'}{txn.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {txn.customerName ? (
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-[140px]">
                            {txn.customerName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">{txn.customerId}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[100px]">
                      {txn.staffName}
                    </td>
                    <td className="px-4 py-3">
                      {txn.images.length > 0 ? (
                        <button
                          onClick={() => setLightboxImages(txn.images)}
                          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#0f4c81] bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors duration-150"
                          title="View proof images"
                        >
                          <ImageIcon size={12} />
                          {txn.images.length}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="text-xs border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-[#0f4c81]/30"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                <option key={`perpage-${n}`} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 text-xs font-medium rounded border transition-colors ${
                    page === pageNum
                      ? 'bg-[#0f4c81] text-white border-[#0f4c81]'
                      : 'bg-card text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImages && (
        <ImageLightbox images={lightboxImages} onClose={() => setLightboxImages(null)} />
      )}
    </div>
  );
}