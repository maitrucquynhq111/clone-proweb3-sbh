import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';
import { CreateUomButton, UomPickerItem, WarningToggle } from '~app/features/ingredients/ingredientsList/components';
import { useGetUomsQuery } from '~app/services/queries';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

export const ingredientYupSchema = () => {
  const { t } = useTranslation('ingredients-form');
  return yup.object().shape({
    name: yup
      .string()
      .required(t('common:required_info') || '')
      .max(30, t('error.max_name') || '')
      .trim(t('common:required_info') || ''),
    uom_name: yup.string().required(t('common:required_info') || ''),
    price: yup.number(),
    total_quantity: yup.number(),
    warning_quantity: yup.number().test('is_warning', t('common:required_info') || '', function Validate(value) {
      // If is_warning = true then must input warning_quantity
      const { is_warning } = this.parent;
      const warning = value ? value.toString().replace('.', '') : '';
      if (is_warning && (isNaN(+warning) || !warning)) return false;
      return true;
    }),
    is_warning: yup.boolean(),
  });
};

type FormSchemaProps = {
  is_warning: boolean;
  total_quantity: number;
  setValue(name: string, value: ExpectedAny): void;
};

export const ingredientFormSchema = ({ is_warning, total_quantity, setValue }: FormSchemaProps) => {
  const { t } = useTranslation('ingredients-form');
  const canViewPrice = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    id: 'ingredient-form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative pw-mb-4`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Text,
                className: 'pw-col-span-6',
                labelClassName: 'pw-font-bold',
                label: t('name'),
                name: 'name',
                isRequired: true,
                placeholder: t('placeholder.name'),
              },
              {
                type: ComponentType.RadioPicker,
                className: 'pw-col-span-6',
                label: t('uom') || '',
                name: 'uom_id',
                labelName: 'uom_name',
                placeholder: t('placeholder.uom') || '',
                isRequired: true,
                async: true,
                searchable: true,
                creatable: true,
                labelKey: 'name',
                valueKey: 'id',
                searchKey: 'name',
                subTitle: 'Đơn vị chuẩn',
                subTitleKey: 'is_standard',
                query: useGetUomsQuery,
                createButton: CreateUomButton,
                customRadioItem: UomPickerItem,
                initStateFunc: () => ({ page: 1, page_sze: 10 }),
                onChange: (data: Uom) => {
                  setValue('uom_id', data.id);
                  setValue('uom_name', data.name);
                },
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative pw-mb-8`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-6',
                label: t('historical_cost'),
                name: 'price',
                placeholder: '0',
                visible: canViewPrice,
              },
              {
                type: ComponentType.Currency,
                className: 'pw-col-span-6',
                label: t('inventory'),
                name: 'total_quantity',
                placeholder: '0',
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12',
            className: 'pw-flex pw-items-center pw-justify-end',
            type: 'block',
            name: 'third-block',
            children: [
              {
                className: 'pw-flex',
                type: 'block',
                name: 'warning-block',
                children: [
                  {
                    type: ComponentType.Custom,
                    className: is_warning ? 'pw-flex pw-items-center pw-mr-4' : '',
                    name: 'is_warning',
                    disabled: !total_quantity,
                    component: WarningToggle,
                  },
                  is_warning && {
                    type: ComponentType.Currency,
                    className: 'pw-w-28',
                    name: 'warning_quantity',
                    max: total_quantity,
                    placeholder: '0',
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
