import { memo } from 'react';
import { ButtonActionData, ExportDataType, ExportType } from '~app/components/ButtonActionData';

const TableHeaderAction = ({ options }: ExpectedAny) => {
  return (
    <div className="pw-gap-1 pw-flex">
      <ButtonActionData<{ search?: string }> dataType={ExportDataType.ORDER} type={ExportType.VIEW} options={options} />
      <ButtonActionData<{ search?: string }>
        dataType={ExportDataType.ORDER}
        type={ExportType.DOWNLOAD}
        options={options}
      />
    </div>
  );
};

export default memo(TableHeaderAction);
