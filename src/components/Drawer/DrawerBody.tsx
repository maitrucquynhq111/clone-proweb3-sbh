import { ReactNode } from 'react';
import cx from 'classnames';

type Props = {
  children: ReactNode;
  className?: string;
};

const DrawerBody = ({ children, className }: Props) => {
  return <div className={cx('pw-p-4 pw-flex-1 pw-overflow-auto', className)}>{children}</div>;
};

export default DrawerBody;
