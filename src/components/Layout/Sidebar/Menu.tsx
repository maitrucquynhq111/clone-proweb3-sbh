import { useTranslation } from 'react-i18next';
import { Nav, Sidenav } from 'rsuite';
import MenuItem from './MenuItem';
import type { SideBarMenuProps } from './types';
import { menusSidebarRenderer } from '~app/configs/menu';

const Menu = ({ open, setOpen }: SideBarMenuProps) => {
  const { t } = useTranslation('routes');
  return (
    <Sidenav.Body className="sidebar !pw-bg-nav-background pw-pt-6 pw-relative pw-h-[calc(100vh_-_180px)] pw-overflow-y-auto">
      <Nav className="!pw-bg-nav-background pw-pt-6 pw-pl-0">
        {menusSidebarRenderer(t).map((menu) => {
          return <MenuItem open={open} data={menu} key={menu.path} setOpen={setOpen} />;
        })}
      </Nav>
    </Sidenav.Body>
  );
};

export default Menu;
