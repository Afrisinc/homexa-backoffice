import { useState } from 'react';
import { Tabs } from '@/components/Tabs';
import { DataTable } from '@/components/DataTable';
import { Users, Settings, Zap } from 'lucide-react';

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Viewer',
    status: 'Inactive',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Editor',
    status: 'Active',
  },
];

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 299.99,
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: 149.99,
    status: 'Pending',
    date: '2024-01-16',
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    amount: 499.99,
    status: 'Completed',
    date: '2024-01-14',
  },
  {
    id: 'ORD-004',
    customer: 'Alice Williams',
    amount: 79.99,
    status: 'Cancelled',
    date: '2024-01-13',
  },
];

export const ComponentShowcasePage = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const userColumns = [
    {
      id: 'name',
      header: 'Name',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      render: (row: any) => (
        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
          {row.role}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            row.status === 'Active' ? 'bg-success/20 text-success' : 'bg-muted/50 text-muted-foreground'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const orderColumns = [
    {
      id: 'id',
      header: 'Order ID',
      searchable: true,
      render: (row: any) => <span className="font-mono text-sm font-medium">{row.id}</span>,
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
      render: (row: any) => <span className="font-semibold text-foreground">${row.amount.toFixed(2)}</span>,
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

  const showcaseTabs = [
    {
      id: 'users',
      label: 'Users Table',
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Users Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Interactive table with search, selection, and row actions
            </p>
          </div>
          <DataTable
            columns={userColumns}
            data={mockUsers}
            searchPlaceholder="Search by name or email..."
            onSelectionChange={setSelectedUsers}
          />
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Orders Table',
      icon: <Zap className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Orders Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Table with custom status badges and financial data
            </p>
          </div>
          <DataTable columns={orderColumns} data={mockOrders} searchPlaceholder="Search orders..." />
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Tab Variants',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Tab Style Variants</h3>

            <div className="space-y-8">
              {/* Default tabs */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Default Variant</p>
                <Tabs
                  tabs={[
                    {
                      id: 'tab1',
                      label: 'Tab 1',
                      content: <p className="text-foreground">Default tab content 1</p>,
                    },
                    {
                      id: 'tab2',
                      label: 'Tab 2',
                      content: <p className="text-foreground">Default tab content 2</p>,
                    },
                    {
                      id: 'tab3',
                      label: 'Tab 3',
                      content: <p className="text-foreground">Default tab content 3</p>,
                    },
                  ]}
                  variant="default"
                />
              </div>

              {/* Pills tabs */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Pills Variant</p>
                <Tabs
                  tabs={[
                    {
                      id: 'pill1',
                      label: 'Option 1',
                      content: <p className="text-foreground">Pills content 1</p>,
                    },
                    {
                      id: 'pill2',
                      label: 'Option 2',
                      content: <p className="text-foreground">Pills content 2</p>,
                    },
                    {
                      id: 'pill3',
                      label: 'Option 3',
                      content: <p className="text-foreground">Pills content 3</p>,
                    },
                  ]}
                  variant="pills"
                />
              </div>

              {/* Underline tabs */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Underline Variant</p>
                <Tabs
                  tabs={[
                    {
                      id: 'under1',
                      label: 'Simple',
                      content: <p className="text-foreground">Underline content 1</p>,
                    },
                    {
                      id: 'under2',
                      label: 'Clean',
                      content: <p className="text-foreground">Underline content 2</p>,
                    },
                    {
                      id: 'under3',
                      label: 'Minimal',
                      content: <p className="text-foreground">Underline content 3</p>,
                    },
                  ]}
                  variant="underline"
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-foreground">Component Showcase</h1>
        <p className="text-muted-foreground mt-1">Reusable components and patterns</p>
      </div>

      <Tabs tabs={showcaseTabs} variant="underline" />
    </div>
  );
};

export default ComponentShowcasePage;
