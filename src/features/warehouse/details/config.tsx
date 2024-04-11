import { useTranslation } from 'react-i18next';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { BsArrowRightCircle } from 'react-icons/bs';
import { AdvanceStockBar, AdvanceStockWarning } from '~app/features/products/components';
import { ImageTextCell } from '~app/components';
import { ComponentType } from '~app/components/HookForm/utils';
import { ModalTypes } from '~app/modals';
import { ProductPermission, useHasPermissions } from '~app/utils/shield';

export const defaultWarehouseDetails = () => ({
  sku_code: '',
  po_details: {
    pricing: 0,
    quantity: 0,
    blocked_quantity: 0,
    warning_value: 0,
  },
});

type Props = {
  productId: string;
  media: string[];
  name: string;
  product_name: string;
};

export const warehouseFormSchema = ({ productId, media, name, product_name }: Props) => {
  const { t } = useTranslation(['inventory-form', 'common']);
  const canUpdateHistoricalCost = useHasPermissions([ProductPermission.PRODUCT_PRODUCTDETAIL_COGS_VIEW]);
  const navigate = useNavigate();
  const location = useLocation();
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            className: `pw-items-center pw-grid pw-grid-cols-12 pw-gap-4`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Custom,
                label: '',
                name: 'info',
                className: 'pw-col-span-10 pw-mb-3',
                image: media[0],
                text: product_name,
                secondText: name,
                textClassName: 'pw-text-sm pw-font-semibold line-clamp-1',
                secondTextClassName: 'pw-text-sm',
                component: ImageTextCell,
              },
              {
                type: ComponentType.Custom,
                label: '',
                name: 'info_icon',
                className: 'pw-flex pw-justify-center pw-col-span-2 pw-mb-3 pw-text-blue-primary pw-cursor-pointer',
                size: 24,
                onClick: () =>
                  navigate({
                    pathname: location.pathname,
                    search: `?${createSearchParams({
                      modal: ModalTypes.ProductDetails,
                      id: productId,
                    })}`,
                  }),
                component: BsArrowRightCircle,
              },
            ],
          },
          {
            className: `pw-grid pw-grid-cols-2 pw-gap-4 pw-border-t pw-border-t-neutral-border pw-pt-5`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Text,
                label: t('sku_code'),
                name: 'sku_code',
              },
              {
                type: ComponentType.Currency,
                label: t('historical_cost'),
                name: 'po_details.pricing',
                visible: canUpdateHistoricalCost,
                placeholder: '0',
              },
              {
                type: ComponentType.DemicalInput,
                label: t('inventory'),
                name: 'po_details.quantity',
                isRequired: true,
                placeholder: '0',
              },
              {
                type: ComponentType.Currency,
                label: t('blocked_quantity'),
                name: 'po_details.blocked_quantity',
                placeholder: '0',
              },
              {
                type: ComponentType.Custom,
                name: 'po_details',
                label: '',
                className: 'pw-col-span-2 pw-mt-2 pw-text-sm',
                titleClassName: 'pw-text-xs pw-font-semibold',
                valueClassName: 'pw-text-sm pw-font-semibold',
                component: AdvanceStockBar,
              },
              {
                type: ComponentType.Custom,
                name: 'po_details.warning_value',
                label: '',
                className: 'pw-col-span-2 pw-mt-2',
                component: AdvanceStockWarning,
              },
            ],
          },
        ],
      },
    ],
  };
};
