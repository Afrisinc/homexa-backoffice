import * as React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/Button';
import { usersAPI } from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tin: string;
  companyName: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<User[]>([]);
  const [paginationData, setPaginationData] = React.useState<PaginationData['pagination'] | null>(null);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const LIMIT = 10;

  const fetchUsers = React.useCallback(async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersAPI.getAll(page, LIMIT, search);
      setUsers(response.data || []);
      setPaginationData(response.pagination || null);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers(1, '');
  }, [fetchUsers]);

  const handlePageChange = React.useCallback((page: number) => {
    fetchUsers(page, searchTerm);
  }, [fetchUsers, searchTerm]);

  const userColumns = [
    {
      id: 'email',
      header: 'Name',
      searchable: true,
      render: (row: User) => (
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
      render: (row: User) => (
        <span className="text-foreground">{row.companyName || '—'}</span>
      ),
    },
    {
      id: 'phone',
      header: 'Phone',
      render: (row: User) => (
        <span className="text-muted-foreground text-sm">{row.phone}</span>
      ),
    },
    {
      id: 'tin',
      header: 'TIN',
      render: (row: User) => (
        <span className="text-muted-foreground text-sm">{row.tin || '—'}</span>
      ),
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      render: (row: User) => (
        <span className="text-muted-foreground text-sm">
          {row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Joined',
      render: (row: User) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Updated',
      render: (row: User) => (
        <span className="text-muted-foreground text-sm">
          {new Date(row.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (row: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/users/${row.id}/view`)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => navigate(`/dashboard/users/${row.id}/edit`)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
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
          <Button
            className="flex items-center gap-2"
            onClick={() => navigate('/dashboard/users/create')}
          >
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

        {/* Error state */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={userColumns}
                data={users}
                searchPlaceholder="Search by name or email..."
                onSelectionChange={setSelectedUsers}
              />

              {/* Pagination */}
              {paginationData && (
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {paginationData.page} of {paginationData.totalPages} ({paginationData.totalItems} total users)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!paginationData.hasPrev}
                      className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!paginationData.hasNext}
                      className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
