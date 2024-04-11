import cx from 'classnames';
import { forwardRef } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, InputGroup, InputProps } from 'rsuite';
import FormLabel from '~app/components/FormControls/FormLabel';

type Props = {
  name: string;
  label?: string;
  rows?: number;
  placeholder?: string;
  as?: string;
  isForm?: boolean;
  inputWrapperClassName?: string;
  PrefixIcon?: JSX.Element;
  startIcon?: JSX.Element;
  transparentIcon?: boolean;
  inputClassName?: string;
  isRequired?: boolean;
  additionalComponent?: ExpectedAny;
  error?: ExpectedAny;
} & InputProps;

type Ref = HTMLInputElement;

const FormTextInput = forwardRef<Ref, Props>(
  (
    {
      name,
      PrefixIcon,
      isRequired = false,
      transparentIcon = false,
      additionalComponent,
      inputWrapperClassName,
      ...props
    },
    ref,
  ) => {
    const { control } = useFormContext();
    const AdditionalComponent = additionalComponent ? additionalComponent : null;

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <div className={cx(inputWrapperClassName)}>
              {props.label ? <FormLabel label={props.label} name={name} isRequired={isRequired} /> : null}
              <InputGroup
                inside
                className={cx({
                  'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-error-active': error,
                })}
              >
                <Input
                  {...props}
                  {...field}
                  inputRef={ref}
                  className={cx(props.inputClassName, {
                    'focus:!pw-outline-none': error,
                  })}
                />
                {AdditionalComponent ? <AdditionalComponent /> : null}
                {PrefixIcon ? (
                  <InputGroup.Addon className={cx({ 'pw-bg-transparent': transparentIcon })}>
                    {PrefixIcon}
                  </InputGroup.Addon>
                ) : null}
              </InputGroup>
              {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
            </div>
          );
        }}
      />
    );
  },
);

const NormalTextInput = ({
  PrefixIcon,
  startIcon,
  isRequired = false,
  transparentIcon = false,
  additionalComponent,
  ...props
}: Props) => {
  const AdditionalComponent = additionalComponent ? additionalComponent : null;
  return (
    <div>
      {props.label ? <FormLabel label={props.label} isRequired={isRequired} /> : null}
      <InputGroup
        inside
        className={cx({
          'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-error-active': props?.error,
        })}
      >
        {startIcon && <InputGroup.Addon>{startIcon}</InputGroup.Addon>}
        <Input
          className={cx(props.inputClassName, {
            'focus:!pw-outline-none': props?.error,
          })}
          {...props}
        />
        {AdditionalComponent ? <AdditionalComponent /> : null}
        {PrefixIcon ? (
          <InputGroup.Addon className={cx({ 'pw-bg-transparent': transparentIcon })}>{PrefixIcon}</InputGroup.Addon>
        ) : null}
      </InputGroup>
      {props?.error && (
        <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{props?.error.message}</p>
      )}
    </div>
  );
};

const TextInput = forwardRef<Ref, Props>(({ isForm = true, ...props }, ref) => {
  return <>{isForm ? <FormTextInput {...props} ref={ref} /> : <NormalTextInput {...props} />}</>;
});

export default TextInput;
