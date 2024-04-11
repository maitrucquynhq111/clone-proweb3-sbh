import cx from 'classnames';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BsChatLeftQuote, BsImage, BsFillSendFill } from 'react-icons/bs';
import { Input, InputGroup, Tooltip, Whisper } from 'rsuite';
import { UploadIcon } from '~app/components';
import { InputImageMessages, RepliedMessage, SendMoreButton } from '~app/features/chat-inbox/details/components';
import { MessageType } from '~app/utils/constants';
import { useCurrentConversation } from '~app/utils/hooks';
import { isLocalImage, revokeObjectUrl } from '~app/utils/helpers';
import { ProductService } from '~app/services/api';
import { isPostComment } from '~app/features/chat-inbox/utils';
import { QuickMessageControl } from '~app/features/chat-inbox/components';

const MAX_IMAGE = 4;

type Props = {
  onSendMessage: (value: string, type: MessageType) => void;
};

const ChatInput = ({ onSendMessage }: Props) => {
  const { t } = useTranslation('chat');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { currentConversation, currentRepliedMessageContent, selectedImages, setSelectedImages } =
    useCurrentConversation();
  const [messageText, setMessageText] = useState<string>('');
  const [showQuickMessageControl, setShowQuickMessageControl] = useState(false);
  const [showQuickMessageSearchControl, setShowQuickMessageSearchControl] = useState(false);

  const handleSetMessageText = (value: string) => {
    if (value.charAt(0) === '/') {
      setShowQuickMessageControl(true);
    } else {
      setShowQuickMessageControl(false);
      setShowQuickMessageSearchControl(false);
    }
    setMessageText(value);
  };

  const handleSelectImages = (fileList: Array<ExpectedAny>) => {
    setSelectedImages((prevState) => {
      if (prevState.length === MAX_IMAGE) {
        fileList.forEach((file) => revokeObjectUrl(file?.url || ''));
        toast.error(t('error.max_input_image_length'));
        return prevState;
      }
      const newState = fileList.map((item) => item);
      return [...prevState, ...newState];
    });
  };

  const handleSend = () => {
    if (messageText.replaceAll(/\s/g, '') !== '') {
      onSendMessage(messageText, MessageType.TEXT);
      setMessageText('');
    }
    selectedImages.forEach(async (image) => {
      try {
        if (isLocalImage(image)) {
          const url = await ProductService.uploadProductImage(image as PendingUploadImage);
          onSendMessage(url || '', MessageType.IMAGE);
          revokeObjectUrl(image?.url || '');
        } else {
          onSendMessage(image, MessageType.IMAGE);
        }
      } catch (error) {
        // TO DO
      }
    });
    setSelectedImages([]);
  };

  const handleClickSend = () => {
    handleSend();
  };

  const handlePressEnter = (e: ExpectedAny) => {
    if (e.key === 'Enter' && !showQuickMessageControl) handleSend();
  };

  const isReadyToSend = useMemo(() => {
    return selectedImages.length > 0 || messageText;
  }, [messageText, selectedImages]);

  useEffect(() => {
    if (!currentRepliedMessageContent || !inputRef?.current) return;
    inputRef.current.focus();
  }, [currentRepliedMessageContent]);

  useEffect(() => {
    if (isPostComment(currentConversation?.tag) && currentRepliedMessageContent) {
      setMessageText(currentRepliedMessageContent.sender?.info?.full_name || '');
    } else {
      setMessageText('');
    }
  }, [currentRepliedMessageContent, currentConversation]);

  return (
    <div className="pw-relative">
      {showQuickMessageControl || showQuickMessageSearchControl ? (
        <QuickMessageControl
          messageText={messageText}
          setMessageText={setMessageText}
          showQuickMessageSearchControl={showQuickMessageSearchControl}
          setShowQuickMessageSearchControl={setShowQuickMessageSearchControl}
          setShowQuickMessageControl={setShowQuickMessageControl}
        />
      ) : null}
      <InputGroup className="!pw-block">
        {currentRepliedMessageContent ? <RepliedMessage messageContent={currentRepliedMessageContent} /> : null}
        <InputImageMessages />
        <div className="pw-flex">
          <Input
            onChange={handleSetMessageText}
            value={messageText}
            size="lg"
            inputRef={inputRef}
            onKeyDown={handlePressEnter}
            placeholder={t('placeholder.input_message') || ''}
            className="!pw-rounded-md"
            autoComplete="off"
          />
          <InputGroup.Addon className="!pw-bg-transparent">
            <div className="pw-flex pw-items-center">
              <div className="pw-flex pw-items-center pw-mr-3">
                <Whisper
                  placement="autoVertical"
                  trigger="hover"
                  speaker={<Tooltip arrow={true}>{t('quick_message')}</Tooltip>}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (showQuickMessageControl || showQuickMessageSearchControl) {
                        setShowQuickMessageControl(false);
                        return setShowQuickMessageSearchControl(false);
                      }
                      setShowQuickMessageSearchControl(true);
                    }}
                  >
                    <BsChatLeftQuote
                      className={cx(
                        'pw-mr-4 pw-text-neutral-secondary pw-cursor-pointer hover:pw-text-secondary-main-blue',
                        {
                          'pw-text-secondary-main-blue': showQuickMessageSearchControl,
                        },
                      )}
                      size={20}
                    />
                  </button>
                </Whisper>
                <Whisper
                  placement="autoVertical"
                  trigger="hover"
                  speaker={<Tooltip arrow={true}>{t('common:send_image')}</Tooltip>}
                >
                  <div className="pw-mr-4">
                    <UploadIcon
                      icon={<BsImage className="pw-text-neutral-secondary hover:pw-text-blue-primary" size={20} />}
                      multiple={true}
                      maxFiles={MAX_IMAGE}
                      onChange={handleSelectImages}
                    />
                  </div>
                </Whisper>
                <SendMoreButton onSendMessage={onSendMessage} />
              </div>
              <button
                className={cx('pw-flex pw-items-center pw-cursor-pointer', {
                  'pw-text-neutral-disable': !isReadyToSend,
                  'pw-text-secondary-main-blue': isReadyToSend,
                })}
                disabled={!isReadyToSend}
                onClick={handleClickSend}
              >
                <BsFillSendFill className="pw-mr-1" size={20} />
                <span className="pw-font-bold">{t('common:send')}</span>
              </button>
            </div>
          </InputGroup.Addon>
        </div>
      </InputGroup>
    </div>
  );
};

export default ChatInput;
