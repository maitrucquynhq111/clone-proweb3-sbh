import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { variantColumnsConfig } from './config';
import StaticTable from '~app/components/EditableTable/StaticTable';
import { currencyToString } from '~app/utils/helpers';
import { checkUniqueAttributeType, createTableDataFromSkus } from '~app/utils/helpers/productHelpers';
import { useSkuDetail } from '~app/utils/hooks/useSkuDetail';
import { useGetIngredientsQuery } from '~app/services/queries';
import { IngredientPermission, useHasPermissions } from '~app/utils/shield';

type Props = {
  sku_attributes: PendingSkuAttribute[];
};

const VariantTable = ({ sku_attributes }: Props) => {
  const { t } = useTranslation('products-form');
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const { setSelectedSku, setOpen } = useSkuDetail();
  const [configs, setConfigs] = useState<ExpectedAny>(null);

  const skus = useWatch({
    control,
    name: 'skus',
    defaultValue: [] as PendingSku[],
  }) as PendingSku[];
  const is_advance_stock = watch('is_advance_stock');
  const has_ingredient = watch('has_ingredient');
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const { data: ingredients } = useGetIngredientsQuery({
    page: 1,
    pageSize: 1,
    enabled: canViewIngredient && has_ingredient,
  });

  const handleInputChange = useCallback((index: number, key: string, value: string) => {
    if (index === null || index === undefined) return;
    setValue(`skus.${index}.${key}`, +value);
  }, []);

  const handleStockChange = useCallback((index: number, key: string, value: string) => {
    if (index === null || index === undefined) return;
    setValue(`skus.${index}.po_details.${key}`, parseInt(currencyToString(value), 10));
  }, []);

  const handleToggleChange = useCallback((index: number, value: boolean) => {
    if (index === null || index === undefined) return;
    setValue(`skus.${index}.is_active`, value);
  }, []);

  const handleDisableRow = useCallback((index: number, value: boolean) => {
    if (index === null || index === undefined) return;
    if (value) {
      const skus = getValues('skus') as PendingSku[];
      const hiddenRows = skus.filter((item) => item.hide_sku === true);
      if (skus.length - hiddenRows.length === 1) return;
    }
    setValue(`skus.${index}.hide_sku`, value);
  }, []);

  const handleUpdateMedia = useCallback((index: number, value: ExpectedAny) => {
    if (index === null || index === undefined) return;
    setValue(`skus.${index}.media`, value);
  }, []);

  const handleOpenDetailDrawer = useCallback((index: number) => {
    if (index === null || index === undefined) return;
    setSelectedSku(getValues(`skus.${index}`));
    setOpen(true);
  }, []);

  const handleChangeIngredients = useCallback((index: number, value: ExpectedAny) => {
    setValue(`skus.${index}.recipe`, value);
  }, []);

  const data = useMemo(() => {
    return createTableDataFromSkus(skus);
  }, [skus]);

  useDebounce(
    () => {
      if (!checkUniqueAttributeType(sku_attributes)) return;
      setConfigs(
        variantColumnsConfig({
          t,
          sku_attributes,
          is_advance_stock,
          has_ingredient,
          ingredientsLength: ingredients?.data.length || 0,
          errorsRecipe: errors?.skus || [],
          onInputChange: handleInputChange,
          onStockChange: handleStockChange,
          onToggleChange: handleToggleChange,
          onDisableRow: handleDisableRow,
          onOpenDetailDrawer: handleOpenDetailDrawer,
          onUpdateMedia: handleUpdateMedia,
          onChangeIngredients: handleChangeIngredients,
        }),
      );
    },
    300,
    [
      sku_attributes,
      is_advance_stock,
      has_ingredient,
      errors?.skus,
      handleInputChange,
      handleStockChange,
      handleToggleChange,
      handleDisableRow,
      handleOpenDetailDrawer,
      handleUpdateMedia,
    ],
  );

  return <>{configs ? <StaticTable columnConfig={configs} data={data} /> : null}</>;
};

export default memo(VariantTable);
