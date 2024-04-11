import { Tag } from 'rsuite';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import WholesalePrice from '../WholesalePrice';
import { AutoResizeInput, FormSchema, SquareToggle, UploadAvatar } from '~app/components';
import { convertStringToObjectKey } from '~app/utils/helpers';
import AdvanceStockWarning from '~app/features/products/components/AdvanceStock/AdvanceStockWarning';
import AdvanceStockBar from '~app/features/products/components/AdvanceStock/AdvanceStockBar';
import { InfoTabKeyType, skuYupSchema } from '~app/features/products/utils';
import OpenDetailDrawerButton from '~app/features/products/components/Variant/OpenDetailDrawerButton';
import ShowHideVariantButton from '~app/features/products/components/Variant/ShowHideVariantButton';
import { ComponentType } from '~app/components/HookForm/utils';
import { EmptyRecipeProduct, IngredientsTable, IngredientsSelection } from '~app/features/products/components';

type ConfigParams = {
  t: ExpectedAny;
  sku_attributes: PendingSkuAttribute[];
  is_advance_stock: boolean;
  has_ingredient: boolean;
  ingredientsLength: number;
  errorsRecipe: ExpectedAny;
  onInputChange(index: number, key: string, value: string): void;
  onStockChange(index: number, key: string, value: string): void;
  onToggleChange(index: number, value: boolean): void;
  onDisableRow(index: number, value: boolean): void;
  onOpenDetailDrawer(index: number): void;
  onUpdateMedia(index: number, value: ExpectedAny): void;
  onChangeIngredients(index: number, value: ExpectedAny): void;
};

