import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectPicker } from 'rsuite';

const MONTHS = [
  {
    name: 'january',
    value: '1',
  },
  {
    name: 'february',
    value: '2',
  },
  {
    name: 'march',
    value: '3',
  },
  {
    name: 'april',
    value: '4',
  },
  {
    name: 'may',
    value: '5',
  },
  {
    name: 'june',
    value: '6',
  },
  {
    name: 'july',
    value: '7',
  },
  {
    name: 'august',
    value: '8',
  },
  {
    name: 'september',
    value: '9',
  },
  {
    name: 'october',
    value: '10',
  },
  {
    name: 'november',
    value: '11',
  },
  {
    name: 'december',
    value: '12',
  },
];

type Props = {
  name: string;
  isForm?: boolean;
  className?: string;
  menuClassName?: string;
  placeholder?: string;
  onChange?(value: number): void;
};

const FormMonthSelect = ({ name, className, placeholder, menuClassName }: Omit<Props, 'isForm' | 'onChange'>) => {
  const { t } = useTranslation('month');
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div className={className}>
              <SelectPicker
                block
                cleanable={false}
                searchable={false}
                data={MONTHS}
                labelKey="name"
                valueKey="value"
                placeholder={placeholder}
                value={field?.value || null}
                onChange={(value) => field.onChange(value as string)}
                menuClassName={menuClassName}
                renderMenuItem={(label) => {
                  return <span className="pw-text-base pw-text-neutral-primary">{t(`${label}`)}</span>;
                }}
                renderValue={() => {
                  const data = MONTHS.find((item) => item.value === field?.value);
                  return <span className="pw-text-sm pw-text-neutral-primary">{t(`${data?.name}`)}</span>;
                }}
              />
            </div>
            {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
          </>
        );
      }}
    />
  );
};

const MonthSelect = ({ isForm = true, ...props }: Props) => {
  return isForm ? (
    <FormMonthSelect
      name={props.name}
      className={props.className}
      menuClassName={props.menuClassName}
      placeholder={props.placeholder}
    />
  ) : null;
};

export default MonthSelect;
