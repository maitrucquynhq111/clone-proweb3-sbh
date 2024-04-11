import { Nav } from 'rsuite';
import { useLocation, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import { removeLastPath } from '~app/utils/helpers';

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
          <>
            {index > 0 && <span className="pw-text-neutral-border">|</span>}
            <Nav.Item
              className={cx('!pw-px-6 !pw-py-3', {
                'pw-ml-5': index === 0,
              })}
              eventKey={item.path}
            >
              <div
                className={cx('pw-flex pw-font-normal pw-items-center pw-gap-2 pw-header-nav-item', {
                  '!pw-font-bold': active === item.path,
                })}
              >
                {item.icon} {item.title}
              </div>
            </Nav.Item>
          </>
        );
      })}
    </Nav>
  );
};

const HeaderNav = ({ data }: ExpectedAny): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const setActive = (key: string) => {
    navigate(key);
  };
  return (
    <div className="pw-pt-4">
      <Navbar appearance="subtle" active={removeLastPath(location.pathname)} onSelect={setActive} data={data} />
    </div>
  );
};

export default HeaderNav;
