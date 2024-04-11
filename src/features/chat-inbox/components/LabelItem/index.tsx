import cx from 'classnames';

const LabelItem = ({ item, className }: { item: Label; className?: string }): JSX.Element => {
  return (
    <>
      <div
        className="pw-min-w-[0.625rem] pw-w-2.5 pw-h-2.5 pw-border-[1px] pw-rounded-full pw-border-white"
        style={{ backgroundColor: item.color }}
      />
      <span className={cx('pw-text-neutral-secondary pw-text-2xs pw-font-semibold line-clamp-1', className)}>
        {item.name}
      </span>
    </>
  );
};

export default LabelItem;
