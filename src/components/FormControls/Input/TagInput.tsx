import { useFormContext, Controller } from 'react-hook-form';
import { TagInput as RsTagInput, TagInputProps } from 'rsuite';

type Props = {
  name: string;
  label?: string;
  PrefixIcon?: JSX.Element;
  type?: string;
} & TagInputProps;

const TagInput = ({ name, label, PrefixIcon, type, ...props }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div>
            {label ? (
              <label className="pw-block pw-mb-1 pw-text-sm" htmlFor={name}>
                {label}
              </label>
            ) : null}
            <RsTagInput
              {...props}
              block
              name={field.name}
              value={field.value}
              onChange={(array) => {
                const uniqueArray = Array.from(new Set(array.map((value) => value.trim())));
                field.onChange(uniqueArray);
              }}
            />
            {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default TagInput;
