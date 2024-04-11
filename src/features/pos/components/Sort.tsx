import { useSyncExternalStore, memo } from 'react';
import { BsSortDownAlt } from 'react-icons/bs';
import cx from 'classnames';
import { IconButton, Popover, Whisper } from 'rsuite';
import { useOfflineContext } from '../context/OfflineContext';
import { RequestType } from '../constants';
import { filterProductStore } from '~app/features/pos/stores';

const data = [
  {
    label: 'Giá (Thấp dần)',
    value: JSON.stringify({
      sortBy: 'normal_price',
      sortValue: 'desc',
    }),
  },
  {
    label: 'Giá (Cao dần)',
    value: JSON.stringify({
      sortBy: 'normal_price',
      sortValue: 'asc',
    }),
  },
  {
    label: 'Tên (A-Z)',
    value: JSON.stringify({
      sortBy: 'name',
      sortValue: 'desc',
    }),
  },
  {
    label: 'Tên (Z-A)',
    value: JSON.stringify({
      sortBy: 'name',
      sortValue: 'asc',
    }),
  },
  {
    label: 'Mới nhất',
    value: JSON.stringify({
      sortBy: 'created_at',
      sortValue: 'desc',
    }),
  },
  {
    label: 'Cũ nhất',
    value: JSON.stringify({
      sortBy: 'created_at',
      sortValue: 'asc',
    }),
  },
  {
    label: ' Bán chạy nhất',
    value: JSON.stringify({
      sortBy: 'sold_quantity',
      sortValue: 'desc',
    }),
  },
];

function Sort() {
  const { offlineModeWorker } = useOfflineContext();
  const filter = useSyncExternalStore(filterProductStore.subscribe, filterProductStore.getSnapshot);

  const valueFilter = {
    sortBy: filter.sortBy,
    sortValue: filter.sortValue,
  };

  const handleSort = (value: ExpectedAny) => {
    const valueSort = value ? JSON.parse(value) : {};
    filterProductStore.setFilter({
      ...filter,
      ...valueSort,
    });
    offlineModeWorker.postMessage({
      action: RequestType.FILTER_PRODUCT,
      value: {
        ...filter,
        ...valueSort,
      },
    });
  };

  return (
    <Whisper
      trigger="click"
      placement="bottomEnd"
      speaker={({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={cx('!pw-rounded', className)} style={{ left, top }} arrow={false} full>
            {data.map((option) => (
              <div
                key={option.value}
                className={cx(
                  'pw-py-2 pw-px-4 pw-text-sm pw-cursor-pointer hover:pw-text-green-700 hover:pw-bg-green-200',
                  {
                    'pw-font-bold pw-text-green-700 pw-bg-green-100': JSON.stringify(valueFilter) === option.value,
                  },
                )}
                onClick={() => {
                  handleSort(option.value);
                  onClose();
                }}
              >
                {option.label}
              </div>
            ))}
          </Popover>
        );
      }}
    >
      <IconButton size="lg" icon={<BsSortDownAlt size={22} />} className="!pw-bg-green-800 !pw-text-white" />
    </Whisper>
  );
}

export default memo(Sort);
