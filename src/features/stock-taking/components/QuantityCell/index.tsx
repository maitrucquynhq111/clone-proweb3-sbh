import cx from 'classnames';
import { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import QuantityControl from '~app/components/QuantityControl';
import { QuantityControlSize } from '~app/utils/constants';

type Props = {
  name: string;
  className?: string;
};

const QuantityCell = ({ name }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div
            className={cx(
              'pw-px-2.5 pw-absolute pw-top-1/2 pw-left-0 -pw-translate-y-1/2 pw-h-full pw-flex pw-items-center',
              {
                'pw-bg-error-background': error,
              },
            )}
          >
            <QuantityControl
              size={QuantityControlSize.Small}
              onChange={(value: string) => {
                field.onChange(value);
              }}
              onBlur={() => field.onBlur()}
              defaultValue={field.value}
              className={cx({
                '!pw-border-error-border': error,
              })}
            />
          </div>
        );
      }}
    />
  );
};

export default memo(QuantityCell);
