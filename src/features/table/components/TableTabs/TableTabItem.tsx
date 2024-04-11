import cx from 'classnames';
import { memo } from 'react';

type Props = {
  item: TableZone;
  active: boolean;
  onClick: (value: string) => void;
};

const TableTabItem = ({ item, active, onClick }: Props) => {
  return (
    <div
      className={cx(
        'pw-flex pw-items-center pw-justify-center pw-w-max pw-px-4 pw-py-3 pw-bg-neutral-divider pw-text-neutral-secondary pw-gap-x-2 pw-rounded  pw-cursor-pointer',
        { '!pw-bg-secondary-main-blue !pw-text-white': active },
      )}
      onClick={() => onClick(item.id)}
    >
      <span className="pw-font-normal pw-text-base">{item.title}</span>
    </div>
  );
};

export default memo(TableTabItem);
