import Items from './Items';
import { useConversationsDefaultQuery } from '~app/services/queries';
import { AssistantMess, FinanceMess, NotiMess, OrderMess, SupportMess } from '~app/components/Icons';
import { ConversationType } from '~app/utils/constants';
import { ConfigPermission, NotiPermission, getPermissions } from '~app/utils/shield';
import { verifyPermission } from '~app/utils/shield/utils';

const CONVERSATION_DEFAULT = [
  {
    name: 'support',
    type: ConversationType.SUPPORT,
    avatar: <SupportMess />,
    permissionName: ConfigPermission.SBH_SUPPORTER_CHAT_VIEW,
  },
  {
    name: 'assistant',
    type: ConversationType.ASSISTANT,
    avatar: <AssistantMess />,
    permissionName: ConfigPermission.SBH_ASSISTANT_CHAT_VIEW,
  },
  {
    name: 'notification',
    type: ConversationType.NOTIFICATION,
    avatar: <NotiMess />,
    permissionName: NotiPermission.NOTI_VIEW,
  },
  {
    name: 'order',
    type: ConversationType.ORDER,
    avatar: <OrderMess />,
    permissionName: NotiPermission.NOTI_ORDER_VIEW,
  },
  {
    name: 'finance',
    type: ConversationType.FINANCE,
    avatar: <FinanceMess />,
    permissionName: NotiPermission.NOTI_FINANCE_VIEW,
  },
];

const ConversationDefault = () => {
  const { data } = useConversationsDefaultQuery();
  const permissions = getPermissions();

  if (data.length === 0) return null;

  return (
    <div className="pw-grid pw-grid-cols-5 pw-gap-2 pw-py-2 pw-px-1">
      {CONVERSATION_DEFAULT.map((conversation) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const existed = data.find((item) => item.type === conversation.type)!;
        const canView = verifyPermission(permissions, conversation.permissionName);
        if (!canView) return null;
        return (
          <Items key={conversation.name} conversation={existed} name={conversation.name} avatar={conversation.avatar} />
        );
      })}
    </div>
  );
};

export default ConversationDefault;
