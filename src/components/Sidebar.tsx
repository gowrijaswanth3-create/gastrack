'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Package, ScrollText, ChevronLeft, ChevronRight, Settings, LogOut, ShieldCheck, BookUser } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const NAV_ITEMS = [
  {
    key: 'nav-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    key: 'nav-inventory',
    label: 'Inventory',
    href: '/inventory-management',
    icon: Package,
    badge: null,
  },
  {
    key: 'nav-transactions',
    label: 'Transactions',
    href: '/transaction-ledger',
    icon: ScrollText,
    badge: '3',
  },
  {
    key: 'nav-customer-log',
    label: 'Customer Log',
    href: '/customer-log',
    icon: BookUser,
    badge: null,
  },
];

const BOTTOM_ITEMS = [
  { key: 'nav-settings', label: 'Settings', href: '#', icon: Settings },
  { key: 'nav-logout', label: 'Sign Out', href: '#', icon: LogOut },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`
        relative flex flex-col bg-[#0f4c81] text-white transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
        h-screen overflow-hidden
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <AppLogo size={32} className="shrink-0" />
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-white truncate">
            GasTrack
          </span>
        )}
      </div>
      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 bg-white/10 rounded-md px-3 py-2">
            <ShieldCheck size={14} className="text-orange-300 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Rajesh Kumar</p>
              <p className="text-[11px] text-white/60 truncate">Admin · Depot #1</p>
            </div>
          </div>
        </div>
      )}
      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Operations
          </p>
        )}
        {NAV_ITEMS?.map((item) => {
          const Icon = item?.icon;
          const isActive = pathname === item?.href;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item?.label}</span>}
              {!collapsed && item?.badge && (
                <span className="ml-auto bg-orange-400 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {item?.badge}
                </span>
              )}
              {collapsed && item?.badge && (
                <span className="absolute top-1 right-1 bg-orange-400 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item?.badge}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item?.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Bottom items */}
      <div className="px-2 py-4 border-t border-white/10 space-y-1">
        {BOTTOM_ITEMS?.map((item) => {
          const Icon = item?.icon;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150 group relative
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item?.label}</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item?.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 bg-white border border-border rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-150 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-[#0f4c81]" />
        ) : (
          <ChevronLeft size={12} className="text-[#0f4c81]" />
        )}
      </button>
    </aside>
  );
}