import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { useConfirmInviteMutation, useUpdateMessageMutation } from '~app/services/mutations';
import { VerifyStatus } from '~app/utils/constants';
import { queryClient } from '~app/configs/client';
import { ME_KEY } from '~app/services/queries';

type Props = {
  id: string;
  messageId: string;
  businessId: string;
  message: NotificationMessageType | null;
};

const SendInviteStaffAction = ({ id, businessId, messageId, message }: Props) => {
  const { t } = useTranslation(['orders-form', 'common']);
  const { mutateAsync: confirmInvite } = useConfirmInviteMutation();
  const { mutateAsync: updateMessage } = useUpdateMessageMutation();

  const handleAccept = async () => {
    const newMessage: string = JSON.stringify({ ...message, status: VerifyStatus.CONFIRM });
    updateMessage({ id: messageId, message: newMessage });
    await confirmInvite({
      id,
      business_id: businessId,
      verify_status: VerifyStatus.VERIFIED,
    });
    queryClient.invalidateQueries([ME_KEY]);
  };

  const handleReject = async () => {
    const newMessage: string = JSON.stringify({ ...message, status: VerifyStatus.REJECTED });
    updateMessage({ id: messageId, message: newMessage });
    await confirmInvite({
      id,
      business_id: businessId,
      verify_status: VerifyStatus.REJECTED,
    });
  };

  return (
    <div className="pw-flex pw-gap-x-2">
      <Button
        className="pw-button-secondary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-primary"
        onClick={(e) => {
          e.stopPropagation();
          handleReject();
        }}
      >
        {t('common:modal-confirm-refuse-btn')}
      </Button>
      <Button
        className="pw-button-primary !pw-py-1.5 !pw-px-4 !pw-text-base !pw-font-bold !pw-text-neutral-white"
        onClick={(e) => {
          e.stopPropagation();
          handleAccept();
        }}
      >
        {t('action.confirm')}
      </Button>
    </div>
  );
};

export default SendInviteStaffAction;
