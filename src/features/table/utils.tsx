import { TableStatus } from './constants';

export const initialTable = (): PendingTable => ({
  selectedZoneId: '',
  searchValue: '',
  statusTableSelected: [],
});

export const countTableStatus = (zone: Table) => {
  const available = zone.tables.reduce((acc, curr) => (curr.status === TableStatus.AVAILABLE ? acc + 1 : acc), 0);
  const using = zone.tables.reduce((acc, curr) => (curr.status === TableStatus.USING ? acc + 1 : acc), 0);
  return { available, using };
};

export const countAvailableTable = (tables: TableItem[]) => {
  return tables.reduce((acc, curr) => {
    const count = curr.status === TableStatus.AVAILABLE ? 1 : 0;
    return acc + count;
  }, 0);
};

export const filterTableStatus = (dataTables: Table[], status: string[]) => {
  if (status.length === 0 || status.length === Object.keys(TableStatus).length) return dataTables;

  return dataTables.map((zone: Table) => {
    return { ...zone, tables: (zone.tables || []).filter((table: TableItem) => status.includes(table.status)) };
  });
};

export const countTablesInZone = (data: Table[]) => data.reduce((acc, curr) => acc + curr.tables.length, 0);

export const defaultTableStatus = { available: 0, using: 0 };
