import cx from 'classnames';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'rsuite';
import { useTablesQuery } from '~app/services/queries/useTablesQuery';
import { numberFormat } from '~app/configs';
import { useSelectedTableStore } from '~app/features/table/hooks/useSelectedTable';
import { countTableStatus, defaultTableStatus } from '~app/features/table/utils';
import { TableStatus as Status } from '~app/features/table/constants';
import { removeItemString } from '~app/utils/helpers/arrayHelpers';

type Props = {
  className?: string;
};

const TableStatus = ({ className }: Props) => {
  const { t } = useTranslation('table');
  const [{ selectedZoneId, searchValue, statusTableSelected }, setStore] = useSelectedTableStore((store) => store);
  const { data } = useTablesQuery({ search: searchValue });

  // count available, using table via zone
  const countStatus = useMemo(() => {
    if (selectedZoneId === '')
      return { available: data?.meta.count_table_empty || 0, using: data?.meta.count_table_using || 0 };

    const existed = (data?.data || []).find((item) => item.id === selectedZoneId);
    if (existed) return countTableStatus(existed);

    return defaultTableStatus;
  }, [selectedZoneId, data]);

  const onChange = (status: string, checked: boolean) => {
    let currentStatus: string[];
    if (checked) {
      currentStatus = [...statusTableSelected, status];
    } else {
      currentStatus = removeItemString(statusTableSelected, status);
    }
    return setStore((store) => ({ ...store, statusTableSelected: currentStatus }));
  };

  return (
    <div className={cx(`pw-flex pw-justify-end pw-gap-x-2 xl:pw-mr-4 md: pw-mr-2`, className)}>
      <div className="pw-flex pw-items-center pw-mr-6">
        <Checkbox
          onChange={(_, checked) => {
            onChange(Status.USING, checked);
          }}
        >
          {t('using_table')} ({numberFormat.format(countStatus.using)})
        </Checkbox>
      </div>
      <div className="pw-flex pw-items-center">
        <Checkbox
          onChange={(_, checked) => {
            onChange(Status.AVAILABLE, checked);
          }}
        >
          {t('empty')} ({numberFormat.format(countStatus.available)})
        </Checkbox>
      </div>
    </div>
  );
};

export default memo(TableStatus);
