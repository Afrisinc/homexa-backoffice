import * as React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
  Zap,
  Eye,
  MessageSquare,
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Tabs } from '@/components/Tabs';
import { DataTable } from '@/components/DataTable';

// Mock analytics data
const mockMetrics = [
  {
    title: 'Total Revenue',
    value: '$125,430.50',
    change: '+28.5%',
    trend: 'up',
    icon: <DollarSign className="h-6 w-6" />,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'Total Orders',
    value: '3,482',
    change: '+12.3%',
    trend: 'up',
    icon: <ShoppingCart className="h-6 w-6" />,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Active Users',
    value: '2,156',
    change: '+8.2%',
    trend: 'up',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Product Views',
    value: '45,230',
    change: '+15.7%',
    trend: 'up',
    icon: <Eye className="h-6 w-6" />,
    color: 'bg-orange-500/10 text-orange-600',
  },
  {
    title: 'Avg Order Value',
    value: '$358.92',
    change: '+5.4%',
    trend: 'up',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-pink-500/10 text-pink-600',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-2.1%',
    trend: 'down',
    icon: <TrendingDown className="h-6 w-6" />,
    color: 'bg-red-500/10 text-red-600',
  },
];

// Mock system health data
const mockSystemHealth = [
  {
    id: '1',
    service: 'API Server',
    status: 'healthy',
    uptime: '99.98%',
    responseTime: '42ms',
    requestCount: '1.2M',
    lastChecked: '2024-01-16 14:23',
  },
  {
    id: '2',
    service: 'Database',
    status: 'healthy',
    uptime: '99.95%',
    responseTime: '28ms',
    requestCount: '4.8M',
    lastChecked: '2024-01-16 14:23',
  },
  {
    id: '3',
    service: 'Cache Service',
    status: 'healthy',
    uptime: '99.99%',
    responseTime: '5ms',
    requestCount: '12.3M',
    lastChecked: '2024-01-16 14:23',
  },
  {
    id: '4',
    service: 'Search Engine',
    status: 'warning',
    uptime: '98.42%',
    responseTime: '156ms',
    requestCount: '850K',
    lastChecked: '2024-01-16 14:22',
  },
  {
    id: '5',
    service: 'Queue Service',
    status: 'healthy',
    uptime: '99.97%',
    responseTime: '15ms',
    requestCount: '3.4M',
    lastChecked: '2024-01-16 14:23',
  },
];

