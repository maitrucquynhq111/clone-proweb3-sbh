import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPencilFill } from 'react-icons/bs';
import { DAYS_IN_WEEK } from '~app/features/chat-configs/components/AbsenceTimeList/details';
import { normalizeTime } from '~app/utils/helpers';

type Props = {
  schedule: PendingTimeSelected;
  onClick(): void;
};

type Data = {
  days: number[];
  times: {
    start: string[];
    end: string[];
  };
};

const ScheduleItem = ({ schedule, onClick }: Props) => {
  const { t } = useTranslation('chat');
  const [data, setData] = useState<Data | null>(null);

  const transformDates = () => {
    const dates: number[] = [];
    const time: ExpectedAny[] = [];

    schedule.time_selected.map((timeSelect: TimeSelect) => {
      const dayFrom = timeSelect.from / (60 * 24);
      const dayFromDecimalPart = timeSelect.from % (60 * 24);
      const dayFromHour = dayFromDecimalPart / 60;
      const dayFromMinute = dayFromDecimalPart % 60;

      const dayTo = timeSelect.to / (60 * 24);
      const dayToDecimalPart = timeSelect.to % (60 * 24);
      const dayToHour = dayToDecimalPart / 60;
      const dayToMinute = dayToDecimalPart % 60;

      const floorNumber = (num: number) => {
        return Math.floor(num);
      };

      dates.push(floorNumber(dayFrom), floorNumber(dayTo));

      if (time.length < 4) {
        time.push(
          normalizeTime(floorNumber(dayFromHour)),
          normalizeTime(floorNumber(dayFromMinute)),
          normalizeTime(floorNumber(dayToHour)),
          normalizeTime(floorNumber(dayToMinute)),
        );
      }
    });

    const uniqueDates = [...new Set(dates)];

    setData({
      ...data,
      days: [...uniqueDates],
      times: { start: [time[0], time[1]], end: [time[2], time[3]] },
    });
  };

  useEffect(() => {
    transformDates();
  }, [schedule]);

  return (
    <div className="pw-flex pw-items-center pw-justify-between pw-bg-neutral-background pw-py-2 pw-px-4">
      <div>
        <div className="pw-text-sm pw-font-bold pw-mb-1">
          {(data?.days || []).map((day: number, index: number) => {
            const length = data?.days?.length || 1;
            return index + 1 < length ? t(DAYS_IN_WEEK[day] || '') + '; ' : t(DAYS_IN_WEEK[day] || '');
          })}
        </div>
        <div className="pw-text-sm pw-text-neutral-secondary">
          {`${data?.times.start[0]}:${data?.times.start[1]} - ${data?.times.end[0]}:${data?.times.end[1]}`}
        </div>
      </div>
      <div className="pw-cursor-pointer" onClick={onClick}>
        <BsPencilFill className="pw-fill-blue-primary" size={24} />
      </div>
    </div>
  );
};

export default ScheduleItem;
