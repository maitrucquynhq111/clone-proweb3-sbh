import { useFormContext } from 'react-hook-form';
import { BsFillPencilFill } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { ContactInfo } from '~app/components';

type Props = {
  className?: string;
  setIsEditContact(value: boolean): void;
};

const ContactEdit = ({ className, setIsEditContact }: Props) => {
  const { watch } = useFormContext<PendingContactTransaction>();

  return (
    <div className={className}>
      <ContactInfo
        className="pw-gap-x-4 pw-items-center"
        avatar={watch('contact_avatar')}
        title={watch('contact_name')}
        titleClassName="pw-text-base pw-font-normal pw-text-black"
        subTitle={watch('contact_phone')}
        subTitleClassName="pw-text-sm pw-font-normal pw-mt-1"
      />
      <IconButton
        appearance="subtle"
        icon={<BsFillPencilFill className="pw-fill-blue-600 pw-w-6 pw-h-6" />}
        onClick={() => setIsEditContact(true)}
      />
    </div>
  );
};

export default ContactEdit;
