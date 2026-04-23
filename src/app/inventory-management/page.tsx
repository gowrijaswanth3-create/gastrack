import React from 'react';
import AppLayout from '@/components/AppLayout';
import InventoryPageClient from './components/InventoryPageClient';

export default function InventoryManagementPage() {
  return (
    <AppLayout>
      <InventoryPageClient />
    </AppLayout>
  );
}