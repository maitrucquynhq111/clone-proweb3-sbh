import * as yup from 'yup';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { FormSchema, SquareToggle } from '~app/components';
import { useCategoriesQuery } from '~app/services/queries/useCategoriesQuery';
import { useCreateProductCategoryMutation } from '~app/services/mutations';
import {
  VariantList,
  ProductConfig,
  WholesalePrice,
  AdvanceStockToggle,
  AdvanceStockBar,
  AdvanceStockWarning,
  IngredientsToggle,
  EmptyRecipeProduct,
  IngredientsTable,
  HistoricalCostInput,
} from '~app/features/products/components';
import { Dropzone } from '~app/components/FormControls';
import { InfoTabKeyType, skuYupSchema } from '~app/features/products/utils';
import { MAX_UOM_LENGTH, PackageKey } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';
import { useProductsAddonQuery } from '~app/services/queries';
import { useHasPermissions, ProductPermission, IngredientPermission } from '~app/utils/shield';

export const productYupSchema = () => {
  const { t } = useTranslation('products-form');
  return yup.object().shape({
    name: yup.string().required(t('error.name') || ''),
    skus: yup.array(skuYupSchema()),
    uom: yup.string().max(MAX_UOM_LENGTH, t('error.max_uom') || ''),
    sku_attributes: yup
      .array(
        yup.object().shape({
          attribute_type: yup.string().required(t('error.attribute_type') || ''),
          attribute: yup.array().min(1, t('error.at_least_one_attribute') || ''),
        }),
      )
      .test('unique', 'sdfjkl', function Validate(array) {
        if (!array) return false;
        const uniqueData = Array.from(new Set(array.map(({ attribute_type }) => attribute_type.trim().toLowerCase())));
        const isUnique = array.length === uniqueData.length;
        if (isUnique) return true;
        const index = array.findIndex((row, i) => row.attribute_type?.toLowerCase() !== uniqueData[i]);
        if (array[index]?.attribute_type === '') {
          return true;
        }
        return this.createError({
          path: `${this.path}.${index}.attribute_type`,
          message: t('error.unique_attribute') || '',
        });
      })
      .nullable(),
  });
};

type Props = {
  is_variant: boolean;
  is_advance_stock: boolean;
  images: ExpectedAny[];
  is_active: boolean;
  selectedSku: PendingSku;
  has_ingredient: boolean;
  activeTab: InfoTabKeyType;
  ingredientsLength: number;
  currentPackage: string;
  setActiveTab(value: InfoTabKeyType): void;
  setValue(name: string, value: ExpectedAny): void;
  setOpenUpgrade(value: boolean): void;
  onRangeWholesalePriceChange(value: RangeWholesalePrice[]): void;
  onProductStatusChange(value: boolean): void;
};

