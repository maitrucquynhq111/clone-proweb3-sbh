import { Nav } from 'rsuite';
import cx from 'classnames';
import { InfoTabKeyType, tabs } from '~app/features/products/utils';

const Navbar = ({
  active,
  onSelect,
  appearance,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: InfoTabKeyType) => void;
}): JSX.Element => {
  return (
    <Nav {...props} appearance={appearance} activeKey={active} onSelect={onSelect}>
      {Object.values(InfoTabKeyType).map((item: InfoTabKeyType) => {
        const { icon, name } = tabs()?.[item] || {};
        return (
          <Nav.Item eventKey={item}>
            <div className="pw-pt-2 pw-px-2 pw-font-semibold pw-flex pw-items-center pw-justify-center pw-gap-2">
              {icon}
              {name}
            </div>
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

type Props = {
  className?: string;
  activeTab: InfoTabKeyType;
  setActiveTab(value: InfoTabKeyType): void;
};

const InfoTabs = ({ className, activeTab, setActiveTab }: Props) => {
  return (
    <div className={cx('pw-overflow-hidde pw-bg-white', className)}>
      <Navbar appearance="subtle" active={activeTab} onSelect={setActiveTab} />
    </div>
  );
};

export default InfoTabs;
