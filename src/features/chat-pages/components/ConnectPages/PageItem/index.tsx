import { Avatar, Tooltip, Whisper } from 'rsuite';
import { useCallback } from 'react';
import { Provider } from '~app/features/chat-pages/utils';
import { IconFacebook, IconZalo } from '~app/components/Icons';

type Props = { data: ExpectedAny };

const PageItem = ({ data }: Props) => {
  const renderIcon = useCallback((provider: string) => {
    switch (provider) {
      case Provider.Meta:
        return <IconFacebook size="12" />;
      case Provider.Zalo:
        return <IconZalo size="12" />;
      default:
        return null;
    }
  }, []);

  return (
    <div className="pw-flex">
      <div className="pw-relative pw-mr-4">
        <div>
          <Avatar circle src={data?.page_avatar || ''} alt={data?.page_name || ''} />
        </div>
        <div className="pw-absolute pw-bottom-0 pw-right-0 pw-overflow-hidden pw-border pw-border-neutral-background pw-rounded-full pw-bg-white">
          {renderIcon(data?.provider)}
        </div>
      </div>
      <div className="pw-flex pw-flex-col pw-justify-between pw-text-sm">
        <Whisper
          placement="bottomEnd"
          trigger="hover"
          speaker={<Tooltip arrow={false}>{data?.page_name || ''}</Tooltip>}
        >
          <div className="pw-font-bold line-clamp-1">{data?.page_name || ''}</div>
        </Whisper>
        <div className="line-clamp-1">{data?.page_id || ''}</div>
      </div>
    </div>
  );
};

export default PageItem;
