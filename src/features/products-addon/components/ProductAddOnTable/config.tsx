import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { SquareToggle } from '~app/components';

export const productAddOnListConfig = ({
  t,
  onStatusChange,
  onRemove,
}: {
  t: ExpectedAny;
  onRemove(index: number): void;
  onStatusChange(index: number, value: boolean): void;
}) => {
  return [
    {
      key: 'name',
      name: 'name',
      tableName: 'list_product_add_on',
      label: t('addon_name'),
      align: 'left',
      isEditable: true,
      flexGrow: 1,
      isForm: true,
    },
    {
      key: 'price',
      name: 'price',
      tableName: 'list_product_add_on',
      label: t('addon_price'),
      align: 'right',
      isEditable: true,
      isNumber: true,
      width: 149,
      isForm: true,
    },
    {
      key: 'historical_cost',
      name: 'historical_cost',
      tableName: 'list_product_add_on',
      label: `${t('addon_historical_cost')}`,
      align: 'right',
      isEditable: true,
      isNumber: true,
      width: 149,
      isForm: true,
    },
    {
      key: 'is_active',
      name: 'is_active',
      label: t('addon_is_active'),
      width: 149,
      align: 'right',
      cell: (props: ExpectedAny) => {
        const { rowIndex, rowData } = props;
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-end pw-justify-center pw-pr-2.5">
            <SquareToggle
              value={rowData.is_active}
              leftText={t('in_stock')}
              rightText={t('out_of_stock')}
              onClick={(value) => {
                onStatusChange(rowIndex, value);
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 74,
      cell: ({ rowIndex }: { rowIndex: ExpectedAny }) => {
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <IconButton
              appearance="subtle"
              icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
              onClick={() => {
                onRemove(rowIndex);
              }}
            />
          </div>
        );
      },
    },
  ];
};
