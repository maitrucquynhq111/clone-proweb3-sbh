import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Divider, Tag } from 'rsuite';
import { StatusInventory } from '~app/features/warehouse/utils';

type Props = {
  status: string;
  staffInfo: InventoryStaffInfo | null;
};

const Title = ({ status, staffInfo }: Props) => {
  const { t } = useTranslation('inventory-export-book-table');
  const getStateName = () => {
    switch (status) {
      case StatusInventory.EMPTY:
      case StatusInventory.COMPLETED:
        return t('status_filter.completed');
      case StatusInventory.PROCESSING:
        return t('status_filter.processing');
      case StatusInventory.CANCELLED:
        return t('status_filter.cancelled');
      default:
        break;
    }
  };

  return (
    <div className="pw-flex pw-items-center">
      <Tag
        className={cx('pw-font-semibold', {
          '!pw-text-success-active !pw-bg-success-background':
            status === StatusInventory.COMPLETED || status === StatusInventory.EMPTY,
          '!pw-text-warning-active !pw-bg-warning-background': status === StatusInventory.PROCESSING,
          '!pw-text-neutral-secondary !pw-bg-neutral-divider': status === StatusInventory.CANCELLED,
        })}
      >
        {getStateName()}
      </Tag>
      <Divider vertical className="!pw-w-0.5" />
      <div>
        <span className="pw-text-sm pw-mr-0.5">{t('created_by')}:</span>
        <span className="pw-text-sm pw-font-semibold">{staffInfo?.staff_name || staffInfo?.phone_number}</span>
      </div>
    </div>
  );
};

export default Title;
