import { useTranslation } from 'react-i18next';
import { RiPencilFill } from 'react-icons/ri';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';
import { formatCurrency } from '~app/utils/helpers';
import { useContactPointUsedQuery } from '~app/services/queries';

type Props = {
  contactDetail: Contact;
  onClick?: () => void;
};

const HeaderAction = ({ contactDetail, onClick }: Props) => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactPointUsedQuery(contactDetail.id);
  const canEditCustomerPoint = useHasPermissions([CustomerPermission.CUSTOMER_LOYALTY_UPDATE]);

  return (
    <div className="pw-py-4 pw-bg-white">
      <div className="pw-grid pw-grid-cols-4 pw-space-x-1 pw-items-end">
        <div className="pw-px-4 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer !pw-bg-neutral-background">
          <div className="pw-flex pw-justify-between">
            <span className="pw-text-neutral-secondary pw-text-2xl pw-font-bold">
              {formatCurrency(contactDetail.customer_point)}
            </span>
            {canEditCustomerPoint && (
              <span onClick={onClick} className="pw-text-2xl pw-font-bold pw-cursor-pointer">
                <RiPencilFill size={20} className="pw-text-secondary-main-blue" />
              </span>
            )}
          </div>
          <div className="pw-text-neutral-secondary pw-text-base">{t('current_points')}</div>
        </div>
        <div className="pw-px-4 pw-text-white pw-p-2 pw-h-18 pw-cursor-pointer !pw-bg-neutral-background">
          <div className="pw-text-neutral-secondary pw-text-2xl pw-font-bold">{formatCurrency(data || 0)}</div>
          <div className="pw-text-neutral-secondary pw-text-base">{t('total_points_changed')}</div>
        </div>
      </div>{' '}
    </div>
  );
};

export default HeaderAction;
