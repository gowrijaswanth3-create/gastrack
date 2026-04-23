export type CylinderType = 'VOT' | 'LOT';
export type Brand = 'Indane' | 'HP' | 'Bharat Gas';
export type TransactionType =
  | 'Sent to Customer' |'Received from Customer' |'Sent for Refilling' |'Received from Refilling' |'Adjustment';

export interface InventoryRow {
  id: string;
  cylinderType: CylinderType;
  capacity: string;
  filled: number;
  empty: number;
  inTransit: number;
  brand?: Brand;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  pendingEmpties: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  cylinderType: CylinderType;
  capacity: string;
  brand: Brand;
  quantity: number;
  customerId: string | null;
  customerName: string | null;
  notes: string;
  images: string[];
  staffName: string;
}

// Backend integration point: Replace with GET /api/inventory
export const INVENTORY_DATA: InventoryRow[] = [
  { id: 'inv-vot-19', cylinderType: 'VOT', capacity: '19kg', filled: 142, empty: 38, inTransit: 12 },
  { id: 'inv-vot-37', cylinderType: 'VOT', capacity: '37kg', filled: 67, empty: 21, inTransit: 8 },
  { id: 'inv-vot-48', cylinderType: 'VOT', capacity: '48kg', filled: 34, empty: 9, inTransit: 5 },
  { id: 'inv-lot-19', cylinderType: 'LOT', capacity: '19kg', filled: 88, empty: 24, inTransit: 6 },
  { id: 'inv-lot-37', cylinderType: 'LOT', capacity: '37kg', filled: 45, empty: 15, inTransit: 9 },
  { id: 'inv-lot-48', cylinderType: 'LOT', capacity: '48kg', filled: 22, empty: 7, inTransit: 3 },
];

// Backend integration point: Replace with GET /api/customers
export const CUSTOMERS: Customer[] = [
  { id: 'cust-001', name: 'Sharma General Store', phone: '9876543210', address: 'MG Road, Block 4', pendingEmpties: 3 },
  { id: 'cust-002', name: 'Patel Brothers', phone: '9823451234', address: 'Station Road, Sector 2', pendingEmpties: 0 },
  { id: 'cust-003', name: 'Gupta Enterprises', phone: '9712345678', address: 'Civil Lines, Ward 7', pendingEmpties: 7 },
  { id: 'cust-004', name: 'Mehta & Sons', phone: '9654321098', address: 'Industrial Area, Plot 12', pendingEmpties: 2 },
  { id: 'cust-005', name: 'Reddy Catering', phone: '9543210987', address: 'Old Market, Lane 3', pendingEmpties: 0 },
  { id: 'cust-006', name: 'Joshi Hotel Supplies', phone: '9432109876', address: 'NH-8 Service Road', pendingEmpties: 12 },
];