// Mock recent activity
const mockRecentActivity = [
  {
    id: '1',
    type: 'order',
    description: 'New order placed by John Doe',
    timestamp: '2024-01-16 14:45',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: '2',
    type: 'user',
    description: 'New seller registered: Tech Solutions Inc',
    timestamp: '2024-01-16 14:38',
    icon: <Users className="h-4 w-4" />,
  },
  {
    id: '3',
    type: 'escalation',
    description: 'Support ticket escalated by admin',
    timestamp: '2024-01-16 14:32',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: '4',
    type: 'product',
    description: 'Product "Wireless Headphones" out of stock',
    timestamp: '2024-01-16 14:25',
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: '5',
    type: 'message',
    description: 'Chat support resolved 8 conversations',
    timestamp: '2024-01-16 14:18',
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

// Mock sales data for chart
const mockSalesData = [
  { date: 'Jan 1', sales: 2400, orders: 240 },
  { date: 'Jan 2', sales: 1398, orders: 221 },
  { date: 'Jan 3', sales: 9800, orders: 229 },
  { date: 'Jan 4', sales: 3908, orders: 200 },
  { date: 'Jan 5', sales: 4800, orders: 218 },
  { date: 'Jan 6', sales: 3800, orders: 250 },
  { date: 'Jan 7', sales: 4300, orders: 210 },
  { date: 'Jan 8', sales: 5280, orders: 270 },
  { date: 'Jan 9', sales: 6100, orders: 290 },
  { date: 'Jan 10', sales: 7240, orders: 310 },
];

// Mock top sellers
const mockTopSellers = [
  {
    id: '1',
    name: 'Tech Solutions Inc',
    totalSales: '$28,450',
    products: 145,
    rating: 4.8,
    orders: 523,
  },
  {
    id: '2',
    name: 'Electronics Hub',
    totalSales: '$24,320',
    products: 98,
    rating: 4.6,
    orders: 412,
  },
  {
    id: '3',
    name: 'Fashion Store',
    totalSales: '$19,840',
    products: 234,
    rating: 4.5,
    orders: 356,
  },
  {
    id: '4',
    name: 'Home Goods Plus',
    totalSales: '$15,670',
    products: 87,
    rating: 4.7,
    orders: 289,
  },
  {
    id: '5',
    name: 'Organic Market',
    totalSales: '$12,430',
    products: 156,
    rating: 4.4,
    orders: 187,
  },
];

const MetricCard = ({ metric }: { metric: (typeof mockMetrics)[0] }) => (
  <div className={`rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {metric.title}
        </p>
        <p className="text-2xl font-bold text-foreground mt-3">{metric.value}</p>
        <div className="flex items-center gap-1 mt-2">
          {metric.trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
          <p className={`text-xs font-medium ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            {metric.change}
          </p>
          <span className="text-xs text-muted-foreground">from last month</span>
        </div>
      </div>
      <div className={`${metric.color} p-3 rounded-lg`}>{metric.icon}</div>
    </div>
  </div>
);

export const AnalyticsPage: React.FC = () => {
  const systemHealthColumns = [
    {
      id: 'service',
      header: 'Service',
      searchable: true,
      render: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.service}</p>
          <p className="text-xs text-muted-foreground">Last checked: {row.lastChecked}</p>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'healthy' ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              <span className="text-sm font-medium text-success">Healthy</span>
            </>
          ) : (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-orange-600">Warning</span>
            </>
          )}
        </div>
      ),
    },
    {
      id: 'uptime',
      header: 'Uptime',
      render: (row: any) => (
        <span className="font-semibold text-foreground">{row.uptime}</span>
      ),
    },
    {
      id: 'responseTime',
      header: 'Response Time',
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.responseTime}</span>
      ),
    },
    {
      id: 'requestCount',
      header: 'Request Count',
      render: (row: any) => (
        <span className="font-medium text-foreground">{row.requestCount}</span>
      ),
    },
  ];

  const topSellersColumns = [
    {
      id: 'name',
      header: 'Seller',
      searchable: true,
      render: (row: any) => (
        <span className="font-medium text-foreground">{row.name}</span>
      ),
    },
    {
      id: 'rating',
      header: 'Rating',
      render: (row: any) => (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-foreground">{row.rating}</span>
          <span className="text-yellow-500">★</span>
        </div>
      ),
    },
    {
      id: 'products',
      header: 'Products',
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">{row.products}</span>
      ),
    },
    {
      id: 'orders',
      header: 'Orders',
      render: (row: any) => (
        <span className="font-medium text-foreground">{row.orders}</span>
      ),
    },
    {
      id: 'totalSales',
      header: 'Total Sales',
      render: (row: any) => (
        <span className="font-semibold text-success">{row.totalSales}</span>
      ),
    },
  ];

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockMetrics.map((metric) => (
              <MetricCard key={metric.title} metric={metric} />
            ))}
          </div>

          {/* Chart Section */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Sales Trend (Last 10 Days)</h3>
              <p className="text-sm text-muted-foreground">Daily sales and order volume</p>
            </div>

            {/* Simple ASCII Chart */}
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 gap-2 px-4 py-6 bg-muted/20 rounded-lg">
                {mockSalesData.map((data, idx) => {
                  const maxSales = Math.max(...mockSalesData.map((d) => d.sales));
                  const heightPercent = (data.sales / maxSales) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all hover:from-primary/80"
                        style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                        title={`$${data.sales}`}
                      />
                      <span className="text-xs text-muted-foreground">{data.date}</span>
                    </div>
                  );
                })}
              </div>

              {/* Sales Summary Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-3 py-2 text-muted-foreground font-medium">Date</th>
                      <th className="text-right px-3 py-2 text-muted-foreground font-medium">Sales</th>
                      <th className="text-right px-3 py-2 text-muted-foreground font-medium">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSalesData.map((data, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-3 py-2 text-foreground">{data.date}</td>
                        <td className="text-right px-3 py-2 font-semibold text-success">${data.sales}</td>
                        <td className="text-right px-3 py-2 font-medium text-foreground">{data.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Sellers */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Sellers</h3>
              <DataTable
                columns={topSellersColumns}
                data={mockTopSellers}
                searchPlaceholder="Search sellers..."
              />
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                    <div className="flex-shrink-0 mt-1 text-muted-foreground">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'system-health',
      label: 'System Health',
      content: (
        <div className="space-y-6">
          {/* System Status Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <p className="text-sm font-medium text-muted-foreground">Healthy Services</p>
              </div>
              <p className="text-2xl font-bold text-foreground">4/5</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <p className="text-sm font-medium text-muted-foreground">Warning</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">1/5</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
              </div>
              <p className="text-2xl font-bold text-foreground">49.2ms</p>
            </div>
          </div>

          {/* System Services Table */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Service Status</h3>
            <DataTable
              columns={systemHealthColumns}
              data={mockSystemHealth}
              searchPlaceholder="Search services..."
            />
          </div>

          {/* Alerts */}
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6 shadow-sm">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">Search Engine Warning</h4>
                <p className="text-sm text-orange-600/80">
                  Search engine response time is higher than usual (156ms). Consider scaling resources or
                  investigating query performance.
                </p>
                <button className="mt-3 text-xs px-3 py-1 rounded bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 font-medium transition-colors">
                  View Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      content: (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* API Performance */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">API Performance</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Average Response Time</p>
                  <p className="text-3xl font-bold text-foreground">42ms</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-success rounded-full" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Error Rate</p>
                  <p className="text-3xl font-bold text-success">0.02%</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/12 bg-success rounded-full" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-success">99.98%</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '99.98%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Database Performance */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Database Performance</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Query Time</p>
                  <p className="text-3xl font-bold text-foreground">28ms</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-primary rounded-full" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Connections Used</p>
                  <p className="text-3xl font-bold text-foreground">145/200</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '72.5%' }} />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Cache Hit Rate</p>
                  <p className="text-3xl font-bold text-success">94.2%</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">Storage & Capacity</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Database Storage</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">238 GB / 500 GB</span>
                    <span className="text-muted-foreground">47.6%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '47.6%' }} />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">File Storage</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">185 GB / 300 GB</span>
                    <span className="text-muted-foreground">61.7%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '61.7%' }} />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Cache Storage</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">42 GB / 128 GB</span>
                    <span className="text-muted-foreground">32.8%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '32.8%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Monitor marketplace performance and system health</p>
        </div>

        {/* Main Tabs */}
        <Tabs tabs={tabs} variant="underline" />
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
