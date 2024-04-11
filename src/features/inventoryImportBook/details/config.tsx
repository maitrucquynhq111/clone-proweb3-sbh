import { useTranslation } from 'react-i18next';
import { Title } from './components';
import {
  SkuTable,
  IngredientTable,
  Payment,
  SupplierInfo,
  PaymentHistory,
  Note,
} from '~app/features/inventory/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { FormSchema } from '~app/components';
import { ID_EMPTY } from '~app/configs';
import { PaymentStateInventory } from '~app/features/warehouse/utils';

type Props = {
  inventoryDetail: InventoryDetail | null;
};

export const importGoodsFormSchema = ({ inventoryDetail }: Props): FormSchema => {
  const { t } = useTranslation(['purchase-order']);
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12 pw-mb-4',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            type: ComponentType.Custom,
            paymentState: inventoryDetail?.payment_state || '',
            staffInfo: inventoryDetail?.staff_info || null,
            component: Title,
          },
        ],
      },
      {
        className: 'pw-col-span-8',
        name: 'second-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('import-goods-info'),
            name: 'first-block',
            subTitle: '',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                visible: inventoryDetail?.list_item ? inventoryDetail.list_item.length > 0 : false,
                listItem: inventoryDetail?.list_item || [],
                component: SkuTable,
              },
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                visible: inventoryDetail?.list_ingredient ? inventoryDetail.list_ingredient.length > 0 : false,
                listIngredient: inventoryDetail?.list_ingredient || [],
                component: IngredientTable,
              },
              {
                type: ComponentType.Custom,
                name: 'products-payment',
                className: 'pw-col-span-12',
                inventoryDetail,
                component: Payment,
              },
            ],
          },
        ],
      },
      {
        className: 'pw-col-span-4 pw-gap-y-6',
        name: 'third-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mb-4',
            type: 'block',
            title: t('supplier_info'),
            name: 'first-block',
            visible: inventoryDetail?.contact_info?.id !== ID_EMPTY,
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                contactInfo: inventoryDetail?.contact_info || null,
                component: SupplierInfo,
              },
            ],
          },
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mb-4',
            type: 'block',
            title: '',
            name: 'second-block',
            visible:
              inventoryDetail &&
              (inventoryDetail?.payment_purchase_order?.length > 0 ||
                (inventoryDetail?.payment_state !== PaymentStateInventory.PAID &&
                  inventoryDetail?.payment_state !== PaymentStateInventory.EMPTY &&
                  inventoryDetail.total_amount > 0)),
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                inventoryDetail,
                component: PaymentHistory,
              },
            ],
          },
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('note'),
            name: 'third-block',
            visible: !!inventoryDetail?.note || !!inventoryDetail?.media?.length,
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                note: inventoryDetail?.note,
                media: inventoryDetail?.media || [],
                component: Note,
              },
            ],
          },
        ],
      },
    ],
  };
};
