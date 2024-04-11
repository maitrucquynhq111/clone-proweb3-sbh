import { UseFormSetValue } from 'react-hook-form';
import EmptyState from '../components/ListSkuSelected/EmptyState';
import { ComponentType } from '~app/components/HookForm/utils';
import { GoodsSelection, ListSkuSelected, ListIngredientSelected } from '~app/features/warehouse/create/components';
import { FormSchema, Dropzone } from '~app/components';
import { Title } from '~app/features/inventoryExportBook/details/components';

export const exportGoodsFormSchema = ({
  t,
  isEdit,
  status,
  staff_info,
  images = [],
  poDetails = [],
  poDetailIngredient = [],
  isImportGoods,
  productSelectionRef,
  setValue,
}: {
  t: ExpectedAny;
  isEdit?: boolean;
  status?: string;
  staff_info?: InventoryStaffInfo;
  isImportGoods: boolean;
  poDetails: PendingPoDetails[];
  poDetailIngredient: PendingPoDetailsIngredient[];
  productSelectionRef: ExpectedAny;
  images: ExpectedAny;
  setValue: UseFormSetValue<ExpectedAny>;
}): FormSchema => {
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12 pw-mb-4',
        name: 'first-col',
        type: 'block-container',
        visible: !!isEdit,
        children: [
          {
            type: ComponentType.Custom,
            status: status || '',
            staffInfo: staff_info || null,
            component: Title,
          },
        ],
      },
      {
        className: 'pw-col-span-8',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('export-products'),
            name: 'first-block',
            subTitle: '',
            children: [
              {
                type: ComponentType.Custom,
                name: 'products',
                className: 'pw-col-span-12',
                ref: productSelectionRef,
                setValue,
                isImportGoods,
                component: GoodsSelection,
              },
              {
                type: ComponentType.Custom,
                name: 'empty_state',
                className: 'pw-col-span-12',
                isImportGoods,
                visible: poDetails.length === 0 && poDetailIngredient.length === 0,
                component: EmptyState,
              },
              {
                type: ComponentType.Custom,
                name: 'po_detail_ingredient',
                className: 'pw-col-span-12',
                visible: poDetails.length > 0,
                isImportGoods,
                setValue,
                component: ListSkuSelected,
              },
              {
                type: ComponentType.Custom,
                name: 'po_details',
                className: 'pw-col-span-12',
                visible: poDetailIngredient.length > 0,
                isImportGoods,
                setValue,
                component: ListIngredientSelected,
              },
            ],
          },
        ],
      },
      {
        className: 'pw-col-span-4 pw-gap-y-6',
        name: 'second-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('more-information'),
            name: 'second-block',
            subTitle: '',
            children: [
              {
                type: ComponentType.Text,
                as: 'textarea',
                rows: 3,
                className: 'pw-col-span-12',
                label: t('note'),
                name: 'note',
                placeholder: t('placeholder.description'),
              },
              {
                blockClassName: 'pw-col-span-12',
                type: 'block',
                name: t('trasaction_images'),
                subTitle: '',
                children: [
                  {
                    type: ComponentType.Label,
                    key: 'label_images',
                    name: 'images',
                    isRequired: false,
                    label: `${t('transaction_images')} (${images.length}/3)`,
                  },
                  {
                    type: ComponentType.Custom,
                    name: 'media',
                    errorMessage: t('error.max_image_length'),
                    component: Dropzone,
                    maxFiles: 3,
                    fileList: images,
                    onChange: (files: ExpectedAny) => setValue('media', files),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
