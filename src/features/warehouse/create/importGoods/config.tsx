import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { UseFormSetValue } from 'react-hook-form';
import EmptyState from '../components/ListSkuSelected/EmptyState';
import { ComponentType } from '~app/components/HookForm/utils';
import { useContactsQuery } from '~app/services/queries';
import { ContactList } from '~app/features/cashbook/components';
import {
  GoodsSelection,
  ContactEdit,
  ListSkuSelected,
  ListIngredientSelected,
  Payment,
} from '~app/features/warehouse/create/components';
import { FormSchema, Dropzone } from '~app/components';

const contactsInitStateFunc = () => ({
  page: 1,
  page_size: 75,
});

export const purchaseYupSchema = () => {
  const { t } = useTranslation(['purchase-order']);
  return yup.object().shape({
    contact_name: yup.string().required(t('common:required_info') || ''),
  });
};

export const purchaseFormSchema = ({
  hasContact,
  images = [],
  poDetails = [],
  poDetailIngredient = [],
  isImportGoods,
  productSelectionRef,
  onRemoveContact,
  onContactChange,
  setValue,
}: {
  hasContact: boolean;
  isImportGoods: boolean;
  poDetails: PendingPoDetails[];
  poDetailIngredient: PendingPoDetailsIngredient[];
  productSelectionRef: ExpectedAny;
  images: ExpectedAny;
  onRemoveContact?(): void;
  onContactChange?(data: Contact): void;
  setValue: UseFormSetValue<ExpectedAny>;
}): FormSchema => {
  const { t } = useTranslation(['purchase-order']);
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-8',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            className: `pw-grid pw-grid-cols-12 pw-gap-4`,
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded',
            type: 'block',
            title: t('import-products'),
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
              {
                type: ComponentType.Custom,
                name: 'products-payment',
                className: 'pw-col-span-12',
                setValue,
                component: Payment,
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
            blockClassName: 'pw-p-6 pw-bg-white pw-rounded pw-mb-4',
            type: 'block',
            title: t('supplier'),
            name: 'first-block',
            subTitle: '',
            children: [
              {
                type: ComponentType.Custom,
                name: 'edit-contact-info',
                className: 'pw-col-span-12',
                visible: hasContact,
                onRemoveContact,
                component: ContactEdit,
              },
              {
                type: ComponentType.Custom,
                name: 'contact_id',
                className: 'pw-col-span-12',
                valueName: 'contact_id',
                labelName: 'contact_name',
                valueKey: 'id',
                labelKey: 'name',
                searchKey: 'search',
                placeholder: t('placeholder.contact'),
                visible: !hasContact,
                onChange: onContactChange,
                initStateFunc: contactsInitStateFunc,
                query: useContactsQuery,
                component: ContactList,
              },
            ],
          },
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
                    onChange: (files: ExpectedAny) => {
                      setValue('media', files);
                    },
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
