export enum ContactGroupAttributeType {
  NAME = 'name',
  PHONE = 'phone',
  EMAIL = 'email',
  DOB = 'dob',
  PROVINCE = 'province',
  LABEL = 'label',
  COMPLETED_ORDER = 'completed_order',
  SPENT_MONEY = 'spent_money',
  POINT = 'point',
  CREDIT = 'credit',
  DEBIT = 'debit',
  LAST_ACTIVE = 'last_active',
}

export enum ContactGroupOperatorType {
  GREATER = 'greater', // Lớn hơn
  GREATER_EQUAL = 'greater_equal', // Lớn hơn hoặc bằng
  EQUAL = 'equal', // Bằng
  IN_RANGE = 'in_range', // Khoảng
  LESS = 'less', // Nhỏ hơn
  LESS_EQUAL = 'less_equal', // Nhỏ hơn hoặc bằng
  NOT_EQUAL = 'not_equal',
  NOT_EMPTY = 'not_empty', // Không trống
  IS_EMPTY = 'is_empty', // Trống
  HAS_PREFIX = 'has_prefix', // Bắt đầu với
  NOT_HAS_PREFIX = 'not_has_prefix',
  CREATED_BEFORE = 'created_before', // Trước ngày
  CREATED_AFTER = 'created_after', // Sau ngày
  CONTAIN = 'contain', // Chứa
  NOT_CONTAIN = 'not_contain', // Không chứa
  ALL = 'all',
}

export enum ContactGroupConditionType {
  CONTAIN = 'contain',
  NOT_CONTAIN = 'not_contain',
  IS_EMPTY = 'is_empty',
  NOT_EMPTY = 'not_empty',
  HAS_PREFIX = 'has_prefix',
  TODAY = 'today',
  THIS_MONTH = 'this_month',
  NEXT_7_DAY = 'next_7_day',
  NEXT_30_DAY = 'next_30_day',
  NEXT_90_DAY = 'next_90_day',
  LAST_7_DAY = 'last_7_day',
  LAST_30_DAY = 'last_30_day',
  LAST_90_DAY = 'last_90_day',
  LAST_6_MONTH = 'last_6_month',
  LAST_1_YEAR = 'last_1_year',
  IN_MONTH = 'in_month',
  EQUAL = 'equal',
  GREATER_EQUAL = 'greater_equal',
  LESS_EQUAL = 'less_equal',
  CREATED_BEFORE = 'created_before',
  CREATED_AFTER = 'created_after',
  ALL = 'all',
}

