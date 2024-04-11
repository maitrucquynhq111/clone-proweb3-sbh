import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { IconButton } from 'rsuite';
import qs from 'qs';
import { BsArrowRepeat } from 'react-icons/bs';
import { PlaceholderImage } from '~app/components';
import { META_SUITE_MESSAGE } from '~app/utils/constants';

type Props = {
  currentConversation: Conversation | null;
  refetch: () => void;
};

const FbPageInfo = ({ currentConversation, refetch }: Props) => {
  const { t } = useTranslation('chat');
  const [assetPageId, setAssetPageId] = useState<string>();

  useEffect(() => {
    const indexConversationArr = currentConversation?.index.split('|');
    const pageMetaId = (indexConversationArr || []).find((item) => item.startsWith('page'));
    setAssetPageId(pageMetaId ? pageMetaId.split(':')[1] : '');
  }, []);

  return (
    <div className="pw-flex pw-bg-neutral-white pw-px-4 pw-py-2 pw-rounded pw-gap-x-3 pw-justify-between pw-items-center">
      <div className="pw-flex pw-gap-x-2">
        <span className="pw-text-neutral-primary pw-text-sm">{t('message_from')}:</span>
        <PlaceholderImage
          className="!pw-w-5 !pw-h-5 pw-rounded-full"
          isAvatar={true}
          src={currentConversation?.page_avatar}
          alt={currentConversation?.page_name}
        />
        <a
          href={`${META_SUITE_MESSAGE}?${qs.stringify({
            asset_id: assetPageId,
          })}`}
          target="_blank"
          className="pw-text-secondary-main-blue pw-text-sm pw-cursor-pointer hover:pw-text-secondary-main-blue pw-font-bold"
        >
          {currentConversation?.page_name}
        </a>
      </div>
      <IconButton
        onClick={refetch}
        icon={<BsArrowRepeat size={20} className="pw-text-secondary-main-blue " />}
        className="pw-bg-transparent"
        appearance="subtle"
        circle
      />
    </div>
  );
};

export default FbPageInfo;
