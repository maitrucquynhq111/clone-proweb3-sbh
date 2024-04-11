import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { ActionMenu, ImageTextCell, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { numberFormat } from '~app/configs';
import { FormulaPermission, ProductPermission, useHasPermissions } from '~app/utils/shield';

export const initFilterValues = {
  search: '',
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
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
  rowData: Recipe,
  { canDelete, canView }: Permission,
  onClick: (rowData: Recipe, action: string) => void,
): MenuItemProps[] => {
  const { t } = useTranslation('common');

  return [
    ...(canView
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

type Props = { onClick: (rowData: Recipe, action: string) => void };

export const columnOptions = ({ onClick }: Props) => {
  const { t } = useTranslation('recipe-table');
  const canDelete = useHasPermissions([FormulaPermission.FORMULA_DELETE]);
  const canView = useHasPermissions([FormulaPermission.FORMULA_VIEW]);
  const canViewPrice = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  let historicalCost = null;
  if (canViewPrice) {
    historicalCost = {
      flexGrow: 1,
      align: 'right',
      label: t('historical_cost'),
      cell: ({ rowData }: { rowData: Recipe }) => {
        return (
          <div className="pw-h-full pw-w-full pw-flex pw-flex-col pw-items-end pw-justify-center pw-pr-2.5 pw-font-semibold pw-text-sm">
            {rowData.min_historical_cost === rowData.max_historical_cost
              ? numberFormat.format(rowData.max_historical_cost)
              : `${numberFormat.format(rowData.min_historical_cost)} - ${numberFormat.format(
                  rowData.max_historical_cost,
                )}`}
          </div>
        );
      },
    };
  }

  return {
    name: {
      label: t('recipe_name'),
      flexGrow: 1,
      cell: ({ rowData }: { rowData: Recipe }) => {
        const arrSkuCode = rowData.sku_code.split('|');
        return (
          <ImageTextCell
            image={rowData.images?.[0] || ''}
            text={rowData.name}
            secondText={arrSkuCode.length > 1 ? `${arrSkuCode.length} ${t('variant')}` : rowData.sku_code}
            className="pw-px-4"
            textClassName="pw-font-bold pw-mb-1 pw-text-sm"
            secondTextClassName="pw-text-2sm pw-text-neutral-secondary"
          />
        );
      },
    },
    historicalCost,
    ...(canDelete || canView
      ? {
          action: {
            width: 50,
            label: '',
            cell: ({ rowData }: { rowData: Recipe }) => {
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
                        canView,
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
