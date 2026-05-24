import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({ data, columns, keyExtractor, emptyMessage = 'No data found.', className }: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm ${className ?? ''}`}>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-6 py-4 ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-6 py-4 ${col.className ?? ''}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as any)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}