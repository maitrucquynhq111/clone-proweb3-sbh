import ConversationFilter from '../ConversationFilter';
import ConversationTab from '../ConversationTab';
import ConversationList from '../ConversationList';
import ConversationDefault from '../ConversationDefault';
import { CustomerPermission, useHasPermissions } from '~app/utils/shield';

const ConversationMenu = () => {
  const canViewConversation = useHasPermissions([CustomerPermission.CUSTOMER_CHAT_ALL_VIEW]);

  return (
    <>
      <ConversationTab />
      <ConversationFilter />
      <ConversationDefault />
      {canViewConversation ? <ConversationList /> : null}
    </>
  );
};

export default ConversationMenu;