export const CONTACT_GROUP_CONDITION: { [key in ContactGroupConditionType]: ContactGroupCondition } = {
  [ContactGroupConditionType.CONTAIN]: {
    operator: ContactGroupOperatorType.CONTAIN,
    condition: ContactGroupConditionType.CONTAIN,
    name: ContactGroupConditionType.CONTAIN,
    can_add_value: true,
    value_type: 'text',
  },
  [ContactGroupConditionType.NOT_CONTAIN]: {
    operator: ContactGroupOperatorType.NOT_CONTAIN,
    condition: ContactGroupConditionType.NOT_CONTAIN,
    name: ContactGroupConditionType.NOT_CONTAIN,
    can_add_value: true,
    value_type: 'text',
  },
  [ContactGroupConditionType.IS_EMPTY]: {
    operator: ContactGroupOperatorType.IS_EMPTY,
    condition: ContactGroupConditionType.IS_EMPTY,
    name: ContactGroupConditionType.IS_EMPTY,
  },
  [ContactGroupConditionType.NOT_EMPTY]: {
    operator: ContactGroupOperatorType.NOT_EMPTY,
    condition: ContactGroupConditionType.NOT_EMPTY,
    name: ContactGroupConditionType.NOT_EMPTY,
  },
  [ContactGroupConditionType.HAS_PREFIX]: {
    operator: ContactGroupOperatorType.HAS_PREFIX,
    condition: ContactGroupConditionType.HAS_PREFIX,
    name: ContactGroupConditionType.HAS_PREFIX,
    can_add_value: true,
    value_type: 'text',
  },
  [ContactGroupConditionType.TODAY]: {
    operator: ContactGroupOperatorType.EQUAL,
    condition: ContactGroupConditionType.TODAY,
    name: ContactGroupConditionType.TODAY,
    value: 'now',
    value_type: 'day',
  },
  [ContactGroupConditionType.NEXT_7_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.NEXT_7_DAY,
    name: ContactGroupConditionType.NEXT_7_DAY,
    value: 'N7D',
  },
  [ContactGroupConditionType.NEXT_30_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.NEXT_30_DAY,
    name: ContactGroupConditionType.NEXT_30_DAY,
    value: 'N30D',
  },
  [ContactGroupConditionType.NEXT_90_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.NEXT_90_DAY,
    name: ContactGroupConditionType.NEXT_90_DAY,
    value: 'N90D',
  },
  [ContactGroupConditionType.IN_MONTH]: {
    operator: ContactGroupOperatorType.EQUAL,
    condition: ContactGroupConditionType.IN_MONTH,
    name: ContactGroupConditionType.IN_MONTH,
    can_add_value: true,
    value_type: 'month',
  },
  [ContactGroupConditionType.THIS_MONTH]: {
    operator: ContactGroupOperatorType.EQUAL,
    condition: ContactGroupConditionType.THIS_MONTH,
    name: ContactGroupConditionType.THIS_MONTH,
    value: 'now',
    value_type: 'month',
  },
  [ContactGroupConditionType.GREATER_EQUAL]: {
    operator: ContactGroupOperatorType.GREATER_EQUAL,
    condition: ContactGroupConditionType.GREATER_EQUAL,
    name: ContactGroupConditionType.GREATER_EQUAL,
    can_add_value: true,
    value_type: 'number',
  },
  [ContactGroupConditionType.LESS_EQUAL]: {
    operator: ContactGroupOperatorType.LESS_EQUAL,
    condition: ContactGroupConditionType.LESS_EQUAL,
    name: ContactGroupConditionType.LESS_EQUAL,
    can_add_value: true,
    value_type: 'number',
  },
  [ContactGroupConditionType.EQUAL]: {
    operator: ContactGroupOperatorType.EQUAL,
    condition: ContactGroupConditionType.EQUAL,
    name: ContactGroupConditionType.EQUAL,
    can_add_value: true,
    value_type: 'number',
  },
  [ContactGroupConditionType.LAST_7_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.LAST_7_DAY,
    name: ContactGroupConditionType.LAST_7_DAY,
    value: 'L7D',
  },
  [ContactGroupConditionType.LAST_30_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.LAST_30_DAY,
    name: ContactGroupConditionType.LAST_30_DAY,
    value: 'L30D',
  },
  [ContactGroupConditionType.LAST_90_DAY]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.LAST_90_DAY,
    name: ContactGroupConditionType.LAST_90_DAY,
    value: 'L90D',
  },
  [ContactGroupConditionType.LAST_6_MONTH]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.LAST_6_MONTH,
    name: ContactGroupConditionType.LAST_6_MONTH,
    value: 'L6M',
  },
  [ContactGroupConditionType.LAST_1_YEAR]: {
    operator: ContactGroupOperatorType.IN_RANGE,
    condition: ContactGroupConditionType.LAST_1_YEAR,
    name: ContactGroupConditionType.LAST_1_YEAR,
    value: 'L1Y',
  },
  [ContactGroupConditionType.CREATED_BEFORE]: {
    operator: ContactGroupOperatorType.CREATED_BEFORE,
    condition: ContactGroupConditionType.CREATED_BEFORE,
    name: ContactGroupConditionType.CREATED_BEFORE,
    can_add_value: true,
    value_type: 'date',
  },
  [ContactGroupConditionType.CREATED_AFTER]: {
    operator: ContactGroupOperatorType.CREATED_AFTER,
    condition: ContactGroupConditionType.CREATED_AFTER,
    name: ContactGroupConditionType.CREATED_AFTER,
    can_add_value: true,
    value_type: 'date',
  },
  [ContactGroupConditionType.ALL]: {
    operator: ContactGroupOperatorType.ALL,
    condition: ContactGroupConditionType.ALL,
    name: ContactGroupConditionType.ALL,
  },
};

enum AttributeType {
  PROPERTY = 'property',
  ACTIVITY = 'activity',
}

