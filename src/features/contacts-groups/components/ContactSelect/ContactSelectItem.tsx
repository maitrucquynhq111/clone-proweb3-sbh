import { BsXCircle } from 'react-icons/bs';
import { Checkbox } from 'rsuite';
import { ImageTextCell } from '~app/components';
import { formatPhoneWithZero } from '~app/utils/helpers';

type Props = {
  contact: Contact;
  checked?: boolean;
  onChange(contact: Contact, checked: boolean, isDelete?: boolean): void;
};

const ContactSelectItem = ({ contact, checked, onChange }: Props) => {
  return (
    <div
      className="pw-grid pw-grid-cols-12 pw-py-2.5 pw-pr-2 pw-cursor-pointer"
      onClick={() => {
        if (checked === undefined) return;
        onChange(contact, !checked);
      }}
    >
      <div className="pw-col-span-11">
        <ImageTextCell
          image={contact.avatar || contact.social_avatar}
          text={contact.name}
          secondText={formatPhoneWithZero(contact.phone_number)}
          isAvatar
          className="!pw-pl-0"
          imageClassName="!pw-rounded-full"
          textClassName="pw-font-bold pw-text-sm line-clamp-1"
          secondTextClassName="pw-text-neutral-secondary pw-text-sm line-clamp-1"
        />
      </div>
      <div className="pw-col-span-1 pw-flex pw-items-center pw-justify-center">
        {checked === undefined ? (
          <div className="pw-bg-white pw-cursor-pointer" onClick={() => onChange(contact, false, true)}>
            <BsXCircle size={24} />
          </div>
        ) : (
          <Checkbox
            checked={checked}
            onClick={(e) => {
              e.stopPropagation();
              onChange(contact, !checked);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContactSelectItem;
