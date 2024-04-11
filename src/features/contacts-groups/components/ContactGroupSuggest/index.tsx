import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import {
  CONTACT_GROUP_ATTRIBUTES,
  CONTACT_GROUP_CONDITION,
  ContactGroupAttributeType,
} from '~app/features/contacts-groups/constant';

const CONTACT_GROUP_SUGGEST: PendingContactGroupSetting[] = [
  {
    name: 'potential_customer',
    conditions: [
      {
        attribute: ContactGroupAttributeType.COMPLETED_ORDER,
        operator: CONTACT_GROUP_CONDITION.greater_equal.operator,
        condition: CONTACT_GROUP_CONDITION.greater_equal.condition,
        conditions:
          CONTACT_GROUP_ATTRIBUTES.find((item) => item.attribute === ContactGroupAttributeType.COMPLETED_ORDER)
            ?.conditions || ([] as ContactGroupCondition[]),
        can_add_value: CONTACT_GROUP_CONDITION.greater_equal.can_add_value,
        value: '2',
        value_type: CONTACT_GROUP_CONDITION.greater_equal.value_type,
        sub_condition: {
          attribute: ContactGroupAttributeType.COMPLETED_ORDER,
          operator: CONTACT_GROUP_CONDITION.last_30_day.operator,
          condition: CONTACT_GROUP_CONDITION.last_30_day.condition,
          can_add_value: CONTACT_GROUP_CONDITION.last_30_day.can_add_value,
          value: CONTACT_GROUP_CONDITION.last_30_day.value,
          value_type: CONTACT_GROUP_CONDITION.last_30_day.value_type,
        },
        sub_conditions:
          CONTACT_GROUP_ATTRIBUTES.find((item) => item.attribute === ContactGroupAttributeType.COMPLETED_ORDER)
            ?.sub_conditions || ([] as ContactGroupCondition[]),
      },
    ],
  },
  {
    name: 'new_customer',
    conditions: [
      {
        attribute: ContactGroupAttributeType.COMPLETED_ORDER,
        operator: CONTACT_GROUP_CONDITION.less_equal.operator,
        condition: CONTACT_GROUP_CONDITION.less_equal.condition,
        conditions:
          CONTACT_GROUP_ATTRIBUTES.find((item) => item.attribute === ContactGroupAttributeType.COMPLETED_ORDER)
            ?.conditions || ([] as ContactGroupCondition[]),
        can_add_value: CONTACT_GROUP_CONDITION.less_equal.can_add_value,
        value: '1',
        value_type: CONTACT_GROUP_CONDITION.less_equal.value_type,
        sub_condition: {
          attribute: ContactGroupAttributeType.COMPLETED_ORDER,
          operator: CONTACT_GROUP_CONDITION.last_7_day.operator,
          condition: CONTACT_GROUP_CONDITION.last_7_day.condition,
          can_add_value: CONTACT_GROUP_CONDITION.last_7_day.can_add_value,
          value: CONTACT_GROUP_CONDITION.last_7_day.value,
          value_type: CONTACT_GROUP_CONDITION.last_7_day.value_type,
        },
        sub_conditions:
          CONTACT_GROUP_ATTRIBUTES.find((item) => item.attribute === ContactGroupAttributeType.COMPLETED_ORDER)
            ?.sub_conditions || ([] as ContactGroupCondition[]),
      },
    ],
  },
  {
    name: 'dob_this_month_customer',
    conditions: [
      {
        attribute: ContactGroupAttributeType.DOB,
        operator: CONTACT_GROUP_CONDITION.this_month.operator,
        condition: CONTACT_GROUP_CONDITION.this_month.condition,
        conditions:
          CONTACT_GROUP_ATTRIBUTES.find((item) => item.attribute === ContactGroupAttributeType.DOB)?.conditions ||
          ([] as ContactGroupCondition[]),
        can_add_value: CONTACT_GROUP_CONDITION.this_month.can_add_value,
        value: CONTACT_GROUP_CONDITION.this_month.value,
        value_type: CONTACT_GROUP_CONDITION.this_month.value_type,
      },
    ],
  },
];

type Props = {
  onCreateSuggestedContactGroup(data: PendingContactGroupSetting): void;
};

const ContactGroupSuggest = ({ onCreateSuggestedContactGroup }: Props) => {
  const { t } = useTranslation('contact-group-form');
  return (
    <div className="pw-pt-1.5 pw-px-4 pw-pb-3 pw-mb-6 pw-bg-info-background pw-rounded">
      <div className="pw-flex pw-gap-x-3 pw-py-2">
        <BsFillInfoCircleFill className="pw-text-info-active" size={24} />
        <div className="pw-text-blue-800 pw-text-sm">{t('suggest_contact_group_desc')}</div>
      </div>
      <div className="pw-flex pw-gap-x-6 pw-mt-2">
        {CONTACT_GROUP_SUGGEST.map((item) => {
          return (
            <div
              key={item.name}
              className="pw-flex pw-gap-x-6 pw-py-4 pw-px-6 pw-bg-neutral-white pw-rounded pw-items-center pw-justify-between
                pw-border pw-border-solid pw-border-neutral-divider pw-flex-1"
            >
              <span className="pw-text-sm pw-text-black">{t(item.name)}</span>
              <button
                className="pw-text-xs pw-py-1.5 pw-px-4 pw-rounded pw-bg-info-active
                  pw-flex pw-items-center pw-justify-center pw-font-bold pw-text-neutral-white"
                onClick={() => onCreateSuggestedContactGroup(item)}
              >
                {t('action.create_group')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(ContactGroupSuggest);
