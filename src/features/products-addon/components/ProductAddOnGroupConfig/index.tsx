import cx from 'classnames';
import { RHFToggle } from '~app/components';

type Props = {
  name: string;
  title: string;
  subtitle?: string;
  checkedChildren?: string;
  unCheckedChildren?: string;
  className?: string;
};

const ProductAddOnGroupConfig = ({ name, title, subtitle, checkedChildren, unCheckedChildren, className }: Props) => {
  return (
    <div className={cx('pw-p-6 pw-flex pw-items-center pw-justify-between', className)}>
      <div>
        <span className="pw-text-base pw-font-bold">{title}</span>
        {subtitle && <p className="pw-text-sm pw-mt-1">{subtitle}</p>}
      </div>
      <RHFToggle name={name} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} />
    </div>
  );
};

export default ProductAddOnGroupConfig;
