import { InnerCellProps } from 'rsuite-table/lib/Cell';
import { Table } from 'rsuite/';
import { AutoResizeInput } from '~app/components/FormControls';

const { Cell } = Table;

type Props = {
  onChange?: ExpectedAny;
  onBlur?: ExpectedAny;
  defaultValue?: string;
  isNumber?: boolean;
  isForm?: boolean;
  tableName?: string;
} & InnerCellProps;

const EditableCell = ({
  rowData,
  rowIndex,
  onBlur,
  onChange,
  isNumber,
  isForm,
  defaultValue = '',
  tableName,
  ...props
}: Props) => {
  const dataKey = props.dataKey || '';
  const error = rowData?.error?.[dataKey];
  const name = tableName ? `${tableName}.${rowIndex}.${dataKey}` : '';

  const handleChange = (value: string) => {
    onChange && onChange(rowIndex, props.dataKey, value);
  };

  const handleBlur = (value: string) => {
    onBlur && onBlur(rowIndex, props.dataKey, value);
  };

  return (
    <Cell {...props} align={isNumber ? 'right' : 'left'}>
      <AutoResizeInput
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        defaultValue={defaultValue}
        placeholder={isNumber ? '0' : ''}
        isForm={isForm}
        isNumber={isNumber}
      />
    </Cell>
  );
};

export default EditableCell;
