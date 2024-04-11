import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { ComponentType } from '~app/components/HookForm/utils';

export const customerNoteYupSchema = () => {
  const { t } = useTranslation('');
  return yup.object().shape({
    note: yup.string().required(t('common:required_info') || ''),
  });
};

export const customerNoteFormSchema = () => {
  const { t } = useTranslation('chat');
  return {
    className: '',
    type: 'container',
    name: 'form',
    children: [
      {
        type: ComponentType.Text,
        className: 'pw-col-span-6',
        name: 'note',
        isRequired: true,
        as: 'textarea',
        rows: 2,
        placeholder: t('placeholder.contact_note'),
      },
    ],
  };
};

export const defaultPendingNote: PendingNote = {
  day: '',
  note: '',
  contact_id: '',
};
