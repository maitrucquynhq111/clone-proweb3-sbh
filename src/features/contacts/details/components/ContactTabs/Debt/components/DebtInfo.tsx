import { isBefore } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { CONTACTS_KEY, useContactDetailQuery } from '~app/services/queries';
import { ComponentType } from '~app/components/HookForm/utils';
import FormLayout from '~app/components/HookForm/FormLayout';
import FormProvider from '~app/components/HookForm/FormProvider';
import { formatCurrency } from '~app/utils/helpers';
import { useSetReminderMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';

export const cashbookFormSchema = ({ onSubmit, loading }: { onSubmit: (date: Date) => void; loading?: boolean }) => {
  const { t } = useTranslation('debt-details');

  return {
    className: 'pw-grid pw-grid-cols-12',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-col-span-12',
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Date,
                name: 'reminder_day',
                placeholder: t('choose-remind-date'),
                className: 'pw-w-52',
                cleanable: false,
                isForm: true,
                loading: loading,
                size: 'lg',
                disabled: loading,
                onOk: (date: Date) => {
                  onSubmit(date);
                },
                disabledDate: (date: Date) => isBefore(date, new Date()),
              },
            ],
          },
        ],
      },
    ],
  };
};

const DebtInfo = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') as string;
  const { data } = useContactDetailQuery(id);

  const { t } = useTranslation('debt-details');
  const { mutateAsync, isLoading } = useSetReminderMutation();

  const methods = useForm<ExpectedAny>({
    defaultValues: {
      reminder_day: null,
    },
  });
  const { setValue } = methods;

  const onSubmit = async (date: Date) => {
    try {
      await mutateAsync({
        contactIds: [id],
        reminderDay: date,
      } as ExpectedAny);
      await toast.success(t('notification:update-reminder-success'));
      queryClient.invalidateQueries([CONTACTS_KEY], {
        exact: false,
      });
    } catch (error: ExpectedAny) {
      console.log(error);
    }
  };

  useEffect(() => {
    data?.reminder_day && setValue('reminder_day', new Date(data.reminder_day));
  }, [data?.reminder_day]);

  const debtAmount = data?.debt_amount || 0;
  const isReceive = debtAmount > 0;

  return (
    <div className="pw-flex pw-gap-6 pw-items-center">
      {debtAmount !== 0 && (
        <div>
          <span className="pw-font-semibold">{isReceive ? t('must-receive') : t('must-pay')}:</span>
          <span
            className={cx('pw-font-bold pw-ml-2 pw-text-base', {
              'pw-text-red-600': isReceive,
              'pw-text-green-600': !isReceive,
            })}
          >
            {formatCurrency(debtAmount)}
          </span>
        </div>
      )}
      <div className="pw-flex pw-gap-2 pw-items-center">
        <span className="pw-font-semibold">{t('remind-date')}: </span>
        <FormProvider methods={methods}>
          <FormLayout
            formSchema={cashbookFormSchema({
              onSubmit,
              loading: isLoading,
            })}
          />
        </FormProvider>
      </div>
    </div>
  );
};

export default DebtInfo;
