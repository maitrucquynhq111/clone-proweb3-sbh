import { useCallback, useMemo } from 'react';
import cx from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from 'rsuite';
import { BsArrow90DegLeft } from 'react-icons/bs';
import { formatDistanceToNowStrict } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import ConversationLabel from './ConversationLabel';
import { MainRouteKeys } from '~app/routes/enums';
import PlaceholderImage from '~app/components/PlaceholderImage';
import { ConversationTag, ConversationType, MessageType, CardsAssistanceType } from '~app/utils/constants';
import { AuthService } from '~app/services/api';
import { Language } from '~app/i18n/enums';
import {
  checkIsConversationDefault,
  checkIsMyLatestMessage,
  getOtherParticipant,
  isConversationDefault,
  updateCacheConversationDefaultList,
  updateCacheConversationList,
} from '~app/features/chat-inbox/utils';
import {
  AssistantMess,
  FinanceMess,
  IconFacebook,
  IconZalo,
  IconMessenger,
  LogoImage,
  NotiMess,
  OrderMess,
  SupportMess,
} from '~app/components/Icons';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { ID_EMPTY } from '~app/configs';
import { useMarkReadMessageMutation } from '~app/services/mutations';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { useCacheMeQuery } from '~app/services/queries';

type Props = {
  data: ExpectedAny;
};
const ConversationItem = ({ data }: Props) => {
  const { t, i18n } = useTranslation('chat');
  const navigate = useNavigate();
  const [filter] = useChatStore((store) => store.filter);
  const [pageIds, setStore] = useChatStore((store) => store.pageIds);
  const { mutateAsync: markSeenMessage } = useMarkReadMessageMutation();
  const { pageId } = useParams();
  const businessId = AuthService.getBusinessId();
  const { data: user } = useCacheMeQuery();

  const dataMemo = useMemo(() => {
    if (!data) return { otherParticipant: null, isMyLatestMessage: false, isConversationDefault: false };
    const isMyLatestMessage = checkIsMyLatestMessage(data.latest_message);
    const otherParticipant = getOtherParticipant({ participants: data.participants });
    const isConversationDefault = checkIsConversationDefault(data.type);
    return { otherParticipant, isMyLatestMessage, isConversationDefault };
  }, [data]);

  const conversationTypeIcon = useMemo(() => {
    if (!dataMemo.otherParticipant || dataMemo.isConversationDefault) return null;
    switch (data.tag) {
      case ConversationTag.FB_MESSAGE:
      case ConversationTag.FB_COMMENT:
      case ConversationTag.ZALO_MESSAGE:
        return (
          <PlaceholderImage
            className="!pw-w-4 !pw-h-4 pw-bg-white pw-rounded-full pw-mr-2"
            isAvatar={true}
            src={data.page_avatar || ''}
            alt={data.otherParticipant?.info?.full_name || ''}
          />
        );
      default:
        return (
          <div className="pw-flex pw-items-center pw-justify-center pw-w-4 pw-h-4 pw-rounded-full pw-bg-primary-main pw-mr-2">
            <LogoImage width="7" />
          </div>
        );
    }
  }, [data]);

  const handleClickItem = useCallback(async () => {
    if (data?.unseen_message > 0) {
      try {
        const body = {
          conversation_ids: [data.id],
          msg_id: null,
          sender_id: data?.type === ConversationType.NOTIFICATION ? user?.user_info?.id : businessId || '',
          sender_type: data?.type === ConversationType.NOTIFICATION ? 'user' : 'business',
        };
        await markSeenMessage(body);
        updateCacheConversationList(data, { ...filter, pageIds }, pageId);
        updateCacheConversationDefaultList(data, data.id);
      } catch (error) {
        // TO DO
      }
    }
    if (pageId !== data.id) setStore((store) => ({ ...store, showOrderInChat: false }));
    navigate(MainRouteKeys.ChatInboxDetails.replace(':pageId', data.id), {
      replace: true,
    });
  }, [data, user, businessId]);

  const handleGetConversationDefaultAvatar = () => {
    switch (data.type) {
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

  const handleGetAvatar = () => {
    if (
      data.tag === ConversationTag.FB_MESSAGE ||
      data.tag === ConversationTag.FB_COMMENT ||
      data.type === ConversationType.GROUP
    ) {
      return data.avatar;
    }
    return dataMemo.otherParticipant?.info?.avatar || '';
  };

  const handleGetNameConversation = () => {
    // disabled account
    if (dataMemo.otherParticipant && dataMemo.otherParticipant?.info?.id === ID_EMPTY) return t('disabled_account');
    // conversation group
    if (data.type === ConversationType.GROUP) return data.title;
    // conversation default
    const isDefault = isConversationDefault(data.type);
    if (typeof isDefault === 'string' && isDefault !== ConversationType.SUPPORT) {
      return t(data.type);
    }
    return (
      dataMemo.otherParticipant?.info?.full_name ||
      formatPhoneWithZero(dataMemo.otherParticipant?.info?.phone_number || '')
    );
  };

  const handleGetBadgeAvatar = () => {
    if (
      data.tag !== ConversationTag.FB_MESSAGE &&
      data.tag !== ConversationTag.ZALO_MESSAGE &&
      data.tag !== ConversationTag.FB_COMMENT
    )
      return null;
    switch (data.tag) {
      case ConversationTag.FB_MESSAGE:
        return <IconMessenger size="16" />;
      case ConversationTag.ZALO_MESSAGE:
        return <IconZalo size="16" />;
      default:
        return <IconFacebook size="16" />;
    }
  };

  const handleGetLastMessageContent = () => {
    const message = data?.latest_message?.message || '';
    switch (data?.latest_message?.message_type) {
      case MessageType.IMAGE_TEXT:
      case MessageType.IMAGE:
        return `[${t('image')}]`;
      case MessageType.ORDER:
        return `[${t('filter.order')} #${message}]`;
      case MessageType.DRAFT_ORDER:
        return `[${t('draft_order')}]`;
      case MessageType.PRODUCT:
        return `[${t('product')}]`;
      case MessageType.CARDS_ASSISTANCE: {
        if (message?.type === CardsAssistanceType.TEXT) return message?.content;
        else {
          return `${t('notification')}`;
        }
      }
      case MessageType.BUTTON: {
        return message?.text;
      }
      case MessageType.NOTIFICATION: {
        return message?.content;
      }
      case MessageType.SYSTEM: {
        return message?.content;
      }
      case MessageType.FORM:
        return t('quality_evalution');
      default:
        return message;
    }
  };

  return (
    <div
      className={cx(
        'pw-w-full pw-p-3 hover:pw-bg-secondary-background pw-h-full pw-overflow-hidden pw-cursor-pointer pw-flex pw-items-center',
        {
          'pw-bg-secondary-background': pageId === data.id,
        },
      )}
      onClick={handleClickItem}
    >
      <div className="pw-relative pw-mr-4">
        {dataMemo.isConversationDefault ? (
          handleGetConversationDefaultAvatar()
        ) : (
          <PlaceholderImage
            className="!pw-w-10 !pw-h-10 pw-bg-white pw-rounded-full"
            isAvatar={true}
            src={handleGetAvatar()}
            alt={data.avatar}
          />
        )}

        {data?.unseen_message > 0 && (
          <Badge className="pw-absolute pw-top-0 pw-right-0 !pw-bg-error-active" content={data.unseen_message} />
        )}
        <div className="pw-absolute pw-bottom-0 pw-right-0 pw-bg-white pw-rounded-full pw-overflow-hidden">
          {handleGetBadgeAvatar()}
        </div>
      </div>
      <div className="pw-flex pw-flex-1 pw-flex-col pw-gap-y-0.5">
        <div className="pw-flex pw-justify-between">
          <div className="pw-flex pw-items-center pw-w-9/12">
            {conversationTypeIcon}{' '}
            <span className="pw-text-neutral-primary pw-font-bold pw-text-sm line-clamp-1">
              {handleGetNameConversation()}
            </span>
            {data.type === ConversationType.ASSISTANT && (
              <span className="pw-text-white pw-text-xs pw-bg-gold pw-px-1 pw-font-semibold pw-rounded-md pw-ml-2">
                BOT
              </span>
            )}
          </div>
          <span className="pw-text-neutral-placeholder pw-text-xs pw-min-w-max">
            {formatDistanceToNowStrict(new Date(data?.latest_message?.created_at || ''), {
              addSuffix: true,
              locale: i18n.language === Language.VI ? vi : enUS,
            })}
          </span>
        </div>
        <div className="pw-flex pw-items-center pw-justify-between">
          <div className="pw-flex pw-items-center">
            {dataMemo.isMyLatestMessage && (
              <div className="pw-text-neutral-placeholder pw-mr-1">
                <BsArrow90DegLeft size={16} />
              </div>
            )}
            <p className="pw-text-neutral-secondary pw-text-sm line-clamp-1">{handleGetLastMessageContent()}</p>
          </div>
          {/* <BsPersonPlusFill className="pw-min-w-fit pw-text-blue-primary" size={20} /> */}
        </div>
        {data.labels && data.labels.length > 0 && <ConversationLabel labels={data.labels} />}
      </div>
    </div>
  );
};

export default ConversationItem;
