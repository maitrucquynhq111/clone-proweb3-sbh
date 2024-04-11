type MessageResponse = {
  id: string;
  conversation_id: string;
  message: string;
  message_type: string;
  reactions?: Reaction[];
  sender?: Participant;
  sender_id?: string;
  status: string;
  replied_message?: RepliedMessage;
  replied_message_id?: string;
  created_at?: string;
  creator_id?: string;
  updated_at?: string;
  updater_id?: string;
};

type Reaction = {
  id: string;
  message: MessageResponse;
  message_id: string;
  participant: Participant;
  participant_id: string;
  type?: string;
  created_at?: string;
  creator_id?: string;
  updated_at?: string;
  updater_id?: string;
  deleted_at?: string;
};

type Participant = {
  id: string;
  sender_id: string;
  sender_type?: string;
  last_message_at: string;
  latest_read_message_id: string;
  read_all: boolean;
  created_at?: string;
  creator_id?: string;
  creator_business_id?: string;
  updated_at?: string;
  updater_id?: string;
  deleted_at?: string;
  info?: {
    id?: string;
    name?: string;
    avatar?: string;
    full_name?: string;
    phone_number?: string;
    domain?: string;
    user_has_businesses?: Array<ExpectedAny>;
  };
};

type ParitcipantWithInfo = Participant & {
  info?: {
    id?: string;
    name?: string;
    avatar?: string;
    full_name?: string;
    phone_number?: string;
    user_has_businesses?: Array<ExpectedAny>;
  };
};

type RepliedMessage = {
  id: string;
  conversation_id: string;
  message: string;
  message_type: string;
  reactions?: Reaction[];
  sender?: ParitcipantWithInfo;
  sender_id?: string;
  status: string;
  replied_message_id?: string;
  created_at?: string;
  creator_id?: string;
  updated_at?: string;
  updater_id?: string;
};

type ConversationMessagesBody = {
  conversation_id: string;
  sender_type: string;
  page: number;
  page_size: number;
  sort?: string;
};
interface CommonSenderPayload {
  sender_id?: string;
  sender_type: string;
  label_ids?: string[];
}
interface ConversationPayload extends CommonSenderPayload {
  status?: string;
  type?: string;
  name?: string;
  tag?: string;
  start_time?: string;
  end_time?: string;
  page?: number;
  page_size?: number;
  sort?: string;
}
interface Conversation {
  avatar: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  index: string;
  is_banned: boolean;
  latest_message: LatestMessage;
  latest_message_id: string;
  owner_id: string;
  owner_type: string;
  page_avatar: string;
  page_name: string;
  participants: Participant[];
  tag: string;
  title: string;
  type: string;
  updated_at: string;
  updater_id: string;
  metadata: ExpectedAny;
  labels: ChatItemLabel[];
  unread: number;
  unseen_message: number;
  pass_a_day: boolean;
  buyer_social_id: string;
}

type LatestMessage = {
  conversation_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  message: string;
  message_type: string;
  reactions: [
    {
      created_at: string;
      creator_id: string;
      deleted_at: string;
      id: string;
      message: {
        conversation_id: string;
        created_at: string;
        creator_id: string;
        deleted_at: string;
        id: string;
        message: string;
        message_type: string;
        reactions: [string];
        replied_message_id: string;
        sender: {
          conversation_id: string;
          created_at: string;
          creator_business_id: string;
          creator_id: string;
          deleted_at: string;
          id: string;
          last_message_at: string;
          latest_read_message_id: string;
          read_all: true;
          sender_id: string;
          sender_type: string;
          updated_at: string;
          updater_id: string;
        };
        sender_id: string;
        status: string;
        updated_at: string;
        updater_id: string;
      };
      message_id: string;
      participant: Participant[];
      participant_id: string;
      type: string;
      updated_at: string;
      updater_id: string;
    },
  ];
  replied_message_id: string;
  sender: {
    conversation_id: string;
    created_at: string;
    creator_business_id: string;
    creator_id: string;
    deleted_at: string;
    id: string;
    info: SenderInfo;
    last_message_at: string;
    latest_read_message_id: string;
    read_all: true;
    sender_id: string;
    sender_type: string;
    updated_at: string;
    updater_id: string;
  };
  sender_id: string;
  status: string;
  updated_at: string;
  updater_id: string;
};

type SenderInfo = {
  id: string;
  user_has_businesses: UserHasBusiness[];
  name: string;
  full_name: string;
  domain: string;
  description: string;
  status: string;
  avatar: string;
  phone_number: string;
  background: string[];
  address: string;
  open_time: number;
  close_time: number;
  delivery_fee: number;
  latitude: number;
  longitude: number;
  min_price_free_ship: number;
  is_close: boolean;
  count_change_domain: number;
};

