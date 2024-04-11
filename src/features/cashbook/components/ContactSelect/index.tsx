import cx from 'classnames';
import { memo } from 'react';
import { ButtonTransparent, ContactInfo } from '~app/components';

type Props = {
  checked: boolean;
  data: Contact;
  onChange(data: Contact): void;
};

const ContactSelect = ({ checked, data, onChange }: Props) => {
  return (
    <ButtonTransparent
      onClick={() => onChange(data)}
      className={cx('pw-truncate', {
        '!pw-bg-gray-200': checked,
        'hover:!pw-bg-gray-100': !checked,
      })}
    >
      <ContactInfo
        className="pw-p-3 pw-gap-x-4 "
        avatar={data.avatar}
        title={data.name}
        titleClassName="pw-text-base pw-font-normal pw-text-black"
        subTitle={data.phone_number}
        subTitleClassName="pw-text-sm pw-font-normal"
      />
    </ButtonTransparent>
  );
};

export default memo(ContactSelect);
