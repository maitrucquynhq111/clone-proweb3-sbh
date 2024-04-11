import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';

type CurrentConversationContextProps = {
  currentConversation: Conversation | null;
  setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>;
  messageResponses: MessageResponse[];
  setMessageResponses: Dispatch<SetStateAction<MessageResponse[]>>;
  selectedImages: Array<PendingUploadImage | string>;
  setSelectedImages: Dispatch<SetStateAction<Array<PendingUploadImage | string>>>;
  currentRepliedMessageContent: MessageResponse | null;
  setCurrentRepliedMessageContent: Dispatch<SetStateAction<MessageResponse | null>>;
};

const CurrentConversationContext = createContext<CurrentConversationContextProps>({
  currentConversation: null,
  setCurrentConversation: () => null,
  messageResponses: [],
  setMessageResponses: () => [],
  selectedImages: [],
  setSelectedImages: () => [],
  currentRepliedMessageContent: null,
  setCurrentRepliedMessageContent: () => null,
});

type CurrentConversationProviderProps = {
  children: React.ReactElement;
};

export const CurrentConversationProvider = ({ children }: CurrentConversationProviderProps) => {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messageResponses, setMessageResponses] = useState<MessageResponse[]>([]);
  const [selectedImages, setSelectedImages] = useState<Array<PendingUploadImage | string>>([]);
  const [currentRepliedMessageContent, setCurrentRepliedMessageContent] = useState<MessageResponse | null>(null);

  const value = useMemo(
    () => ({
      currentConversation,
      setCurrentConversation,
      messageResponses,
      setMessageResponses,
      selectedImages,
      setSelectedImages,
      currentRepliedMessageContent,
      setCurrentRepliedMessageContent,
    }),
    [
      currentConversation,
      setCurrentConversation,
      messageResponses,
      setMessageResponses,
      selectedImages,
      setSelectedImages,
      currentRepliedMessageContent,
      setCurrentRepliedMessageContent,
    ],
  );

  return <CurrentConversationContext.Provider value={value}>{children}</CurrentConversationContext.Provider>;
};

export const useCurrentConversation = () => useContext(CurrentConversationContext);
