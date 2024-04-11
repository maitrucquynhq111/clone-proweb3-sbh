import cx from 'classnames';
import { Tag } from 'rsuite';

type Props = {
  item: ExpectedAny;
  itemData: ExpectedAny;
  showLabel?: boolean;
  className?: string;
  onClose: () => void;
};

const FilterDataItem = ({ item, itemData, showLabel = true, className, onClose }: Props) => {
  return (
    <Tag
      onClose={onClose}
      className={cx('pw-mr-1 pw-font-bold !pw-bg-secondary-background pw-overflow-hidden', className)}
      closable
    >
      <span className="!pw-text-main pw-text-sm line-clamp-1 pw-text-ellipsis">
        {showLabel && (
          <>
            {item.label}: <span className="!pw-text-main"></span>
          </>
        )}
        {itemData}
      </span>
    </Tag>
  );
};

export default FilterDataItem;
