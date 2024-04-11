import qs from 'qs';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchData } from '~app/utils/helpers';

async function getNotifications(opt: { page: number; lastUpdate: Date; type?: string }) {
  return fetchData<Array<JSONRecord<AppNotification>>>(
    `${API_URI}/ms-notification-management/api/notify-info?${qs.stringify({
      page: opt.page,
      type: opt.type || 'normal',
      size: 30,
      update_after: opt.lastUpdate.toISOString(),
      user_id: await AuthService.getUserId(),
    })}`,
    {
      authorization: true,
    },
  );
}

async function getNotificationCount() {
  return fetchData<NotificationStatistic>(`${API_URI}/ms-notification-management/api/notification/get-count-notify`, {
    authorization: true,
  });
}

const notificationService = { getNotifications, getNotificationCount };
export default notificationService;
