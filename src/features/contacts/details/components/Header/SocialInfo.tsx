import { Button } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { enUS, vi } from 'date-fns/locale';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { formatDistanceToNowStrict } from 'date-fns';
import { Language } from '~app/i18n/enums';
import {
  // IconMessenger,
  IconZalo,
  // IconFacebook,
  // IconGoogle,
} from '~app/components/Icons';
import { useActivitiesHistoryQuery } from '~app/services/queries';

const SocialInfo = ({ data }: { data?: Contact }) => {
  const { t, i18n } = useTranslation('contact-details');
  const { phone_number } = data || {};
  const { data: activities } = useActivitiesHistoryQuery({ page: 1, pageSize: 1, contact_id: data?.id || '' });

  return (
    <div className="pw-px-4 pw-text-right">
      <div>
        {phone_number && (
          <Button as="a" href={`tel:${phone_number}`} appearance="subtle" size="sm">
            <BsFillTelephoneFill size={22} />
          </Button>
        )}
        {/* <Button disabled appearance="subtle" size="sm">
          <IconGoogle />
        </Button>
        <Button disabled appearance="subtle" size="sm">
          <IconFacebook />
        </Button>
        <Button disabled appearance="subtle" size="sm">
          <IconMessenger />
        </Button> */}

        {phone_number && (
          <Button as="a" target="_blank" href={`https://zalo.me/${phone_number}`} appearance="subtle" size="sm">
            <IconZalo />
          </Button>
        )}
      </div>
      {activities?.data?.[0] && (
        <p className="pw-text-sm">
          {t('connected')}
          <strong className="pw-ml-1">
            {formatDistanceToNowStrict(new Date(activities.data[0].time), {
              addSuffix: true,
              locale: i18n.language === Language.VI ? vi : enUS,
            })}
          </strong>
        </p>
      )}
    </div>
  );
};

export default SocialInfo;
