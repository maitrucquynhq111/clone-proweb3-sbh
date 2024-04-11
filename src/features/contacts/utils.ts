import { formatBirthday, formatDateToString, formatPhoneWithZero } from '~app/utils/helpers';
import { RETAILCUSTOMER } from '~app/configs';
import { numberRegex } from '~app/utils/helpers/regexHelper';

export const defaultContact = ({ contactNameDefault }: { contactNameDefault?: string }) => {
  const isNumber = contactNameDefault && numberRegex.test(contactNameDefault);
  return {
    name: contactNameDefault && !isNumber ? contactNameDefault : '',
    phone_number: contactNameDefault && isNumber ? contactNameDefault : '',
    email: '',
    birthday: null as Date | string | null,
    gender: '',
    address_info: null as AddressInfo | null,
    group_of_contact_ids: [] as Array<GroupInContact>,
    tags: [] as Array<ContactLabel>,
  };
};

export const toDefaultContact = (detail: Contact) => ({
  name: detail.name,
  phone_number: formatPhoneWithZero(detail.phone_number),
  email: detail.email,
  gender: detail.gender,
  address_info: detail.address_info,
  birthday: formatBirthday(detail.birthday),
  group_of_contact_ids: detail?.contact_groups || [],
  tags: detail?.contact_tag || [],
});

export const toPendingContact = (data: ReturnType<typeof defaultContact>): PendingContact => {
  const params = {
    ...data,
    name: data.name?.trim(),
    birthday: data.birthday ? formatDateToString(data.birthday, 'dd-MM-yyyy') : '',
    group_of_contact_ids: (data?.group_of_contact_ids || []).map((group) => group.id),
    tags: (data?.tags || []).map((tag) => tag.id),
  } as PendingContact;
  return params;
};

export const isContactDefault = (detail: Contact | null) => {
  if (!detail) return false;
  if (detail.name === RETAILCUSTOMER.name && detail.phone_number === RETAILCUSTOMER.phone_number) return true;
  return false;
};

export const defaultContactLabel = (defaultName?: string) => ({
  name: defaultName || '',
});

export const toDefaultContactLabel = (labels: ContactLabel[]) => {
  return labels.map((label) => ({ name: label.name, id: label.id }));
};

export const toPendingContactLabel = ({
  oldData,
  currentData,
}: {
  oldData: PendingContactLabel[];
  currentData: PendingContactLabel[];
}) => {
  const result: PendingContactLabel[] = [];
  currentData.forEach((current) => {
    const different = oldData.find((old) => current.id === (old?.id || '') && old.name !== current.name);
    if (different) result.push(current);
  });
  return result;
};

export const checkIsChangedLabel = ({
  oldLabels,
  currentLabels,
}: {
  oldLabels: ContactLabel[];
  currentLabels: ContactLabel[];
}) => {
  const oldIds = oldLabels.map((old) => old.id);
  const currentIds = currentLabels.map((current) => current.id);
  return oldIds.join(',') !== currentIds.join(',');
};
