import { createSearchParams, NavigateFunction, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsPencilFill, BsTrash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { ColumnDef, Row } from '@tanstack/react-table';
import { HistoricalCostCell, InventoryCell, NormalPriceCell } from './components';
import { ActionMenu, MenuItemProps, PlaceholderImage } from '~app/components';
import { ModalTypes } from '~app/modals/types';
import { useCategoriesQuery, PRODUCTS_KEY } from '~app/services/queries';
import { queryClient } from '~app/configs/client';
import { useDeleteMultipleProductMutation } from '~app/services/mutations';
import {
  getCanPickQuantityProduct,
  getRangePrice,
  getMultiUom,
  getRangeHistoricalCost,
  acronymName,
  isStockProduct,
  getTotalProductStock,
} from '~app/utils/helpers';
import { useHasPermissions, ProductPermission } from '~app/utils/shield';
import { ComponentType } from '~app/components/HookForm/utils';
import { useOfflineContext } from '~app/features/pos/context/OfflineContext';
import { SyncType } from '~app/features/pos/constants';
import { numberFormat } from '~app/configs';
import i18n from '~app/i18n/i18n';
import { ProductService } from '~app/services/api';

export const selectAllAction = (selected: string[]): MenuItemProps[] => {
  const { syncDataByTypes } = useOfflineContext();
  const { t } = useTranslation(['common', 'notification']);
  const { mutateAsync } = useDeleteMultipleProductMutation();

  const canDelete = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_DELETE]);

  return [
    ...(canDelete
      ? [
          {
            title: t('delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => {
              await mutateAsync({
                productIds: selected,
              } as ExpectedAny);
              toast.success(t('notification:delete-success'));
              syncDataByTypes([SyncType.PRODUCTS]);
              queryClient.invalidateQueries([PRODUCTS_KEY], { exact: false });
            },
            showConfirm: true,
          },
        ]
      : []),
  ];
};

