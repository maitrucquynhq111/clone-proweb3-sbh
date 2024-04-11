import cx from 'classnames';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

type Props = {
  icon: ExpectedAny;
  title: string;
  children: ReactNode;
  className?: string;
};

const PaymentMethodCollapse = ({ icon, title, children, className }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;
    if (!open) {
      ele.style.height = `0px`;
    } else {
      const height = ele.scrollHeight;
      ele.style.height = `${height}px`;
    }
  }, [open, children]);

  return (
    <div
      className={cx('pw-cursor-pointer', className, {
        '!pw-pb-0': open,
      })}
      onClick={() => setOpen((prevState) => !prevState)}
    >
      <div className="pw-flex pw-gap-x-2">
        {icon}
        <div className="pw-w-full">
          <div className="pw-flex pw-flex-1 pw-w-full pw-justify-between">
            <span className="pw-text-base pw-text-neutral-primary">{title}</span>
            {open ? (
              <HiChevronUp size={24} className="pw-text-neutral-secondary" />
            ) : (
              <HiChevronDown size={24} className="pw-text-neutral-secondary" />
            )}
          </div>
        </div>
      </div>
      <div ref={ref} className="pw-overflow-hidden pw-transition-all pw-duration-200 pw-ease-in">
        {children}
      </div>
    </div>
  );
};

export default PaymentMethodCollapse;
