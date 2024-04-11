import { ReactNode } from 'react';
import cx from 'classnames';

type Props = {
  children: ReactNode;
  className?: string;
};

const DrawerFooter = ({ children, className }: Props) => {
  return (
    <div
      className={cx('pw-p-4 pw-shadow-xl pw-border-t pw-flex pw-gap-2 pw-justify-end pw-border-gray-100', className)}
    >
      {children}
    </div>
  );
};

export default DrawerFooter;
