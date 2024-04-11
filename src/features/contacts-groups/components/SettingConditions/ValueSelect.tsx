import React from 'react';
import { useTranslation } from 'react-i18next';
import DateSelect from './DateSelect';
import { DecimalInput, FormLabel, MonthSelect, TextInput } from '~app/components';

type Props = {
  index: number;
  value_type?: string;
  update(index: number, value: PendingContactGroupCondition): void;
};

const ValueSelect = ({ index, value_type }: Props) => {
  const { t } = useTranslation('common');
  return (
    <div className="pw-flex pw-gap-x-2 pw-flex-1 pw-max-w-3/12">
      <div className="pw-inline-block pw-overflow-hidden pw-whitespace-nowrap pw-align-middle pw-grow-0">
        <FormLabel
          label={t('value') || ''}
          isRequired
          className="!pw-mb-0 !pw-text-neutral-secondary pw-relative pw-inline-flex pw-max-w-full pw-items-center pw-h-9 pw-gap-x-0.5"
        />
      </div>
      <div className="pw-flex-[1_1_80%]">
        {value_type === 'text' ? (
          <TextInput
            name={`conditions.${index}.value`}
            placeholder={t('enter_value') || ''}
            inputWrapperClassName="pw-fle"
          />
        ) : null}
        {value_type === 'month' ? (
          <MonthSelect
            menuClassName="pw-contact-group-select-menu"
            name={`conditions.${index}.value`}
            placeholder={t('select_month') || ''}
          />
        ) : null}
        {value_type === 'number' ? (
          <DecimalInput name={`conditions.${index}.value`} placeholder={t('enter_value') || ''} />
        ) : null}
        {value_type === 'date' ? (
          <DateSelect name={`conditions.${index}.value`} placeholder={t('enter_value') || ''} />
        ) : null}
      </div>
    </div>
  );
};

export default ValueSelect;
