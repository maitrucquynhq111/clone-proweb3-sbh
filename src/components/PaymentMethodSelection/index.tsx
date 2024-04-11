import cx from 'classnames';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCashCoin } from 'react-icons/bs';
import { FaMoneyCheck } from 'react-icons/fa';
import { PaymentMethod, DEFAULT_BANK, NEOX_PAYMENT_METHOD, DIRECT_PAYMENT_METHOD } from './utils';
import PaymentMethodCollapse from './PaymentMethodCollapse';
import {
  useCheckTurnOnNeoXQuery,
  useEPaymentMethodsQuery,
  useLinkedBanksQuery,
  usePaymentsInfo,
} from '~app/services/queries';
import { IconMomo, IconVietQr } from '~app/components/Icons';

type Props = {
  defaultValue?: string;
  onSelect(payment_method: string, bank_inf?: BankInfo): void;
};

const PaymentMethodSelection = ({ defaultValue = '', onSelect }: Props) => {
  const { t } = useTranslation('');
  const { data: linkedBanks } = useLinkedBanksQuery();
  const { data: ePaymentMethods } = useEPaymentMethodsQuery();
  const { data: listPaymentInfo } = usePaymentsInfo();
  const { data: activeNeoX } = useEPaymentMethodsQuery('NeoX');
  const { data: isTurnOnNeoX } = useCheckTurnOnNeoXQuery();

  const [selectedPaymentType, setSelectPaymentType] = useState(defaultValue);
  const [selectedBankInfo, setSelectedBankInfo] = useState<BankInfo | null>(null);

  const VIET_QR_BANK = useMemo(() => {
    const result: EPaymentMethod[] = [];
    if (linkedBanks) {
      linkedBanks.forEach((item) => {
        const newBankInfo = {
          id: item?.sourceId || '',
          payment_type: item?.bankCode || '',
          payment_info: {
            account_name: item?.sourceName || '',
            account_number: item?.vaNumber || '',
            bank_name: item?.bankCode?.toLocaleLowerCase(),
          },
          user_id: item?.sourceId || '',
        } as EPaymentMethod;
        result.push(newBankInfo);
      });
    }
    if (ePaymentMethods) {
      ePaymentMethods.forEach((item) => {
        if (item.payment_type === PaymentMethod.HDB) {
          result.push(item);
        }
      });
    }
    if (listPaymentInfo) {
      listPaymentInfo.forEach((item) => {
        if (item?.information?.bank_code === PaymentMethod.MB) {
          const newBankInfo = {
            id: item.id,
            payment_type: PaymentMethod.MB,
            payment_info: {
              account_name: item?.information?.account_owner,
              account_number: item?.information?.account_number,
            },
            user_id: item.user_id,
          } as EPaymentMethod;
          result.push(newBankInfo);
        }
      });
    }
    return result;
  }, [linkedBanks, ePaymentMethods, listPaymentInfo]);

  const showNeoX = useMemo(() => {
    if (!activeNeoX) return false;
    if (activeNeoX.length === 0) return false;
    return isTurnOnNeoX;
  }, [activeNeoX, isTurnOnNeoX]);

  const filteredPaymentInfo = useMemo(() => {
    if (!listPaymentInfo) return [];
    return listPaymentInfo.filter((item) => item?.information.bank_code !== PaymentMethod.MB);
  }, [listPaymentInfo]);

  const momoPaymentInfo = useMemo(() => {
    return filteredPaymentInfo.find((item) => item?.payment_method === PaymentMethod.MOMO);
  }, [filteredPaymentInfo]);

  const bankingPaymentInfo = useMemo(() => {
    return filteredPaymentInfo.filter((item) => item?.payment_method === PaymentMethod.BANKING);
  }, [filteredPaymentInfo]);

  return (
    <div className="pw-bg-neutral-white pw-flex pw-flex-col pw-max-w-sm">
      {VIET_QR_BANK.length > 0 ? (
        <PaymentMethodCollapse icon={<IconVietQr />} title={t('chat:viet_qr_payment')} className="pw-py-3 pw-px-4">
          {DEFAULT_BANK.filter((item) => VIET_QR_BANK.some((bank) => item.payment_type === bank.payment_type)).map(
            (item, index) => {
              return (
                <div
                  className={cx('pw-flex pw-py-3 pw-ml-8 pw-justify-between', {
                    'pw-border-t pw-border-solid pw-border-neutral-divider': index !== 0,
                  })}
                  key={item.payment_type}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectPaymentType(item.payment_type);
                    onSelect(item.payment_type);
                  }}
                >
                  <div className="pw-flex pw-items-center pw-gap-x-2">
                    {item.icon}
                    <span className="pw-text-base pw-text-neutral-primary">{item.name}</span>
                  </div>
                  <div className="pw-wrapper-custom-radio_green">
                    <input checked={item.payment_type === selectedPaymentType} type="radio" readOnly />
                    <span className="pw-checkmark-custom-radio_green"></span>
                  </div>
                </div>
              );
            },
          )}
        </PaymentMethodCollapse>
      ) : null}
      {showNeoX
        ? NEOX_PAYMENT_METHOD.map((item) => {
            return (
              <div
                className="pw-flex pw-py-3 pw-px-4 pw-cursor-pointer pw-justify-between pw-border-t pw-border-solid pw-border-neutral-divider"
                key={item.payment_type}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectPaymentType(item.payment_type);
                  onSelect(item.payment_type);
                }}
              >
                <div className="pw-flex pw-items-center pw-gap-x-2">
                  {item.icon}
                  <span className="pw-text-base pw-text-neutral-primary">{t(`chat:${item.name}`)}</span>
                </div>
                <div className="pw-wrapper-custom-radio_green">
                  <input checked={item.payment_type === selectedPaymentType} type="radio" readOnly />
                  <span className="pw-checkmark-custom-radio_green"></span>
                </div>
              </div>
            );
          })
        : null}
      <PaymentMethodCollapse
        icon={<BsCashCoin size={24} className="pw-text-neutral-secondary" />}
        title={t('chat:direct')}
        className={cx('pw-py-3 pw-px-4 ', {
          'pw-border-t pw-border-solid pw-border-neutral-divider': showNeoX || VIET_QR_BANK.length > 0,
        })}
      >
        <>
          {DIRECT_PAYMENT_METHOD.map((item) => {
            return (
              <div
                className="pw-flex pw-py-3 pw-ml-8 pw-justify-between"
                key={item.payment_type}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectPaymentType(item.payment_type);
                  onSelect(item.payment_type);
                }}
              >
                <div className="pw-flex pw-items-center pw-gap-x-2">
                  {item.icon}
                  <span className="pw-text-base pw-text-neutral-primary">{t(`chat:${item.name}`)}</span>
                </div>
                <div className="pw-wrapper-custom-radio_green">
                  <input checked={item.payment_type === selectedPaymentType} type="radio" readOnly />
                  <span className="pw-checkmark-custom-radio_green"></span>
                </div>
              </div>
            );
          })}
          {momoPaymentInfo ? (
            <div
              className="pw-flex pw-justify-between pw-py-3 pw-ml-8 pw-border-t pw-border-solid pw-border-neutral-divider"
              onClick={(e) => {
                e.stopPropagation();
                setSelectPaymentType(PaymentMethod.MOMO);
                onSelect(PaymentMethod.MOMO, momoPaymentInfo?.information);
              }}
            >
              <div className="pw-flex pw-items-center pw-gap-x-2">
                <IconMomo />
                <span className="pw-text-base pw-text-neutral-primary">MOMO</span>
              </div>
              <div className="pw-wrapper-custom-radio_green">
                <input checked={selectedPaymentType === PaymentMethod.MOMO} type="radio" readOnly />
                <span className="pw-checkmark-custom-radio_green"></span>
              </div>
            </div>
          ) : null}
          {bankingPaymentInfo.map((item) => {
            const checked =
              selectedPaymentType === PaymentMethod.BANKING &&
              selectedBankInfo?.account_number === item?.information?.account_number;
            return (
              <div
                className="pw-flex pw-py-3 pw-justify-between pw-ml-8 pw-border-t pw-border-solid pw-border-neutral-divider"
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectPaymentType(PaymentMethod.BANKING);
                  setSelectedBankInfo(item?.information);
                  onSelect(PaymentMethod.BANKING, item?.information);
                }}
              >
                <div className="pw-flex pw-items-center pw-gap-x-2">
                  <FaMoneyCheck size={24} className="pw-text-neutral-placeholder" />
                  <span className="pw-text-base pw-text-neutral-primary pw-uppercase">
                    {item?.information?.bank_name}
                  </span>
                </div>
                <div className="pw-wrapper-custom-radio_green">
                  <input checked={checked} type="radio" readOnly />
                  <span className="pw-checkmark-custom-radio_green" />
                </div>
              </div>
            );
          })}
        </>
      </PaymentMethodCollapse>
    </div>
  );
};

export default memo(PaymentMethodSelection);
