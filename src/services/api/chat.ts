import qs from 'qs';
import AuthService from './auth';
import { API_URI } from '~app/configs';
import { fetchAll, post, put, deleteMethod, fetchData } from '~app/utils/helpers';

// SETTING
const getCurrentLink = async (provider = 'meta') => {
  return await fetchData<LinkPage>(`${API_URI}/finan-social/api/v1/social/current-link?provider=${provider}`, {
    authorization: true,
  });
};

const getAllCurrentLink = async () => {
  return await fetchData<LinkPage[]>(`${API_URI}/finan-social/api/v1/social/all-current-link`, {
    authorization: true,
  });
};

const activeListLinkSocial = async (ids: string[]) => {
  const modifiedIds = ids.join();

  return await put<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/active-link?ids=${modifiedIds}`,
    {},
    {
      authorization: true,
    },
  );
};

const linkOrUnlinkSocial = async (id: string) => {
  return await put<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/active-link/${id}`,
    {},
    {
      authorization: true,
    },
  );
};

const linkMeta = async ({ token, isUpsell }: { token: string; isUpsell: boolean }) => {
  return await post<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/link-meta`,
    { token, tenant: isUpsell ? 'upsell' : '' },
    { authorization: true },
  );
};

const linkZalo = async ({ token, refreshToken }: { token: string; refreshToken: string; isUpsell: boolean }) => {
  return await post<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/link-zalo`,
    { access_token: token, refresh_token: refreshToken, tenant: '' },
    { authorization: true },
  );
};

const unlinkMeta = async () => {
  return await deleteMethod<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/unlink-meta`,
    {},
    {
      authorization: true,
    },
  );
};

const unlinkZalo = async () => {
  return await deleteMethod<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/social/unlink-zalo`,
    {},
    {
      authorization: true,
    },
  );
};

const getConversationMessages = async (body: ConversationMessagesBody) => {
  const { data, meta } = await fetchAll<{
    data: MessageResponse[];
    meta: ResponseMeta;
  }>(`${API_URI}/ms-chat-2/api/v1/messages/query?${qs.stringify({ ...body })}`, { authorization: true });

  return { data, meta };
};

// CONVERSATION
const getConversations = async (props: ConversationPayload) => {
  const business_id = await AuthService.getBusinessId();
  return await fetchAll<{ data: Conversation[]; meta: ResponseMeta }>(
    `${API_URI}/ms-chat-2/api/v1/conversation/query?${qs.stringify({
      ...props,
      sender_id: business_id,
    })}`,
    {
      authorization: true,
    },
  );
};

async function getConversationDetail(id: string) {
  const conversation = await fetchData<Conversation>(`${API_URI}/ms-chat-2/api/v1/conversation/get-one/${id}`, {
    authorization: true,
  });
  return conversation;
}

const updateConversation = async (id: string, data: PendingUpdateConversation) => {
  const business_id = await AuthService.getBusinessId();
  return put<Conversation>(
    `${API_URI}/ms-chat-2/api/v1/conversation/update/${id}`,
    { ...data, business_id },
    {
      authorization: true,
    },
  );
};

const getConversationsDefault = async () => {
  return await fetchData<Conversation[]>(`${API_URI}/ms-chat-2/api/v1/conversation/default-conversation`, {
    authorization: true,
  });
};

async function getPostDetail({ post_id, participant_id }: { post_id: string; participant_id: string }) {
  const business_id = await AuthService.getBusinessId();

  console.log('getRepliedMessageId_currentConversation: getBusinessId', business_id);
  const conversation = await fetchData<PostDetail>(
    `${API_URI}/finan-social/api/v1/social/get-post?${qs.stringify({
      post_id,
      participant_id,
    })}`,
    {
      authorization: true,
    },
  );
  return conversation;
}

