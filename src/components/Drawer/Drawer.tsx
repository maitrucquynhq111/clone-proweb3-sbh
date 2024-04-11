import { Drawer } from 'rsuite';
import { ReactNode } from 'react';
import cx from 'classnames';
import { ModalPlacement, ModalSize } from '~app/modals';

type Props = {
  children: ReactNode;
  placement: ModalPlacement;
  size: ModalSize;
  open: boolean;
  onClose?: () => void;
  backdrop?: boolean | 'static';
  className?: string;
  keyboard?: boolean;
};

const DrawerComponent = (props: Props) => {
  const { children, className } = props;
  return (
    <Drawer {...props}>
      <div className={cx('pw-flex pw-flex-col', className)}>{children}</div>
    </Drawer>
  );
};

export default DrawerComponent;
