import type { ReactNode } from 'react';
import { useState } from 'react';
import { Checkbox } from '@/components/Checkbox';

interface TableColumn {
  id: string;
  header: string;
  render: (row: any) => ReactNode;
  width?: string;
  sortable?: boolean;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSelectionChange?: (selectedIds: string[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  striped?: boolean;
  hover?: boolean;
}

export const Table = ({
  columns,
  data,
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hover = true,
}: TableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map((row) => row.id);
      setSelectedRows(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev: string[]) => {
      const newSelected = checked ? [...prev, id] : prev.filter((rowId) => rowId !== id);
      onSelectionChange?.(newSelected);
      return newSelected;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-border rounded-lg bg-card/50">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {onSelectionChange && (
              <th className="w-12 px-4 py-3 text-left">
                <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${
                  column.width ? `w-${column.width}` : ''
                } ${column.sortable ? 'cursor-pointer hover:bg-muted/70 transition-colors' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && <span className="text-xs">⇅</span>}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`border-b border-border transition-colors ${
                striped && idx % 2 === 0 ? 'bg-muted/20' : ''
              } ${hover ? 'hover:bg-muted/40' : ''}`}
            >
              {onSelectionChange && (
                <td className="px-4 py-3">
                  <Checkbox onChange={(e) => handleSelectRow(row.id, e.target.checked)} />
                </td>
              )}
              {columns.map((column) => (
                <td key={`${row.id}-${column.id}`} className="px-4 py-3 text-sm text-foreground">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
