import * as React from 'react';
import { Phone, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Tabs } from '@/components/Tabs';

// Mock data
const mockChats = [
  {
    id: 'chat_001',
    chatId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    productName: 'Samsung Galaxy A25',
    buyer: 'John Doe',
    seller: 'Tech Corp',
    status: 'active',
    lastMessage: 'Is this still available?',
    lastMessageTime: '2024-01-15 14:30',
    unreadCount: 2,
  },
  {
    id: 'chat_002',
    chatId: 'b2c3d4e5-f6789012-bcde-f1234567890a',
    productName: 'Wireless Headphones',
    buyer: 'Jane Smith',
    seller: 'Electronics Hub',
    status: 'active',
    lastMessage: 'What\'s the warranty period?',
    lastMessageTime: '2024-01-15 12:15',
    unreadCount: 0,
  },
  {
    id: 'chat_003',
    chatId: 'c3d4e5f6-7890123c-def-1234567890ab',
    productName: 'Organic Cotton T-Shirt',
    buyer: 'Bob Johnson',
    seller: 'Fashion Store',
    status: 'resolved',
    lastMessage: 'Thanks, order placed!',
    lastMessageTime: '2024-01-14 16:45',
    unreadCount: 0,
  },
  {
    id: 'chat_004',
    chatId: 'd4e5f6a7-8901234d-efg-1234567890bc',
    productName: 'Camera Tripod',
    buyer: 'Alice Williams',
    seller: 'Electronics Hub',
    status: 'pending',
    lastMessage: 'When will it be restocked?',
    lastMessageTime: '2024-01-14 10:20',
    unreadCount: 1,
  },
  {
    id: 'chat_005',
    chatId: 'e5f6a7b8-9012345e-fgh-1234567890cd',
    productName: 'Water Bottle',
    buyer: 'Charlie Brown',
    seller: 'Home Goods',
    status: 'escalated',
    lastMessage: 'Product not as described',
    lastMessageTime: '2024-01-13 09:00',
    unreadCount: 3,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-blue-500/20 text-blue-600';
    case 'resolved':
      return 'bg-success/20 text-success';
    case 'pending':
      return 'bg-orange-500/20 text-orange-600';
    case 'escalated':
      return 'bg-destructive/20 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Phone className="h-4 w-4 inline mr-1" />;
    case 'resolved':
      return <CheckCircle2 className="h-4 w-4 inline mr-1" />;
    case 'pending':
      return <Clock className="h-4 w-4 inline mr-1" />;
    case 'escalated':
      return <AlertCircle className="h-4 w-4 inline mr-1" />;
    default:
      return null;
  }
};

export const SupportPage: React.FC = () => {
  const [selectedChats, setSelectedChats] = React.useState<string[]>([]);

  const columns = [
    {
      id: 'productName',
      header: 'Product',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.productName}</p>
          <p className="text-xs text-muted-foreground">Chat ID: {row.chatId.substring(0, 8)}...</p>
        </div>
      ),
    },
    {
      id: 'buyer',
      header: 'Buyer',
      searchable: true,
      render: (row: any) => (
        <span className="text-sm text-foreground">{row.buyer}</span>
      ),
    },
    {
      id: 'seller',
      header: 'Seller',
      searchable: true,
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.seller}</span>
      ),
    },
    {
      id: 'lastMessage',
      header: 'Last Message',
      searchable: true,
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {row.unreadCount > 0 && (
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          )}
          <span className="text-sm text-muted-foreground line-clamp-1">
            {row.lastMessage}
          </span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(row.status)}`}>
          {getStatusIcon(row.status)}
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      id: 'lastMessageTime',
      header: 'Last Activity',
      render: (row: any) => (
        <span className="text-muted-foreground text-sm">{row.lastMessageTime}</span>
      ),
    },
  ];

  const allChats = mockChats;
  const activeChats = mockChats.filter(c => c.status === 'active');
  const resolvedChats = mockChats.filter(c => c.status === 'resolved');
  const escalatedChats = mockChats.filter(c => c.status === 'escalated');

  const tabs = [
    {
      id: 'all',
      label: `All Chats (${allChats.length})`,
      content: (
        <DataTable
          columns={columns}
          data={allChats}
          searchPlaceholder="Search chats..."
          onSelectionChange={setSelectedChats}
        />
      ),
    },
    {
      id: 'active',
      label: `Active (${activeChats.length})`,
      content: (
        <DataTable
          columns={columns}
          data={activeChats}
          searchPlaceholder="Search active chats..."
          onSelectionChange={setSelectedChats}
        />
      ),
    },
    {
      id: 'resolved',
      label: `Resolved (${resolvedChats.length})`,
      content: (
        <DataTable
          columns={columns}
          data={resolvedChats}
          searchPlaceholder="Search resolved chats..."
          onSelectionChange={setSelectedChats}
        />
      ),
    },
    {
      id: 'escalated',
      label: `Escalated (${escalatedChats.length})`,
      content: (
        <DataTable
          columns={columns}
          data={escalatedChats}
          searchPlaceholder="Search escalated chats..."
          onSelectionChange={setSelectedChats}
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Customer Support</h1>
          <p className="text-muted-foreground mt-1">Manage buyer-seller conversations and resolve issues</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Chats', value: allChats.length.toString(), color: 'bg-blue-500/10' },
            { label: 'Active', value: activeChats.length.toString(), color: 'bg-green-500/10' },
            { label: 'Resolved', value: resolvedChats.length.toString(), color: 'bg-success/10' },
            { label: 'Escalated', value: escalatedChats.length.toString(), color: 'bg-destructive/10' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-lg ${stat.color} p-4 border border-border`}>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chats Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <Tabs tabs={tabs} variant="underline" />
        </div>

        {/* Selection info */}
        {selectedChats.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm text-foreground">
              {selectedChats.length} chat{selectedChats.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 hover:bg-primary/20 rounded transition-colors text-primary">
                Mark as Resolved
              </button>
              <button className="text-xs px-3 py-1 hover:bg-destructive/20 rounded transition-colors text-destructive">
                Escalate
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupportPage;
