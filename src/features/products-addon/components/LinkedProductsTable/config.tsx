import { BsTrash } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { ImageTextCell } from '~app/components';

export const linkedProductsConfig = ({
  t,
  onRemove,
}: {
  t: ExpectedAny;
  onRemove(index: number, id: string): void;
}) => {
  return [
    {
      key: 'name',
      name: 'name',
      label: t('product_name'),
      align: 'left',
      flexGrow: 1,
      cell: ({ rowData }: { rowData: PendingLinkedProductsAddOn }) => {
        return (
          <div className="pw-h-full pw-flex pw-items-center">
            <ImageTextCell image={rowData?.images?.[0]} text={rowData.product_name} textClassName="line-clamp-1" />
          </div>
        );
      },
    },
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 74,
      cell: ({ rowIndex, rowData }: { rowIndex: number; rowData: PendingLinkedProductsAddOn }) => {
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-items-center pw-justify-center">
            <IconButton
              appearance="subtle"
              icon={<BsTrash size={24} className="pw-fill-neutral-secondary" />}
              onClick={() => {
                onRemove(rowIndex, rowData.product_id);
              }}
            />
          </div>
        );
      },
    },
  ];
};
