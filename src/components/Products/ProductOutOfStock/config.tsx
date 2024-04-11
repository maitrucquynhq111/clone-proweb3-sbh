import * as yup from 'yup';
import ListProduct from './ListProduct';
import { ComponentType } from '~app/components/HookForm/utils';
import { AuthService } from '~app/services/api';

export const promotionYupSchema = () => {
  return yup.object().shape({
    data: yup.array(),
  });
};

type FormSchemaProps = {
  data: OutOfStockItem[];
  setValue: (name: string, value: ExpectedAny) => void;
};

export const productFormSchema = ({ data, setValue }: FormSchemaProps) => {
  const content = [
    {
      type: ComponentType.Custom,
      data: data,
      name: 'products',
      setValue,
      component: ListProduct,
    },
  ];

  return {
    type: 'container',
    name: 'form',
    children: content,
  };
};

export const toPendingSoldOut = (data: ExpectedAny) => {
  const formatData = {
    sku_id: data.id,
    name: data.sku_name || data.product_name,
    description: data.description || '',
    images: data.media,
    selling_price: data.selling_price,
    normal_price: data.normal_price,
    uom: data.uom,
    sku_code: data.sku_code,
    barcode: data.barcode,
    is_active: data.is_active,
    business_id: AuthService.getBusinessId() || '',
  };
  if (data?.po_details && data?.po_details?.quantity > 0) {
    Object.assign(formatData, {
      po_details: { quantity: data.po_details.quantity },
    });
  }
  return formatData;
};
