import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const yupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    name: yup.string().required(t('required_info') || ''),
  });
};