export const variantColumnsConfig = ({
  t,
  sku_attributes,
  has_ingredient = false,
  ingredientsLength,
  errorsRecipe = [],
  onInputChange,
  onStockChange,
  onToggleChange,
  onDisableRow,
  onOpenDetailDrawer,
  onUpdateMedia,
  onChangeIngredients,
}: ConfigParams) => {
  const columns = sku_attributes
    .filter((sku_attribute) => sku_attribute.attribute && sku_attribute.attribute_type.length > 0)
    .map((sku_attribute) => {
      const key = convertStringToObjectKey(sku_attribute.attribute_type);
      return {
        key,
        name: key,
        label: sku_attribute.attribute_type,
        flexGrow: 1,
        required: true,
      };
    });
  const statusColumn = has_ingredient
    ? {
        key: 'recipe',
        name: 'recipe',
        label: t('ingredients_shorten'),
        width: 132,
        align: 'right',
        cell: (props: ExpectedAny) => {
          const { rowIndex, rowData } = props;
          return (
            <div
              className={cx(
                'pw-pr-2.5 pw-cursor-pointer pw-flex pw-items-center pw-justify-end pw-h-full pw-w-full pw-absolute pw-top-0',
                {
                  'pw-bg-error-background': errorsRecipe[rowIndex]?.recipe?.message,
                },
              )}
            >
              <IngredientsSelection
                selectedSku={rowData}
                ingredientsLength={ingredientsLength}
                onChange={(value: ExpectedAny) => onChangeIngredients(rowIndex, value)}
              />
            </div>
          );
        },
      }
    : {
        key: 'is_active',
        name: 'is_active',
        label: t('inventory'),
        width: 132,
        align: 'right',
        cell: ({ rowData, rowIndex }: { rowData: PendingSku; rowIndex: number }) => {
          const defaultValue = rowData?.po_details?.quantity?.toString() || '';
          const handleChange = (value: string) => {
            onStockChange(rowIndex, 'quantity', value);
          };
          return (
            <div className="pw-h-full pw-flex pw-flex-col pw-items-end pw-justify-center pw-pr-2.5">
              {rowData.sku_type === 'stock' ? (
                <AutoResizeInput
                  name=""
                  defaultValue={defaultValue}
                  isNumber={true}
                  placeholder="0"
                  onBlur={handleChange}
                  isForm={false}
                />
              ) : (
                <SquareToggle
                  value={rowData.is_active}
                  leftText={t('stocking')}
                  rightText={t('out_of_stock')}
                  onClick={(value) => onToggleChange(rowIndex, value)}
                />
              )}
            </div>
          );
        },
      };
  return [
    {
      key: 'media',
      name: 'media',
      label: t('image'),
      align: 'center',
      width: 74,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex } = props;
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <UploadAvatar
              fileList={rowData.media}
              onChange={(fileList) => {
                onUpdateMedia(rowIndex, fileList);
              }}
              disabled={rowData.hide_sku ? true : false}
            />
          </div>
        );
      },
    },
    ...columns,
    {
      key: 'normal_price',
      name: 'normal_price',
      label: t('normal_price'),
      align: 'right',
      required: true,
      width: 132,
      colSpan: 3,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex, dataKey } = props;
        const defaultValue = rowData[dataKey]?.toString() || '';
        const handleChange = (value: string) => {
          onInputChange(rowIndex, dataKey, value);
        };
        if (rowData.hide_sku === true) {
          return (
            <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
              <Tag>{t('not_existed_variant')}</Tag>
            </div>
          );
        }
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <AutoResizeInput
              name=""
              defaultValue={defaultValue}
              isNumber={true}
              placeholder="0"
              onBlur={handleChange}
              isForm={false}
            />
          </div>
        );
      },
    },
    {
      key: 'historical_cost',
      name: 'historical_cost',
      label: t('historical_cost'),
      align: 'right',
      width: 132,
      cell: (props: ExpectedAny) => {
        const { rowData, rowIndex, dataKey } = props;
        const defaultValue = rowData[dataKey]?.toString() || '';
        const handleChange = (value: string) => {
          onInputChange(rowIndex, dataKey, value);
        };
        return (
          <div className="pw-h-full pw-flex pw-items-center pw-justify-end pw-pr-2.5">
            <AutoResizeInput
              name=""
              defaultValue={defaultValue}
              isNumber={true}
              placeholder="0"
              onBlur={handleChange}
              isForm={false}
            />
          </div>
        );
      },
    },
    statusColumn,
    {
      key: 'action',
      name: 'action',
      label: '',
      width: 106,
      cell: (props: ExpectedAny) => {
        const { rowIndex, rowData } = props;
        return (
          <div className="pw-h-full pw-flex pw-flex-col pw-justify-center">
            <div className="pw-flex pw-p-1 pw-bg-transparent pw-rounded-md pw-justify-center pw-gap-x-6">
              <OpenDetailDrawerButton rowData={rowData} rowIndex={rowIndex} onClick={onOpenDetailDrawer} />
              <ShowHideVariantButton rowData={rowData} rowIndex={rowIndex} onClick={onDisableRow} />
            </div>
          </div>
        );
      },
    },
  ];
};

export const variantDetailYubSchema = () => {
  return skuYupSchema();
};

