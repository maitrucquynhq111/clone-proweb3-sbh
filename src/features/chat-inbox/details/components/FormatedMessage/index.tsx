import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Tooltip, Whisper } from 'rsuite';
import { phoneNumberRegex } from '~app/utils/helpers/regexHelper';

type Props = {
  message: string;
  isSender?: boolean;
  reactionTag?: React.ReactNode;
};

const FormatedMessage = ({ message, isSender = false, reactionTag }: Props) => {
  const { t } = useTranslation('chat');

  const handleClickCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(t('success.copy_phone'));
  };

  return (
    <>
      <div className="pw-whitespace-pre-line">
        {message.split(' ').map((item, index) => {
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
    </>
  );
};

export default FormatedMessage;
