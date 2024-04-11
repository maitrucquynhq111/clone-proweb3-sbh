import { useTranslation } from 'react-i18next';
import { BsExclamationTriangle, BsPencilFill, BsTrash } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';
import { ActionMenu, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { IngredientPermission, ProductPermission, useHasPermissions } from '~app/utils/shield';

export const initFilterValues = {
  name: '',
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      name: {
        type: ComponentType.Text,
        placeholder: t('recipe-table.search'),
        defaultValue: '',
        icon: 'search',
        className: '!pw-w-80',
        size: 'lg',
      },
    },
  };
};

const dataMenuAction = (
  rowData: Ingredient,
  { canDelete, canViewDetail }: Permission,
  onClick: (rowData: Ingredient, action: string) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    ...(canViewDetail
      ? [
          {
            title: t('common:edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => onClick(rowData, 'edit'),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            title: t('common:delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => onClick(rowData, 'delete'),
          },
        ]
      : []),
  ];
};

type Props = { onClick: (rowData: Ingredient, action: string) => void };

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('ingredients-table');
  const canViewDetail = useHasPermissions([IngredientPermission.INGREDIENT_DETAIL_VIEW]);
  const canDelete = useHasPermissions([IngredientPermission.INGREDIENT_DELETE]);
  const canViewPrice = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  let price = null;
  let totalPrice = null;
  if (canViewPrice) {
    price = {
      label: t('historical_cost'),
      flexGrow: 1,
      align: 'right',
      sortable: true,
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return <span className="pw-w-full pw-text-right pw-pr-4 pw-text-sm">{formatCurrency(rowData.price)}</span>;
      },
    };
    totalPrice = {
      label: t('inventory_value'),
      flexGrow: 1,
      align: 'right',
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return (
          <span className="pw-w-full pw-text-right pw-pr-4 pw-text-sm">{formatCurrency(rowData.total_inventory)}</span>
        );
      },
    };
  }
  return {
    name: {
      label: t('name'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return <span className="pw-w-full pw-text-left pw-pl-4 pw-text-sm">{rowData.name}</span>;
      },
    },
    uom: {
      label: t('uom'),
      flexGrow: 0.5,
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return <span className="pw-w-full pw-text-left pw-pl-4 pw-text-sm">{rowData.uom.name}</span>;
      },
    },
    price,
    total_quantity: {
      label: t('inventory'),
      flexGrow: 1,
      align: 'right',
      sortable: true,
      cell: ({ rowData }: { rowData: Ingredient }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-pr-4 pw-w-full">
            {rowData.total_quantity > 0 && rowData.total_quantity <= rowData.warning_quantity && (
              <Whisper
                placement="bottomEnd"
                trigger="hover"
                speaker={<Tooltip arrow={false}>{t('tooltip_warning')}</Tooltip>}
              >
                <div className="pw-text-orange-500 pw-ml-2 pw-text-xl pw-cursor-pointer">
                  <BsExclamationTriangle size={22} className="pw-mr-2 pw-text-warning-active" />
                </div>
              </Whisper>
            )}
            <span className="pw-text-sm">{formatCurrency(rowData.total_quantity)}</span>
          </div>
        );
      },
    },
    totalPrice,
    ...(canDelete || canViewDetail
      ? {
          action: {
            width: 50,
            label: '',
            cell: ({ rowData }: { rowData: Ingredient }) => {
              return (
                <div
                  className="pw-flex pw-justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ActionMenu
                    data={dataMenuAction(
                      rowData,
                      {
                        canDelete,
                        canViewDetail,
                      },
                      onClick,
                    )}
                  />
                </div>
              );
            },
          },
        }
      : {}),
  };
};