export const variantDetailFormSchema = ({
  is_active,
  media,
  sku_type,
  has_ingredient,
  activeTab,
  selectedSku,
  ingredientsLength,
  onStatusChange,
  onRangeWholesalePriceChange,
  onMediaChange,
  onRecipeChange,
}: {
  is_active: boolean;
  media?: ExpectedAny;
  sku_type: string;
  has_ingredient: boolean;
  activeTab: InfoTabKeyType;
  selectedSku: PendingSku;
  ingredientsLength: number;
  onStatusChange(value: boolean): void;
  onRangeWholesalePriceChange(value: RangeWholesalePrice[]): void;
  onMediaChange(value: ExpectedAny): void;
  onRecipeChange(value: ExpectedAny): void;
}): FormSchema => {
  const { t } = useTranslation(['products-form', 'common']);
  const is_advance_stock = sku_type === 'stock';
  const infoContent = {
    className: '',
    name: 'first-col',
    type: 'block-container',
    children: [
      {
        className: ``,
        blockClassName: '',
        type: 'block',
        name: 'upload-image',
        children: [
          {
            type: ComponentType.Custom,
            value: '',
            name: `media`,
            size: 96,
            fileList: media,
            onChange: onMediaChange,
            component: UploadAvatar,
          },
        ],
      },
      {
        className: `pw-grid pw-grid-cols-12 pw-gap-4`,
        blockClassName: 'pw-py-6 pw-bg-white pw-border-b pw-border-solid pw-border-gray-200',
        type: 'block',
        title: t('general_info', { ns: 'common' }),
        name: 'general-block',
        children: [
          {
            type: ComponentType.Text,
            className: 'pw-col-span-4',
            value: '',
            label: t('uom'),
            name: `uom`,
            placeholder: t('placeholder.uom'),
          },
          {
            type: ComponentType.Text,
            className: 'pw-col-span-4',
            name: `sku_code`,
            value: '',
            label: t('sku_code') || '',
          },
          {
            type: ComponentType.Text,
            className: 'pw-col-span-4',
            name: `barcode`,
            label: t('barcode') || '',
            value: '',
          },
        ],
      },
      {
        className: `pw-grid pw-grid-cols-12 pw-gap-4`,
        blockClassName: cx('pw-py-6 pw-bg-white pw-border-b pw-border-solid pw-border-gray-200', {
          '!pw-border-none': has_ingredient,
        }),
        type: 'block',
        title: t('product_price'),
        subTitle: '',
        name: 'price-block',
        children: [
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-4',
            name: 'normal_price',
            label: t('normal_price') || '',
            placeholder: '0',
          },
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-4',
            name: 'historical_cost',
            label: t('historical_cost') || '',
            placeholder: '0',
          },
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-4',
            name: 'selling_price',
            label: t('selling_price') || '',
            placeholder: '0',
          },
          {
            type: ComponentType.Custom,
            className: 'pw-col-span-12',
            name: '',
            onChange: onRangeWholesalePriceChange,
            component: WholesalePrice,
          },
        ],
      },
      {
        className: `pw-flex pw-justify-between pw-items-center`,
        blockClassName: 'pw-py-6 pw-bg-white',
        type: 'block',
        name: 'po_block',
        visible: has_ingredient ? false : is_advance_stock ? false : true,
        children: [
          {
            type: ComponentType.Custom,
            name: 'status',
            component: () => <h4 className="pw-text-base pw-font-bold pw-tracking-tighter">{t('status')}</h4>,
          },
          {
            type: ComponentType.Custom,
            name: 'po_detail',
            leftText: t('stocking_item'),
            rightText: t('out_of_stock_item'),
            value: is_active,
            onClick: (value: boolean) => onStatusChange(value),
            component: SquareToggle,
          },
        ],
      },
      {
        type: 'block',
        name: 'advance_stock',
        blockClassName: 'pw-pt-6',
        title: t('tracking_stock_quantity'),
        visible: has_ingredient ? false : is_advance_stock ? true : false,
        className: 'pw-grid pw-grid-cols-12 pw-gap-4',
        children: [
          {
            type: ComponentType.Currency,
            name: 'po_details.quantity',
            label: t('inventory'),
            placeholder: '0',
            className: 'pw-col-span-6',
          },
          {
            type: ComponentType.Currency,
            name: 'po_details.blocked_quantity',
            label: t('blocked_quantity'),
            placeholder: '0',
            className: 'pw-col-span-6',
          },
          {
            type: ComponentType.Custom,
            name: 'po_details',
            label: t('blocked_quantity'),
            className: 'pw-col-span-12',
            component: AdvanceStockBar,
          },
          {
            type: ComponentType.Custom,
            name: 'po_details.warning_value',
            label: '',
            className: 'pw-col-span-12',
            component: AdvanceStockWarning,
          },
        ],
      },
    ],
  };

  const recipeContent = {
    className: '',
    name: 'first-col',
    type: 'block-container',
    children: [
      selectedSku.recipe.length === 0
        ? {
            type: ComponentType.Custom,
            name: 'recipe',
            selectedSku,
            ingredientsLength,
            onChange: onRecipeChange,
            component: EmptyRecipeProduct,
          }
        : {
            type: ComponentType.Custom,
            name: 'recipe',
            selectedSku,
            onChange: onRecipeChange,
            component: IngredientsTable,
          },
    ],
  };

  return {
    className: '',
    type: 'container',
    name: 'form',
    children: [activeTab === InfoTabKeyType.INFO ? infoContent : recipeContent],
  };
};
