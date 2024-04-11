import { useMemo, useEffect, useState } from 'react';
import qs from 'qs';
import { BsMeta } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useCurrentConversation } from '~app/utils/hooks';
import { checkIsConversationDefault, getOtherParticipant, isConversationDefault } from '~app/features/chat-inbox/utils';
import { PlaceholderImage } from '~app/components';
import { ConversationType, ConversationTag, META_SUITE_MESSAGE } from '~app/utils/constants';
import {
  AssistantMess,
  IconFacebook,
  IconMessenger,
  IconZalo,
  FinanceMess,
  LogoImage,
  NotiMess,
  OrderMess,
  SupportMess,
} from '~app/components/Icons';
import { formatPhoneWithZero } from '~app/utils/helpers';

type Props = {
  id: string;
};

const Header = ({ id }: Props) => {
  const { t } = useTranslation('chat');
  const { currentConversation } = useCurrentConversation();
  const [assetPageId, setAssetPageId] = useState<string>();

  useEffect(() => {
    if (currentConversation?.tag === ConversationTag.FB_MESSAGE) {
      const indexConversationArr = currentConversation?.index.split('|');
      const pageMetaId = (indexConversationArr || []).find((item) => item.startsWith('page'));
      setAssetPageId(pageMetaId ? pageMetaId.split(':')[1] : '');
    }
  }, [currentConversation]);

  const dataMemo = useMemo(() => {
    if (!currentConversation) return { otherParticipant: null, isConversationDefault: false };
    const otherParticipant = getOtherParticipant({ participants: currentConversation.participants });
    const isConversationDefault = checkIsConversationDefault(currentConversation.type);
    return { otherParticipant, isConversationDefault };
  }, [id, currentConversation]);

  const handleGetConversationDefaultAvatar = () => {
    if (!currentConversation) return null;
    switch (currentConversation.type) {
      case ConversationType.NOTIFICATION:
        return <NotiMess />;
      case ConversationType.ORDER:
        return <OrderMess />;
      case ConversationType.ASSISTANT:
        return <AssistantMess />;
      case ConversationType.SUPPORT:
        return <SupportMess />;
      default:
        return <FinanceMess />;
    }
  };

  const conversationTypeIcon = useMemo(() => {
    if (!currentConversation || !dataMemo.otherParticipant || dataMemo.isConversationDefault) return null;
    switch (currentConversation.tag) {
      case ConversationTag.ZALO_MESSAGE:
      case ConversationTag.FB_MESSAGE:
      case ConversationTag.FB_COMMENT:
        return (
          <PlaceholderImage
            className="!pw-w-5 !pw-h-5 pw-bg-white pw-rounded-full pw-ml-2"
            isAvatar={true}
            src={currentConversation.page_avatar || ''}
            alt={dataMemo.otherParticipant?.info?.full_name || ''}
          />
        );
      default:
        return (
          <div className="pw-flex pw-items-center pw-justify-center pw-w-5 pw-h-5 pw-rounded-full pw-bg-primary-main pw-ml-2">
            <LogoImage width="9" />
          </div>
        );
    }
  }, [currentConversation]);

  const handleGetAvatar = () => {
    if (!currentConversation || !dataMemo.otherParticipant) return '';
    if (
      currentConversation.tag === ConversationTag.FB_MESSAGE ||
      currentConversation.tag === ConversationTag.FB_COMMENT ||
      currentConversation.type === ConversationType.GROUP
    ) {
      return currentConversation.avatar;
    }
    return dataMemo.otherParticipant?.info?.avatar || '';
  };

  const handleGetName = () => {
    if (!currentConversation) return '';
    // conversation default
    const isDefault = isConversationDefault(currentConversation.type);
    if (typeof isDefault === 'string' && isDefault !== ConversationType.SUPPORT) return t(currentConversation.type);
    return (
      dataMemo.otherParticipant?.info?.full_name ||
      formatPhoneWithZero(dataMemo.otherParticipant?.info?.phone_number || '')
    );
  };

  const handleGetBadgeAvatar = () => {
    if (
      currentConversation?.tag !== ConversationTag.FB_MESSAGE &&
      currentConversation?.tag !== ConversationTag.ZALO_MESSAGE &&
      currentConversation?.tag !== ConversationTag.FB_COMMENT
    )
      return null;
    switch (currentConversation?.tag) {
      case ConversationTag.FB_MESSAGE:
        return <IconMessenger size="16" />;
      case ConversationTag.ZALO_MESSAGE:
        return <IconZalo size="16" />;
      default:
        return <IconFacebook size="16" />;
    }
  };

  return (
    <div className="pw-h-18 pw-border-b pw-border-neutral-background pw-px-4 pw-flex pw-justify-between">
      <div className="pw-flex pw-items-center">
        {dataMemo.isConversationDefault ? (
          handleGetConversationDefaultAvatar()
        ) : (
          <div className="pw-relative">
            <PlaceholderImage
              className="!pw-w-10 !pw-h-10 pw-bg-white pw-rounded-full"
              isAvatar={true}
              src={handleGetAvatar()}
              alt={dataMemo.otherParticipant?.info?.full_name || ''}
            />
            <div className="pw-absolute -pw-bottom-1 -pw-right-1 pw-bg-white pw-rounded-full pw-overflow-hidden">
              {handleGetBadgeAvatar()}
            </div>
          </div>
        )}
        <div className="pw-ml-4">
          <div className="pw-flex pw-items-center">
            <span className="pw-text-base pw-font-bold">{handleGetName()}</span>
            {conversationTypeIcon}
            {currentConversation?.type === ConversationType.ASSISTANT && (
              <span className="pw-text-white pw-text-xs pw-bg-gold pw-px-1 pw-py-0.5 pw-rounded-md pw-font-semibold pw-ml-2">
                BOT
              </span>
            )}
          </div>
          {/* {!checkIsConversationDefault(currentConversation?.type || '') && (
            <div className="pw-text-blue-primary pw-cursor-pointer pw-text-sm">{t('view-detail')}</div>
          )} */}
        </div>
      </div>
      <div className="pw-flex pw-items-center">
        {currentConversation?.tag === ConversationTag.FB_MESSAGE && (
          <a
            href={`${META_SUITE_MESSAGE}?${qs.stringify({
              asset_id: assetPageId,
            })}`}
            target="_blank"
            className="pw-bg-secondary-background pw-p-2 pw-rounded pw-cursor-pointer"
          >
            <BsMeta size={24} className="pw-text-secondary-main-blue" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
