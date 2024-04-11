import RemoveWholesalePriceButton from './RemoveWholesalePriceButton';
import { PackageKey } from '~app/utils/constants';

export const wholesalePriceColumnsConfig = ({
  t,
  currentPackage,
  onRemove,
  onCellChange,
}: {
  t: ExpectedAny;
  currentPackage: string;
  onRemove: ExpectedAny;
  onCellChange: ExpectedAny;
}) => {
  return [
    {
      key: 'name',
      name: 'name',
      label: t('range_price'),
      align: 'center',
      width: 132,
    },
    {
      key: 'min_quantity',
      name: 'min_quantity',
      label: t('min_quantity'),
      align: 'right',
      flexGrow: 1,
      isEditable: currentPackage !== PackageKey.FREE ? true : false,
      isNumber: true,
      onCellBlur: onCellChange,
    },
    {
      key: 'price',
      name: 'price',
      label: `${t('product_price')} (VNĐ)`,
      align: 'right',
      flexGrow: 1,
      isEditable: currentPackage !== PackageKey.FREE ? true : false,
      isNumber: true,
      onCellBlur: onCellChange,
    },
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 74,
      cell: ({ rowIndex }: { rowIndex: ExpectedAny }) => {
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <RemoveWholesalePriceButton onClick={onRemove} index={rowIndex} />
          </div>
        );
      },
    },
  ];
};
