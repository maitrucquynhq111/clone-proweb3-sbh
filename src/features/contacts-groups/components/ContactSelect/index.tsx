import ContactSelectInDetails from './ContactSelectInDetails';
import ContactSelectInUpdate from './ContactSelectInUpdate';

type Props = {
  error: string;
  contacts: Contact[];
  isDetails?: boolean;
  onChange(value: ExpectedAny): void;
};

const ContactSelect = ({ error, contacts = [], isDetails = false, onChange }: Props): JSX.Element => {
  return (
    <>
      {isDetails ? (
        <ContactSelectInDetails contacts={contacts} onChange={onChange} />
      ) : (
        <ContactSelectInUpdate contacts={contacts} error={error} onChange={onChange} />
      )}
    </>
  );
};

export default ContactSelect;
