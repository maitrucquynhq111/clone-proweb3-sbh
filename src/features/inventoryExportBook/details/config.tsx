import { Title } from './components';
import { SkuTable, IngredientTable, Note } from '~app/features/inventory/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { FormSchema } from '~app/components';

type Props = {
  t: ExpectedAny;
  inventoryDetail: InventoryDetail | null;
};

export const exportGoodsDetailsSchema = ({ t, inventoryDetail }: Props): FormSchema => {
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
            status: inventoryDetail?.status || '',
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
            title: t('export-goods-info'),
            name: 'first-block',
            subTitle: '',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                visible: inventoryDetail?.list_item ? inventoryDetail.list_item.length > 0 : false,
                listItem: inventoryDetail?.list_item || [],
                isExport: true,
                component: SkuTable,
              },
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                visible: inventoryDetail?.list_ingredient ? inventoryDetail.list_ingredient.length > 0 : false,
                listIngredient: inventoryDetail?.list_ingredient || [],
                isExport: true,
                component: IngredientTable,
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
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('note'),
            name: 'second-block',
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
