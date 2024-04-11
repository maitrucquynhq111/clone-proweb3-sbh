import createFastContext from '~app/utils/hooks/createFastContext';
import { initialChat } from '~app/features/chat-inbox/utils';

export const { Provider: ChatProvider, useStore: useChatStore } = createFastContext<PendingChat>(initialChat());
