import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { UseFormSetValue } from 'react-hook-form';
import ContactEdit from './components/ContactEdit';
import { MAX_PRICE } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';
import { useContactsQuery } from '~app/services/queries';
import { ContactList } from '~app/features/cashbook/components';
import { Dropzone } from '~app/components';

const contactsInitStateFunc = () => ({
  page: 1,
  page_size: 75,
});

export const debtbookYupSchema = () => {
  const { t } = useTranslation(['debtbook-form', 'common']);
  return yup.object().shape({
    amount: yup
      .number()
      .min(1, t('error.min_amount') || '')
      .max(MAX_PRICE, t('products-form:error.max_length') || '')
      .typeError(t('products-form:error.type_number') || ''),
    contact_name: yup.string().when('contact_id', {
      is: '',
      then: (schema) => schema.required(t('common:required_info') || ''),
    }),
  });
};

export const debtbookSchema = ({
  images = [],
  isEditContact,
  showContactBlock,
  setIsEditContact,
  onContactChange,
  setValue,
}: {
  isEditContact: boolean;
  showContactBlock: boolean;
  images: ExpectedAny;
  setIsEditContact(value: boolean): void;
  onContactChange(data: Contact): void;
  setValue: UseFormSetValue<PendingContactTransaction>;
}) => {
  const { t } = useTranslation('debtbook-form');
  return {
    className: 'pw-grid pw-grid-cols-12',
    type: 'container',
    name: 'form',
    children: [
      {
        blockClassName:
          'pw-col-span-12 pw-pt-2 pw-pb-6 pw-px-4 pw-border-b-gray-100 pw-border-b pw-border-solid -pw-mx-4',
        className: ``,
        type: 'block',
        visible: showContactBlock,
        name: 'first-block',
        children: [
          {
            type: ComponentType.Custom,
            name: 'edit-contact-info',
            className: 'pw-flex pw-w-full pw-justify-between pw-items-center',
            visible: isEditContact ? false : true,
            setIsEditContact,
            component: ContactEdit,
          },
          {
            type: ComponentType.Custom,
            name: 'contact_id',
            valueName: 'contact_id',
            labelName: 'contact_name',
            valueKey: 'id',
            labelKey: 'name',
            searchKey: 'search',
            label: t('contact'),
            placeholder: t('placeholder.contact'),
            visible: isEditContact ? true : false,
            onChange: onContactChange,
            isRequired: true,
            initStateFunc: contactsInitStateFunc,
            query: useContactsQuery,
            component: ContactList,
          },
        ],
      },
      {
        blockClassName: 'pw-col-span-12 pw-pt-6',
        className: 'pw-grid pw-grid-cols-2 pw-justify-center pw-items-center pw-gap-x-4',
        type: 'block',
        name: 'second-block',
        children: [
          {
            type: ComponentType.Currency,
            className: 'pw-col-span-1',
            labelClassName: 'pw-font-bold',
            label: t('amount'),
            name: 'amount',
            isRequired: true,
            placeholder: '0.000',
          },
          {
            type: ComponentType.Date,
            className: 'pw-col-span-1',
            label: t('transaction_time'),
            name: 'start_time',
            isForm: true,
            cleanable: false,
          },
        ],
      },
      {
        type: ComponentType.Text,
        as: 'textarea',
        rows: 3,
        className: 'pw-col-span-12 pw-mt-4',
        label: t('description'),
        name: 'description',
        placeholder: t('placeholder.description'),
      },
      {
        blockClassName: 'pw-col-span-12 pw-mt-4',
        type: 'block',
        name: t('trasaction_images'),
        subTitle: '',
        children: [
          {
            type: ComponentType.Label,
            key: 'label_images',
            name: 'images',
            isRequired: false,
            label: `${t('transaction_images')} (${images.length}/4)`,
          },
          {
            type: ComponentType.Custom,
            name: 'images',
            errorMessage: t('error.max_image_length'),
            component: Dropzone,
            maxFiles: 4,
            fileList: images,
            onChange: (files: ExpectedAny) => {
              setValue('images', files);
            },
          },
        ],
      },
    ],
  };
};
