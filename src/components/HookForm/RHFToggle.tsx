import { useFormContext, Controller } from 'react-hook-form';
import cx from 'classnames';
import { Toggle, Form } from 'rsuite';

type Props = {
  name: string;
  checkedChildren?: string;
  unCheckedChildren?: string;
  isTextOutSide?: boolean;
  textPlacement?: 'left' | 'right';
  disabled?: boolean;
  textClassName?: string;
};

export default function RHFToggle({
  name,
  checkedChildren,
  unCheckedChildren,
  isTextOutSide = false,
  textPlacement = 'left',
  textClassName,
  ...props
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (isTextOutSide) {
          return (
            <Form.ControlLabel className="!pw-mb-0 pw-cursor-pointer">
              {textPlacement === 'left' && <span className={cx('pw-mr-4', textClassName)}>{checkedChildren}</span>}
              <Toggle {...field} {...props} checked={field.value} />
              {textPlacement === 'right' && <span className={cx('pw-ml-4', textClassName)}>{checkedChildren}</span>}
            </Form.ControlLabel>
          );
        }
        return (
          <Toggle
            {...field}
            {...props}
            checked={field.value}
            checkedChildren={<span className="pw-font-bold pw-my-2 pw-mx-1">{checkedChildren}</span>}
            unCheckedChildren={<span className="pw-text-black pw-my-2 pw-mx-1">{unCheckedChildren}</span>}
          />
        );
      }}
    />
  );
}
