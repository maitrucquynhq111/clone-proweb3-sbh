import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import MenuItem from './MenuItem';
import { MenuBlockType } from './types';
import { checkHasAllPermissions, getPermissions, validatePermissions } from '~app/utils/shield';

type Props = {
  data: MenuBlockType;
};

const MenuBlock = ({ data }: Props) => {
  const { title, childs } = data;
  const { t } = useTranslation('chat');
  const permissions = getPermissions();
  const hasAllPermissions = checkHasAllPermissions(childs);

  return (
    <div className="pw-pb-2">
      {hasAllPermissions && (
        <div className="pw-text-neutral-placeholder pw-px-9 pw-font-bold pw-text-xs pw-mb-2">{t(title)}</div>
      )}
      <div className="pw-px-3">
        {childs.map((item) => {
          const hasPermission = validatePermissions(permissions, item.permissions);
          if (!hasPermission) return null;
          return <MenuItem data={item} key={item.path} />;
        })}
      </div>
    </div>
  );
};

export default MenuBlock;
