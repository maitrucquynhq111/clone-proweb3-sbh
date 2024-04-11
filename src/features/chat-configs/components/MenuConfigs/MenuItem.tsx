import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { MenuItemType } from './types';

type Props = {
  data: MenuItemType;
};

const MenuItem = ({ data }: Props) => {
  const { t } = useTranslation();
  const { icon, title, path } = data;

  return (
    <NavLink
      className={({ isActive }) =>
        cx('pw-flex pw-mb-1 pw-py-3 pw-px-6 !pw-no-underline pw-items-center pw-gap-x-2', {
          'pw-font-bold !pw-text-primary-main pw-bg-neutral-200 pw-rounded-md': isActive,
          'pw-text-neutral-primary': !isActive,
          '[&>.icon]:pw-text-neutral-placeholder': !isActive,
          '[&>.icon]:pw-text-primary-main': isActive,
        })
      }
      to={path}
    >
      <span className="icon">{icon}</span>
      <span className="pw-text-base">{t(title)}</span>
    </NavLink>
  );
};

export default MenuItem;
