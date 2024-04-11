import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { addSeconds, format } from 'date-fns';
import { ComponentType } from '~app/components/HookForm/utils';
import {
  AbsenceTimeList,
  ApplyToggle,
  MessageContentControl,
  SendTimeSelect,
} from '~app/features/chat-configs/components';
import { SEND_TYPE } from '~app/features/chat-configs/AutoMessage/config';

export const AbsenceMessageYupSchema = () => {
  const { t } = useTranslation('common');
  return yup.object().shape({
    day_range: yup.array().min(1, t('chat:error.not_select_day_range') || ''),
    message: yup
      .string()
      .required(t('required_info') || '')
      .max(1000, t('chat:max_auto_message_length') || ''),
    send_after: yup.number().when('send_type', {
      is: SEND_TYPE.SEND_AFTER,
      then: (schema) => schema.min(1, 'chat:error.max_send_time').max(5, 'chat:error.max_send_time'),
    }),
    send_type: yup.string(),
    absent_schedule: yup.array(),
    business_has_page_setting: yup.object().shape({
      absent_message_enable: yup.boolean(),
      business_has_page_id: yup.string(),
    }),
  });
};

type Props = {
  dataForm: ReturnType<typeof defaultAbsenceMessage>;
  errorSendAfter: string;
  setValue(type: string, value: ExpectedAny): void;
};

export const AbsenceMessageFormSchema = ({ dataForm, errorSendAfter, setValue }: Props) => {
  const { t } = useTranslation('chat');
  return {
    className: 'pw-grid pw-grid-cols-12 pw-gap-x-6',
    type: 'container',
    name: 'form',
    children: [
      {
        className: 'pw-col-span-12',
        name: 'first-col',
        type: 'block-container',
        children: [
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'first-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                name: 'apply',
                title: t('apply_absence_message'),
                checked: dataForm.business_has_page_setting?.absent_message_enable || false,
                onChange: (value: boolean) => setValue('business_has_page_setting.absent_message_enable', value),
                component: ApplyToggle,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12',
            className: `pw-grid pw-grid-cols-12 pw-gap-4 pw-relative`,
            type: 'block',
            name: 'second-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12',
                dataForm,
                onChange: (name: string, value: ExpectedAny) => setValue(name, value),
                component: AbsenceTimeList,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'third-block',
            children: [
              {
                type: ComponentType.Custom,
                className: 'pw-col-span-12 pw-mt-4',
                label: t('message_content'),
                labelClassName: 'pw-font-bold',
                name: 'message',
                placeholder: t('placeholder.message_content'),
                maxLength: 1000,
                component: MessageContentControl,
              },
            ],
          },
          {
            blockClassName: 'pw-col-span-12 pw-mt-4',
            type: 'block',
            name: 'last-block',
            children: [
              {
                type: ComponentType.Custom,
                name: 'send_after',
                send_type: dataForm.send_type,
                send_after: dataForm.send_after,
                error: errorSendAfter,
                onChangeTime: (value: string) => setValue('send_after', +value),
                onChangeType: (value: string) => setValue('send_type', value),
                component: SendTimeSelect,
              },
            ],
          },
        ],
      },
    ],
  };
};

export const defaultAbsenceMessage = () => ({
  day_range: [] as number[],
  message: '',
  send_after: 1,
  absent_schedule: [] as PendingTimeSelected[],
  send_type: SEND_TYPE.SEND_AFTER,
  business_has_page_setting: {
    absent_message_enable: false,
    business_has_page_id: '',
  },
});

export const toDefaultAbsenceMessage = ({
  activePage,
  detail,
}: {
  activePage: Page;
  detail: AbsenceMessageShorten;
}) => {
  const schedules: PendingTimeSelected[] = [];
  detail.absent_schedule.map((schedule) => {
    const pendingTimeSelected: ExpectedAny = [];
    schedule.page_time_selected.map((timeSelected) => {
      pendingTimeSelected.push({ from: timeSelected.from, to: timeSelected.to });
    });
    schedules.push({ id: schedule.page_time_selected?.[0]?.id || '', time_selected: pendingTimeSelected });
  });
  return {
    message: detail.absent_message.message,
    send_after: detail.absent_message.send_after,
    send_type: detail.absent_message.send_after === 0 ? SEND_TYPE.SEND_NOW : SEND_TYPE.SEND_AFTER,
    absent_schedule: schedules,
    business_has_page_setting: {
      absent_message_enable: activePage.business_has_page_setting.absent_message_enable,
      business_has_page_id: activePage.id,
    },
  };
};

export const checkExistedAbsenceSchedule = ({
  absent_schedule,
  current_time_select,
}: {
  absent_schedule: ExpectedAny;
  current_time_select: ExpectedAny;
}) => {
  // check duplicate schedule & must different id
  const existed = absent_schedule.some(
    (schedule: ExpectedAny) =>
      schedule.id !== current_time_select.id &&
      JSON.stringify(schedule.time_selected) === JSON.stringify(current_time_select.time_selected),
  );
  return existed;
};

type LocalTimeSelect = {
  hour: string;
  minute: string;
};
export const formatTimeSelected = ({
  dayRange,
  startTime,
  endTime,
}: {
  dayRange: number[];
  startTime: LocalTimeSelect;
  endTime: LocalTimeSelect;
}) => {
  return dayRange.map((day) => {
    const { hour: startHour, minute: startMinute } = startTime;
    const { hour: endHour, minute: endMinute } = endTime;

    const from = day * 1440 + (+startHour * 60 + +startMinute);
    const to = day * 1440 + (+endHour * 60 + +endMinute);

    return { from, to };
  });
};

export const toDefaultSchedule = (timeSelected: TimeSelect[]) => {
  const dates: number[] = [];
  const time: ExpectedAny[] = [];

  timeSelected.map((selected: TimeSelect) => {
    const dayFrom = selected.from / (60 * 24);
    const dayFromDecimalPart = selected.from % (60 * 24);

    const dayTo = selected.to / (60 * 24);
    const dayToDecimalPart = selected.to % (60 * 24);

    dates.push(Math.floor(dayFrom), Math.floor(dayTo));

    if (time.length < 2) {
      const formattedTime = (minutes: number) => {
        const helperDate = addSeconds(new Date(0), minutes);

        const h = helperDate.getMinutes();
        const m = helperDate.getSeconds();

        const fDate = new Date();
        fDate.setHours(h);
        fDate.setMinutes(m);

        return fDate;
      };

      const formattedFromTime = formattedTime(dayFromDecimalPart);
      const formattedToTime = formattedTime(dayToDecimalPart);

      time.push(formattedFromTime, formattedToTime);
    }
  });

  const formattedFromTime = time[0];
  const formattedToTime = time[1];

  const startHour = format(formattedFromTime, 'H');
  const startMinute = format(formattedFromTime, 'm');
  const endHour = format(formattedToTime, 'H');
  const endMinute = format(formattedToTime, 'm');

  const uniqueDates = [...new Set(dates)];

  return {
    dayRange: uniqueDates,
    startTime: { date: time[0], hour: startHour, minute: startMinute },
    endTime: { date: time[1], hour: endHour, minute: endMinute },
  };
};
