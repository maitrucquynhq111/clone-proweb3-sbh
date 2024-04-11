import { useCallback, useState } from 'react';
import { Checkbox, Tooltip, Whisper } from 'rsuite';
import { PlaceholderImage } from '~app/components';
import { Provider } from '~app/features/chat-pages/utils';
import { IconFacebook, IconZalo } from '~app/components/Icons';

type PageItemType = {
  pageInfo: ExpectedAny;
  onSelected: ({ id, value }: { id: string; value: boolean }) => void;
  listPageId: string[];
};

const PageItem = ({ pageInfo, onSelected, listPageId }: PageItemType) => {
  const [checkValue, setCheckValue] = useState<boolean>(listPageId.includes(pageInfo.page_id));
  const handleChange = (value: boolean) => {
    onSelected({ id: pageInfo.page_id, value });
    setCheckValue(value);
  };

  const renderIcon = useCallback((provider: string) => {
    switch (provider) {
      case Provider.Meta:
        return <IconFacebook size="16" />;
      case Provider.Zalo:
        return <IconZalo size="16" />;
      default:
        return null;
    }
  }, []);
  return (
    <div
      onClick={() => {
        handleChange(!checkValue);
      }}
      className="pw-flex pw-items-center pw-justify-between pw-py-3 pw-px-4 pw-border-b pw-border-neutral-divider pw-cursor-pointer"
    >
      <div className="pw-flex pw-items-center">
        <div className="pw-mr-3 pw-w-6 pw-h-6 pw-relative">
          <PlaceholderImage
            className="!pw-w-6 !pw-h-6 pw-bg-white pw-rounded-full"
            isAvatar={true}
            src={pageInfo.page_avatar || ''}
            alt={pageInfo.page_name}
          />
          <div className="pw-absolute -pw-bottom-2 -pw-right-2 pw-overflow-hidden pw-border pw-border-neutral-background pw-rounded-full pw-bg-white">
            {renderIcon(pageInfo?.provider)}
          </div>
        </div>
        <Whisper placement="bottomEnd" trigger="hover" speaker={<Tooltip arrow={false}>{pageInfo.page_name}</Tooltip>}>
          <div className="pw-text-base line-clamp-1">{pageInfo.page_name}</div>
        </Whisper>
      </div>
      <Checkbox checked={checkValue} />
    </div>
  );
};

export default PageItem;
