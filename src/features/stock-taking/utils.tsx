import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import {
  IngredientTable,
  NoteAndImages,
  SkuIngredientSelection,
  SkuTable,
  Summary,
} from '~app/features/stock-taking/components';
import { Dropzone } from '~app/components';
import { StockTakingAnalyticStatus } from '~app/utils/constants';

export const defaultStockTaking: PendingStockTaking = {
  media: [],
  note: '',
  po_detail_ingredient: [],
  po_details: [],
  status: StockTakingAnalyticStatus.PROCESSING,
};

export function skuYupSchema() {
  return yup.object().shape({
    after_change_quantity: yup.string().required(),
  });
}

export function ingredientYupSchema() {
  return yup.object().shape({
    after_change_quantity: yup.string().required(),
  });
}

export function stockTakingYupSchema() {
  return yup.object().shape({
    po_details: yup.array(skuYupSchema()),
    po_detail_ingredient: yup.array(ingredientYupSchema()),
  });
}

export function stockTakingFormSchema({
  images,
  status,
  onAddSku,
  onAddIngredient,
  setValue,
}: {
  images: ExpectedAny[];
  status: string;
  onAddSku(sku: SkuInventory): void;
  onAddIngredient(sku: Ingredient): void;
  setValue(name: string, value: ExpectedAny): void;
}) {
  const { t } = useTranslation('stocktaking-form');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6 pw-h-full',
    type: 'container',
    name: 'form',
    children: [
      {
        blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-col-span-8',
        name: 'first-col',
        type: 'block',
        title: t('stocktaking_list'),
        titleClassName: status !== StockTakingAnalyticStatus.PROCESSING ? '!pw-pb-0' : '',
        children: [
          {
            name: 'sku_ingredient',
            type: ComponentType.Custom,
            inputClassName: 'pw-w-8/12',
            component: SkuIngredientSelection,
            onAddSku: onAddSku,
            onAddIngredient: onAddIngredient,
            visible: status === StockTakingAnalyticStatus.PROCESSING,
          },
          {
            name: 'sku_table',
            type: ComponentType.Custom,
            component: SkuTable,
          },
          {
            name: 'ingredient_table',
            type: ComponentType.Custom,
            component: IngredientTable,
          },
          {
            name: 'summary',
            type: ComponentType.Custom,
            component: Summary,
          },
        ],
      },
      {
        blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-col-span-4 pw-h-max',
        name: 'second-col',
        type: 'block',
        title: t('common:additional_info'),
        children: [
          {
            type: ComponentType.Text,
            as: 'textarea',
            rows: 2,
            className: 'pw-w-full',
            label: t('note') || '',
            name: 'note',
            placeholder: t('placeholder.note'),
            visible: status === StockTakingAnalyticStatus.PROCESSING,
          },
          {
            type: ComponentType.Label,
            key: 'label_images',
            name: 'images',
            isRequired: false,
            className: 'pw-mt-4',
            label: `${t('transaction_images')} (${images.length}/3)`,
            visible: status === StockTakingAnalyticStatus.PROCESSING,
          },
          {
            type: ComponentType.Custom,
            name: 'media',
            errorMessage: t('error.max_image_length'),
            component: Dropzone,
            maxFiles: 3,
            fileList: images,
            canRemoveAll: false,
            onChange: (files: ExpectedAny) => {
              setValue('media', files);
            },
            visible: status === StockTakingAnalyticStatus.PROCESSING,
          },
          {
            type: ComponentType.Custom,
            name: 'note_media',
            visible: status !== StockTakingAnalyticStatus.PROCESSING,
            component: NoteAndImages,
          },
        ],
      },
    ],
  };
}

export function toStockTakingBody(data: PendingStockTaking, uploadedImages: string[]) {
  return {
    business_id: '',
    option: 'create_po',
    type: 'stocktake',
    po_type: 'other',
    media: uploadedImages,
    note: data.note,
    status: data.status,
    po_details: data.po_details.map((item) => {
      return {
        sku_id: item.sku_id,
        after_change_quantity: +item.after_change_quantity,
      };
    }),
    po_detail_ingredient: data.po_detail_ingredient.map((item) => {
      return {
        sku_id: item.sku_id,
        after_change_quantity: +item.after_change_quantity,
        uom_id: item.uom_id,
      };
    }),
  } as StockTakingBody;
}

export function addSku(
  sku: SkuInventory,
  poDetails: PendingStockTakingPoDetailSku[],
  callback: (value: PendingStockTakingPoDetailSku[]) => void,
) {
  const existedIndex = poDetails.findIndex((item: ExpectedAny) => item.sku_id === sku.id);
  if (existedIndex !== -1) {
    const newPoDetails = poDetails.map((item, index) => {
      if (existedIndex === index) {
        return { ...item, after_change_quantity: String(+item.after_change_quantity + 1) };
      }
      return item;
    });
    return callback(newPoDetails);
  }
  const sku_info: PendingStockTakingPoDetailSkuInfo = {
    sku_code: sku.sku_code,
    sku_name: sku.sku_name,
    media: sku.media,
    product_name: sku.product_name,
    product_type: sku.product_type,
  };
  const newStockTakingPoDetailSku: PendingStockTakingPoDetailSku = {
    sku_info,
    sku_id: sku.id,
    after_change_quantity: '',
    before_change_quantity: sku.total_quantity,
  };
  callback([...poDetails, newStockTakingPoDetailSku]);
}

export function addIngredient(
  ingredient: Ingredient,
  poDetailIngredient: PendingStockTakingPoDetailIngredient[],
  callback: (value: PendingStockTakingPoDetailIngredient[]) => void,
) {
  const existedIndex = poDetailIngredient.findIndex((item) => item.sku_id === ingredient.id);
  if (existedIndex !== -1) {
    const newPoDetailIngredient = poDetailIngredient.map((item, index) => {
      if (existedIndex === index) {
        return { ...item, after_change_quantity: String(+item.after_change_quantity + 1) };
      }
      return item;
    });
    return callback(newPoDetailIngredient);
  }
  const newStockTakingPoDetailIngredient: PendingStockTakingPoDetailIngredient = {
    sku_id: ingredient.id,
    name: ingredient.name,
    uom_id: ingredient.uom_id,
    uom: ingredient.uom,
    after_change_quantity: '',
    before_change_quantity: ingredient.total_quantity,
  };
  callback([...poDetailIngredient, newStockTakingPoDetailIngredient]);
}

export function toPendingStockTaking(data: InventoryDetail) {
  const po_details: PendingStockTakingPoDetailSku[] = data?.list_item
    ? data.list_item.map((item) => {
        return {
          sku_id: item.id,
          sku_info: {
            media: item.media,
            product_name: item.product_name,
            product_type: item.product_type,
            sku_code: item.sku_code,
            sku_name: item.sku_name,
            uom: item?.uom,
          },
          before_change_quantity: item.before_change_quantity,
          after_change_quantity: String(item?.after_change_quantity ?? ''),
        };
      })
    : [];
  const po_detail_ingredient: PendingStockTakingPoDetailIngredient[] = data?.list_ingredient
    ? data.list_ingredient.map((item) => {
        return {
          sku_id: item.id,
          name: item.name,
          before_change_quantity: item.before_change_quantity,
          after_change_quantity: String(item?.after_change_quantity ?? ''),
          uom: item.uom,
          uom_id: item.uom_id,
        };
      })
    : [];
  return {
    media: data?.media || [],
    note: data?.note || '',
    po_detail_ingredient: po_detail_ingredient,
    po_details: po_details,
    status: data.status,
  } as PendingStockTaking;
}
