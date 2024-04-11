type AppNotification = ISyncRecord & {
  id: string;
  updated_at: number;
};

type NotificationStatistic = {
  count_unread_normal: number;
  count_no_process: number;
  count_unread_two_way: number;
};
