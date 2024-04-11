import { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'rsuite';
import { CurrencyInput } from '~app/components';
import { usePosStore } from '~app/features/pos/hooks/usePos';
import { useSelectedOrderStore } from '~app/features/pos/hooks/useSelectedOrder';

const DeliveryFeeModal = () => {
  const { t } = useTranslation(['pos', 'common']);
  const [showDeliveryModal, setPosStore] = usePosStore((store) => store.show_delivery_fee_modal);
  const [deliveryFee, setSelectedOrderStore] = useSelectedOrderStore((store) => store.delivery_fee);

  const [value, setValue] = useState('');

  const handleClose = () => {
    setPosStore((store) => ({ ...store, show_delivery_fee_modal: false }));
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSelectedOrderStore((store) => ({
      ...store,
      delivery_fee: value ? +value : 0,
      show_delivery_fee: !!value,
    }));
    handleClose();
    return;
  };

  useEffect(() => {
    setValue(deliveryFee ? deliveryFee.toString() : '');
  }, [deliveryFee]);

  return (
    <Modal
      open={showDeliveryModal}
      keyboard={false}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <form onSubmit={handleSubmit}>
        <div className="pw-w-full pw-p-1">
          <label className="pw-inline-block pw-text-sm pw-font-normal pw-text-neutral-primary pw-mb-1">
            {t('delivery_fee')}
          </label>
          <CurrencyInput
            name=""
            onChange={handleChange}
            isForm={false}
            value={value}
            placeholder="đ"
            autoFocus={true}
            inputGroupClassName="pw-px-4 pw-py-2"
            inputClassName="!pw-border-none !pw-outline-none !pw-px-0"
          />
          <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
            <Button appearance="ghost" type="button" onClick={handleClose}>
              {t('common:cancel')}
            </Button>
            <Button appearance="primary" type="submit">
              {t('common:modal-confirm')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default memo(DeliveryFeeModal);
