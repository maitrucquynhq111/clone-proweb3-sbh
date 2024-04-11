import { Nav } from 'rsuite';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuToggle from './MenuToggle';
import Item from './Item';
import { SideBarMenuToggleProps, SideBarMenuItemProps } from './types';
import { removeLastPath } from '~app/utils/helpers';

const MenuItem = ({ open, data, setOpen }: SideBarMenuToggleProps) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const location = useLocation();
  const { childs } = data;
  const haveChild = Array.isArray(childs) && childs.length > 0;
  const childPaths = (childs || []).map((item) => item.path);
  const isActiveChild = childPaths.includes(removeLastPath(location.pathname));

  useEffect(() => {
    setOpenMenu(data?.defaultOpen || isActiveChild);
  }, []);

  if (childs === undefined) return <Item key={data.path} open={open} data={data} />;

  return haveChild ? (
    <Nav.Menu
      toggleClassName="!pw-p-0 !pw-bg-nav-background !pw-outline-none"
      className="!pw-bg-nav-background"
      trigger={open ? 'hover' : 'click'}
      open={openMenu}
      onClick={() => {
        if (!open) setOpen?.(true);
      }}
      title={
        <div className="pw-flex pw-gap-x-2">
          <span>{data.icon}</span>
          <span className="pw-text-sm pw-font-bold">{data.title}</span>
        </div>
      }
      renderToggle={({ 'aria-expanded': ariaExpanded, onClick }: ExpectedAny) => {
        return (
          <MenuToggle
            open={open}
            onClick={() => {
              onClick();
              setOpenMenu(!openMenu);
            }}
            expanded={ariaExpanded}
            data={data}
          />
        );
      }}
      placement="rightStart"
    >
      {childs.map((child: SideBarMenuItemProps) => {
        return <Item isChild key={child.path} open={open} data={child} />;
      })}
    </Nav.Menu>
  ) : null;
};

export default MenuItem;
