import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCalendar3WeekFill, BsEnvelopeFill, BsHouseDoorFill, BsPencilFill } from 'react-icons/bs';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';
import { generateFullLocation } from '~app/utils/helpers';
import { ContactUpdateInline } from '~app/features/contacts/details/components';

const ContactInfo = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const [openUpdate, setOpenUpdate] = useState(false);
  const location = useMemo(() => generateFullLocation({ location: data?.address_info }), [data?.address_info]);

  return (
    <div className="pw-mb-6">
      <div className="pw-flex pw-items-center pw-mb-4">
        <h6 className="pw-text-lg pw-font-bold pw-mr-2">{t('title.contact_info')}</h6>
        <span className="pw-cursor-pointer" onClick={() => setOpenUpdate(true)}>
          <BsPencilFill size={18} className="pw-text-blue-primary" />
        </span>
      </div>
      <div className="pw-flex pw-items-center pw-mb-4">
        <BsHouseDoorFill size={16} className="pw-text-neutral-placeholder" />
        <span className="pw-ml-2">{location || t('empty_state.address')}</span>
      </div>
      <div className="pw-flex">
        <div className="pw-flex pw-items-center pw-mr-4">
          <BsEnvelopeFill size={16} className="pw-text-neutral-placeholder" />
          <span className="pw-ml-2">{data?.email || t('empty_state.email')}</span>
        </div>
        <div className="pw-flex pw-items-center">
          <BsCalendar3WeekFill size={16} className="pw-text-neutral-placeholder" />
          <span className="pw-ml-2">{data?.birthday || t('empty_state.birthday')}</span>
        </div>
      </div>
      {openUpdate && <ContactUpdateInline onClose={() => setOpenUpdate(false)} />}
    </div>
  );
};

export default ContactInfo;
