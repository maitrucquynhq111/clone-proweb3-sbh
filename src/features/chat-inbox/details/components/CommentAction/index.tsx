import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { Language } from '~app/i18n/enums';
import { updateContentCacheConversation } from '~app/features/chat-inbox/utils';
import { useReactMessageMutation } from '~app/services/mutations';
import { MessageReactType } from '~app/utils/constants';

type Props = {
  messageContent: MessageResponse;
  defaultHasReaction?: boolean;
  participantId?: string;
  conversationId?: string;
  onClickReplied(messageContent: MessageResponse): void;
};

const CommentAction = ({
  messageContent,
  defaultHasReaction,
  participantId,
  conversationId,
  onClickReplied,
}: Props) => {
  const { t, i18n } = useTranslation('chat');
  const { mutateAsync } = useReactMessageMutation();
  const [hasReaction, setHasReaction] = useState(defaultHasReaction || false);

  useEffect(() => {
    setHasReaction(defaultHasReaction || false);
  }, [defaultHasReaction]);

  const handleReaction = async () => {
    setHasReaction((prevState) => !prevState);
    try {
      const response = await mutateAsync({
        messageId: messageContent?.id,
        participantId,
        reactType: MessageReactType.LOVE,
      } as ExpectedAny);
      updateContentCacheConversation(response, conversationId);
    } catch (error) {
      setHasReaction(false);
    }
  };
  return (
    <div className="pw-flex pw-gap-x-6">
      <div
        className={cx({
          'pw-w-12': messageContent?.replied_message_id,
          'pw-w-3': !messageContent?.replied_message_id,
        })}
      />
      <span
        className={cx('pw-text-xs pw-font-bold pw-cursor-pointer', {
          'pw-text-neutral-secondary': !hasReaction,
          'pw-text-error-active': hasReaction,
        })}
        onClick={handleReaction}
      >
        {hasReaction ? t('action.love') : t('action.like')}
      </span>
      <span
        className="pw-text-xs pw-text-neutral-secondary pw-font-bold pw-cursor-pointer"
        onClick={() => onClickReplied(messageContent)}
      >
        {t('action.feedback')}
      </span>
      <span className="pw-text-xs pw-text-neutral-secondary">
        {formatDistanceToNowStrict(new Date(messageContent?.created_at || new Date().getTime()), {
          addSuffix: true,
          locale: i18n.language === Language.VI ? vi : enUS,
        })}
      </span>
    </div>
  );
};

export default CommentAction;
