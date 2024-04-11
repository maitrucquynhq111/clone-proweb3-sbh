import { toast } from 'react-toastify';
import { useMemo, useState } from 'react';
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
import { useCreateContactDeliveringAddressMutation } from '~app/services/mutations';
import { queryClient } from '~app/configs/client';
import { LIST_CONTACT_DELIVERING_KEY } from '~app/services/queries/useGetListContactDeliveringAddress';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { ConversationTag, SourceKey } from '~app/utils/constants';
import { CONTACT_IN_CHAT_KEY } from '~app/services/queries';
import { ContactService } from '~app/services/api';
import { DuplicateContactModal, SyncOldContactModal } from '~app/features/chat-inbox/details/components';

type Props = {
  contact_id: string;
  isCreateContactInChat?: boolean;
  onClose(): void;
  onSelectCustomerInfo?(value: ContactDeliveringAddress): void;
};

const CreateCustomerInfo = ({ contact_id, isCreateContactInChat = false, onClose, onSelectCustomerInfo }: Props) => {
  const { t } = useTranslation('contact-form');
  const { currentConversation } = useCurrentConversation();
  const { mutateAsync: createContactDeliveringAddress } = useCreateContactDeliveringAddressMutation();
  const [openSyncModal, setOpenSyncModal] = useState(false);
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [syncContact, setSyncContact] = useState<{
    contact_name: string;
    contact_id: string;
  }>({
    contact_name: '',
    contact_id: '',
  });

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  const methods = useForm<CustomerInfo>({
    resolver: yupResolver(customerInfoYupSchema({ isRequiredPhoneNumber: isCreateContactInChat ? false : true })),
    defaultValues: defaultFormSchema,
  });
  const { handleSubmit, watch, setValue } = methods;

  const onSubmit = async (data: CustomerInfo) => {
    try {
      const { id, ...cusomter_info } = data;
      if (isCreateContactInChat && currentConversation) {
        const body: CreateContactInChatBody = {
          avatar: otherParticipant?.info?.avatar || '',
          address_info: cusomter_info?.address_info || defaultAddressInfo,
          name: cusomter_info.name,
          phone_number: cusomter_info.phone_number,
          sender_id: otherParticipant?.sender_id || '',
          sender_type: otherParticipant?.sender_type || '',
          source_key: SourceKey[currentConversation.tag as keyof typeof SourceKey],
        };
        await ContactService.createContactInChat(body);
        queryClient.invalidateQueries([
          CONTACT_IN_CHAT_KEY,
          {
            sender_id: otherParticipant?.sender_id || '',
            sender_type: otherParticipant?.sender_type || '',
          },
        ]);
        toast.success(t('success.create_contact_delivering'));
      } else {
        const result = await createContactDeliveringAddress({
          contact_id,
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
      }
      onClose();
    } catch (_) {
      // TO DO
      if (
        isCreateContactInChat &&
        (currentConversation?.tag === ConversationTag.FB_MESSAGE ||
          currentConversation?.tag === ConversationTag.ZALO_MESSAGE)
      ) {
        const result = await ContactService.getOneByPhoneName(data.phone_number);
        if (result) {
          setSyncContact({
            contact_id: result.id,
            contact_name: result.name,
          });
          setOpenSyncModal(true);
        }
        return;
      }
      if (isCreateContactInChat && currentConversation?.tag === ConversationTag.SBH) {
        const result = await ContactService.getOneByPhoneName(data.phone_number);
        if (result) {
          setSyncContact({
            contact_id: result.id,
            contact_name: result.name,
          });
          setOpenDuplicateModal(true);
        }
        return;
      }
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          formSchema={customerFormSchema({
            address_info: watch('address_info'),
            isRequiredPhoneNumber: isCreateContactInChat ? false : true,
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
      {openSyncModal ? (
        <SyncOldContactModal
          open={openSyncModal}
          setOpen={setOpenSyncModal}
          participant={otherParticipant}
          contactId={syncContact.contact_id}
          contactName={syncContact.contact_name}
        />
      ) : null}
      {openDuplicateModal ? (
        <DuplicateContactModal
          open={openDuplicateModal}
          setOpen={setOpenDuplicateModal}
          contactName={syncContact.contact_name}
        />
      ) : null}
    </>
  );
};

export default CreateCustomerInfo;
