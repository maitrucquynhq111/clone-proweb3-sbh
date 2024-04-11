import cx from 'classnames';
import { BsChevronRight, BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';

type Props = {
  type: 'warning' | 'info' | 'success';
  children: React.ReactNode;
  className?: string;
  hasChevronRight?: boolean;
  onClick?(): void;
};

const Message = ({ type, children, className, hasChevronRight, onClick }: Props) => {
  const renderIcon = () => {
    switch (type) {
      case 'info':
        return <BsExclamationCircle size={24} />;
      default:
        return <BsExclamationTriangle size={24} />;
    }
  };
  return (
    <div
      className={cx('pw-flex pw-items-center pw-justify-between pw-px-4 pw-py-2 pw-cursor-pointer', className, {
        'pw-bg-info-background pw-text-info-active': type === 'info',
        'pw-bg-warning-background pw-text-warning-active': type === 'warning',
      })}
      onClick={onClick}
    >
      <div className="pw-flex pw-items-center pw-w-full">
        <div className="pw-mr-2">{renderIcon()}</div>
        {children}
      </div>
      {hasChevronRight && <BsChevronRight size={22} className="pw-ml-2" />}
    </div>
  );
};

export default Message;
