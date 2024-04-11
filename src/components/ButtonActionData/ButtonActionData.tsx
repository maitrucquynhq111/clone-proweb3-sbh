import { Button } from 'rsuite';
import { ButtonExportTableProps, ExportTypeIcon } from './types';
import { useExportData } from './utils';

function ButtonExportData<OptionsType>({
  title,
  dataType,
  options,
  type,
  size,
  appearance = 'default',
  className = '',
}: ButtonExportTableProps<OptionsType>) {
  const { loading, handleExport } = useExportData();

  return (
    <Button
      onClick={() => {
        handleExport(type, dataType, options);
      }}
      className={className}
      size={size || 'sm'}
      appearance={appearance || 'default'}
      loading={loading}
      disabled={loading}
      startIcon={ExportTypeIcon[type]}
    >
      {title && title}
    </Button>
  );
}

export default ButtonExportData;
