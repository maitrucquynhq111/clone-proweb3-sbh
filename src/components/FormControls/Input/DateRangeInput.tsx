import React from 'react';
import DateRangePicker, { RangeType } from 'rsuite/DateRangePicker';
import { BsCalendar3 } from 'react-icons/bs';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { startOfDay, startOfMonth, endOfDay, endOfMonth, addDays, addMonths, subDays } from 'date-fns';

const ranges = (): RangeType[] => {
  const { t } = useTranslation('common');
  return [
    {
      label: t('date-ranges.today'),
      value: [startOfDay(new Date()), endOfDay(new Date())],
    },
    {
      label: t('date-ranges.yesterday'),
      value: [startOfDay(addDays(new Date(), -1)), endOfDay(addDays(new Date(), -1))],
    },
    {
      label: t('date-ranges.this-month'),
      value: [startOfMonth(new Date()), endOfMonth(new Date())],
    },
    {
      label: t('date-ranges.last-month'),
      value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    },
    {
      label: t('date-ranges.last-30-days'),
      value: [startOfDay(subDays(new Date(), 30)), endOfDay(new Date())],
    },
  ];
};

type DateRangeInputProps = {
  onChange: (value: ExpectedAny) => void;
  placeholder?: string;
  defaultValue?: [Date, Date];
  title?: string;
  className?: string;
};

export default function DateRangeInput({
  onChange,
  placeholder,
  defaultValue,
  className,
  ...props
}: DateRangeInputProps) {
  return (
    <div className={className}>
      {props.title && <label className="pw-block pw-mb-1 pw-text-sm">{props.title}</label>}
      <DateRangePicker
        block
        placeholder={placeholder || ''}
        format="dd-MM-yyyy"
        onChange={onChange}
        defaultValue={defaultValue}
        ranges={ranges()}
        caretAs={MyIcon}
        className={cx('custom-daterange-neutral', className)}
        {...props}
      />
    </div>
  );
}
const MyIcon = React.forwardRef((props) => {
  return <BsCalendar3 size={24} className="pw-text-neutral-secondary" {...props} />;
});
