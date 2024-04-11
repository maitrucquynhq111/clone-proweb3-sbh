import { Header, ContactTabs } from './components';

const ContactDetails = () => {
  return (
    <div className="pw-flex pw-flex-col pw-h-full pw-overflow-hidden">
      <Header />
      <div className="pw-flex pw-flex-1 pw-overflow-hidden pw-bg-white">
        <ContactTabs />
      </div>
    </div>
  );
};

export default ContactDetails;