export const productFormSchema = ({
  is_advance_stock = false,
  is_variant = false,
  images = [],
  is_active = false,
  selectedSku,
  has_ingredient = false,
  activeTab,
  ingredientsLength,
  currentPackage,
  setActiveTab,
  setValue,
  setOpenUpgrade,
  onRangeWholesalePriceChange,
  onProductStatusChange,
}: Props): FormSchema => {
  const { t } = useTranslation(['products-form', 'common']);
  const { mutateAsync } = useCreateProductCategoryMutation();
  const canUpdateInventory = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_INVENTORY_VIEW]);
  const canViewIngredient = useHasPermissions([IngredientPermission.INGREDIENT_LIST_VIEW]);
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);

  const infoContent = [
    {
      className: 'pw-col-span-8',
      name: 'first-col',
      type: 'block-container',
      children: [
        {
          className: `pw-grid pw-grid-cols-12 pw-gap-4`,
          blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
          type: 'block',
          title: t('general_info', { ns: 'common' }),
          name: 'first-block',
          subTitle: '',
          children: [
            {
              type: ComponentType.Text,
              className: 'pw-col-span-9',
              value: '',
              label: t('name') || '',
              name: 'name',
              isRequired: true,
              placeholder: t('name') || '',
            },
            {
              type: ComponentType.Text,
              className: 'pw-col-span-3',
              value: '',
              label: t('uom'),
              name: 'uom',
              placeholder: t('placeholder.uom'),
            },
            {
              type: ComponentType.TagPicker,
              className: 'pw-col-span-6',
              label: t('category') || '',
              name: 'category',
              placeholder: t('placeholder.category') || '',
              creatable: true,
              createKey: 'name',
              searchKey: 'name',
              async: true,
              mutateAsync,
              initStateFunc: () => ({
                page: 1,
                page_sze: 10,
              }),
              query: useCategoriesQuery,
              mapFunc: (item: Category) => ({
                label: item.name,
                value: item.id,
              }),
            },
            {
              type: ComponentType.Text,
              className: 'pw-col-span-3',
              name: 'skus[0].sku_code',
              visible: is_variant ? false : true,
              label: t('sku_code') || '',
            },
            {
              type: ComponentType.Text,
              className: 'pw-col-span-3',
              name: 'skus[0].barcode',
              label: t('barcode') || '',
              visible: is_variant ? false : true,
              value: '',
            },
          ],
        },
        {
          className: `pw-grid pw-grid-cols-12 pw-gap-4 `,
          blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-border-t pw-border-solid pw-border-gray-200',
          type: 'block',
          title: t('product_price'),
          subTitle: '',
          name: 'second-block',
          visible: is_variant ? false : true,
          children: [
            {
              type: ComponentType.Currency,
              className: 'pw-col-span-3',
              name: 'skus[0].normal_price',
              isRequired: true,
              label: t('normal_price') || '',
              placeholder: '0',
            },
            {
              type: ComponentType.Custom,
              className: 'pw-col-span-3',
              name: 'skus[0]',
              component: HistoricalCostInput,
              visible: canUpdateHistoricalCost,
            },
            {
              type: ComponentType.Currency,
              className: 'pw-col-span-3',
              name: 'skus[0].selling_price',
              label: t('selling_price') || '',
              placeholder: '0',
            },
            {
              type: ComponentType.Custom,
              className: 'pw-col-span-9',
              name: 'skus[0]',
              currentPackage,
              setOpenUpgrade,
              onChange: onRangeWholesalePriceChange,
              component: WholesalePrice,
            },
          ],
        },
        {
          className: `pw-grid pw-grid-cols-12 pw-gap-4 `,
          blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mt-4',
          type: 'block',
          name: 'fourth-block',
          title: t('product_variant'),
          subTitle: t('sub_title.product_variant'),
          children: [
            {
              className: 'pw-col-span-12',
              name: 'sku_attributes',
              type: ComponentType.Custom,
              is_variant,
              component: VariantList,
            },
          ],
        },
        {
          className: `pw-grid pw-grid-cols-12 pw-gap-4 `,
          blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mt-4',
          type: 'block',
          title: t('additional_info', { ns: 'common' }),
          subTitle: '',
          name: 'fifth-block',
          children: [
            {
              type: ComponentType.TagPicker,
              className: 'pw-col-span-9',
              label: t('addon_group') || '',
              name: 'product_add_on_group_ids',
              placeholder: t('placeholder.category') || '',
              creatable: false,
              searchKey: 'name',
              async: true,
              initStateFunc: () => ({
                page: 1,
                page_sze: 10,
              }),
              query: useProductsAddonQuery,
              mapFunc: (item: AddOnGroup) => ({
                label: item.name,
                value: item.id,
              }),
            },
            {
              type: ComponentType.TagPicker,
              className: 'pw-col-span-3',
              value: '',
              label: t('product_label') || '',
              name: 'tag_info',
              placeholder: '',
              creatable: false,
              searchKey: 'name',
              async: false,
              data: [],
            },
            {
              type: ComponentType.Text,
              as: 'textarea',
              rows: 3,
              className: 'pw-col-span-12',
              value: '',
              label: t('description') || '',
              name: 'description',
              placeholder: '',
            },
          ],
        },
      ],
    },
    {
      className: 'pw-col-span-4',
      name: 'second-col',
      type: 'block-container',
      children: [
        {
          blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
          type: 'block',
          title: `${t('product_image')} (${images.length}/10)`,
          name: t('product_image'),
          subTitle: '',
          children: [
            {
              type: ComponentType.Custom,
              name: 'images',
              errorMessage: t('error.max_image_length'),
              component: Dropzone,
              fileList: images,
              canRemoveAll: false,
              conditionOpacity: { package: PackageKey.FREE, index: 0 },
              onChange: (files: ExpectedAny) => {
                if (
                  currentPackage === PackageKey.FREE &&
                  ((images.length === 0 && files.length > 1) || (images.length > 0 && images.length <= files.length))
                ) {
                  if (images.length === 0) setValue('images', files.splice(0, 1));
                  setOpenUpgrade(true);
                  return;
                }
                setValue('images', files);
              },
            },
          ],
        },
        {
          blockClassName: 'pw-bg-white pw-rounded pw-mt-4',
          type: 'block',
          name: 'product-config',
          className: 'pw-divide-neutral-100 pw-divide-y',
          children: [
            // {
            //   type: 'custom',
            //   name: 'skus.0',
            //   component: AdvanceStock,
            // },
            {
              type: 'block',
              blockClassName: 'pw-p-6',
              className: 'pw-flex pw-items-center pw-justify-between',
              name: 'product_status',
              visible: has_ingredient || is_variant || is_advance_stock ? false : true,
              children: [
                {
                  type: ComponentType.Custom,
                  name: 'status',
                  component: () => <span className="pw-text-base pw-font-bold">{t('status')}</span>,
                },
                {
                  type: ComponentType.Custom,
                  name: 'is_active',
                  leftText: t('stocking_item'),
                  rightText: t('out_of_stock_item'),
                  value: is_active,
                  onClick: onProductStatusChange,
                  component: SquareToggle,
                },
              ],
            },
            {
              type: 'block',
              name: 'advance_stock',
              blockClassName: 'pw-p-6',
              className: 'pw-grid pw-grid-cols-12 pw-gap-4',
              visible: !has_ingredient,
              children: [
                {
                  type: ComponentType.Custom,
                  name: 'advance_stock_toggle',
                  className: 'pw-flex pw-col-span-12 pw-justify-between',
                  isCreate: false,
                  component: AdvanceStockToggle,
                  disabled: !canUpdateInventory,
                },
                {
                  type: ComponentType.DemicalInput,
                  name: 'skus[0].po_details.quantity',
                  label: t('inventory'),
                  className: 'pw-col-span-6',
                  placeholder: '0',
                  visible: !is_variant && is_advance_stock ? true : false,
                  disabled: !canUpdateInventory,
                },
                {
                  type: ComponentType.Currency,
                  name: 'skus[0].po_details.blocked_quantity',
                  label: t('blocked_quantity'),
                  className: 'pw-col-span-6',
                  placeholder: '0',
                  visible: !is_variant && is_advance_stock ? true : false,
                  disabled: !canUpdateInventory,
                },
                {
                  type: ComponentType.Custom,
                  name: 'skus[0].po_details',
                  label: t('blocked_quantity'),
                  className: 'pw-col-span-12',
                  visible: !is_variant && is_advance_stock ? true : false,
                  component: AdvanceStockBar,
                  disabled: !canUpdateInventory,
                },
                {
                  type: ComponentType.Custom,
                  name: 'skus[0].po_details.warning_value',
                  placeholder: '0',
                  className: 'pw-col-span-12',
                  visible: !is_variant && is_advance_stock ? true : false,
                  component: AdvanceStockWarning,
                  disabled: !canUpdateInventory,
                },
              ],
            },
            {
              type: 'block',
              name: 'ingredient_block',
              visible: canViewIngredient,
              children: [
                {
                  type: ComponentType.Custom,
                  name: 'apply_ingredients',
                  is_variant,
                  setActiveTab,
                  component: IngredientsToggle,
                },
              ],
            },
            {
              type: ComponentType.Custom,
              name: 'show_price',
              title: t('allow_wholesale_price'),
              subtitle: t('allow_wholesale_price_subtitle'),
              component: ProductConfig,
            },
            {
              type: ComponentType.Custom,
              name: 'show_on_store',
              title: t('display_product_website'),
              component: ProductConfig,
            },
          ],
        },
      ],
    },
  ];
  const recipeContent = [
    {
      type: 'block-container',
      name: 'first-col',
      className: 'pw-col-span-12 pw-bg-white',
      children: [
        {
          type: 'block',
          name: 'first-block',
          className: cx('pw-col-span-12 pw-p-6 pw-rounded pw-h-full', {
            '!pw-col-span-8': selectedSku.recipe.length > 0,
          }),
          blockClassName: 'pw-grid pw-grid-cols-12',
          children: [
            selectedSku.recipe.length === 0
              ? {
                  type: ComponentType.Custom,
                  name: 'recipe',
                  selectedSku,
                  ingredientsLength,
                  onChange: (value: ExpectedAny) => setValue('skus.0.recipe', value),
                  component: EmptyRecipeProduct,
                }
              : {
                  type: ComponentType.Custom,
                  name: 'recipe',
                  selectedSku,
                  onChange: (value: ExpectedAny) => setValue('skus.0.recipe', value),
                  component: IngredientsTable,
                },
          ],
        },
      ],
    },
  ];

  return {
    className: cx('pw-grid pw-grid-cols-12 pw-gap-x-6', {
      'pw-h-full': activeTab === InfoTabKeyType.RECIPE,
    }),
    type: 'container',
    name: 'form',
    children: activeTab === InfoTabKeyType.INFO ? infoContent : recipeContent,
  };
};

