import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillXCircleFill } from 'react-icons/bs';
import { IconButton } from 'rsuite';
import { MessageType } from '~app/utils/constants';
import { useCurrentConversation } from '~app/utils/hooks';

type Props = {
  messageContent: MessageResponse;
};

const RepliedMessage = ({ messageContent }: Props) => {
  const { t } = useTranslation('chat');
  const { setCurrentRepliedMessageContent } = useCurrentConversation();

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
    <div className="pw-px-3 pw-py-2 pw-w-full">
      <div className="pw-flex pw-items-center pw-justify-between pw-gap-x-1 pw-bg-neutral-background pw-py-2 pw-px-3 pw-text-xs pw-text-neutral-secondary pw-truncate pw-rounded">
        <div>
          {t('action.reply')} <span className="pw-font-semibold">{messageContent?.sender?.info?.full_name}</span>:{' '}
          {handleGetMessageContent(messageContent?.message_type || '', messageContent?.message || '')}
        </div>
        <IconButton
          className="!pw-p-0"
          icon={<BsFillXCircleFill size={16} className="pw-fill-neutral-placeholder" />}
          onClick={() => setCurrentRepliedMessageContent(null)}
        />
      </div>
    </div>
  );
};

export default memo(RepliedMessage);
