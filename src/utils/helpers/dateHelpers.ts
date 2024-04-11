import { endOfDay, format, formatDistance, isBefore, startOfDay } from 'date-fns';

export const formatDateToString = (input: string | Date, formatInput = 'dd/MM/yyyy'): string =>
  format(new Date(input), formatInput);

export const formatDistanceFromNow = (input: string | Date) => {
  return formatDistance(new Date(input), new Date(), { addSuffix: true });
  //=> "3 days ago"
};

export const checkDateBeforeNow = (input?: string) => {
  const today = new Date();
  return isBefore(input ? new Date(input) : new Date(), today);
};

export const normalizeTime = (time: number) => {
  return String(time).length === 1 ? `0${time}` : String(time);
};

export const formatBirthday = (birthday: string) => {
  // convert to YYYY-MM-dd
  if (!birthday || birthday.split('-').length !== 3) return null;
  const birthdayArr = birthday.split('-');
  return new Date(`${birthdayArr[2]}-${birthdayArr[1]}-${birthdayArr[0]}`);
};

export function getTimeZone() {
  const offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);
  return (offset < 0 ? '+' : '-') + ('00' + Math.floor(o / 60)).slice(-2) + ':' + ('00' + (o % 60)).slice(-2);
}

export function convertDateFilter(date: Date[] = []) {
  return date?.length > 0
    ? {
        start_time: format(startOfDay(date?.[0] as Date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        end_time: format(endOfDay(date?.[1] as Date), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      }
    : {
        start_time: '',
        end_time: '',
      };
}
