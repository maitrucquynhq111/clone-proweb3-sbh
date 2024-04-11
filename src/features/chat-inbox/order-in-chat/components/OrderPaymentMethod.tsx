import { memo, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMoneyCheck } from 'react-icons/fa';
import { HiChevronDown } from 'react-icons/hi';
import { Popover, Whisper } from 'rsuite';
import { PaymentMethodSelection } from '~app/components';
import { IconMomo } from '~app/components/Icons';
import {
  DEFAULT_BANK,
  DIRECT_PAYMENT_METHOD,
  NEOX_PAYMENT_METHOD,
  PaymentMethod,
} from '~app/components/PaymentMethodSelection/utils';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

const OrderPaymentMethod = () => {
  const { t } = useTranslation('chat');
  const whisperRef = useRef<ExpectedAny>();
  const [paymentMethod, setSelectedOrderStore] = useSelectedOrderStore((store) => store.payment_method);
  const [bankInfo] = useSelectedOrderStore((store) => store.bank_info);

  const appropriatePaymentInfo = useMemo(() => {
    return [...DEFAULT_BANK, ...DIRECT_PAYMENT_METHOD, ...NEOX_PAYMENT_METHOD].find(
      (item) => item.payment_type === paymentMethod,
    );
  }, [paymentMethod]);

  const handleSelect = (payment_method: string, bank_info?: BankInfo) => {
    setSelectedOrderStore((store) => ({ ...store, payment_method, bank_info }));
    whisperRef?.current.close();
  };

  useEffect(() => {
    setSelectedOrderStore((store) => ({ ...store, payment_method: PaymentMethod.COD }));
  }, [setSelectedOrderStore]);

  return (
    <div className="pw-py-6 pw-px-5 pw-bg-neutral-white pw-border-b pw-border-l pw-border-solid pw-border-neutral-divider">
      <div className="pw-flex pw-justify-between pw-items-center">
        <h3 className="pw-font-bold pw-text-base pw-text-neutral-primary">{t('payment_method')}</h3>
        <Whisper
          trigger="click"
          placement="autoVerticalEnd"
          ref={whisperRef}
          speaker={({ left, top, className }, ref) => {
            return (
              <Popover ref={ref} style={{ left, top }} full arrow={false} className={className}>
                <PaymentMethodSelection defaultValue={paymentMethod} onSelect={handleSelect} />
              </Popover>
            );
          }}
        >
          <button className="pw-flex pw-gap-x-1 pw-p-0.5">
            <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('common:change')}</span>
            <HiChevronDown size={20} className="pw-text-secondary-main-blue" />
          </button>
        </Whisper>
      </div>
      <div className="pw-mt-4 pw-flex pw-gap-x-3 pw-items-center">
        {paymentMethod === PaymentMethod.BANKING ? (
          <>
            <FaMoneyCheck size={24} className="pw-text-neutral-placeholder" />
            <span className="pw-text-base pw-text-neutral-primary">{bankInfo?.bank_name}</span>
          </>
        ) : null}
        {paymentMethod === PaymentMethod.MOMO ? (
          <>
            <IconMomo />
            <span className="pw-text-base pw-text-neutral-primary">MOMO</span>
          </>
        ) : null}
        {appropriatePaymentInfo ? (
          <>
            {appropriatePaymentInfo?.icon}
            <span>{t(`${appropriatePaymentInfo?.name}`)}</span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default memo(OrderPaymentMethod);
