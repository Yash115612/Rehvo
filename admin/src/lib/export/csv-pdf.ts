/**
 * REHVO Admin Client Data Export Utility
 * Supports CSV export with proper escaping and formatting
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const keys = columns ? columns.map((c) => c.key) : (Object.keys(data[0]) as (keyof T)[]);
  const headers = columns ? columns.map((c) => c.label) : keys.map((k) => String(k).toUpperCase());

  const csvRows: string[] = [];
  csvRows.push(headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','));

  data.forEach((row) => {
    const values = keys.map((k) => {
      const val = row[k];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printOrExportPDF(elementId?: string, title: string = 'REHVO Report'): void {
  window.print();
}
