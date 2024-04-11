import { useTranslation } from 'react-i18next';
import { AutoResizeInput } from '~app/components';
import { usePosStore, useSelectedOrderStore } from '~app/features/pos/hooks';
import { formatCurrency } from '~app/utils/helpers';

const DeliveryFee = () => {
  const { t } = useTranslation('pos');
  const [isEdit] = usePosStore((store) => store.is_edit_order);
  const [deliveryFee, setSelectedOrderStore] = useSelectedOrderStore((store) => store.delivery_fee);

  const handleChange = (value: string) => {
    setSelectedOrderStore((store) => ({ ...store, delivery_fee: +value }));
  };

  return (
    <div className="pw-flex pw-justify-between pw-items-center pw-py-1">
      <h4 className="pw-text-base pw-text-neutral-primary pw-font-normal">{t('delivery_fee')}</h4>
      {isEdit ? (
        <AutoResizeInput
          name=""
          isForm={false}
          isNumber
          defaultValue={deliveryFee.toString()}
          onChange={handleChange}
          className="!pw-bg-transparent"
          placeholder="0"
        />
      ) : (
        <span className="pw-text-base pw-text-neutral-primary pw-font-semibold">{formatCurrency(deliveryFee)}₫</span>
      )}
    </div>
  );
};

export default DeliveryFee;
