import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageType } from '~app/utils/constants';

type Props = {
  messageContent: MessageResponse;
};

const RepliedMessage = ({ messageContent }: Props) => {
  const { t } = useTranslation('chat');

  const handleGetMessageContent = (messageType: string, message: string) => {
    switch (messageType) {
      case MessageType.IMAGE:
        return `[${t('image')}]`;
      case MessageType.ORDER:
      case MessageType.DRAFT_ORDER:
        return `[${t('filter.order')} #${message}]`;
      case MessageType.PRODUCT:
        return `[${t('product')}]`;
      default:
        return message;
    }
  };

  return (
    <div className="pw-flex pw-gap-x-2 pw-px-4 -pw-mb-1 pw-pt-3">
      <div className="pw-w-1 pw-h-4 pw-rounded-sm pw-bg-blue-primary" />
      <span className="pw-text-xs pw-text-neutral-secondary">
        {t('action.reply')}:{' '}
        {handleGetMessageContent(
          messageContent?.replied_message?.message_type || '',
          messageContent?.replied_message?.message || '',
        )}
      </span>
    </div>
  );
};

export default memo(RepliedMessage);
