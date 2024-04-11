import cx from 'classnames';

type Props = {
  name?: string;
  label: string;
  isRequired?: boolean;
  className?: string;
};

const FormLabel = ({ name, label, isRequired, className }: Props) => {
  return (
    <label className={cx('!pw-text-left pw-block pw-mb-1 pw-text-sm', className)} htmlFor={name}>
      {label} {isRequired ? <span className="pw-text-xs pw-text-red-500">*</span> : null}
    </label>
  );
};

export default FormLabel;
