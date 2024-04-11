import { useState, Suspense, Fragment } from 'react';
import { Nav } from 'rsuite';
import TopBarProgress from 'react-topbar-progress-indicator';
import { useSearchParams } from 'react-router-dom';
import { TabKeyType, tabs } from './utils';
import { ActionsButton } from '~app/features/contacts/details/components';

const Navbar = ({
  active,
  onSelect,
  appearance,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: TabKeyType) => void;
}): JSX.Element => {
  return (
    <Nav {...props} appearance={appearance} activeKey={active} onSelect={onSelect}>
      {Object.values(TabKeyType).map((item: TabKeyType) => {
        const { icon, name, isDisplay } = tabs()?.[item] || {};

        if (!isDisplay) return;
        return (
          <Nav.Item eventKey={item}>
            <div className="pw-pt-2 pw-px-2 pw-font-semibold pw-flex pw-items-center pw-justify-center pw-gap-2 pw-pb-3">
              {icon}
              {name}
            </div>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

const ContactTabs = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') as TabKeyType;
  const defaultActiveTab =
    defaultTab && tabs()?.[defaultTab as TabKeyType]?.isDisplay ? defaultTab : TabKeyType.OVERVIEW;
  const [activeTab, setActiveTab] = useState<TabKeyType>(defaultActiveTab);
  const Component = tabs()?.[activeTab as TabKeyType]?.element || Fragment;

  return (
    <div className="pw-flex pw-flex-grow pw-flex-col pw-overflow-hidden">
      <div className="pw-relative pw-py-3 pw-pr-6">
        <Navbar appearance="subtle" active={activeTab} onSelect={setActiveTab} />
        <ActionsButton />
      </div>
      <div className="pw-flex-1 pw-overflow-auto pw-p-4 pw-pt-2">
        <Suspense fallback={<TopBarProgress />}>
          <Component />
        </Suspense>
      </div>
    </div>
  );
};

export default ContactTabs;
