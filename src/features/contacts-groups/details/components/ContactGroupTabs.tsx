import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Nav } from 'rsuite';
import { ContactDetailTabKey, CONTACT_GROUP_TABS } from '../config';

const Navbar = ({
  active,
  onSelect,
  appearance,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: ContactDetailTabKey) => void;
}): JSX.Element => {
  const { t } = useTranslation('contact-group-form');
  return (
    <Nav {...props} appearance={appearance} activeKey={active} onSelect={onSelect}>
      {Object.values(ContactDetailTabKey).map((item: ContactDetailTabKey) => {
        const { icon, name } = CONTACT_GROUP_TABS?.[item] || {};
        return (
          <Nav.Item eventKey={item} className="!pw-pl-0 !pw-pb-3 !pw-mr-6">
            <div className="pw-pt-2 pw-font-semibold pw-flex pw-items-center pw-justify-center pw-gap-2">
              {icon}
              <span>{t(`contact-group-form:${name}`)}</span>
            </div>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

type Props = {
  className?: string;
  activeTab: ContactDetailTabKey;
  setActiveTab(value: ContactDetailTabKey): void;
};

const ContactGroupTabs = ({ className, activeTab, setActiveTab }: Props) => {
  return (
    <div className={cx('pw-overflow-hidde pw-bg-white pw-px-6', className)}>
      <Navbar appearance="subtle" active={activeTab} onSelect={setActiveTab} />
    </div>
  );
};

export default ContactGroupTabs;
