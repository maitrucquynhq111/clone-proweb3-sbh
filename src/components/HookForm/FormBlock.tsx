import cx from 'classnames';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  blockClassName?: string;
  title?: string;
  titleClassName?: string;
  subTitle?: string;
  children: ReactNode;
};

const FormBlock = ({ blockClassName = '', className = '', title, subTitle, titleClassName, children }: Props) => {
  return (
    <div className={blockClassName}>
      {title ? (
        <h4
          className={cx(
            ' pw-text-base pw-font-bold pw-tracking-tighter',
            {
              'pw-pb-1': subTitle,
              'pw-pb-4': !subTitle,
            },
            titleClassName,
          )}
        >
          {title}
        </h4>
      ) : null}
      {subTitle ? <h5 className="pw-text-sm pw-text-neutral-700 pw-font-normal">{subTitle}</h5> : null}
      <div className={className}>{children}</div>
    </div>
  );
};

export default FormBlock;
