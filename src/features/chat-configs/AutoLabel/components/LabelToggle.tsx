import { useFormContext, Controller } from 'react-hook-form';
import { Toggle, Form } from 'rsuite';

type Props = {
  name: string;
  title?: string;
  subTitle?: string;
};

const LabelToggle = ({ name, title, subTitle }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Form.ControlLabel className="!pw-mb-0 pw-cursor-pointer pw-flex pw-justify-between blue-toggle">
            <div>
              {title ? <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{title}</span> : null}
              {subTitle ? (
                <span className="pw-inline-block pw-mt-1 pw-text-xs pw-text-neutral-placeholder">{subTitle}</span>
              ) : null}
            </div>
            <Toggle {...field} checked={field.value} />
          </Form.ControlLabel>
        );
      }}
    />
  );
};

export default LabelToggle;
