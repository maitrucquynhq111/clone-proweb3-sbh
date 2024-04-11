import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import {
  CustomerInfo,
  customerFormSchema,
  customerInfoYupSchema,
  defaultAddressInfo,
  defaultFormSchema,
} from './config';
import FormProvider from '~app/components/HookForm/FormProvider';
import FormLayout from '~app/components/HookForm/FormLayout';
import { formatPhoneWithZero } from '~app/utils/helpers';
import {
  useCreateContactDeliveringAddressMutation,
  useUpdateContactDeliveringAddressMutation,
} from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { LIST_CONTACT_DELIVERING_KEY } from '~app/services/queries/useGetListContactDeliveringAddress';
import { useSelectedOrderStore } from '~app/features/pos/hooks';

type Props = {
  contactId?: string;
  defaultCustomerInfo: CustomerInfo | null;
  hasContact: boolean;
  onClose(): void;
  onSelectCustomerInfo?(value: ContactDeliveringAddress): void;
};

const CustomerInfoDetail = ({ onClose, defaultCustomerInfo, hasContact, contactId, onSelectCustomerInfo }: Props) => {
  const { t } = useTranslation('contact-form');
  const [, setSelectedOrderStore] = useSelectedOrderStore((store) => store.id);
  const { mutateAsync: updateContactDeliveringAddress } = useUpdateContactDeliveringAddressMutation();
  const { mutateAsync: createContactDeliveringAddress } = useCreateContactDeliveringAddressMutation();

  const methods = useForm<CustomerInfo>({
    resolver: yupResolver(customerInfoYupSchema({ isRequiredPhoneNumber: true })),
    defaultValues: defaultFormSchema,
  });
  const { handleSubmit, watch, reset, setValue } = methods;

  const onSubmit = async (data: CustomerInfo) => {
    try {
      const { id, ...cusomter_info } = data;
      if (hasContact) {
        if (id) {
          const result = await updateContactDeliveringAddress({
            id: id,
            body: {
              name: cusomter_info.name,
              phone_number: cusomter_info.phone_number,
              is_default: true,
              address_info: cusomter_info?.address_info || defaultAddressInfo,
            },
          });
          queryClient.invalidateQueries([LIST_CONTACT_DELIVERING_KEY], { exact: false });
          onSelectCustomerInfo?.(result);
          toast.success(t('success.update_contact_delivering'));
          onClose();
        } else {
          const result = await createContactDeliveringAddress({
            contact_id: contactId || '',
            body: {
              name: cusomter_info.name,
              phone_number: cusomter_info.phone_number,
              is_default: true,
              address_info: cusomter_info?.address_info || defaultAddressInfo,
            },
          });
          queryClient.invalidateQueries([LIST_CONTACT_DELIVERING_KEY], { exact: false });
          onSelectCustomerInfo?.(result);
          toast.success(t('success.create_contact_delivering'));
          onClose();
        }
      } else {
        setSelectedOrderStore((store) => {
          const { buyer_info } = store;
          const newBuyerInfo = {
            ...buyer_info,
            name: cusomter_info.name,
            phone_number: cusomter_info.phone_number,
            address_info: cusomter_info?.address_info || defaultAddressInfo,
          };
          return { ...store, buyer_info: newBuyerInfo };
        });
        onClose();
      }
    } catch (_) {
      // TO DO
    }
  };

  useEffect(() => {
    if (!defaultCustomerInfo) return;
    reset({ ...defaultCustomerInfo, phone_number: formatPhoneWithZero(defaultCustomerInfo.phone_number) });
  }, [defaultCustomerInfo]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        formSchema={customerFormSchema({
          address_info: watch('address_info'),
          setValue,
        })}
      />
      <div className="pw-flex pw-gap-x-4 pw-mt-4 pw-justify-end">
        <Button onClick={onClose} className="pw-button-secondary !pw-py-1.5 !pw-px-6">
          <span className="pw-text-sm pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
        </Button>
        <Button type="submit" className="pw-button-primary !pw-py-1.5 !pw-px-6">
          <span className="pw-text-sm pw-font-bold pw-text-neutral-white">{t('common:modal-confirm')}</span>
        </Button>
      </div>
    </FormProvider>
  );
};

export default CustomerInfoDetail;