// LABEL
async function getLabels({ page, pageSize, sort = 'created_at desc', search }: CommonParams) {
  const business_id = await AuthService.getBusinessId();
  const { data, meta } = await fetchAll<{
    data: Array<Label>;
    meta: ResponseMeta;
  }>(
    `${API_URI}/ms-chat-2/api/v1/label/query?${qs.stringify({
      business_id,
      page,
      page_size: pageSize,
      sort,
      name: search,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

async function createLabel(body: PendingLabel) {
  const business_id = await AuthService.getBusinessId();
  return await post<Label>(
    `${API_URI}/ms-chat-2/api/v1/label/create`,
    { ...body, business_id },
    { authorization: true },
  );
}

async function updateLabel(body: PendingLabel) {
  const business_id = await AuthService.getBusinessId();
  return await put<Label>(
    `${API_URI}/ms-chat-2/api/v1/label/update/${body.id}`,
    { ...body, business_id },
    { authorization: true },
  );
}

async function changeLabelPosition(body: PendingLabelPosition, id: string) {
  return await put<Label>(`${API_URI}/ms-chat-2/api/v1/label/change-position/${id}`, body, { authorization: true });
}

async function deleteLabel(id: string) {
  return await fetchData(`${API_URI}/ms-chat-2/api/v1/label/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
}

// ORDER
async function getOrdersHistory({ page, pageSize, buyer_id, seller_id, search }: OrdersHistoryParams) {
  const business_id = await AuthService.getBusinessId();
  const { data, meta } = await fetchAll<{
    data: OrderHistory[];
    meta: ResponseMeta;
  }>(
    `${API_URI}/finan-order/api/v1/chat-order/get-list-history?${qs.stringify({
      business_id: business_id,
      page,
      page_size: pageSize,
      buyer_id,
      seller_id,
      search,
    })}`,
    { authorization: true },
  );

  return { data, meta };
}

async function getCountTotalOrders({ buyer_id, seller_id }: CountTotalOrdersParams) {
  return await fetchData<CountTotalOrders>(
    `${API_URI}/finan-order/api/v1/chat-order/count-total?${qs.stringify({
      buyer_id,
      seller_id,
    })}`,
    {
      authorization: true,
    },
  );
}

// MESSAGE
async function sendMessage(body: PendingMessages) {
  return await post<MessageResponse>(
    `${API_URI}/ms-chat-2/api/v1/messages/create`,
    { ...body },
    { authorization: true },
  );
}

async function reactMessage(body: ReactMessagesInput) {
  return await post<MessageResponse>(
    `${API_URI}/ms-chat-2/api/v1/reactions/react-message`,
    { ...body },
    { authorization: true },
  );
}

async function updateMessage(id: string, message: string) {
  return await put<MessageResponse>(
    `${API_URI}/ms-chat-2/api/v1/messages/update/${id}`,
    {
      message: message,
    },
    { authorization: true },
  );
}

const markReadMessage = async (body: MarkReadMessageParams) => {
  return {
    ...(await post<{
      success: boolean;
    }>(
      `${API_URI}/ms-chat-2/api/v1/messages/received-messages`,
      { ...body },
      {
        authorization: true,
        headers: {},
      },
    )),
  };
};

// FREQUENTLY QUESTION
async function getFrequentlyQuestion({ business_has_page_id }: FrequentlyQuestionParams) {
  const conversation = await fetchAll<{ data: FrequentlyQuestion[]; meta: ResponseMeta }>(
    `${API_URI}/finan-social/api/v1/suggest-message/get-or-create?${qs.stringify({
      business_has_page_id,
    })}`,
    {
      authorization: true,
    },
  );
  return conversation;
}

const createOrUpdateFrequentlyQuestion = async ({
  business_has_page_id,
  data,
  suggest_message_enable,
}: FrequentlyQuestionParams) => {
  return await put<FrequentlyQuestion>(
    `${API_URI}/finan-social/api/v1/suggest-message/update`,
    { business_has_page_id, data, suggest_message_enable },
    {
      authorization: true,
    },
  );
};

// QUICK MESSAGE
async function getQuickMessages() {
  return {
    ...(await fetchAll<{
      data: Array<QuickMessageResponse>;
    }>(`${API_URI}/ms-chat-2/api/v1/quick-message/query`, {
      authorization: true,
    })),
  };
}

async function createQuickMessage(body: QuickMessageRequest) {
  return await post<QuickMessageResponse>(`${API_URI}/ms-chat-2/api/v1/quick-message/create`, body, {
    authorization: true,
  });
}

const updateQuickMessage = async (body: QuickMessageRequest, id: string) => {
  return put<QuickMessageResponse>(`${API_URI}/ms-chat-2/api/v1/quick-message/update/${id}`, body, {
    authorization: true,
  });
};

const deleteQuickMessage = async (id: string) => {
  return await fetchData(`${API_URI}/ms-chat-2/api/v1/quick-message/delete/${id}`, {
    method: 'DELETE',
    authorization: true,
  });
};

//AUTO MESSAGE
const getAutoMessage = async ({ business_has_page_id }: AbsenceMessageParams) => {
  return await fetchData<AutoMessage>(
    `${API_URI}/finan-social/api/v1/page-auto-message/get-or-create?${qs.stringify({
      business_has_page_id,
    })}`,
    {
      authorization: true,
    },
  );
};

const updateAutoMessage = async (body: PendingAutoMessage) => {
  return await put<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/page-auto-message/update`,
    { ...body },
    {
      authorization: true,
    },
  );
};

//ABSENCE MESSAGE
const getAbsenceMessage = async ({ business_has_page_id }: AbsenceMessageParams) => {
  return await fetchData<AbsenceMessageResponse>(
    `${API_URI}/finan-social/api/v1/page-absent-message/get-or-create?${qs.stringify({
      business_has_page_id,
    })}`,
    {
      authorization: true,
    },
  );
};

const updateAbsenceMessage = async (data: PendingAbsenceMessage) => {
  return await put<ExpectedAny>(`${API_URI}/finan-social/api/v1/page-absent-message/update`, data, {
    authorization: true,
  });
};

// Chatbot
const getListChatbot = async (body?: ExpectedAny) => {
  return await fetchData<Chatbot[]>(`${API_URI}/ms-chat-2/api/v1/chat-bot/get-list?${qs.stringify({ ...body })}`, {
    authorization: true,
  });
};

const applyChatbot = async (body: ApplyChatbotBody) => {
  return await post<ApplyChatbotResponse>(
    `${API_URI}/finan-social/api/v1/page-has-chat-bot/create`,
    { ...body },
    { authorization: true },
  );
};

const getUsingChatbot = async (business_has_page_id: string) => {
  return await fetchData<ApplyChatbotResponse>(
    `${API_URI}/finan-social/api/v1/page-has-chat-bot/get-one?${qs.stringify({
      business_has_page_id,
    })}`,
    {
      authorization: true,
    },
  );
};

const removeChatbot = async (id: string) => {
  return await deleteMethod(
    `${API_URI}/finan-social/api/v1/page-has-chat-bot/delete/${id}`,
    {},
    {
      authorization: true,
    },
  );
};

const updateCommentSetting = async (body: CommentSettingBody) => {
  return await put<ExpectedAny>(
    `${API_URI}/finan-social/api/v1/comment-social/update`,
    { ...body },
    {
      authorization: true,
    },
  );
};

const getOrCreateAutoLabel = async () => {
  return await fetchData<AutoLabelResponse>(`${API_URI}/ms-chat-2/api/v1/auto-label/get-or-create`, {
    authorization: true,
  });
};

const updateAutoLabelSetting = async (body: AutoLabelBody) => {
  const business_id = await AuthService.getBusinessId();
  return await put<ExpectedAny>(
    `${API_URI}/ms-chat-2/api/v1/auto-label/update`,
    { ...body, business_id },
    {
      authorization: true,
    },
  );
};

const ChatService = {
  getCurrentLink,
  getAllCurrentLink,
  activeListLinkSocial,
  linkOrUnlinkSocial,
  linkMeta,
  linkZalo,
  unlinkMeta,
  getAbsenceMessage,
  updateAbsenceMessage,
  getConversationMessages,
  getConversations,
  getConversationDetail,
  updateConversation,
  getConversationsDefault,
  getPostDetail,
  getLabels,
  createLabel,
  updateLabel,
  changeLabelPosition,
  deleteLabel,
  getOrdersHistory,
  getCountTotalOrders,
  sendMessage,
  reactMessage,
  markReadMessage,
  updateMessage,
  getFrequentlyQuestion,
  createOrUpdateFrequentlyQuestion,
  getQuickMessages,
  createQuickMessage,
  updateQuickMessage,
  deleteQuickMessage,
  getAutoMessage,
  updateAutoMessage,
  unlinkZalo,
  getListChatbot,
  applyChatbot,
  getUsingChatbot,
  removeChatbot,
  updateCommentSetting,
  getOrCreateAutoLabel,
  updateAutoLabelSetting,
};

export default ChatService;
