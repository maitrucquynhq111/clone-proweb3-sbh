import cx from 'classnames';
import { MdClose } from 'react-icons/md';
import { ReactNode } from 'react';

type Props = {
  title: string | ReactNode;
  children?: ReactNode;
  className?: string;
  onClose: () => void;
};

const DrawerHeader = (props: Props) => {
  const { title, onClose, className, children } = props;

  return (
    <div className={cx('pw-bg-primary-main pw-flex pw-justify-between pw-items-center pw-p-3', className)}>
      <div className="pw-font-semibold pw-text-lg pw-ml-2 pw-text-white">{title}</div>
      {children}
      <span className="pw-p-2 pw-cursor-pointer" onClick={() => onClose()}>
        <MdClose size="20" color="#FFFFFF" />
      </span>
    </div>
  );
};

export default DrawerHeader;
