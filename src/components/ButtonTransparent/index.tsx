import cx from 'classnames';
import { ReactNode, forwardRef } from 'react';
import { Button } from 'rsuite';

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?(): void;
};

type Ref = HTMLButtonElement;

const ButtonTransparent = forwardRef<Ref, Props>(({ children, className, disabled = false, onClick }, ref) => {
  return (
    <Button
      ref={ref}
      appearance="default"
      className={cx('!pw-p-0 !pw-m-0 !pw-bg-transparent', className)}
      block
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});

export default ButtonTransparent;
