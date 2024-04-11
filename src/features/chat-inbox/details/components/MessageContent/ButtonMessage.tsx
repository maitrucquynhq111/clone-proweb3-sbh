import { memo, useState, useEffect } from 'react';
import { Button } from 'rsuite';

type Props = {
  message: string;
  reactionTag?: React.ReactNode;
};

type ButtonMessageType = {
  text: string;
  buttons?: Array<{ text: string; url: string }>;
};

const ButtonMessage = ({ message, reactionTag }: Props) => {
  const [messageContent, setMessageContent] = useState<ButtonMessageType>();

  useEffect(() => {
    const dataMessage = JSON.parse(message);
    setMessageContent(dataMessage);
  }, []);

  return (
    <div>
      <p>{messageContent?.text}</p>
      {messageContent?.buttons?.map((button, index) => {
        const url = button?.url?.startsWith('url') ? button.url.split('|')[1] : undefined;
        return (
          <Button
            key={`${index}-button-message`}
            as="a"
            target="_blank"
            href={url}
            appearance="link"
            className="!pw-block !pw-mt-3 pw-p-2 pw-text-center !pw-text-sm !pw-text-secondary-main-blue !pw-font-bold !pw-rounded !pw-border !pw-border-solid !pw-border-secondary-border !pw-bg-neutral-white hover:!pw-no-underline focus:!pw-no-underline"
          >
            {button.text}
          </Button>
        );
      })}
      {reactionTag}
    </div>
  );
};

export default memo(ButtonMessage);
