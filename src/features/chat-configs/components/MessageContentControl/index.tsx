import cx from 'classnames';
import { useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input, InputGroup, InputProps } from 'rsuite';
import InsertPattern from './InsertPattern';
import { FormLabel } from '~app/components';

type Props = {
  name: string;
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  isRequired?: boolean;
  maxLength?: number;
  excludeTypes?: string[];
} & InputProps;

const MessageContentControl = ({
  name,
  label,
  labelClassName,
  isRequired,
  maxLength = 50,
  excludeTypes = [],
  ...props
}: Props) => {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInsertPattern = async (field: ExpectedAny, insertPattern: string) => {
    const currentMessage = field.value;
    if (insertPattern.length + currentMessage.length > maxLength) return currentMessage;
    const element = inputRef.current;
    if (!element) return currentMessage;
    const startPosition = element.selectionStart || 0;
    const endPosition = element.selectionEnd || 0;
    const newMessage =
      currentMessage.substring(0, startPosition) + insertPattern + ' ' + currentMessage.substring(endPosition);
    await field.onChange(newMessage);
    const newPosition = startPosition + insertPattern.length + 1;
    await element.focus();
    element.setSelectionRange(newPosition, newPosition);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="pw-group">
            {label ? <FormLabel label={label} name={name} isRequired={isRequired} className={labelClassName} /> : null}
            <InputGroup
              inside
              className={cx('!pw-rounded-b-none', {
                'focus-within:!pw-outline-none focus:!pw-outline-none !pw-border-error-active': error,
              })}
            >
              <Input
                {...field}
                inputRef={inputRef}
                placeholder={props.placeholder}
                className={cx('focus:!pw-outline-none', props.inputClassName)}
                onChange={(value: string) => {
                  if (value.length > maxLength) return;
                  field.onChange(value);
                }}
                as="textarea"
                rows={5}
              />
            </InputGroup>
            <InsertPattern
              currentLength={field.value?.length}
              maxLength={maxLength}
              onChange={(value: string) => {
                handleInsertPattern(field, value);
              }}
              excludeTypes={excludeTypes}
            />
            {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default MessageContentControl;
