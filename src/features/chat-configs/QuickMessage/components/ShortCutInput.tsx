import cx from 'classnames';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BsSlash } from 'react-icons/bs';
import { Input, InputGroup, InputProps } from 'rsuite';
import { FormLabel } from '~app/components';

type Props = {
  name: string;
  label?: string;
  maxLength?: number;
  showMaxLength?: boolean;
  isRequired?: boolean;
  inputClassName?: string;
} & InputProps;

const ShortcutInput = ({ name, label, maxLength = 50, showMaxLength = false, isRequired, ...props }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div>
            {label ? <FormLabel label={label} name={name} isRequired={isRequired} /> : null}
            <InputGroup
              inside
              className={cx({
                'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-red-400': error,
              })}
            >
              <InputGroup.Addon>
                <BsSlash className="pw-text-info-active pw-bg-info-background pw-rounded" />
              </InputGroup.Addon>
              <Input
                {...field}
                className={cx(props.inputClassName, {
                  'focus:!pw-outline-none': error,
                })}
                onChange={(value: string) => {
                  if (value.length > maxLength) return;
                  field.onChange(value);
                }}
              />
              {showMaxLength ? (
                <InputGroup.Addon>
                  <div className="pw-text-neutral-placeholder pw-font-semibold pw-text-xs">
                    {field.value?.length || 0}/{maxLength}
                  </div>
                </InputGroup.Addon>
              ) : null}
            </InputGroup>
            {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default memo(ShortcutInput);
