import { IconButton, Sidenav } from 'rsuite';
import cn from 'classnames';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import type { SideBarHeaderProps } from './types';
import { LogoImage, NameImageBeta } from '~app/components/Icons';

const SidenavHeader = ({ open, setOpen }: SideBarHeaderProps): JSX.Element => {
  return (
    <Sidenav.Header className="pw-bg-nav-background pw-flex pw-items-center pw-gap-x-4">
      <div className="bg-white pw-z-30 pw-rounded-full pw-border pw-absolute pw-border-zinc-700 pw-cursor-pointer pw--right-3 pw-top-9 pw-items-center">
        <IconButton
          size="xs"
          appearance="subtle"
          onClick={() => setOpen(!open)}
          className="!pw-bg-white"
          icon={
            <ArrowLeftLineIcon
              color=""
              className={cn('', {
                ['pw-rotate-180']: !open,
              })}
            />
          }
          circle
        />
      </div>
      <div className="pw-px-2 pw-cursor-pointer pw-w-full pw-duration-500 pw-flex pw-items-center">
        <span>
          <LogoImage />
        </span>
        <span
          className={cn(
            'origin-left pw-flex-1 duration-500 pw-ml-2 pw-font-bold pw-text-2xl pw-overflow-hidden pw-text-green-600',
            {
              ['pw-w-0 pw-hidden']: !open,
            },
          )}
        >
          <NameImageBeta />
        </span>
      </div>
    </Sidenav.Header>
  );
};
export default SidenavHeader;
