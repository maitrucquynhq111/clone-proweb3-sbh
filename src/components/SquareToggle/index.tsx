import cx from 'classnames';

type Props = {
  value: boolean;
  leftText: string;
  rightText: string;
  className?: string;
  leftTextActiveClassName?: string;
  rightTextActiveClassName?: string;
  onClick(value: boolean): void;
};

const SquareToggle = ({
  className,
  value,
  leftText,
  rightText,
  leftTextActiveClassName,
  rightTextActiveClassName,
  onClick,
}: Props) => {
  return (
    <div className={cx('pw-flex pw-p-0.5 pw-bg-neutral-background pw-rounded-md pw-justify-end pw-w-max', className)}>
      <button
        type="button"
        className={cx('pw-px-3 pw-py-1 pw-shadow-sm pw-text-sm pw-w-max ', {
          'pw-rounded-md pw-text-primary-main pw-font-bold pw-bg-primary-background': value,
          [`${leftTextActiveClassName}`]: value,
          'pw-text-neutral-secondary pw-bg-transparent': !value,
        })}
        onClick={() => onClick(true)}
      >
        {leftText}
      </button>
      <button
        type="button"
        className={cx('pw-px-3 pw-py-1 pw-shadow-sm pw-text-sm pw-w-max ', {
          'pw-rounded-md pw-text-primary-main pw-font-bold pw-bg-primary-background': !value,
          [`${rightTextActiveClassName}`]: !value,
          'pw-text-neutral-secondary pw-bg-transparent ': value,
        })}
        onClick={() => onClick(false)}
      >
        {rightText}
      </button>
    </div>
  );
};

export default SquareToggle;
