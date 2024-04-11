import cx from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiPencilFill } from 'react-icons/ri';
import CustomerInfoDetail from './detail';
import { CustomerInfo } from './config';
import { formatPhoneWithZero, generateFullLocation } from '~app/utils/helpers';

type Props = {
  className?: string;
  id?: string;
  name: string;
  phoneNumber: string;
  addressInfo?: AddressInfo | null;
  showForm?: boolean;
  hasContact?: boolean;
  contactId?: string;
  error?: boolean;
  setError?(value: boolean): void;
  onClick?(name?: string, phone_number?: string, address_info?: AddressInfo | null): void;
};

const EditableCustomerInfo = ({
  id,
  name,
  phoneNumber,
  addressInfo,
  contactId,
  showForm = false,
  hasContact = false,
  error = false,
  className,
  setError,
  onClick,
}: Props) => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);

  const defaultCustomerInfo = useMemo(() => {
    return {
      id,
      name,
      phone_number: phoneNumber,
      address_info: addressInfo,
    } as CustomerInfo;
  }, [id, name, phoneNumber, addressInfo]);

  const handleSelectCustomerInfo = useCallback(
    (value: ContactDeliveringAddress) => {
      onClick?.(value.name, value.phone_number, value.address_info);
      setError?.(false);
    },
    [onClick, setError],
  );

  const handleClose = () => setIsEdit(false);

  return (
    <div className={cx(className)}>
      {isEdit && showForm ? null : (
        <>
          <div className="pw-flex pw-items-center pw-justify-between pw-gap-x-2">
            <div className="pw-flex pw-gap-x-2 pw-items-center">
              <div className="pw-text-sm pw-text-neutral-primary pw-max-w-1/2 line-clamp-1">{name}</div>
              <div className="pw-h-2 pw-border-l pw-border-solid pw-border-neutral-border" />
              {phoneNumber ? (
                <span className="pw-text-sm pw-text-neutral-primary">{formatPhoneWithZero(phoneNumber)}</span>
              ) : (
                <span
                  className={cx('pw-text-sm ', {
                    'pw-text-error-active': error,
                    'pw-text-neutral-placeholder': !error,
                  })}
                >
                  {t('contact-form:empty_phone_number')}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setIsEdit(true);
                onClick?.(name, phoneNumber, addressInfo);
              }}
            >
              <RiPencilFill className="pw-text-neutral-secondary" size={20} />
            </button>
          </div>
          {addressInfo?.district_id ? (
            <p className="pw-mt-1 pw-text-sm pw-text-neutral-primary">
              {generateFullLocation({
                location: addressInfo,
                showAddress: true,
              })}
            </p>
          ) : null}
        </>
      )}
      {showForm && isEdit ? (
        <CustomerInfoDetail
          onClose={handleClose}
          defaultCustomerInfo={defaultCustomerInfo}
          hasContact={hasContact}
          contactId={contactId}
          onSelectCustomerInfo={handleSelectCustomerInfo}
        />
      ) : null}
    </div>
  );
};

export default memo(EditableCustomerInfo);
