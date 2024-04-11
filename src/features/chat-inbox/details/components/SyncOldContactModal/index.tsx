import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Button, Modal } from 'rsuite';
import { queryClient } from '~app/configs/client';
import { useSyncContactChatMutation } from '~app/services/mutations';
import { CONTACT_IN_CHAT_KEY } from '~app/services/queries';

type Props = {
  participant: Participant;
  contactId: string;
  contactName: string;
  open: boolean;
  setOpen(value: boolean): void;
};

const SyncOldContactModal = ({ participant, contactId, contactName, open, setOpen }: Props) => {
  const { t } = useTranslation('chat');
  const { mutateAsync } = useSyncContactChatMutation();

  const handleAccept = async () => {
    try {
      const body: SyncContactChatBody = {
        contact_id: contactId,
        sender_id: participant.sender_id,
        sender_type: participant?.sender_type || '',
        avatar: participant?.info?.avatar || '',
      };
      await mutateAsync(body);
      setOpen(false);
      queryClient.invalidateQueries([
        CONTACT_IN_CHAT_KEY,
        {
          sender_id: participant?.sender_id || '',
          sender_type: participant?.sender_type || '',
        },
      ]);
    } catch (error) {
      // TO DO
    }
  };

  return (
    <Modal
      open={open}
      keyboard={false}
      size="xs"
      className="!pw-flex !pw-absolute !-pw-translate-x-1/2 xl:-pw-translate-y-1/2 xl:pw-top-1/2 pw-left-1/2
        pw-items-center pw-justify-center xl:!pw-my-0 center-modal"
    >
      <div className="pw-w-full pw-p-1">
        <div className="pw-flex pw-justify-center pw-items-center">
          <BsExclamationTriangle className="pw-text-warning-active" size={80} />
        </div>
        <div className="pw-py-6 pw-px-3 pw-text-lg pw-font-bold pw-text-neutral-title pw-text-center">
          {t('sync_old_contact')}
        </div>
        <div className="pw-text-center">
          <Trans
            t={t}
            i18nKey="sync_old_contact_desc"
            values={{
              name: contactName,
            }}
            components={{
              strong: <strong />,
            }}
          />
        </div>
        <div className="pw-flex pw-justify-end pw-items-center pw-gap-x-3 pw-mt-6">
          <Button onClick={() => setOpen(false)} className="pw-button-secondary !pw-py-3 !pw-px-4">
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">
              {t('common:modal-confirm-refuse-btn')}
            </span>
          </Button>
          <Button onClick={handleAccept} className="pw-button-primary !pw-py-3 !pw-px-4">
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">
              {t('common:modal-confirm-accept-btn')}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SyncOldContactModal;
