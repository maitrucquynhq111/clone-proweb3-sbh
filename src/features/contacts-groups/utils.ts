import {
  CONTACT_GROUP_ATTRIBUTES,
  CONTACT_GROUP_CONDITION,
  ContactGroupConditionType,
  ContactGroupOperatorType,
} from './constant';

export const defaultContactGroup = () => ({
  name: '',
  code: '',
  contact_ids: [] as Contact[],
});

export const defaultContactGroupCondition: PendingContactGroupCondition = {
  attribute: '',
  operator: '',
  value: '',
  value_type: '',
};

export const defaultContactGroupSetting: PendingContactGroupSetting = {
  name: '',
  conditions: [defaultContactGroupCondition],
};

export const toDefaultContactGroup = (data: ContactGroup) => {
  return {
    name: data.name,
    code: data.code,
    contact_ids: data.contacts || [],
  };
};

export const toPendingContactGroup = (data: ReturnType<typeof defaultContactGroup>): PendingContactGroup => {
  const params = {
    ...data,
    name: data.name?.trim(),
    code: data.code,
    contact_ids: data.contact_ids.map((contact: Contact) => contact.id),
  };
  return params;
};

function getCorrespondingCondition(data: ContactGroupSettingCondition) {
  let result = '';
  if (data.operator === ContactGroupOperatorType.EQUAL && data.value === 'now' && data.value_type === 'day') {
    result = ContactGroupConditionType.TODAY;
  } else if (data.operator === ContactGroupOperatorType.EQUAL && data.value === 'now' && data.value_type === 'month') {
    result = ContactGroupConditionType.THIS_MONTH;
  } else if (data.operator === ContactGroupOperatorType.EQUAL && data.value_type === 'month') {
    result = ContactGroupConditionType.IN_MONTH;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'N7D') {
    result = ContactGroupConditionType.TODAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'N30D') {
    result = ContactGroupConditionType.NEXT_30_DAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'N90D') {
    result = ContactGroupConditionType.NEXT_30_DAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'L7D') {
    result = ContactGroupConditionType.LAST_7_DAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'L30D') {
    result = ContactGroupConditionType.LAST_30_DAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'L90D') {
    result = ContactGroupConditionType.LAST_90_DAY;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'L6M') {
    result = ContactGroupConditionType.LAST_6_MONTH;
  } else if (data.operator === ContactGroupOperatorType.IN_RANGE && data.value === 'L1Y') {
    result = ContactGroupConditionType.LAST_1_YEAR;
  } else {
    result = data.operator;
  }
  return result;
}

export function toPendingContactGroupSetting(data: ContactGroup, contactGroupSetting?: ContactGroupSetting | null) {
  const conditions: PendingContactGroupCondition[] = contactGroupSetting?.conditions
    ? contactGroupSetting?.conditions.map((item) => {
        const condition = getCorrespondingCondition(item);
        const conditions = CONTACT_GROUP_ATTRIBUTES.find(
          (groupAttribute) => groupAttribute.attribute === item.attribute,
        )?.conditions;
        const result: PendingContactGroupCondition = {
          condition,
          conditions: conditions || [],
          attribute: item.attribute,
          operator: item.operator,
          can_add_value: CONTACT_GROUP_CONDITION[condition as ContactGroupConditionType].can_add_value,
          value: item?.value || '',
          value_type: item?.value_type || '',
        };
        if (item?.sub_condition) {
          const sub_condition: PendingContactGroupCondition = {
            attribute: item.sub_condition?.attribute || '',
            operator: item.sub_condition?.operator || '',
            condition: item?.sub_condition ? getCorrespondingCondition(item.sub_condition) : '',
            value: item?.sub_condition?.value || '',
            value_type: item?.sub_condition?.value_type || '',
          };
          const sub_conditions = CONTACT_GROUP_ATTRIBUTES.find(
            (groupAttribute) => groupAttribute.attribute === item.sub_condition?.attribute,
          )?.sub_conditions;
          result.sub_condition = sub_condition;
          result.sub_conditions = sub_conditions;
        }
        return result;
      })
    : [defaultContactGroupCondition];
  return {
    id: data.id,
    conditions,
    name: data.name,
    number_of_contact: data?.number_of_contact || 0,
    contact: data?.contacts || [],
  } as PendingContactGroupSetting;
}
