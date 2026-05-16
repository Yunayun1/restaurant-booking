export interface TableRecord {
  id?: string;
  tableCode?: string;
  number?: number;
  customerName?: string;
  date?: string;
  time?: string;
  capacity?: number;
  status?: string;
  tableNumber?: string;
  people?: number;
}

const toDateTime = (table: TableRecord): Date | null => {
  if (!table?.date) return null;
  const time = table.time || "00:00";
  const dateTime = new Date(`${table.date}T${time}`);
  return Number.isNaN(dateTime.getTime()) ? null : dateTime;
};

export const getTableCode = (table: TableRecord): string => {
  if (table?.tableCode) return table.tableCode;
  if (table?.number !== undefined && table.number !== null) return `TB-${String(table.number).padStart(2, "0")}`;
  return table?.tableNumber ?? "TB-00";
};

export const getUpcomingTables = (
  tables: TableRecord[],
  now: Date = new Date(),
  maxItems = 5
): TableRecord[] => {
  return tables
    .filter((table) => {
      const tableDate = toDateTime(table);
      return tableDate !== null && tableDate >= now;
    })
    .sort((a, b) => {
      const aDate = toDateTime(a)!;
      const bDate = toDateTime(b)!;
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, maxItems);
};
