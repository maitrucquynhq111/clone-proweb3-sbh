import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Tooltip, Whisper } from 'rsuite';
import { phoneNumberRegex } from '~app/utils/helpers/regexHelper';

type Props = {
  message: string;
  isSender?: boolean;
  reactionTag?: React.ReactNode;
};

const ImageTextMessage = ({ message, isSender = false, reactionTag }: Props) => {
  const { t } = useTranslation('chat');

  const handleClickCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(t('success.copy_phone'));
  };

  return (
    <>
      <img className="pw-object-cover pw-max-w-xs pw-rounded-t" src={JSON.parse(message).image} alt="message-image" />
      <div className="pw-py-2 pw-px-3">
        <div className="pw-whitespace-pre-line">
          {JSON.parse(message)
            .text.split(' ')
            .map((item: ExpectedAny, index: number) => {
              if (item.match(phoneNumberRegex)) {
                return (
                  <Whisper
                    key={item + index}
                    placement={isSender ? 'bottomEnd' : 'bottomStart'}
                    trigger="hover"
                    speaker={<Tooltip arrow={true}>{t('action.click_to_copy')}</Tooltip>}
                  >
                    <span
                      className="pw-text-base pw-font-bold pw-text-info-active hover:pw-cursor-pointer"
                      onClick={() => handleClickCopy(item)}
                    >
                      {item}&nbsp;
                    </span>
                  </Whisper>
                );
              }
              return `${item} `;
            })}
        </div>
        {reactionTag}
      </div>
    </>
  );
};

export default ImageTextMessage;