export const CONTACT_GROUP_ATTRIBUTES: ContactGroupAttribute[] = [
  {
    attribute: ContactGroupAttributeType.NAME,
    name: ContactGroupAttributeType.NAME,
    conditions: [
      CONTACT_GROUP_CONDITION.contain,
      CONTACT_GROUP_CONDITION.not_contain,
      CONTACT_GROUP_CONDITION.is_empty,
      CONTACT_GROUP_CONDITION.not_empty,
      CONTACT_GROUP_CONDITION.has_prefix,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.PHONE,
    name: ContactGroupAttributeType.PHONE,
    conditions: [
      CONTACT_GROUP_CONDITION.is_empty,
      CONTACT_GROUP_CONDITION.not_empty,
      CONTACT_GROUP_CONDITION.has_prefix,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.EMAIL,
    name: ContactGroupAttributeType.EMAIL,
    conditions: [
      CONTACT_GROUP_CONDITION.contain,
      CONTACT_GROUP_CONDITION.not_contain,
      CONTACT_GROUP_CONDITION.is_empty,
      CONTACT_GROUP_CONDITION.not_empty,
      CONTACT_GROUP_CONDITION.has_prefix,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.DOB,
    name: ContactGroupAttributeType.DOB,
    conditions: [
      CONTACT_GROUP_CONDITION.today,
      CONTACT_GROUP_CONDITION.next_7_day,
      CONTACT_GROUP_CONDITION.next_30_day,
      CONTACT_GROUP_CONDITION.next_90_day,
      CONTACT_GROUP_CONDITION.in_month,
      CONTACT_GROUP_CONDITION.this_month,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.PROVINCE,
    name: ContactGroupAttributeType.PROVINCE,
    conditions: [
      CONTACT_GROUP_CONDITION.contain,
      CONTACT_GROUP_CONDITION.not_contain,
      CONTACT_GROUP_CONDITION.is_empty,
      CONTACT_GROUP_CONDITION.not_empty,
      CONTACT_GROUP_CONDITION.has_prefix,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.LABEL,
    name: ContactGroupAttributeType.LABEL,
    conditions: [
      CONTACT_GROUP_CONDITION.contain,
      CONTACT_GROUP_CONDITION.not_contain,
      CONTACT_GROUP_CONDITION.is_empty,
      CONTACT_GROUP_CONDITION.not_empty,
      CONTACT_GROUP_CONDITION.has_prefix,
    ],
    attribute_type: AttributeType.PROPERTY,
  },
  {
    attribute: ContactGroupAttributeType.COMPLETED_ORDER,
    name: ContactGroupAttributeType.COMPLETED_ORDER,
    conditions: [
      CONTACT_GROUP_CONDITION.equal,
      CONTACT_GROUP_CONDITION.greater_equal,
      CONTACT_GROUP_CONDITION.less_equal,
    ],
    sub_conditions: [
      CONTACT_GROUP_CONDITION.all,
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.last_6_month,
      CONTACT_GROUP_CONDITION.last_1_year,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
  {
    attribute: ContactGroupAttributeType.SPENT_MONEY,
    name: ContactGroupAttributeType.SPENT_MONEY,
    conditions: [
      CONTACT_GROUP_CONDITION.equal,
      CONTACT_GROUP_CONDITION.greater_equal,
      CONTACT_GROUP_CONDITION.less_equal,
    ],
    sub_conditions: [
      CONTACT_GROUP_CONDITION.all,
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.last_6_month,
      CONTACT_GROUP_CONDITION.last_1_year,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
  {
    attribute: ContactGroupAttributeType.POINT,
    name: ContactGroupAttributeType.POINT,
    conditions: [
      CONTACT_GROUP_CONDITION.equal,
      CONTACT_GROUP_CONDITION.greater_equal,
      CONTACT_GROUP_CONDITION.less_equal,
    ],
    sub_conditions: [
      CONTACT_GROUP_CONDITION.all,
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.last_6_month,
      CONTACT_GROUP_CONDITION.last_1_year,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
  {
    attribute: ContactGroupAttributeType.CREDIT,
    name: ContactGroupAttributeType.CREDIT,
    conditions: [
      CONTACT_GROUP_CONDITION.equal,
      CONTACT_GROUP_CONDITION.greater_equal,
      CONTACT_GROUP_CONDITION.less_equal,
    ],
    sub_conditions: [
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.last_6_month,
      CONTACT_GROUP_CONDITION.last_1_year,
      CONTACT_GROUP_CONDITION.all,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
  {
    attribute: ContactGroupAttributeType.DEBIT,
    name: ContactGroupAttributeType.DEBIT,
    conditions: [
      CONTACT_GROUP_CONDITION.equal,
      CONTACT_GROUP_CONDITION.greater_equal,
      CONTACT_GROUP_CONDITION.less_equal,
    ],
    sub_conditions: [
      CONTACT_GROUP_CONDITION.all,
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.last_6_month,
      CONTACT_GROUP_CONDITION.last_1_year,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
  {
    attribute: ContactGroupAttributeType.LAST_ACTIVE,
    name: ContactGroupAttributeType.LAST_ACTIVE,
    conditions: [
      CONTACT_GROUP_CONDITION.last_7_day,
      CONTACT_GROUP_CONDITION.last_30_day,
      CONTACT_GROUP_CONDITION.last_90_day,
      CONTACT_GROUP_CONDITION.created_before,
      CONTACT_GROUP_CONDITION.created_after,
    ],
    attribute_type: AttributeType.ACTIVITY,
  },
];
