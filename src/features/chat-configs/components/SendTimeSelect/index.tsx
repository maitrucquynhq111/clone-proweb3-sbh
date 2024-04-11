import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Radio, RadioGroup } from 'rsuite';
import { AutoResizeInput } from '~app/components';
import { SEND_TYPE } from '~app/features/chat-configs/AutoMessage/config';

type Props = {
  send_type: string;
  send_after: number;
  name: string;
  error?: string;
  onChangeType(value: string): void;
  onChangeTime(value: string): void;
};

const SendTimeSelect = ({ send_type, send_after, error, name, onChangeType, onChangeTime }: Props) => {
  const { t } = useTranslation('chat');
  return (
    <div>
      <p className="pw-font-bold pw-text-sm pw-mt-6 pw-mb-1">{t('send_time')}</p>
      <RadioGroup className="!pw-flex-col" inline value={send_type} onChange={(value) => onChangeType(value as string)}>
        <Radio
          value="send_after"
          className={cx('pw-whitespace-nowrap !pw-mb-3', {
            '!pw-mb-3': error,
          })}
        >
          <div className="pw-flex pw-items-center">
            <span>{t('send_after_prefix')}</span>
            <AutoResizeInput
              name={name}
              className="!pw-text-center pw-mx-3"
              onChange={onChangeTime}
              onBlur={onChangeTime}
              defaultValue={send_after.toString()}
              placeholder="0"
              disabled={send_type === SEND_TYPE.SEND_NOW}
              isForm={true}
              isNumber={true}
            />
            <span>{t('send_after_suffix')}</span>
          </div>
          {error && (
            <label className="!pw-font-semibold pw-text-xs pw-text-error-active pw-mt-2">
              {t('error.max_send_time')}
            </label>
          )}
        </Radio>
        <Radio value="send_now" className="pw-whitespace-nowrap">
          {t('send_when_income_mess')}
        </Radio>
      </RadioGroup>
    </div>
  );
};

export default SendTimeSelect;
