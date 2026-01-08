import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';

interface DataTableColumn {
  id: string;
  header: string;
  render: (row: any) => ReactNode;
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  searchPlaceholder?: string;
  onSelectionChange?: (selectedIds: string[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hover?: boolean;
}

export const DataTable = ({
  columns,
  data,
  searchPlaceholder = 'Search...',
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hover = true,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const searchableColumns = useMemo(() => columns.filter((col) => col.searchable), [columns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      searchableColumns.some((col) => {
        const value = row[col.id];
        return value ? String(value).toLowerCase().includes(searchTerm.toLowerCase()) : false;
      })
    );
  }, [data, searchTerm, searchableColumns]);

  return (
    <div className="space-y-4">
      {searchableColumns.length > 0 && (
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <Table
        columns={columns}
        data={filteredData}
        onSelectionChange={onSelectionChange}
        loading={loading}
        emptyMessage={emptyMessage}
        striped={striped}
        hover={hover}
      />
    </div>
  );
};
