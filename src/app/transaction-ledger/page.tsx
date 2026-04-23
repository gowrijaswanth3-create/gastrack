import React from 'react';
import AppLayout from '@/components/AppLayout';
import TransactionLedgerClient from './components/TransactionLedgerClient';

export default function TransactionLedgerPage() {
  return (
    <AppLayout>
      <TransactionLedgerClient />
    </AppLayout>
  );
}