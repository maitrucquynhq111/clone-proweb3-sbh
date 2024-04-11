import { useLocation } from 'react-router-dom';
import cn from 'classnames';
import { HiChevronDown } from 'react-icons/hi';
import type { SideBarMenuToggleProps } from './types';
import { getActivePath } from '~app/utils/helpers';

const MenuToggle = ({ open, onClick, expanded, data }: SideBarMenuToggleProps) => {
  const { pathname } = useLocation();
  const { icon, title, path } = data;
  const isActive = getActivePath(path, pathname);
  return (
    <div
      className={cn(
        'pw-flex pw-rounded-md !pw-outline-none pw-duration-100 pw-pt-3 pw-pb-2 pw-mb-1 !pw-no-underline hover:pw-bg-zinc-600 pw-items-center pw-gap-x-2 pw-cursor-pointer',
        {
          ['pw-bg-zinc-600 pw-font-bold']: isActive,
          ['pw-pr-2']: open,
          ['pw-flex pw-justify-center pw-w-full']: !open,
        },
      )}
      onClick={() => onClick?.()}
    >
      <span className={cn('pw-text-white', { 'pw-hidden': open })}>{icon}</span>
      <span
        className={cn(
          'pw-origin-left pw-whitespace-nowrap pw-text-neutral-disable pw-duration-200 pw-uppercase pw-font-semibold pw-text-sm pw-pl-2',
          {
            ['pw-hidden']: !open,
          },
        )}
      >
        {title}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={cn('pw-ml-auto', {
          ['pw-hidden']: !open,
        })}
      >
        <HiChevronDown
          color="#FFFFFF"
          size={20}
          className={cn('pw-transition-all pw-duration-100 pw-ease-in', { '-pw-rotate-180': !expanded })}
        />
      </button>
    </div>
  );
};

export default MenuToggle;
