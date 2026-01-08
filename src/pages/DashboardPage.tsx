import * as React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Tabs } from '@/components/Tabs';

// Mock data
const mockStats = [
  {
    title: 'Total Sales',
    value: '$45,231.89',
    change: '+20.1%',
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+12%',
    icon: <ShoppingCart className="h-6 w-6" />,
  },
  {
    title: 'Active Users',
    value: '892',
    change: '+4%',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Growth',
    value: '28.5%',
    change: '+8.2%',
    icon: <TrendingUp className="h-6 w-6" />,
  },
];

const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: '$1,299.00', status: 'Completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: '$749.50', status: 'Pending', date: '2024-01-16' },
  { id: 'ORD-003', customer: 'Bob Johnson', amount: '$2,499.00', status: 'Completed', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Alice Williams', amount: '$399.99', status: 'Cancelled', date: '2024-01-13' },
  { id: 'ORD-005', customer: 'Charlie Brown', amount: '$1,849.00', status: 'Pending', date: '2024-01-12' },
];

const StatCard = ({ title, value, change, icon }: (typeof mockStats)[0]) => (
  <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
        <p className="text-xs text-success mt-2">{change} from last month</p>
      </div>
      <div className="text-primary/50">{icon}</div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const [selectedOrders, setSelectedOrders] = React.useState<string[]>([]);

  const columns = [
    {
      id: 'id',
      header: 'Order ID',
      searchable: true,
      render: (row: any) => <span className="font-mono text-sm font-medium text-primary">{row.id}</span>,
    },
    {
      id: 'customer',
      header: 'Customer',
      searchable: true,
      render: (row: any) => <span className="text-foreground">{row.customer}</span>,
    },
    {
      id: 'amount',
      header: 'Amount',
      render: (row: any) => <span className="font-semibold text-foreground">{row.amount}</span>,
    },
    {
      id: 'date',
      header: 'Date',
      render: (row: any) => <span className="text-muted-foreground text-sm">{row.date}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 'Completed'
              ? 'bg-success/20 text-success'
              : row.status === 'Pending'
                ? 'bg-orange-500/20 text-orange-600'
                : 'bg-destructive/20 text-destructive'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockStats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Orders</h3>
            <DataTable
              columns={columns}
              data={mockOrders}
              searchPlaceholder="Search orders..."
              onSelectionChange={setSelectedOrders}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Sales Analytics</h3>
          <p className="text-muted-foreground">Analytics data coming soon...</p>
        </div>
      ),
    },
    {
      id: 'reports',
      label: 'Reports',
      content: (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Reports</h3>
          <p className="text-muted-foreground">Reports coming soon...</p>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your business hub</p>
        </div>

        {selectedOrders.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <Tabs tabs={tabs} variant="underline" />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