export const dataMenuAction = (
  rowData: Product,
  { canView, canDelete }: Permission,
  location: Location,
  navigate: NavigateFunction,
  syncDataByTypes: ExpectedAny,
  skuId?: string,
): MenuItemProps[] => {
  const { t } = i18n;

  const handleClick = (name: string, id: string) => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: name,
        id: id,
        sku_id: skuId || '',
      })}`,
    });
  };

  return [
    ...(canView
      ? [
          {
            title: t('common:edit'),
            icon: <BsPencilFill className="pw-text-primary-main" />,
            action: () => handleClick(ModalTypes.ProductDetails, rowData.id),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            title: t('common:delete'),
            icon: <BsTrash />,
            className: 'pw-text-red-500',
            action: async () => {
              await ProductService.deleteProduct(rowData.id);
              toast.success(t('notification:delete-success'));
              queryClient.invalidateQueries([PRODUCTS_KEY], { exact: false });
              syncDataByTypes([SyncType.PRODUCTS]);
            },
            showConfirm: true,
          },
        ]
      : []),
  ];
};

const getCanPickQuantity = (data: Product) => {
  const canPick = getCanPickQuantityProduct(data);
  if (typeof canPick === 'string') return null;
  if (typeof canPick === 'boolean') return null;
  return <div>{numberFormat.format(data.can_pick_quantity)}</div>;
};

export const columnOptions = (
  canView: boolean,
  canDelete: boolean,
  canViewInventory: boolean,
  canViewHistoricalCost: boolean,
  location: Location,
  navigate: NavigateFunction,
  syncDataByTypes: ExpectedAny,
  onUpdateProduct: (productId: string, sku: Sku, successMessage?: string) => Promise<boolean>,
  filteredColumns?: Column[],
): ColumnDef<Product>[] => {
  const { t } = i18n;

  let columns: ColumnDef<Product>[] = [
    {
      id: 'product_code',
      header: () => t('barcode:print_size.barcode'),
      cell: ({ row }) => {
        const product = row.original;
        const sku = product?.list_sku[0];
        const isVariant = product.product_type === 'variant';
        return <div>{isVariant ? `${product.list_sku?.length} phân loại` : sku?.sku_code || ''}</div>;
      },
      size: 112,
    },
    {
      id: 'name',
      accessorFn: () => ({}),
      header: () => t('products-table:product'),
      cell: ({ row }) => {
        const product = row.original;
        const image = product?.images?.[0] || '';
        const showImage = filteredColumns
          ? filteredColumns?.some((item) => item.id === 'product_image' && item.checked)
          : true;
        return (
          <div className="pw-flex pw-py-2 pw-items-center pw-gap-3 pw-w-full">
            {showImage ? (
              <>
                {image ? (
                  <PlaceholderImage
                    className="pw-bg-cover pw-rounded-md !pw-w-10 pw-h-10 pw-object-cover"
                    src={image}
                    alt={product.name}
                    isAvatar={false}
                  />
                ) : (
                  <div className="pw-h-9 pw-rounded pw-bg-neutral-divider pw-font-semibold pw-p-2 pw-text-xs pw-flex pw-items-center pw-justify-center pw-text-primary-main">
                    {acronymName(product.name).substring(0, 3)}
                  </div>
                )}
              </>
            ) : null}
            <div className="pw-overflow-hidden pw-flex-1 pw-text-ellipsis pw-text-justify">{product.name}</div>
          </div>
        );
      },
      size: 290,
      meta: {
        sortable: true,
      },
    },
    {
      id: 'uom',
      header: () => t('products-table:uom'),
      cell: ({ row }) => {
        const product = row.original;
        return <div className="pw-overflow-hidden pw-text-ellipsis pw-w-full">{getMultiUom(product)}</div>;
      },
      size: 94,
    },
    {
      id: 'historical_cost',
      header: () => t('products-form:historical_cost'),
      cell: ({ row }) => {
        const product = row.original;
        const sku = product.list_sku[0];
        if (!sku) return null;
        return (
          <div className="pw-text-right pw-w-full">
            {product.product_type === 'variant' ? (
              getRangeHistoricalCost(product)
            ) : (
              <HistoricalCostCell onUpdateProduct={onUpdateProduct} product={product} sku={sku} />
            )}
          </div>
        );
      },
      size: 160,
      meta: {
        align: 'right',
      },
    },
    {
      id: 'normal_price',
      accessorFn: () => ({}),
      header: () => `${t('products-table:normal_price')}`,
      cell: ({ row }) => {
        const product = row.original;
        const sku = product.list_sku[0];
        if (!sku) return null;
        return (
          <div className="pw-text-right pw-w-full">
            {product.product_type === 'variant' ? (
              getRangePrice(product)
            ) : (
              <NormalPriceCell onUpdateProduct={onUpdateProduct} product={product} sku={sku} />
            )}
          </div>
        );
      },
      size: 160,
      meta: {
        align: 'right',
        sortable: true,
      },
    },
    {
      id: 'can_pick_quantity',
      accessorFn: () => ({}),
      header: () => t('products-table:can_pick_quantity'),
      cell: ({ row }) => {
        const product = row.original;
        return <div className="pw-text-right pw-w-full">{getCanPickQuantity(product)}</div>;
      },
      size: 130,
      meta: {
        align: 'right',
        sortable: true,
      },
    },
    {
      id: 'inventory',
      header: () => t('warehouse-table:inventory'),
      cell: ({ row }) => {
        const product = row.original;
        const isIngredient = product.has_ingredient;
        const sku = product.list_sku[0];
        const isActive = product.list_sku.some((sku) => sku.is_active);
        if (!sku) return null;
        if (isIngredient)
          return (
            <div className="pw-w-full pw-flex pw-justify-end pw-items-center pw-h-full">
              {t('products-table:apply_recipe')}
            </div>
          );
        if (product.product_type === 'variant') {
          return (
            <div className="pw-w-full pw-flex pw-justify-end pw-items-center pw-h-full">
              {isStockProduct(product.list_sku) ? (
                <div className="pw-text-sm pw-text-neutral-primary">{getTotalProductStock(product.list_sku)}</div>
              ) : (
                <span className="pw-text-sm pw-text-neutral-primary">
                  {isActive ? t('common:in-stock') : t('common:out-of-stock')}
                </span>
              )}
            </div>
          );
        }
        return (
          <div onClick={(e) => e.stopPropagation()} className="pw-w-full">
            <InventoryCell product={product} sku={sku} onUpdateProduct={onUpdateProduct} />
          </div>
        );
      },
      size: 150,
      meta: {
        align: 'right',
        isFullCell: true,
      },
    },
    {
      id: 'action',
      header: () => null,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div onClick={(e) => e.stopPropagation()} className="pw-w-full pw-flex pw-items-center pw-justify-center">
            <ActionMenu
              data={dataMenuAction(
                product,
                {
                  canDelete,
                  canView,
                },
                location,
                navigate,
                syncDataByTypes,
              )}
            />
          </div>
        );
      },
      maxSize: 44,
      size: 44,
      meta: {
        align: 'center',
        isFullCell: true,
      },
    },
  ];

  if (!canViewInventory) columns = columns.filter((item) => item.id !== 'inventory');
  if (!canView && !canDelete) columns = columns.filter((item) => item.id !== 'action');
  if (!canViewHistoricalCost) columns = columns.filter((item) => item.id !== 'historical_cost');

  filteredColumns
    ?.filter((item) => !item.checked)
    .forEach((item) => {
      const index = columns.findIndex((column) => column.id === item.id);
      if (index !== -1) columns.splice(index, 1);
    });

  return columns;
};

export const getRowCanExpand = (row: Row<Product>) => {
  return row.original.product_type === 'variant';
};

export const getRowId = (row: Product, relativeIndex: number, parent?: Row<Product>) => {
  return parent ? [parent.id, row.id].join('.') : row.id;
};

export type FilterType = {
  primary: {
    name: string;
  };
  secondary: {
    category_ids: string[];
  };
};

export const initFilterValues: FilterType = {
  primary: {
    name: '',
  },
  secondary: {
    category_ids: [],
  },
};

export type ConverFilterType = {
  name: string;
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
      name: {
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
