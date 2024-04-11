import cx from 'classnames';
import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectPicker } from 'rsuite';
import { FormLabel } from '~app/components';

type Props = {
  name: string;
  index: number;
  label?: string;
  data: ContactGroupCondition[];
  className?: string;
  onUpdate(index: number, data: ContactGroupCondition): void;
};

const ConditionSelect = ({ name, index, label, data, className, onUpdate }: Props) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div className={cx(className)}>
              <div className="pw-flex pw-gap-x-2">
                <div className="pw-inline-block pw-overflow-hidden pw-whitespace-nowrap pw-align-middle pw-grow-0">
                  <FormLabel
                    label={label || ''}
                    isRequired
                    className="!pw-mb-0 !pw-text-neutral-secondary pw-relative pw-inline-flex pw-max-w-full pw-items-center pw-h-9 pw-gap-x-0.5"
                  />
                </div>
                <div className="pw-flex pw-flex-col pw-flex-1">
                  <SelectPicker
                    block
                    cleanable={false}
                    searchable={false}
                    data={data}
                    labelKey="name"
                    valueKey="condition"
                    value={field?.value || null}
                    onChange={(value: ExpectedAny) => {
                      const dataItem = data.find((item) => item.name === value);
                      if (!dataItem) return field.onChange('');
                      field.onChange(dataItem.condition);
                      onUpdate(index, dataItem);
                    }}
                    placeholder={t('contact-form:placeholder.select_condition')}
                    className={cx('pw-contact-group-select', {
                      'pw-select-error': error,
                    })}
                    menuClassName="pw-contact-group-select-menu"
                    locale={{
                      searchPlaceholder: '',
                    }}
                    renderMenuItem={(label, item) => {
                      return (
                        <div className="pw-flex pw-items-center pw-justify-between ">
                          <span className="pw-text-base pw-text-neutral-primary">{t(`contact-form:${label}`)}</span>
                          <div className="pw-wrapper-custom-radio_green">
                            <input checked={item.condition === field?.value} type="radio" readOnly />
                            <span className="pw-checkmark-custom-radio_green"></span>
                          </div>
                        </div>
                      );
                    }}
                    renderValue={() => {
                      const dataItem = data.find((item) => item.condition === field?.value);
                      return (
                        <span className="pw-text-sm pw-text-neutral-primary">
                          {t(`contact-form:${dataItem?.name}`)}
                        </span>
                      );
                    }}
                  />
                  {error && <p className="pw-text-error-active pw-text-xs pw-font-semibold pw-pt-1">{error.message}</p>}
                </div>
              </div>
            </div>
          </>
        );
      }}
    />
  );
};

export default memo(ConditionSelect);
