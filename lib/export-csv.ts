interface CsvRow {
  [key: string]: string | number | boolean | null | undefined;
}

export function generateCsv(rows: CsvRow[], columns: { key: string; label: string }[]): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");

  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        if (val === null || val === undefined) return "";
        return escapeCsvField(String(val));
      })
      .join(",")
  );

  return [header, ...lines].join("\n");
}

function escapeCsvField(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
