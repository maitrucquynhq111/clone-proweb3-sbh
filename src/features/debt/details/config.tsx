import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { UseFormSetValue } from 'react-hook-form';
import { MAX_PRICE } from '~app/utils/constants';
import { ComponentType } from '~app/components/HookForm/utils';
import { Dropzone } from '~app/components';

export const debtbookYupSchema = () => {
  const { t } = useTranslation(['debtbook-form', 'common']);
  return yup.object().shape({
    amount: yup
      .number()
      .min(1, t('error.min_amount') || '')
      .max(MAX_PRICE, t('products-form:error.max_length') || '')
      .typeError(t('products-form:error.type_number') || ''),
  });
};

export const debtbookSchema = ({
  images = [],
  setValue,
}: {
  images: ExpectedAny;
  setValue: UseFormSetValue<ExpectedAny>;
}) => {
  const { t } = useTranslation('debtbook-form');
  return {
    className: 'pw-grid pw-grid-cols-12',
    type: 'container',
    name: 'form',
    children: [
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
