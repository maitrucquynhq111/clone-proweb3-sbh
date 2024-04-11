import { useMemo, useState } from 'react';
import SendInviteStaffAction from './SendInviteStaffAction';
import ViewOnPhoneModal from '~app/features/chat-inbox/details/components/ViewOnPhoneModal';
import { MessageStateValue, VerifyStatus } from '~app/utils/constants';
import { formatDateToString, isJsonString } from '~app/utils/helpers';

type Props = {
  messageContent: MessageResponse;
  className?: string;
};

const NotificationMessage = ({ messageContent, className }: Props) => {
  const [visible, setVisible] = useState(false);

  const message = useMemo(() => {
    return isJsonString(messageContent.message)
      ? (JSON.parse(messageContent.message) as NotificationMessageType)
      : null;
  }, [messageContent]);

  const isSendInviteStaff = useMemo(() => {
    return (
      message?.state_value === MessageStateValue.SEND_INVITE_STAFF &&
      message?.status !== VerifyStatus.REJECTED &&
      message?.status !== VerifyStatus.CONFIRM
    );
  }, [message]);

  const handleClick = () => {
    if (isSendInviteStaff) return;
    setVisible(true);
  };

  return (
    <>
      <div className={className}>
        {messageContent?.created_at ? (
          <p className="pw-text-xs pw-font-semibold pw-text-neutral-secondary pw-text-center pw-mb-3">
            {formatDateToString(messageContent.created_at, 'HH:mm dd/MM/yyyy')}
          </p>
        ) : null}
        <div className="pw-gap-x-2 pw-items-end pw-max-w-9/12" onClick={handleClick}>
          <div className="pw-rounded pw-py-3 pw-px-4 pw-bg-neutral-divider pw-flex-1 hover:pw-cursor-pointer">
            <h4 className="pw-font-bold pw-text-neutral-title pw-text-base pw-mb-3">{message?.title || ''}</h4>
            <p className="pw-text-base pw-text-neutral-primary pw-whitespace-pre-line pw-mb-3">
              {message?.content || ''}
            </p>
            {isSendInviteStaff ? (
              <SendInviteStaffAction
                id={message?.contact_id || ''}
                messageId={messageContent?.id || ''}
                businessId={message?.two_way_confirmation_id || ''}
                message={message}
              />
            ) : null}
          </div>
        </div>
      </div>
      <ViewOnPhoneModal onClose={() => setVisible(false)} visible={visible} />
    </>
  );
};

export default NotificationMessage;
