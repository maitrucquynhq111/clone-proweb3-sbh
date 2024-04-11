import { InnerCellProps } from 'rsuite-table/lib/Cell';
import { Checkbox, Table } from 'rsuite/';

const { Cell } = Table;

type Props = {
  onChange: ExpectedAny;
  dataKey: string;
  rowData: ExpectedAny;
  checked: boolean;
} & Omit<InnerCellProps, 'dataKey' | 'rowData'>;

const CheckboxCell = ({ rowData, dataKey, onChange, ...props }: Props) => {
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div className="pw-leading-10">
        <Checkbox value={rowData[dataKey]} inline onChange={onChange} checked={props.checked} />
      </div>
    </Cell>
  );
};

export default CheckboxCell;
