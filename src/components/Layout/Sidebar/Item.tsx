import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';
import { SideBarMenuItemProps } from './types';
import { getActivePath, removeLastPath } from '~app/utils/helpers';

type Props = {
  open?: boolean;
  data: SideBarMenuItemProps;
  isChild?: boolean;
};

const Item = ({ open, data, isChild }: Props) => {
  const { pathname } = useLocation();
  const { title, path, icon } = data;
  const splitPath = path.split('/');
  const isActive = getActivePath(
    // check lại khi move Cấu hình + Chatbot qua phần setting
    removeLastPath(
      path,
      splitPath.length <= (path.includes('chat') ? 4 : 3) ? undefined : path.includes('chat') ? 4 : 3,
    ),
    removeLastPath(
      pathname,
      splitPath.length <= (path.includes('chat') ? 4 : 3) ? undefined : path.includes('chat') ? 4 : 3,
    ),
  );

  return (
    <NavLink
      className={() =>
        cn(
          'pw-flex pw-rounded-md !pw-outline-none pw-duration-50 hover:pw-font-bold pw-text-white pw-py-3 !pw-no-underline pw-items-center pw-gap-x-3',
          {
            ['pw-bg-zinc-600']: isActive && !isChild,
            ['hover:pw-bg-zinc-600 !pw-text-white']: !isChild,
            ['hover:!pw-text-white active:!pw-text-white focus:!pw-text-white']: isChild,
            ['pw-font-bold']: isActive,
            ['pw-ml-5']: open && isChild,
            ['pw-text-opacity-50']: !isActive && isChild,
            ['pw-pb-3']: isChild,
            ['pw-w-full pw-flex pw-justify-center']: !open && !isChild,
          },
        )
      }
      to={path}
    >
      <span className={cn('pw-text-2xl', { 'pw-pl-2': open && !isChild })}>{icon}</span>
      <span
        className={cn('pw-origin-left pw-whitespace-nowrap pw-duration-50 pw-text-sm pw-font-normal', {
          ['pw-hidden']: !open && !isChild,
        })}
      >
        {title}
      </span>
    </NavLink>
  );
};

export default Item;
