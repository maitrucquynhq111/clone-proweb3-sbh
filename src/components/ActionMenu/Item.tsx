import { Dropdown } from 'rsuite';
import cn from 'classnames';
import { MenuItemProps } from './types';

type ItemProps = {
  data: MenuItemProps;
  openModal?: (data: MenuItemProps) => void;
  onSelect?: () => void;
};

const Item = (props: ItemProps) => {
  const { data, openModal, onSelect } = props;
  const { title, showConfirm, action, icon, className } = data;

  return (
    <Dropdown.Item
      onClick={() => {
        showConfirm ? openModal?.(data) : action?.();
        onSelect?.();
      }}
    >
      <div className={cn('pw-flex pw-items-center pw-space-x-2 pw-text-sm', className)}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
    </Dropdown.Item>
  );
};

export default Item;
