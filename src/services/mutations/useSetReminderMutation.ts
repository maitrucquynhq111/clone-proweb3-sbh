import { useMutation } from '@tanstack/react-query';
import { CashbookService } from '~app/services/api';

export const useSetReminderMutation = () => {
  const { isLoading, error, data, isError, isSuccess, mutate, mutateAsync } = useMutation<ExpectedAny, Error>({
    mutationFn: (variables: ExpectedAny) => {
      return CashbookService.setReminder({
        contact_ids: variables.contactIds,
        reminder_day: variables.reminderDay,
        action: variables.action,
      });
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    data,
    isError,
    mutate,
    mutateAsync,
  };
};
