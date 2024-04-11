import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { Button } from 'rsuite';
import { useEffect, useState } from 'react';
import { isAfter } from 'date-fns';
import { BsTrash } from 'react-icons/bs';
import { v4 } from 'uuid';
import { DateItem, FromToSelect } from './components';
import { ConfirmModal, DrawerBody, DrawerFooter, DrawerHeader, FormLabel } from '~app/components';
import {
  checkExistedAbsenceSchedule,
  defaultAbsenceMessage,
  formatTimeSelected,
  toDefaultSchedule,
} from '~app/features/chat-configs/AbsenceMessage/config';

type Props = {
  dataForm: ReturnType<typeof defaultAbsenceMessage>;
  detail: PendingTimeSelected | null;
  onChange(name: string, value: ExpectedAny): void;
  onClose: () => void;
};

enum ErrorType {
  NOT_DAY_RANGE = 'not_day_range',
  NOT_TIME_RANGE = 'not_time_range',
  IS_VALID_TIME = 'is_valid_time',
  EXISTED_SCHEDULE = 'existed_schedule',
}

export const DAYS_IN_WEEK = ['date.mon', 'date.tue', 'date.wed', 'date.thu', 'date.fri', 'date.sat', 'date.sun'];

const AbsenceTimeSelectDetails = ({ dataForm, detail, onChange, onClose }: Props): JSX.Element => {
  const { t } = useTranslation('chat');
  const [dayRange, setDayRange] = useState<number[]>([]);
  const [startTime, setStartTime] = useState({ date: null, hour: '', minute: '' });
  const [endTime, setEndTime] = useState({ date: null, hour: '', minute: '' });
  const [error, setError] = useState({ type: '', text: '' });
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClickDate = (value: number) => {
    const newRange = [...dayRange];
    const currentIndex = dayRange.indexOf(value);
    if (currentIndex === -1) {
      newRange.push(value);
      newRange.sort((a, b) => a - b);
    } else {
      newRange.splice(currentIndex, 1);
    }
    setDayRange(newRange);
    error.type === ErrorType.NOT_DAY_RANGE && setError({ type: '', text: '' });
  };

  const handleSubmit = () => {
    if (dayRange.length === 0) {
      return setError({ type: ErrorType.NOT_DAY_RANGE, text: t('error.not_select_day_range') });
    }
    if (!startTime.date || !endTime.date) {
      return setError({ type: ErrorType.NOT_TIME_RANGE, text: t('error.not_select_time_range') });
    }
    if (isAfter(startTime.date, endTime.date)) {
      return setError({ type: ErrorType.IS_VALID_TIME, text: t('error.start_after_end') });
    }
    const timeSelected = {
      id: detail?.id || v4(),
      time_selected: formatTimeSelected({ dayRange, startTime, endTime }),
    };

    const isExisted = checkExistedAbsenceSchedule({
      absent_schedule: dataForm.absent_schedule,
      current_time_select: timeSelected,
    });
    if (isExisted) {
      return setError({ type: ErrorType.EXISTED_SCHEDULE, text: t('error.existed_schedule') });
    }
    let newAbsentSchedule = [...dataForm.absent_schedule];
    if (detail) {
      newAbsentSchedule = newAbsentSchedule.map((schedule) => {
        if (schedule.id === detail.id) return { ...schedule, time_selected: timeSelected.time_selected };
        return schedule;
      });
    } else {
      newAbsentSchedule.push(timeSelected);
    }

    onChange('absent_schedule', newAbsentSchedule);
    onClose();
  };

  const handleDeleteSchedule = () => {
    const timeSelected = formatTimeSelected({ dayRange, startTime, endTime });
    onChange(
      'absent_schedule',
      [...dataForm.absent_schedule].filter(
        (schedule) => JSON.stringify(schedule.time_selected) !== JSON.stringify(timeSelected),
      ),
    );
    onClose();
  };

  useEffect(() => {
    if (detail) {
      const { dayRange, startTime, endTime } = toDefaultSchedule(detail.time_selected);
      setDayRange(dayRange);
      setStartTime(startTime);
      setEndTime(endTime);
    }
  }, [detail]);

  return (
    <div className="pw-flex pw-flex-col !pw-h-screen">
      <DrawerHeader title={detail ? t('modal.detail_absence') : t('modal.add_absence')} onClose={onClose} />
      <DrawerBody className="pw-bg-white">
        <FormLabel
          label={t('select_date_apply')}
          className={cx('pw-mb-4', {
            '!pw-mb-1': error.type === ErrorType.NOT_DAY_RANGE,
          })}
          isRequired
        />
        {error.type === ErrorType.NOT_DAY_RANGE && (
          <p className="pw-text-xs pw-font-semibold pw-text-error-active pw-mb-4">{error.text}</p>
        )}
        <div className="pw-grid pw-grid-cols-7 pw-gap-4 pw-mb-6">
          {DAYS_IN_WEEK.map((date, index) => (
            <DateItem
              key={date}
              text={date}
              index={index}
              active={dayRange.some((day) => day === index)}
              onClick={handleClickDate}
            />
          ))}
        </div>
        <FromToSelect
          startTime={startTime.date}
          endTime={endTime.date}
          error={error.type !== ErrorType.NOT_DAY_RANGE ? error.text : ''}
          onChange={(name, value) => {
            if (name === 'start_time') {
              setStartTime(value);
              error.type === ErrorType.NOT_TIME_RANGE && endTime.hour && setError({ type: '', text: '' });
            } else {
              setEndTime(value);
              error.type === ErrorType.NOT_TIME_RANGE && startTime.hour && setError({ type: '', text: '' });
            }
          }}
        />
      </DrawerBody>
      <DrawerFooter className="!pw-border-none !pw-shadow-revert !pw-justify-between">
        {detail ? (
          <Button
            appearance="subtle"
            className="!pw-py-3 !pw-px-6 !pw-text-error-active"
            startIcon={<BsTrash size={24} />}
            onClick={() => setOpenConfirm(true)}
          >
            <span className="pw-text-base pw-font-bold">{t('common:delete')}</span>
          </Button>
        ) : (
          <div />
        )}
        <div className="pw-flex">
          <Button className="pw-button-secondary !pw-py-3 !pw-px-6 pw-mr-4" onClick={onClose}>
            <span className="pw-text-base pw-font-bold pw-text-neutral-primary">{t('common:cancel')}</span>
          </Button>
          <Button className="pw-button-primary !pw-py-3 !pw-px-6" onClick={handleSubmit}>
            <span className="pw-text-base pw-font-bold pw-text-neutral-white">{t('common:save')}</span>
          </Button>
        </div>
      </DrawerFooter>
      {openConfirm && (
        <ConfirmModal
          open={openConfirm}
          title={t('modal.delete_absence')}
          iconTitle={<BsTrash size={24} />}
          description={t('modal.delete_absence_description')}
          isDelete
          onConfirm={handleDeleteSchedule}
          onClose={() => setOpenConfirm(false)}
        />
      )}
    </div>
  );
};

export default AbsenceTimeSelectDetails;
