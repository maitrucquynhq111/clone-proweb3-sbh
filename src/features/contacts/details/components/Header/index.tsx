import { BsFillTelephoneFill } from 'react-icons/bs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SocialInfo from './SocialInfo';
import { CONTACT_DETAIL } from '~app/services/queries';
import { AutoResizeInput, PlaceholderImage } from '~app/components';
import { formatPhoneWithZero, validatePhone } from '~app/utils/helpers';
import { toDefaultContact, toPendingContact } from '~app/features/contacts/utils';
import { useUpdateContactMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { RETAILCUSTOMER } from '~app/configs';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

const Header = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const { mutateAsync: updateContact } = useUpdateContactMutation();
  const [error, setError] = useState('');

  const handleBlur = async (value: string) => {
    if (!data) return;
    if (value && (isNaN(+value) || !validatePhone(value))) {
      setError(t('common:error_phone') || '');
      return;
    }

    // new value is different from old value
    if (formatPhoneWithZero(value) !== formatPhoneWithZero(data.phone_number)) {
      try {
        const pendingContact = toDefaultContact({ ...data, phone_number: value });
        const body = toPendingContact(pendingContact);
        await updateContact({ id: data.id, contact: body });
        queryClient.invalidateQueries([CONTACT_DETAIL], { exact: false });
        error && setError('');
        toast.success(t('contact-form:success.update') || '');
      } catch (error) {
        //
      }
    }
  };

  return (
    <div className="pw-h-24 pw-flex pw-px-4 pw-justify-between pw-items-center">
      <div className="pw-flex pw-items-center pw-gap-6 pw-max-w-[50vw]">
        <PlaceholderImage
          className="pw-bg-cover pw-rounded-full !pw-w-16 !pw-h-16 pw-object-cover"
          src={data?.social_avatar || data?.avatar}
          alt={data?.name}
          isAvatar={true}
          sizeDefaultAvatar="64"
        />
        <div>
          <h5 className="pw-font-bold pw-text-xl pw-mb-3 line-clamp-1">{data?.name}</h5>
          <div className="pw-relative pw-flex pw-items-center">
            <span className="pw-mr-2">
              <BsFillTelephoneFill size={16} className="pw-text-neutral-placeholder" />
            </span>
            <AutoResizeInput
              name=""
              disabled={data?.phone_number === RETAILCUSTOMER.phone_number}
              className="pw-cursor-pointer !pw-text-left pw-bg-transparent"
              defaultValue={formatPhoneWithZero(data?.phone_number || '')}
              placeholder={t('empty_state.phone_number') || ''}
              onBlur={handleBlur}
            />
          </div>
          {error && <p className="pw-text-xs pw-font-semibold pw-text-error-active pw-mt-1">{error}</p>}
        </div>
      </div>
      <SocialInfo data={data} />
    </div>
  );
};

export default Header;
