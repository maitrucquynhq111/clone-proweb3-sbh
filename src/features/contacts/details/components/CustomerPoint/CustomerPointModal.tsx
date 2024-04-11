import { useEffect, useState, memo, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'rsuite';
import { toast } from 'react-toastify';
import { CurrencyInput, Loading } from '~app/components';
import { useUpdateCustomerPoint } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { CONTACT_ANALYTIC_KEY, CONTACT_DETAIL, CUSTOMER_POINT_HISTORY_KEY } from '~app/services/queries';
import { formatCurrency } from '~app/utils/helpers';

type Props = {
  detail: Contact;
  onClose(): void;
};

const CustomerPointModal = ({ detail, onClose }: Props) => {
  const { t } = useTranslation('contact-details');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutateAsync: updateCustomerPoint, isLoading } = useUpdateCustomerPoint();

  const [value, setValue] = useState('');

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleSuccess = () => {
    toast.success(t('contact-form:success.update_customer_point'));
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (+value === detail.customer_point) {
        handleSuccess();
        return;
      }
      await updateCustomerPoint({ id: detail.id, customer_point: +value });
      queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
      queryClient.invalidateQueries([CUSTOMER_POINT_HISTORY_KEY], { exact: false });
      queryClient.invalidateQueries([CONTACT_ANALYTIC_KEY], { exact: false });
      handleSuccess();
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    setValue(detail.customer_point.toString());
    inputRef.current?.focus();
  }, [detail]);

  const handleGetAfterChangedPoint = () => {
    const lastPoints = +value - detail.customer_point;
    return (
      <span
        className={cx('pw-text-success-active pw-lowercase', {
          '!pw-text-error-active': lastPoints < 0,
        })}
      >{`${lastPoints > 0 ? '+' : '-'}${formatCurrency(lastPoints)} ${t('common:point')}`}</span>
    );
  };

  return (
    <Modal
      open={true}
      keyboard={false}
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
      backdropClassName="!pw-z-1050"
    >
      <form onSubmit={handleSubmit}>
        <div className="pw-w-full pw-p-1">
          <label className="pw-inline-block pw-text-sm pw-font-normal pw-text-neutral-primary pw-mb-1">
            {t('change_current_point')}
          </label>
          <CurrencyInput
            name=""
            ref={inputRef}
            onChange={handleChange}
            isForm={false}
            value={value}
            placeholder="đ"
            autoFocus={true}
            inputGroupClassName="pw-px-4 pw-py-2"
            inputClassName="!pw-border-none !pw-outline-none !pw-px-0"
          />
          {+value !== detail.customer_point && (
            <span className="pw-text-xs pw-font-semibold pw-text-neutral-secondary pw-mt-1">
              {t('will')} {handleGetAfterChangedPoint()} {t('compare_with_previous')}
            </span>
          )}
          <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-4">
            <Button appearance="ghost" type="button" onClick={onClose}>
              {t('common:cancel')}
            </Button>
            <Button appearance="primary" type="submit">
              {t('common:update')}
            </Button>
          </div>
        </div>
      </form>
      {isLoading && <Loading backdrop className="pw-z-50" />}
    </Modal>
  );
};

export default memo(CustomerPointModal);
