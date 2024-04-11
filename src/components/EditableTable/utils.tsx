import { Table } from 'rsuite';
import CheckboxCell from '~app/components/EditableTable/components/CheckboxCell';
import EditableCell from '~app/components/EditableTable/components/EditableCell';

const { Cell } = Table;

type Params = {
  columnConfig: ExpectedAny[];
  data?: ExpectedAny;
  selectable?: boolean;
  selectableDataKey?: string;
};

const CustomComponent = (props: ExpectedAny) => {
  const Component = props?.cell || null;
  const { isCurrency, isNumber, isForm, cell, ...rest } = props;

  return (
    <Cell
      {...rest}
      style={{
        padding: 0,
      }}
    >
      {Component ? <Component {...rest} isNumber={isNumber} /> : <></>}
    </Cell>
  );
};

export const buildTableColumn = ({ columnConfig, selectable, selectableDataKey = 'id' }: Params) => {
  const result: ExpectedAny[] = [];

  if (selectable) {
    result.push({
      key: selectableDataKey,
      label: '',
      fixed: true,
      width: 55,
      CustomCell: CheckboxCell,
    });
  }

  [...columnConfig]
    .filter((col) => col !== null)
    .forEach((config) => {
      const { cell, isDateTime, isBoolean, isEditable, isForm, tableName, isDecimal, ...params } = config;

      const isCustomCell = typeof config?.cell === 'function';
      // const isDateTimeColumn = isDateTime || false;
      // const isBooleanColumn = isBoolean || false;

      if (isCustomCell) {
        return result.push({
          ...params,
          customcell: (props: ExpectedAny) => {
            const { isNumber, ...rest } = props;
            return <CustomComponent {...rest} cell={cell} />;
          },
        });
      }

      if (isEditable && !isCustomCell) {
        return result.push({
          ...params,
          customcell: (props: ExpectedAny) => {
            const { isNumber, onChange, ...rest } = props;
            const defaultValue = rest.rowData[props.dataKey]?.toString() || '';
            return (
              <EditableCell
                {...rest}
                defaultValue={defaultValue}
                onChange={onChange}
                isNumber={isNumber}
                isDecimal={isDecimal}
                isForm={isForm}
                tableName={tableName}
              />
            );
          },
        });
      }

      if (!isCustomCell) {
        return result.push({
          ...params,
          customcell: (props: ExpectedAny) => {
            const { isCurrency, isNumber, isForm, ...rest } = props;
            return <Cell {...rest} />;
          },
        });
      }
    });
  return result;
};
