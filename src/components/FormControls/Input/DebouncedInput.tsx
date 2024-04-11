import cx from 'classnames';
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Input, InputGroup } from 'rsuite';
import SearchIcon from '@rsuite/icons/Search';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import FormLabel from '~app/components/FormControls/FormLabel';

const DebouncedInput = ({
  value: initialValue = '',
  onChange,
  debounce = 500,
  isRequired,
  label,
  icon,
  iconRight,
  size = 'md',
  error,
  className,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  isRequired?: boolean;
  label?: string;
  icon?: string;
  iconRight?: JSX.Element;
  size?: TypeAttributes.Size;
  error?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useDebounce(
    () => {
      onChange(value);
    },
    debounce,
    [value],
  );

  const renderIcon = () => {
    if (icon === 'search') return <SearchIcon />;
  };

  return (
    <div className={className}>
      {label ? <FormLabel label={label} isRequired={isRequired} /> : null}
      <InputGroup inside className={cx({ '!pw-border-red-400': error })}>
        {icon && <InputGroup.Addon>{renderIcon()}</InputGroup.Addon>}
        <Input {...props} size={size} value={value} onChange={(value) => setValue(value)} />
        {iconRight && <InputGroup.Addon className="!pw-py-2">{iconRight}</InputGroup.Addon>}
      </InputGroup>
    </div>
  );
};

export default DebouncedInput;