// Backend integration point: Replace with GET /api/transactions
export const TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-001',
    date: '2026-04-23T08:15:00',
    type: 'Sent to Customer',
    cylinderType: 'VOT',
    capacity: '19kg',
    brand: 'Indane',
    quantity: 10,
    customerId: 'cust-001',
    customerName: 'Sharma General Store',
    notes: 'Morning delivery batch',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Delivery+Receipt'],
    staffName: 'Rajesh Kumar',
  },
  {
    id: 'txn-002',
    date: '2026-04-23T09:30:00',
    type: 'Received from Customer',
    cylinderType: 'VOT',
    capacity: '19kg',
    brand: 'HP',
    quantity: 7,
    customerId: 'cust-001',
    customerName: 'Sharma General Store',
    notes: 'Empties collected with morning delivery',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Empties+Receipt'],
    staffName: 'Rajesh Kumar',
  },
  {
    id: 'txn-003',
    date: '2026-04-23T10:00:00',
    type: 'Sent for Refilling',
    cylinderType: 'LOT',
    capacity: '37kg',
    brand: 'Bharat Gas',
    quantity: 20,
    customerId: null,
    customerName: null,
    notes: 'Sent to Bharat Gas plant — Truck #GJ-05-T-4421',
    images: [],
    staffName: 'Sunil Verma',
  },
  {
    id: 'txn-004',
    date: '2026-04-23T11:15:00',
    type: 'Sent to Customer',
    cylinderType: 'VOT',
    capacity: '37kg',
    brand: 'Indane',
    quantity: 5,
    customerId: 'cust-003',
    customerName: 'Gupta Enterprises',
    notes: '',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Delivery+Slip'],
    staffName: 'Priya Nair',
  },
  {
    id: 'txn-005',
    date: '2026-04-23T12:45:00',
    type: 'Received from Refilling',
    cylinderType: 'VOT',
    capacity: '48kg',
    brand: 'HP',
    quantity: 15,
    customerId: null,
    customerName: null,
    notes: 'Received from HP refilling plant — all seals intact',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Plant+Receipt'],
    staffName: 'Rajesh Kumar',
  },
  {
    id: 'txn-006',
    date: '2026-04-23T13:30:00',
    type: 'Sent to Customer',
    cylinderType: 'LOT',
    capacity: '19kg',
    brand: 'Bharat Gas',
    quantity: 8,
    customerId: 'cust-006',
    customerName: 'Joshi Hotel Supplies',
    notes: 'Bulk hotel order',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Hotel+Delivery'],
    staffName: 'Sunil Verma',
  },
  {
    id: 'txn-007',
    date: '2026-04-22T09:00:00',
    type: 'Received from Customer',
    cylinderType: 'LOT',
    capacity: '19kg',
    brand: 'Indane',
    quantity: 3,
    customerId: 'cust-006',
    customerName: 'Joshi Hotel Supplies',
    notes: 'Partial empties — 12 still pending',
    images: [],
    staffName: 'Priya Nair',
  },
  {
    id: 'txn-008',
    date: '2026-04-22T14:00:00',
    type: 'Adjustment',
    cylinderType: 'VOT',
    capacity: '19kg',
    brand: 'Indane',
    quantity: -2,
    customerId: null,
    customerName: null,
    notes: 'Physical audit — 2 cylinders found damaged/unusable',
    images: [],
    staffName: 'Rajesh Kumar',
  },
  {
    id: 'txn-009',
    date: '2026-04-22T16:30:00',
    type: 'Sent to Customer',
    cylinderType: 'VOT',
    capacity: '19kg',
    brand: 'HP',
    quantity: 12,
    customerId: 'cust-004',
    customerName: 'Mehta & Sons',
    notes: 'Afternoon batch delivery',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Delivery+Proof'],
    staffName: 'Sunil Verma',
  },
  {
    id: 'txn-010',
    date: '2026-04-21T08:30:00',
    type: 'Received from Refilling',
    cylinderType: 'LOT',
    capacity: '37kg',
    brand: 'Bharat Gas',
    quantity: 18,
    customerId: null,
    customerName: null,
    notes: 'Received from Bharat Gas plant — 2 cylinders rejected (damaged valve)',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Refill+Receipt'],
    staffName: 'Rajesh Kumar',
  },
  {
    id: 'txn-011',
    date: '2026-04-21T11:00:00',
    type: 'Sent to Customer',
    cylinderType: 'LOT',
    capacity: '48kg',
    brand: 'HP',
    quantity: 4,
    customerId: 'cust-002',
    customerName: 'Patel Brothers',
    notes: '',
    images: [],
    staffName: 'Priya Nair',
  },
  {
    id: 'txn-012',
    date: '2026-04-21T15:00:00',
    type: 'Sent for Refilling',
    cylinderType: 'VOT',
    capacity: '37kg',
    brand: 'Indane',
    quantity: 25,
    customerId: null,
    customerName: null,
    notes: 'Sent to Indane plant — Truck #RJ-14-G-7732',
    images: ['https://placehold.co/400x300/0f4c81/white?text=Refill+Dispatch'],
    staffName: 'Rajesh Kumar',
  },
];

export const DAILY_FLOW_DATA = [
  { date: 'Apr 10', dispatched: 28, returned: 22, refilled: 15 },
  { date: 'Apr 11', dispatched: 34, returned: 18, refilled: 0 },
  { date: 'Apr 12', dispatched: 19, returned: 25, refilled: 30 },
  { date: 'Apr 13', dispatched: 41, returned: 31, refilled: 0 },
  { date: 'Apr 14', dispatched: 23, returned: 19, refilled: 0 },
  { date: 'Apr 15', dispatched: 38, returned: 27, refilled: 20 },
  { date: 'Apr 16', dispatched: 15, returned: 12, refilled: 0 },
  { date: 'Apr 17', dispatched: 29, returned: 23, refilled: 18 },
  { date: 'Apr 18', dispatched: 44, returned: 38, refilled: 0 },
  { date: 'Apr 19', dispatched: 31, returned: 20, refilled: 25 },
  { date: 'Apr 20', dispatched: 27, returned: 24, refilled: 0 },
  { date: 'Apr 21', dispatched: 37, returned: 28, refilled: 43 },
  { date: 'Apr 22', dispatched: 33, returned: 19, refilled: 0 },
  { date: 'Apr 23', dispatched: 35, returned: 10, refilled: 15 },
];

export const STOCK_BY_CAPACITY = [
  { capacity: '19kg VOT', filled: 142, empty: 38, inTransit: 12 },
  { capacity: '37kg VOT', filled: 67, empty: 21, inTransit: 8 },
  { capacity: '48kg VOT', filled: 34, empty: 9, inTransit: 5 },
  { capacity: '19kg LOT', filled: 88, empty: 24, inTransit: 6 },
  { capacity: '37kg LOT', filled: 45, empty: 15, inTransit: 9 },
  { capacity: '48kg LOT', filled: 22, empty: 7, inTransit: 3 },
];