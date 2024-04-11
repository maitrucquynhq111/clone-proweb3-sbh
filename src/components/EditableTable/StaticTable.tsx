import { memo, useMemo } from 'react';
import { Table } from 'rsuite';
import { buildTableColumn } from '~app/components/EditableTable/utils';

const { Column, HeaderCell } = Table;

type Props = {
  data: ExpectedAny[];
  columnConfig: ExpectedAny[];
  selectable?: boolean;
  autoHeight?: boolean;
  shouldUpdateScroll?: boolean;
  selectableDataKey?: string;
  rowHeight?: number;
  rowKey?: string;
  height?: number;
  className?: string;
  loading?: boolean;
  handleScroll?: (x: ExpectedAny, y: ExpectedAny) => void;
};

const StaticTable = ({
  data,
  columnConfig,
  selectable,
  autoHeight = true,
  shouldUpdateScroll = true,
  selectableDataKey,
  height,
  loading,
  rowHeight = 56,
  rowKey = 'name',
  className,
  handleScroll,
}: Props) => {
  const columns = useMemo(() => {
    return buildTableColumn({
      columnConfig,
      selectable,
      selectableDataKey,
    });
  }, [columnConfig, selectable, selectableDataKey]);

  return (
    <>
      <Table
        bordered
        autoHeight={autoHeight}
        cellBordered
        height={height}
        affixHorizontalScrollbar
        rowKey={rowKey}
        rowHeight={rowHeight}
        data={data}
        loading={loading}
        className={className}
        wordWrap="break-word"
        onScroll={handleScroll}
        shouldUpdateScroll={shouldUpdateScroll}
      >
        {columns.map((column) => {
          const { customcell: CustomCell, isNumber, required, onCellChange, onCellBlur, ...props } = column;
          return (
            <Column key={column.key} {...props} verticalAlign="middle">
              <HeaderCell>
                {column.label} {required ? <span className="pw-text-red-600">*</span> : null}
              </HeaderCell>
              <CustomCell dataKey={column.key} isNumber={isNumber} onChange={onCellChange} onBlur={onCellBlur} />
            </Column>
          );
        })}
      </Table>
    </>
  );
};

export default memo(StaticTable);
