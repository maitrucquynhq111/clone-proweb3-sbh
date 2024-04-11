import { v4 } from 'uuid';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BsPlusCircleFill, BsXCircle } from 'react-icons/bs';
import AttributeSelect from './AttributeSelect';
import ValueSelect from './ValueSelect';
import { defaultContactGroupCondition } from '~app/features/contacts-groups/utils';
import ConditionSelect from '~app/features/contacts-groups/components/SettingConditions/ConditionSelect';

const SettingConditions = () => {
  const { t } = useTranslation('contact-form');
  const { getValues, setValue, control } = useFormContext<PendingContactGroupSetting>();

  const {
    fields: conditions,
    update,
    remove,
  } = useFieldArray({
    control,
    name: 'conditions',
  });

  const handleAddCondition = () => {
    const conditions = getValues('conditions');
    setValue('conditions', [...conditions, { ...defaultContactGroupCondition, id: v4() }]);
  };

  const handleUpdateAttribute = useCallback((index: number, data: ContactGroupAttribute) => {
    const condition = getValues(`conditions.${index}`);
    update(index, {
      ...defaultContactGroupCondition,
      id: condition.id,
      attribute: data.attribute,
      conditions: data.conditions,
      sub_conditions: data?.sub_conditions,
    });
    setValue(`conditions.${index}.condition`, '');
    setValue(`conditions.${index}.conditions`, data.conditions);
    setValue(`conditions.${index}.sub_conditions`, data?.sub_conditions);
  }, []);

  const handleUpdateMainCondition = useCallback((index: number, data: ContactGroupCondition) => {
    const condition = getValues(`conditions.${index}`);
    update(index, {
      ...condition,
      operator: data.operator,
      condition: data.condition,
      can_add_value: data.can_add_value,
      value: data?.value || '',
      value_type: data?.value_type || '',
    });
    setValue(`conditions.${index}.operator`, data.operator);
    setValue(`conditions.${index}.can_add_value`, data.can_add_value);
    setValue(`conditions.${index}.value`, data?.value || '');
    setValue(`conditions.${index}.value_type`, data?.value_type || '');
  }, []);

  const handleUpdateSubCondition = useCallback((index: number, data: ContactGroupCondition) => {
    const condition = getValues(`conditions.${index}`);
    const sub_condition = {
      attribute: condition.attribute,
      operator: data.operator,
      condition: data.condition,
      can_add_value: data.can_add_value,
      value: data?.value || '',
      value_type: data?.value_type || '',
    };
    update(index, {
      ...condition,
      sub_condition: sub_condition,
    });
    setValue(`conditions.${index}.sub_condition`, sub_condition);
  }, []);

  const handleRemoveCondition = useCallback((index: number) => {
    const conditions = getValues('conditions');
    remove(index);
    setValue('conditions', [...conditions.filter((_, itemIndex) => itemIndex !== index)]);
  }, []);

  return (
    <div>
      <div className="pw-flex pw-flex-col pw-gap-y-4">
        {conditions.map((condition, index) => {
          return (
            <div className="pw-flex pw-gap-4" key={condition.id}>
              <AttributeSelect index={index} className="pw-flex-1 pw-max-w-3/12" onUpdate={handleUpdateAttribute} />
              {condition?.conditions && condition.conditions.length > 0 ? (
                <ConditionSelect
                  index={index}
                  name={`conditions.${index}.condition`}
                  className="pw-flex-1 pw-max-w-3/12"
                  label={t('common:if') || ''}
                  data={condition.conditions}
                  onUpdate={handleUpdateMainCondition}
                />
              ) : null}
              {condition?.can_add_value ? (
                <ValueSelect update={update} index={index} value_type={condition?.value_type} />
              ) : null}
              {condition?.condition && condition.sub_conditions && condition.sub_conditions.length > 0 ? (
                <ConditionSelect
                  index={index}
                  name={`conditions.${index}.sub_condition.condition`}
                  className="pw-flex-1 pw-max-w-2/12"
                  label={t('common:other') || ''}
                  data={condition.sub_conditions}
                  onUpdate={handleUpdateSubCondition}
                />
              ) : null}
              {conditions.length === 1 ? null : (
                <button onClick={() => handleRemoveCondition(index)} className="pw-h-9">
                  <BsXCircle size={20} className="pw-fill-neutral-secondary" />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-4"
        type="button"
        onClick={() => {
          handleAddCondition();
        }}
      >
        <BsPlusCircleFill className="pw-fill-secondary-main-blue" size={20} />
        <span className="pw-text-secondary-main-blue pw-text-sm pw-font-bold">{t('action.add_condition')}</span>
      </button>
    </div>
  );
};

export default SettingConditions;
