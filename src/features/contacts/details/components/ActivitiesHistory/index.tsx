import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Timeline } from 'rsuite';
import { format } from 'date-fns';
import { BsChevronDown } from 'react-icons/bs';
import { useActivitiesHistoryQuery } from '~app/services/queries';
import { useContactDetails } from '~app/features/contacts/hooks/useContactDetails';

const ActivitiesHistory = () => {
  const { t } = useTranslation('contact-details');
  const { data } = useContactDetails();
  const [page, setPage] = useState(1);
  const { data: activities } = useActivitiesHistoryQuery({ page, pageSize: 5, contact_id: data?.id || '' });

  return (
    <div className="gray-timeline">
      <h6 className="pw-text-lg pw-font-bold pw-mb-3">{t('title.interaction_history')}</h6>
      <Timeline>
        {activities?.data.map((activity) => (
          <Timeline.Item className="pw-text-sm pw-text-neutral-secondary">
            <span className="pw-font-semibold pw-mr-3">{format(new Date(activity.time), 'dd/MM/yyyy hh:mm')}</span>{' '}
            {activity.content}
          </Timeline.Item>
        ))}
      </Timeline>
      {activities?.data && activities.data.length > 0 && page < activities?.meta.total_pages && (
        <div className="pw-mt-4 pw-border-t pw-border-t-neutral-divider">
          <Button
            appearance="subtle"
            className="!pw-text-blue-primary !pw-font-bold pw-mt-3"
            endIcon={<BsChevronDown size={20} />}
            onClick={() => setPage(page + 1)}
          >
            {t('common:view_more')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesHistory;
