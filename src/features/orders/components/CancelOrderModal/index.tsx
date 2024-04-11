import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTrash } from 'react-icons/bs';
import { Checkbox, Modal } from 'rsuite';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  paymentOrderHistory: PaymentOrderHistory[];
  open: boolean;
  onClose(): void;
  onClick(value: string[]): void;
};

const CancelOrderModal = ({ paymentOrderHistory, open, onClose, onClick }: Props) => {
  const { t } = useTranslation('orders-form');
  const [checked, setChecked] = useState(true);
  const [cancelTransaction, setCancelTransaction] = useState<string[]>(['business_transaction']);

  const paidAmount = useMemo(() => {
    if (!paymentOrderHistory) return 0;
    return paymentOrderHistory.reduce((acc, prev) => acc + prev.amount, 0);
  }, [paymentOrderHistory]);

  const handleChecked = (checked: boolean) => {
    if (checked) {
      setChecked(true);
      setCancelTransaction(['business_transaction']);
    } else {
      setChecked(false);
      setCancelTransaction([]);
    }
  };

  return (
    <Modal
      open={open}
      keyboard={true}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 !-pw-translate-y-1/2 pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center !pw-my-0 center-modal"
      backdropClassName="!pw-z-[1050]"
    >
      <div className="pw-p-1 pw-bg-neutral-white">
        <div className="pw-flex pw-gap-x-4 pw-mb-6 pw-items-center">
          <BsTrash size={24} />
          <h4 className="pw-font-bold pw-text-lg pw-text-neutral-title">{t('cancel_order_title')}?</h4>
        </div>
        <div className="pw-text-base pw-text-neutral-secondary">{t('cancel_order_desc')}</div>
        {paidAmount ? (
          <div className="pw-flex pw-gap-x-2 pw-py-4 pw-items-center">
            <Checkbox checked={checked} onChange={(_, checked) => handleChecked(checked)} className="-pw-mx-2.5" />
            <div
              className="pw-text-base pw-text-neutral-primary pw-cursor-pointer"
              onClick={() => setChecked(!checked)}
            >
              <span className="">{t('delete_cashbook_transaction')}: </span>
              <span className="pw-font-semibold">{formatCurrency(paidAmount)}₫</span>
            </div>
          </div>
        ) : null}
        <div className="pw-flex pw-gap-x-3 pw-mt-6 pw-justify-end">
          <button
            className="pw-rounded pw-bg-error-active pw-text-neutral-white pw-font-bold pw-text-base pw-py-3 pw-px-4"
            onClick={(e) => {
              e.stopPropagation();
              onClick(cancelTransaction);
            }}
          >
            {t('action.confirm')}
          </button>
          <button
            className="pw-rounded pw-bg-neutral-white pw-border pw-border-solid pw-py-3 pw-px-4
            pw-border-neutral-border pw-text-base pw-text-neutral-primary pw-font-bold"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {t('action.back')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelOrderModal;
