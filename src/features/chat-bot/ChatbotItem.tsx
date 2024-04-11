import cx from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'rsuite';
import { PlaceholderImage } from '~app/components';

type Props = {
  chatbot: Chatbot;
  using: boolean;
  onClick(chatbot: ExpectedAny, isPreview: boolean): Promise<void>;
};

const ChatBotItem = ({ chatbot, using, onClick }: Props) => {
  const { t } = useTranslation('chat');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={cx('pw-rounded pw-shadow-card', {
        'pw-border pw-border-success-active': using,
      })}
    >
      <PlaceholderImage
        className="pw-bg-cover !pw-w-full  !pw-max-h-34.5 pw-object-cover pw-rounded-t pw-aspect-video"
        src={chatbot?.image}
        alt={chatbot.name}
      />
      <div className="pw-px-3 pw-py-4">
        <p className="pw-font-bold pw-mb-1">{t(chatbot.name)}</p>
        <p className="pw-text-xs pw-mb-4">{t(chatbot?.description || '')}</p>
        <div className="pw-flex pw-justify-between">
          <Button
            appearance="ghost"
            className="pw-w-full !pw-font-bold pw-mr-3 !pw-text-blue-primary !pw-border-secondary-border"
            onClick={() => onClick(chatbot, true)}
          >
            {t('action.preview')}
          </Button>
          <Button
            appearance={using ? 'ghost' : 'primary'}
            className={cx('pw-w-full !pw-font-bold', {
              '!pw-border-neutral-border': using,
            })}
            loading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await onClick(chatbot, false);
              setIsLoading(false);
            }}
          >
            {t(using ? 'action.stop_using_shorten' : 'action.use')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotItem;
