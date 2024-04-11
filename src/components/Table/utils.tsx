import Table from 'rsuite/Table';
import Checkbox from 'rsuite/Checkbox';
import cx from 'classnames';
import { formatDateToString } from '~app/utils/helpers';

const { Cell } = Table;

const isArrayOrObjectColumn = (value: ExpectedAny) => Array.isArray(value) || typeof value === 'object' || false;

export const buildTableColumns = (
  columnOptions: ExpectedAny,
  data?: ExpectedAny,
  selectable?: boolean,
  dataKey = 'id',
): ExpectedAny => {
  if (!data) return [];
  const formatColumnOptions: ExpectedAny = Object.fromEntries(
    Object.entries(columnOptions).filter(([, v]) => v != null),
  );
  const dataColumns = Object.keys(formatColumnOptions);
  const result: ExpectedAny = [];

  const dataGridDisplayColumn = dataColumns.reduce(
    (pre: Record<string, null>, cur: string) => ({ ...pre, [cur]: null }),
    {},
  );

  if (selectable) {
    result.push({
      key: dataKey,
      label: '',
      fixed: true,
      width: 55,
      Cell: (props: ExpectedAny) => {
        const { checkedKeys, className, justifyContent, ...rest } = props || {};
        const fieldValue = rest.rowData;
        const onSelect = rest?.onSelect;
        const isSelected = checkedKeys.includes(props.rowData[dataKey]);
        return (
          <Cell
            {...rest}
            dataKey={dataKey}
            style={{ padding: 0 }}
            className={cx(className, {
              ['!pw-bg-gray-50']: isSelected,
            })}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="pw-leading-10 pw-h-full pw-flex pw-items-center"
            >
              <Checkbox
                checked={(checkedKeys || []).some((item: ExpectedAny) => item === props.rowData[dataKey])}
                inline
                value={fieldValue}
                onChange={onSelect}
              />
            </div>
          </Cell>
        );
      },
    });
  }

  Object.keys(dataGridDisplayColumn).forEach((columnName) => {
    const defaultColumn: ExpectedAny = {
      key: columnName,
      label: formatColumnOptions?.[columnName]?.label || columnName,
      ...formatColumnOptions?.[columnName],
      Cell: (props: ExpectedAny) => {
        const { checkedKeys, className, justifyContent, onSelect, ...rest } = props;
        const fieldValue = props.rowData[columnName];
        const checkIsArrayOrObjectColumn = isArrayOrObjectColumn(fieldValue);

        const isSelected = checkedKeys.includes(props.rowData[dataKey]);
        return (
          <Cell
            {...rest}
            dataKey={columnName}
            className={cx(className, {
              ['!pw-bg-gray-50']: isSelected,
            })}
          >
            {checkIsArrayOrObjectColumn ? JSON.stringify(fieldValue) : fieldValue}
          </Cell>
        );
      },
    };

    const isCustomCell = typeof formatColumnOptions?.[columnName]?.cell === 'function';

    const isDateTimeColumn = formatColumnOptions?.[columnName]?.isDateTime || false;
    const isBooleanColumn = formatColumnOptions?.[columnName]?.isBoolean || false;

    if (isDateTimeColumn && !isCustomCell) {
      return result.push({
        ...defaultColumn,
        Cell: (props: ExpectedAny) => {
          const { checkedKeys, className, justifyContent, onSelect, ...rest } = props;
          const fieldValue = props.rowData[columnName];
          const isSelected = checkedKeys.includes(props.rowData[dataKey]);
          return (
            <Cell
              {...rest}
              dataKey={columnName}
              className={cx(className, {
                ['!pw-bg-gray-50']: isSelected,
              })}
            >
              {formatDateToString(fieldValue, 'dd/MM/yyyy HH:mm')}
            </Cell>
          );
        },
      });
    }

    if (isBooleanColumn && !isCustomCell) {
      return result.push({
        ...defaultColumn,
        Cell: (props: ExpectedAny) => {
          const { checkedKeys, className, justifyContent, onSelect, ...rest } = props;
          const fieldValue = props.rowData[columnName];
          const isSelected = checkedKeys.includes(props.rowData[dataKey]);
          return (
            <Cell
              {...rest}
              dataKey={columnName}
              className={cx(className, {
                ['!pw-bg-gray-50']: isSelected,
              })}
            >
              {fieldValue ? 'checked' : 'unchecked'}
            </Cell>
          );
        },
      });
    }

    if (isCustomCell) {
      return result.push({
        ...defaultColumn,
        ...formatColumnOptions[columnName],
        Cell: (props: ExpectedAny) => {
          const { checkedKeys, className, justifyContent, onSelect, ...rest } = props;
          const Component = rest?.cell || null;
          const isSelected = checkedKeys.includes(props.rowData[dataKey]);
          return (
            <Cell
              {...rest}
              dataKey={columnName}
              style={{
                padding: 0,
                display: 'flex',
                justifyContent: justifyContent ? justifyContent : 'center',
                alignItems: 'center',
              }}
              className={cx(className, {
                ['!pw-bg-gray-50']: isSelected,
              })}
            >
              {Component ? <Component {...rest} className={className} /> : <></>}
            </Cell>
          );
        },
      });
    }

    if (!isCustomCell) {
      return result.push(defaultColumn);
    }
  });
  return result;
};
