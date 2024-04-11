import { Nav } from 'rsuite';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import cx from 'classnames';
import { Fragment } from 'react';

const Navbar = ({
  active,
  onSelect,
  data,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  data: ExpectedAny;
  onSelect: (value: string) => void;
}) => {
  return (
    <Nav className="pw-flex pw-items-center" {...props} activeKey={active} onSelect={onSelect}>
      {data.map((item: ExpectedAny, index: number) => {
        return (
          <Fragment key={item.key}>
            {index > 0 && <span className="pw-text-neutral-border">|</span>}
            <Nav.Item
              className={cx('!pw-px-6 !pw-py-3', {
                'pw-ml-5': index === 0,
              })}
              eventKey={item.key}
            >
              <div className="pw-flex pw-h-6 pw-font-bold pw-items-center pw-gap-2">
                {item.icon} {item.title}
              </div>
            </Nav.Item>
          </Fragment>
        );
      })}
    </Nav>
  );
};

const HeaderNav = ({ data, onChange, activeTab }: ExpectedAny): JSX.Element => {
  const setActive = (key: string) => {
    onChange(key);
  };

  return (
    <div className="-pw-ml-5 -pw-mr-5">
      <Navbar appearance="subtle" active={activeTab} onSelect={setActive} data={data} />
    </div>
  );
};

export default HeaderNav;
