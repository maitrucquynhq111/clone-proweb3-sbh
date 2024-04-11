import { useTranslation } from 'react-i18next';
import { BsExclamationTriangle, BsPencilFill } from 'react-icons/bs';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { OpenInventory } from './components';
import { ActionMenu, AutoResizeInput, ImageTextCell, MenuItemProps } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { formatCurrency } from '~app/utils/helpers';
import { useCategoriesQuery } from '~app/services/queries';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { numberFormat } from '~app/configs';

const dataMenuAction = (rowData: SkuInventory, { canView }: Permission): MenuItemProps[] => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  return [
    ...(canView
      ? [
          {
            title: t('common:edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => {
              navigate({
                pathname: location.pathname,
                search: `?${createSearchParams({
                  modal: ModalTypes.WarehouseDetails,
                  placement: ModalPlacement.Right,
                  size: ModalSize.Xsmall,
                  id: rowData.id,
                })}`,
              });
            },
          },
        ]
      : []),
  ];
};

type Props = {
  onBlur({ rowData, total_inventory }: { rowData: SkuInventory; total_inventory: number }): void;
};

export const columnOptions = ({ onBlur }: Props) => {
  const { t } = useTranslation('warehouse-table');
  const canView = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  const canUpdateInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);

  let historical_cost,
    inventory_value = null;
  if (canUpdateHistoricalCost) {
    historical_cost = {
      flexGrow: 0.5,
      colSpan: 4,
      label: t('historical_cost'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        if (rowData.sku_type === 'non_stock') {
          return (
            <div className="pw-text-right pw-w-full pw-px-4">
              <OpenInventory sku={rowData} canUpdate={canUpdateInventory} />
            </div>
          );
        }
        return (
          <div className="pw-px-4 pw-w-full pw-text-right pw-text-sm">{formatCurrency(rowData.historical_cost)}</div>
        );
      },
    };
    inventory_value = {
      flexGrow: 0.5,
      label: t('inventory_value'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <div className="pw-px-4 pw-w-full pw-text-right pw-text-sm">{formatCurrency(rowData.inventory_value)}</div>
        );
      },
    };
  }

  return {
    sku_code: {
      label: t('sku'),
      width: 110,
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return <div className="pw-px-4 pw-w-full pw-text-sm">{rowData.sku_code}</div>;
      },
    },
    sku_name: {
      flexGrow: 1,
      label: t('product'),
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <ImageTextCell
            image={rowData?.media?.[0]}
            text={rowData.product_name}
            secondText={rowData.sku_name}
            className="pw-text-sm"
            textClassName="pw-font-bold pw-mb-1"
            secondTextClassName="pw-text-neutral-secondary pw-text-2sm"
          />
        );
      },
    },
    historical_cost,
    total_quantity: {
      flexGrow: 0.5,
      label: t('inventory'),
      className: 'pw-text-right',
      cell: ({ rowData }: { rowData: SkuInventory }) => {
        return (
          <div className="pw-flex pw-items-center pw-justify-end pw-px-4 pw-w-full">
            {rowData.warning_value > 0 && rowData.can_pick_quantity <= rowData.warning_value && (
              <BsExclamationTriangle size={24} className="pw-text-warning-active pw-mr-1" />
            )}
            {canUpdateInventory ? (
              <AutoResizeInput
                name=""
                className="!pw-bg-transparent hover:pw-cursor-pointer pw-text-sm"
                isForm={false}
                isNumber={false}
                isDecimal={true}
                defaultValue={(rowData?.total_quantity || 0).toString()}
                placeholder="0"
                onClick={(e) => e.stopPropagation()}
                onBlur={(value: string) => onBlur({ rowData, total_inventory: +value })}
              />
            ) : (
              <span className="pw-text-sm">{numberFormat.format(rowData?.total_quantity || 0)}</span>
            )}
          </div>
        );
      },
    },
    inventory_value,
    ...(canView
      ? {
          action: {
            width: 50,
            label: '',
            cell: ({ rowData }: { rowData: SkuInventory }) => {
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <ActionMenu data={dataMenuAction(rowData, { canView })} />
                </div>
              );
            },
          },
        }
      : {}),
  };
};

export const initFilterValues = {
  primary: {
    search: '',
    isTable: true,
  },
  secondary: {
    category_ids: [],
  },
};

export type ConverFilterType = {
  search: string;
  category_ids: string[];
};

export const convertFilter = (props: ConverFilterType) => {
  const { category_ids, ...rest } = props;
  return {
    ...rest,
    category_ids: category_ids.map((item: string) => {
      return JSON.parse(item).value;
    }),
  };
};

export const filterOptions = () => {
  const { t } = useTranslation('filters');
  return {
    primary: {
      search: {
        type: ComponentType.Text,
        placeholder: t('products-table.search'),
        value: '',
        icon: 'search',
        className: '!pw-w-80',
        size: 'lg',
      },
    },
    secondary: {
      category_ids: {
        type: ComponentType.CheckPicker,
        placeholder: t('products-table.category'),
        async: true,
        label: t('products-table.category'),
        menuMaxHeight: 200,
        initStateFunc: () => ({
          page: 1,
          page_size: 10,
        }),
        searchKey: 'name',
        size: 'lg',
        defaultValue: initFilterValues.secondary.category_ids,
        container: () => document.getElementById('filter'),
        query: useCategoriesQuery,
        mapFunc: (item: Category) => ({
          label: item.name,
          value: JSON.stringify({
            label: item.name,
            value: item.id,
          }),
        }),
      },
    },
  };
};
