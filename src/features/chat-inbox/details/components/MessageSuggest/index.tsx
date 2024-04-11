import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { MessageType, SuggestMessages } from '~app/utils/constants';

type Props = {
  onSendMessage: (value: string, type: MessageType) => void;
  conversationType?: string;
};

const MessageSuggest = ({ onSendMessage, conversationType }: Props) => {
  const { t } = useTranslation('chat');
  const listMessageSuggest = SuggestMessages[conversationType as keyof typeof SuggestMessages];

  return (
    <div className="pw-flex pw-items-center pw-justify-between">
      {listMessageSuggest && (
        <div className="pw-flex pw-items-center pw-flex-wrap pw-gap-y-2">
          {(listMessageSuggest || []).map((message: string) => (
            <div
              key={message}
              onClick={() => onSendMessage(t(`message_suggest.${message}`), MessageType.TEXT)}
              className="pw-flex pw-items-center pw-bg-secondary-background pw-rounded pw-py-2 pw-px-4 pw-w-max pw-mr-2 pw-cursor-pointer"
            >
              <span className={cx('pw-text-secondary-main-blue pw-text-sm line-clamp-1')}>
                {t(`message_suggest.${message}`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageSuggest;
