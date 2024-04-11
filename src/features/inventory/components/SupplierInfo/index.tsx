import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { generateFullLocation } from '~app/utils/helpers';
import { ContactInfo } from '~app/components';

type Props = {
  contactInfo: ContactInfo | null;
};

const SupplierInfo = ({ contactInfo }: Props) => {
  const { t } = useTranslation('purchase-order');

  return (
    <>
      <ContactInfo
        avatar={contactInfo?.social_avatar || contactInfo?.avatar}
        title={contactInfo?.name}
        subTitle={contactInfo?.phone_number}
        className={cx('pw-justify-between pw-items-center', {
          'pw-mb-3': contactInfo?.address,
        })}
        titleClassName="pw-text-base pw-font-semibold"
        subTitleClassName="!pw-text-sm pw-text-neutral-secondary"
      />
      {contactInfo?.address && (
        <div className="pw-text-sm pw-mb-3">
          <span className="pw-text-neutral-secondary pw-font-semibold pw-mr-0.5">{t('common:address')}:</span>
          <span>{generateFullLocation({ location: contactInfo?.address })}</span>
        </div>
      )}
    </>
  );
};

export default SupplierInfo;
