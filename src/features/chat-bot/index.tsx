import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatBotItem from './ChatbotItem';
import { Header } from '~app/features/chat-configs/components';
import { EmptyStateConnectFB } from '~app/components/Icons';
import { ConfirmModal, EmptyState } from '~app/components';
import { MainRouteKeys } from '~app/routes/enums';
// import { CHATBOT_IMAGES } from '~app/utils/constants';
import { ModalPlacement, ModalRendererInline, ModalSize, ModalTypes } from '~app/modals';
import { useCurrentPage } from '~app/features/chat-configs/hooks';
import { useChatbotsQuery, useGetUsingChatbotQuery } from '~app/services/queries';
import { useApplyChatbotMutation, useRemoveChatbotMutation } from '~app/services/mutations';

type ModalData = {
  modal: ModalTypes;
  size?: ModalSize;
  placement?: ModalPlacement;
  detail: ExpectedAny;
};

// const CHATBOTS = [
//   {
//     image: CHATBOT_IMAGES.RESTAURANT,
//     value: 'chatbot_restaurant',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
//   },
//   {
//     image: CHATBOT_IMAGES.FOOD,
//     value: 'chatbot_food',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
//   },
//   {
//     image: CHATBOT_IMAGES.FASHION,
//     value: 'chatbot_fashion',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
//   },
//   {
//     image: CHATBOT_IMAGES.COMMON,
//     value: 'chatbot_common',
//     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do',
//   },
// ];

const ChatBot = () => {
  const { t } = useTranslation('chat');
  const navigate = useNavigate();
  const { isEmpty, linkedPages, activePage, setActivePage } = useCurrentPage();
  const { data: usingChatbot, refetch, isError } = useGetUsingChatbotQuery(activePage?.id || '', true);
  const [usingOther, setUsingOther] = useState<Chatbot | null>(null);
  const [stopUsing, setStopUsing] = useState(false);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const { data } = useChatbotsQuery();
  const { mutateAsync: applyChatbot } = useApplyChatbotMutation();
  const { mutateAsync: removeChatbot } = useRemoveChatbotMutation();

  const handleClick = async (chatbot: Chatbot, isPreview: boolean) => {
    try {
      if (isPreview) {
        window.open(`https://m.me/108757745593226?ref=${chatbot.id}`);
      } else {
        if (usingChatbot && !isError) {
          if (usingChatbot?.chat_bot_id !== chatbot.id) {
            return setUsingOther(chatbot);
          } else {
            return setStopUsing(true);
          }
        }
        handleApplyChatbot(chatbot);
      }
    } catch (error) {
      // TO DO
    }
  };

  const handleApplyChatbot = async (chatbot: Chatbot) => {
    try {
      await applyChatbot({
        business_has_page_id: activePage?.id || '',
        chat_bot_id: chatbot.id,
      });
      await refetch();
      toast.success(t('success.apply_chatbot'));
    } catch (error) {
      // TO DO
    }
  };

  if (isEmpty) {
    return (
      <EmptyState
        icon={<EmptyStateConnectFB />}
        description1={t('empty_state_connect_fb')}
        textBtn={t('action.connect_now') || ''}
        onClick={() => navigate(MainRouteKeys.ChatConfigsPages)}
      />
    );
  }

  return (
    <div>
      <h5 className="pw-font-bold pw-mb-2">{t('title.chatbot')}</h5>
      <p className="pw-text-sm pw-text-neutral-secondary pw-mb-6">{t('chatbot_description')}</p>
      <div className="pw-border pw-rounded pw-border-neutral-divider">
        <Header title="title.setting_page" linkedPages={linkedPages} activePage={activePage} onClick={setActivePage} />
        <div className="pw-grid pw-gap-4 sm:pw-grid-cols-2 md:pw-grid-cols-4 pw-p-6">
          {data
            ? data.map((chatbot) => (
                <ChatBotItem
                  key={chatbot.id}
                  chatbot={chatbot}
                  using={!isError && usingChatbot?.chat_bot_id === chatbot.id}
                  onClick={handleClick}
                />
              ))
            : null}
        </div>
      </div>
      {usingOther && (
        <ConfirmModal
          open={true}
          title={t('modal.using_new_chatbot')}
          description={t('modal.using_new_chatbot_description')}
          confirmText={t('action.still_using') || ''}
          onConfirm={async () => {
            await handleApplyChatbot(usingOther);
            setUsingOther(null);
          }}
          onClose={() => setUsingOther(null)}
        />
      )}
      {stopUsing && (
        <ConfirmModal
          open={true}
          title={t('modal.stop_using_chatbot')}
          description={t('modal.stop_using_chatbot_description')}
          confirmText={t('action.stop_using') || ''}
          isDelete
          onConfirm={async () => {
            await removeChatbot(usingChatbot?.id || '');
            await refetch();
            setStopUsing(false);
            toast.success(t('success.stop_chatbot'));
          }}
          onClose={() => setStopUsing(false)}
        />
      )}
      {modalData && <ModalRendererInline onClose={() => setModalData(null)} {...modalData} />}
    </div>
  );
};

export default ChatBot;
