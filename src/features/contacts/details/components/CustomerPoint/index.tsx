import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { format } from 'date-fns';
import { BsPencilFill } from 'react-icons/bs';
import { Button } from 'rsuite';
import { useState } from 'react';
import CustomerPointModal from './CustomerPointModal';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { formatCurrency } from '~app/utils/helpers';
import { useCustomerPointHistoryQuery } from '~app/services/queries';
import { ContactUpdateInline } from '~app/features/contacts/details/components';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';

export enum OpenType {
  CUSTOMER_POINT = 'customer_point',
  CONTACT_UPDATE = 'contact_update',
}

const CustomerPoint = () => {
  const { t } = useTranslation('contact-details');
  const [openType, setOpenType] = useState<OpenType | ''>('');
  const { data } = useContactDetails();
  const { data: pointHistory } = useCustomerPointHistoryQuery({ page: 1, page_size: 1, contact_id: data?.id || '' });
  const canEditCustomerPoint = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_UPDATE]);

  return (
    <div
      className={cx('pw-border-b pw-border-b-neutral-border pw-mt-6', {
        '!pw-pb-6': data?.phone_number,
      })}
    >
      <div
        className={cx('pw-flex pw-items-center pw-justify-between pw-mb-6', {
          '!pw-mb-2.5': data?.phone_number,
        })}
      >
        <h6 className="pw-text-lg pw-font-bold">{t('title.customer_point')}</h6>
        {canEditCustomerPoint && data?.phone_number && (
          <span className="pw-cursor-pointer pw-text-blue-primary" onClick={() => setOpenType(OpenType.CUSTOMER_POINT)}>
            <BsPencilFill size={22} />
          </span>
        )}
      </div>
      {!data?.phone_number ? (
        <div className="pw-flex pw-flex-col pw-items-center pw-justify-center pw-text-center pw-mb-6">
          <p className="pw-text-base pw-mb-2 pw-mx-2">{t('empty_state.customer_point')}</p>
          <Button
            appearance="primary"
            size="md"
            className="!pw-font-bold"
            onClick={() => setOpenType(OpenType.CONTACT_UPDATE)}
          >
            {t('action.add_phone_number')}
          </Button>
        </div>
      ) : (
        <div className="pw-font-semibold">
          <div className="pw-mb-2">
            <p className="pw-text-xs pw-text-neutral-secondary pw-mb-1">{t('current_points')}</p>
            <p className="pw-text-sm pw-mt-0">{`${formatCurrency(data.customer_point)} ${t('common:point')}`}</p>
          </div>
          <p className="pw-text-xs pw-text-neutral-secondary pw-mb-1">{t('last_updated')}</p>
          <p className="pw-text-sm pw-mt-0">
            {pointHistory?.data?.[0] ? format(new Date(pointHistory?.data?.[0]?.updated_at), 'dd/MM/yyyy') : '-'}
          </p>
        </div>
      )}
      {openType === OpenType.CONTACT_UPDATE && (
        <ContactUpdateInline onClose={() => setOpenType('')} hideDelete={true} />
      )}
      {openType === OpenType.CUSTOMER_POINT && data && (
        <CustomerPointModal detail={data} onClose={() => setOpenType('')} />
      )}
    </div>
  );
};

export default CustomerPoint;
