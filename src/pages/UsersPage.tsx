import * as React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Tabs } from '@/components/Tabs';
import { Button } from '@/components/Button';

// Mock data
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    companyName: 'Tech Corp',
    role: 'seller',
    phone: '+1234567890',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    companyName: null,
    role: 'buyer',
    phone: '+1234567891',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    companyName: 'Electronics Hub',
    role: 'seller',
    phone: '+1234567892',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice@example.com',
    companyName: null,
    role: 'buyer',
    phone: '+1234567893',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@example.com',
    companyName: 'Fashion Store',
    role: 'seller',
    phone: '+1234567894',
    createdAt: '2024-01-11',
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'seller':
      return 'bg-blue-500/20 text-blue-600';
    case 'buyer':
      return 'bg-green-500/20 text-green-600';
    case 'admin':
      return 'bg-purple-500/20 text-purple-600';
    case 'support':
      return 'bg-orange-500/20 text-orange-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const UsersPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  const userColumns = [
    {
      id: 'name',
      header: 'Name',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{`${row.firstName} ${row.lastName}`}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      id: 'companyName',
      header: 'Company',
      searchable: true,
      render: (row: any) => (
        <span className="text-foreground">{row.companyName || '—'}</span>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      render: (row: any) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(row.role)}`}>
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      render: (row: any) => (
        <span className="text-muted-foreground text-sm">{row.phone}</span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Joined',
      render: (row: any) => (
        <span className="text-muted-foreground text-sm">{row.createdAt}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <button className="p-2 hover:bg-muted rounded-md transition-colors" title="View">
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button className="p-2 hover:bg-muted rounded-md transition-colors" title="Edit">
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button className="p-2 hover:bg-destructive/10 rounded-md transition-colors" title="Delete">
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  const sellers = mockUsers.filter(u => u.role === 'seller');
  const buyers = mockUsers.filter(u => u.role === 'buyer');

  const tabs = [
    {
      id: 'all',
      label: `All Users (${mockUsers.length})`,
      content: (
        <DataTable
          columns={userColumns}
          data={mockUsers}
          searchPlaceholder="Search by name or email..."
          onSelectionChange={setSelectedUsers}
        />
      ),
    },
    {
      id: 'sellers',
      label: `Sellers (${sellers.length})`,
      content: (
        <DataTable
          columns={userColumns}
          data={sellers}
          searchPlaceholder="Search sellers..."
          onSelectionChange={setSelectedUsers}
        />
      ),
    },
    {
      id: 'buyers',
      label: `Buyers (${buyers.length})`,
      content: (
        <DataTable
          columns={userColumns}
          data={buyers}
          searchPlaceholder="Search buyers..."
          onSelectionChange={setSelectedUsers}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage sellers, buyers, and platform users</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Selection info */}
        {selectedUsers.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
            <button className="text-xs text-destructive hover:underline">Delete Selected</button>
          </div>
        )}

        {/* Tabs */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Tabs tabs={tabs} variant="underline" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
