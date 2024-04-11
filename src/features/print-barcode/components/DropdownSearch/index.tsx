import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { searchYupSchema, searchSchema } from './config';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';

const DropdownSearch = () => {
  const { t } = useTranslation('filters');
  const methods = useForm<ExpectedAny>({
    resolver: yupResolver(searchYupSchema()),
    defaultValues: { search: '' },
  });
  return (
    <FormProvider className="pw-flex-1 pw-flex pw-flex-col pw-overflow-hidden" methods={methods}>
      <FormLayout formSchema={searchSchema({ t })} />
    </FormProvider>
  );
};

export default memo(DropdownSearch);