type UserHasBusiness = {
  id: string;
  is_active: boolean;
  user_id: string;
  business_id: string;
  role_id: string;
  role: Role;
  user_name: string;
  phone_number: string;
  avatar: string;
  is_default: boolean;
  last_visited: string;
  verify_status: string;
  note: string;
  rank: number;
};

type Role = {
  id: string;
  role_name: string;
  description: string;
  business_id: string;
  is_owner: boolean;
  permission_keys?: string[];
};

type Participant = {
  conversation_id: string;
  created_at: string;
  creator_business_id: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  info: ExpectedAny;
  last_message_at: string;
  latest_read_message_id: string;
  read_all: boolean;
  sender_id: string;
  sender_type: string;
  updated_at: string;
  updater_id: string;
};

type ChatItemLabel = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  conversation_id: string;
  label_id: string;
  business_id: string;
  label: Label;
};

type Label = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | ExpectedAny;
  business_id: string;
  name: string;
  color: string;
  conversations: ExpectedAny;
};

type PendingLabel = {
  color: string;
  name: string;
  id?: string;
};

type PendingLabelPosition = {
  position: number;
  prev_position: number;
};

type PendingChat = {
  tab: string;
  pageIds: string[];
  filter: ChatFilter;
  showOrderInChat: boolean;
};

type ChatFilter = {
  name: string;
  status: string;
  tag: string[];
  label_ids: string[];
  dateRange: ExpectedAny;
};

type NotificationMessageType = {
  title: string;
  content: string;
  deep_link?: string;
  addition?: string;
  entity_key?: string;
  state_value?: string;
  two_way_confirmation_id?: string;
  contact_id?: string;
  notify_info_status?: string;
  notify_info_type?: string;
  two_way_confirmation_id?: string;
  status?: string;
};

type PendingUpdateConversation = {
  title: string;
  avatar: string;
  label_ids: string[];
};

type OrdersHistoryParams = CommonParams & {
  buyer_id?: string;
  seller_id?: string;
};

type OrderHistory = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  order_id: string;
  order: Order;
  buyer_business_id: string;
  seller_business_id: string;
  payments: ExpectedAny[];
};

type PendingMessages = {
  conversation_id: string;
  message: string;
  message_type: string;
  sender_id: string;
};

type ReactMessagesInput = {
  message_id: 'string';
  participant_id: 'string';
  react_type: 'string';
};

type CountTotalOrdersParams = {
  buyer_id: string;
  seller_id: string;
};

type CountTotalOrders = {
  total_bought: number;
  total_sold: number;
};

type MarkReadMessageParams = {
  conversation_ids: string[] | null;
  msg_id: string | null;
  sender_id: string;
  sender_type: string;
};

type LinkPage = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  avatar: PageAvatar;
  token: string;
  expires_at: string;
  data_access_expires_at: string;
  business_id: string;
  provider: string;
  tenant: string;
  pages: Page[];
};

type Page = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  token: string;
  page_id: string;
  page_name: string;
  page_avatar: string;
  sync_at: string;
  business_id: string;
  expires_at: string;
  data_access_expires_at: string;
  active: boolean;
  business_has_page_setting: BusinessHasPageSetting;
  provider: string;
  data: PageData;
  already_active: boolean;
};

type BusinessHasPageSetting = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_has_page_id: string;
  auto_message_enable: boolean;
  absent_message_enable: boolean;
  suggest_message_enable: boolean;
  auto_hide_comment_enable: boolean;
  auto_like_comment_enable: boolean;
  auto_reply_comment_enable: boolean;
  auto_reply_content: string;
  hide_comment_keyword: string;
};

type PageData = {
  name: string;
  access_token: string;
  picture: {
    data: PageAvatar;
  };
  subscribed_apps: SubscribedApps;
  id: string;
};

type PageAvatar = {
  url: string;
  width: number;
  height: number;
  is_silhouette: boolean;
};

type SubscribedApps = {
  data: ExpectedAny;
};

type FrequentlyQuestion = {
  answer: string;
  answer_type: string;
  business_has_page_id: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  message: string;
  message_type: string;
  priority: number;
  updated_at: string;
  updater_id: string;
};

type Post = {
  category_tag: string[];
  content: string;
  created_at: string;
  creator_id: string;
  deleted_at: string;
  id: string;
  media: string[];
  merchant: Merchant;
  merchant_id: string;
  post_type: string;
  meta: ExpectedAny;
  is_reacted: boolean;
  priority_locations: string[];
  updated_at: string;
  updater_id: string;
  reaction_number: number;
  share_number: number;
  updated_at: string;
  updater_id: string;
  view_number: number;
  comment_number: number;
  products: Product[];
  locations: ExpectedAny;
  hashtag: Array<string>;
};

