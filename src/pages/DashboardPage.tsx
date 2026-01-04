import * as React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your dashboard</p>
        </div>

        {/* Placeholder content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="h-20 w-full rounded-lg bg-muted animate-pulse" />
              <div className="mt-4 h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
