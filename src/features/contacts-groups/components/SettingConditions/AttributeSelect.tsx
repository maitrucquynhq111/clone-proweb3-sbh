import cx from 'classnames';
import { memo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SelectPicker } from 'rsuite';
import { FormLabel } from '~app/components';
import { CONTACT_GROUP_ATTRIBUTES } from '~app/features/contacts-groups/constant';

type Props = {
  index: number;
  className?: string;
  onUpdate(index: number, data: ContactGroupAttribute): void;
};

const AttributeSelect = ({ index, className, onUpdate }: Props) => {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      name={`conditions.${index}.attribute`}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <div className={cx(className)}>
              <div className="pw-flex pw-gap-x-2">
                <div className="pw-inline-block pw-overflow-hidden pw-whitespace-nowrap pw-align-middle pw-grow-0">
                  <FormLabel
                    label={t('common:if') || ''}
                    isRequired
                    className="!pw-mb-0 !pw-text-neutral-secondary pw-relative pw-inline-flex pw-max-w-full pw-items-center pw-h-9 pw-gap-x-0.5"
                  />
                </div>
                <div className="pw-flex pw-flex-col pw-flex-1">
                  <SelectPicker
                    block
                    data={CONTACT_GROUP_ATTRIBUTES}
                    labelKey="name"
                    valueKey="attribute"
                    groupBy="attribute_type"
                    value={field?.value || null}
                    onChange={(value) => {
                      const data = CONTACT_GROUP_ATTRIBUTES.find((item) => item.name === value);
                      if (!data) return field.onChange('');
                      field.onChange(data.attribute);
                      onUpdate(index, data);
                    }}
                    cleanable={false}
                    searchable={false}
                    placeholder={t('contact-form:placeholder.select_condition')}
                    className={cx('pw-contact-group-select', {
                      'pw-select-error': error,
                    })}
                    menuClassName="pw-contact-group-select-menu"
                    locale={{
                      searchPlaceholder: '',
                    }}
                    renderMenuGroup={(groupTitle) => {
                      return (
                        <span className="pw-text-sm pw-font-semibold pw-text-neutral-primary">
                          {t(`contact-form:${groupTitle}`)}
                        </span>
                      );
                    }}
                    renderMenuItem={(label, item) => {
                      return (
                        <div className="pw-flex pw-items-center pw-justify-between ">
                          <span className="pw-text-base pw-text-neutral-primary">{t(`contact-form:${label}`)}</span>
                          <div className="pw-wrapper-custom-radio_green">
                            <input checked={item.attribute === field?.value} type="radio" readOnly />
                            <span className="pw-checkmark-custom-radio_green"></span>
                          </div>
                        </div>
                      );
                    }}
                    renderValue={() => {
                      const data = CONTACT_GROUP_ATTRIBUTES.find((item) => item.name === field?.value);
                      return (
                        <span className="pw-text-sm pw-text-neutral-primary">{t(`contact-form:${data?.name}`)}</span>
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

export default memo(AttributeSelect);
