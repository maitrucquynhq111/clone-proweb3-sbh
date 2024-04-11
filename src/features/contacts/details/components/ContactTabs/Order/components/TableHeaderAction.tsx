import { memo } from 'react';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';

type Props = {
  options: ExpectedAny;
};

const TableHeaderAction = ({ options }: Props) => {
  return (
    <div className="pw-gap-1 pw-flex">
      <ButtonActionData<Props> options={options} dataType={ExportDataType.ORDER} type={ExportType.DOWNLOAD} />
    </div>
  );
};

export default memo(TableHeaderAction);