export const variantFormSchema = (sku: PendingSku, index: number): FormSchema => {
  const { t } = useTranslation('products-form');

  return {
    className: 'pw-grid pw-grid-cols-2 pw-gap-2',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-grid pw-grid-cols-2 pw-gap-x-2 pw-gap-y-4',
        name: 'first-col',
        type: 'block',
        children: [
          {
            type: ComponentType.Text,
            className: 'pw-col-span-1',
            value: sku.name,
            label: t('name') || '',
            name: `skus[${index}].name`,
            placeholder: t('name') || '',
          },
          {
            type: ComponentType.Text,
            className: '',
            value: sku.uom,
            label: t('uom') || '',
            name: `skus[${index}].uom`,
            placeholder: t('uom') || '',
          },
          {
            type: ComponentType.Text,
            className: '',
            value: sku.barcode,
            label: t('barcode') || '',
            name: `skus[${index}].barcode`,
            placeholder: t('barcode') || '',
          },
          {
            type: ComponentType.Text,
            className: '',
            value: sku.sku_code,
            label: t('sku_code') || '',
            name: `skus[${index}].sku_code`,
            placeholder: t('sku_code') || '',
          },
        ],
      },
      {
        className: 'pw-grid pw-grid-cols-2 pw-gap-x-2 pw-gap-y-4',
        name: 'second-col',
        type: 'block',
        children: [
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-1',
            value: sku.normal_price,
            label: t('normal_price') || '',
            name: `skus[${index}].normal_price`,
            placeholder: t('placeholder.normal_price') || '',
          },
          {
            type: ComponentType.Currency,
            className: '',
            value: sku.selling_price,
            label: t('selling_price') || '',
            name: `skus[${index}].selling_price`,
            placeholder: t('placeholder.selling_price') || '',
          },
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-2',
            value: sku.historical_cost,
            label: t('historical_cost') || '',
            name: `skus[${index}].historical_cost`,
            placeholder: t('placeholder.historical_cost') || '',
          },
        ],
      },
    ],
  };
};
