import createFastContext from './createFastContext';
import { TABLE_COLUMNS } from '~app/configs';

type TableColumnStore = {
  table_columns: TableColumns;
};

function getLocalTableColumns() {
  try {
    const tableColumns = JSON.parse(window.localStorage.getItem(TABLE_COLUMNS) || '') as TableColumns;
    if (!tableColumns) {
      throw new Error('Invalid cache');
    }
    return tableColumns;
  } catch (error) {
    return {};
  }
}

export const { Provider: TableColumnsProvider, useStore: useTableColumnsStore } = createFastContext<TableColumnStore>({
  table_columns: getLocalTableColumns(),
});