type FrequentlyQuestionParams = {
  business_has_page_id: string;
  data?: PendingFrequentlyQuestion[];
  suggest_message_enable?: boolean;
};

type PendingFrequentlyQuestion = {
  answer: string;
  answer_type: string;
  id?: string;
  message: string;
  message_type: string;
};

interface PostDetail {
  id: string;
  message: string;
  attachments: {
    data: {
      description: string;
      media: {
        image: {
          height: number;
          src: string;
          width: number;
        };
      };
      target: {
        id: string;
        url: string;
      };
      type: string;
      url: string;
    }[];
  };
  permalink_url: string;
  created_time: string;
}

type QuickMessageResponse = {
  business_id: string;
  id: string;
  images: Array<string>;
  message: string;
  shortcut: string;
};

type QuickMessageRequest = {
  id?: string;
  shortcut: string;
  message: string;
  images: string[] | null;
};

type TransformQuickMessageRequest = {
  conversation_id: string;
  message: string;
};

type AutoMessageShorten = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  message: string;
  send_after: number;
};

type AutoMessage = {
  page_auto_message: AutoMessageShorten;
  business_has_page_res: [
    {
      id: string;
      creator_id: string;
      updater_id: string;
      created_at: string;
      updated_at: string;
      token: string;
      page_id: string;
      business_id: string;
      expires_at: string;
      data_access_expires_at: string;
      active: boolean;
      business_has_page_setting: {
        id: string;
        creator_id: string;
        updater_id: string;
        created_at: string;
        updated_at: string;
        business_has_page_id: string;
        auto_message_enable: boolean;
        absent_message_enable: boolean;
      };
      provider: string;
      data: {
        name: string;
        access_token: string;
        picture: {
          data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: number;
          };
        };
        id: string;
      };
      already_active: boolean;
    },
  ];
};

type PendingAutoMessage = {
  business_has_page_setting: {
    auto_message_enable: boolean;
    business_has_page_id: string;
  };
  message: string;
  send_after: number;
};

type AbsenceMessageParams = {
  business_has_page_id: string;
};

type AbsenceMessageResponse = {
  business_has_page_with_absent_msg: Page & { page_absent_message: AbsenceMessage };
  absent_schedule: AbsenceSchedule[];
};

type AbsenceMessageShorten = {
  absent_message: AbsenceMessage;
  absent_schedule: AbsenceSchedule[];
};

type AbsenceMessage = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  message: string;
  business_id: string;
  send_after: number;
  business_has_page_id: string;
};

type AbsenceSchedule = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  business_id: string;
  page_time_selected: TimeSelected[];
};

type PendingTimeSelected = {
  id: string;
  time_selected: TimeSelect[];
};

type TimeSelect = {
  from: number;
  to: number;
};

type TimeSelected = {
  id: string;
  creator_id: string;
  updater_id: string;
  created_at: string;
  updated_at: string;
  absent_schedule_id: string;
  from: number;
  to: number;
};

type PendingAbsenceMessage = {
  absent_schedule: PendingTimeSelected[];
  business_has_page_setting: {
    absent_message_enable: boolean;
    business_has_page_id: string;
  };
  message: string;
  send_after: number;
};

type Chatbot = {
  id: string;
  name: string;
  image?: string;
  description: string;
  start_block_id: string;
};

type ApplyChatbotBody = {
  business_has_page_id: string;
  chat_bot_id: string;
};

type ApplyChatbotResponse = {
  id: string;
  business_has_page_id: string;
  chat_bot_id: string;
};

type CommentSettingBody = {
  auto_hide_comment_enable: boolean;
  auto_like_comment_enable: boolean;
  auto_reply_comment_enable: boolean;
  auto_reply_content: string;
  business_has_page_id: string;
  hide_comment_keyword: string;
};

type KeywordLabel = {
  id?: string;
  keywords: string[];
  label?: Label | null;
};

type PendingAutoLabel = {
  auto_label_phone_enable: boolean;
  label_phone_value?: Label | null;
  auto_label_keyword_enable: boolean;
  keyword_label: KeywordLabel[];
};

type AutoLabelChatSetting = {
  id: string;
  auto_label_phone_number_enable: boolean;
  auto_label_phone_number_label_id: string | null;
  auto_label_phone_number_label?: Label | null;
  auto_label_keyword_enable: boolean;
};

type AutoLabelSetting = {
  id: string;
  data: Label | null;
  keyword: string;
  label_id: string;
};

type AutoLabelResponse = {
  auto_label_chat_setting: AutoLabelChatSetting;
  auto_label_setting: AutoLabelSetting[];
};

type AutoLabelBody = {
  auto_label_keyword_enable: boolean;
  auto_label_phone_number_enable: boolean;
  auto_label_phone_number_label_id: string;
  auto_label_settings: {
    keyword: string;
    label_id: string;
  }[];
};
