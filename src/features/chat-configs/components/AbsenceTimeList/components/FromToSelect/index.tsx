import { format } from 'date-fns';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { DatePicker } from 'rsuite';
import { FormLabel } from '~app/components';

type Props = {
  startTime: Date | null;
  endTime: Date | null;
  error: string;
  onChange(name: string, value: ExpectedAny): void;
};

const FromToSelect = ({ startTime, endTime, error, onChange }: Props): JSX.Element => {
  const { t } = useTranslation('chat');

  const handleChangeTime = (value: Date | null, name: string) => {
    if (value) {
      const date = new Date(value);
      const hour = format(date, 'H');
      const minute = format(date, 'm');
      onChange(name, { date: value, hour, minute });
      return;
    }
    onChange(name, { date: null, hour: '', minute: '' });
  };

  return (
    <div className="pw-grid pw-grid-cols-2 pw-gap-4">
      <div className="pw-w-full">
        <FormLabel label={t('start_time')} />
        <DatePicker
          className={cx('pw-w-full', { '!pw-border-error-active': error })}
          format="HH:mm"
          value={startTime}
          placeholder="00:00"
          locale={{ hours: t('common:hour') || '', minutes: t('common:minute') || '' }}
          onChange={(value) => handleChangeTime(value, 'start_time')}
        />
      </div>
      <div className="pw-w-full">
        <FormLabel label={t('end_time')} />
        <DatePicker
          className={cx('pw-w-full', { '!pw-border-error-active': error })}
          format="HH:mm"
          value={endTime}
          placeholder="00:00"
          placement="bottomEnd"
          locale={{ hours: t('common:hour') || '', minutes: t('common:minute') || '' }}
          onChange={(value) => handleChangeTime(value, 'end_time')}
        />
      </div>
      <p className="pw-col-span-2 pw-text-xs pw-font-semibold pw-text-error-active">{error}</p>
    </div>
  );
};

export default FromToSelect;
