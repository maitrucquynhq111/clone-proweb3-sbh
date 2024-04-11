import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IconButton, Input, InputGroup, Tooltip, Whisper } from 'rsuite';
import { BsGearFill, BsPlus, BsPlusCircleFill } from 'react-icons/bs';
import SearchIcon from '@rsuite/icons/Search';
import QuickMessageItem from './QuickMessageItem';
import QuickMessageInstruction from './QuickMessageInstruction';
import { useQuickMessagesQuery } from '~app/services/queries';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant, isScrolledIntoView } from '~app/features/chat-inbox/utils';
import { NoDataImage } from '~app/components/Icons';
import { QUICK_MESSAGE_TYPE_CODE } from '~app/utils/constants';
import { ModalPlacement, ModalSize, ModalTypes } from '~app/modals';
import { MainRouteKeys } from '~app/routes/enums';
import { formatPhoneWithZero } from '~app/utils/helpers';
import { quickMessageCodeRegex } from '~app/utils/helpers/regexHelper';

const MAX_QUICK_MESSAGES = 20;

const getFormatedMessage = (message: string, currentParticipant: Participant, otherParticipant: Participant) => {
  let formatedMessage = message;
  const specialPatterns = formatedMessage.match(quickMessageCodeRegex);
  if (specialPatterns && specialPatterns.length > 0) {
    specialPatterns.forEach((specialPattern) => {
      switch (specialPattern) {
        case QUICK_MESSAGE_TYPE_CODE.CUSTOMER_NAME:
          formatedMessage = formatedMessage.replace(specialPattern, otherParticipant?.info?.full_name || '');
          break;
        case QUICK_MESSAGE_TYPE_CODE.CUSTOMER_PHONE:
          formatedMessage = formatedMessage.replace(
            specialPattern,
            formatPhoneWithZero(currentParticipant?.info?.phone_number || ''),
          );
          break;
        case QUICK_MESSAGE_TYPE_CODE.CUSTOMER_GENDER:
          formatedMessage = formatedMessage.replace(specialPattern, 'Anh/Chị');
          break;
        case QUICK_MESSAGE_TYPE_CODE.SHOP_NAME:
          formatedMessage = formatedMessage.replace(specialPattern, currentParticipant?.info?.full_name || '');
          break;
        default:
          break;
      }
    });
  }
  return formatedMessage;
};

type Props = {
  messageText: string;
  showQuickMessageSearchControl: boolean;
  setMessageText(value: string): void;
  setShowQuickMessageSearchControl(value: boolean): void;
  setShowQuickMessageControl(value: boolean): void;
};

const QuickMessageControl = ({
  messageText,
  showQuickMessageSearchControl,
  setMessageText,
  setShowQuickMessageSearchControl,
  setShowQuickMessageControl,
}: Props) => {
  const { t } = useTranslation(['chat', 'common']);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isError } = useQuickMessagesQuery();
  const { currentConversation, setSelectedImages } = useCurrentConversation();
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [innerSearch, setInnerSearch] = useState('');

  const currentParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], true);
  }, [currentConversation]);

  const otherParticipant = useMemo(() => {
    return getParticipant(currentConversation?.participants || [], false);
  }, [currentConversation]);

  const originalQuickMessages = useMemo(() => {
    return data?.data
      ? data.data.map((item) => {
          return { ...item, message: getFormatedMessage(item.message, currentParticipant, otherParticipant) };
        })
      : [];
  }, [data, currentParticipant, otherParticipant]);

  const quickMessages = useMemo(() => {
    const searchText = messageText.split('/')?.[1] || '';
    return (
      originalQuickMessages.filter((item) =>
        item.shortcut
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(showQuickMessageSearchControl ? innerSearch : searchText),
      ) || []
    );
  }, [originalQuickMessages, messageText, innerSearch, showQuickMessageSearchControl]);

  const canCreateNewMessage = originalQuickMessages.length < MAX_QUICK_MESSAGES;

  const handleSelect = useCallback(
    (index: number) => {
      const selectedMessage = quickMessages?.[index];
      if (selectedMessage) setMessageText(selectedMessage.message);
      const image = selectedMessage?.images?.[0];
      if (image) {
        setSelectedImages([image]);
      } else {
        setSelectedImages([]);
      }
      setShowQuickMessageSearchControl(false);
      setShowQuickMessageControl(false);
    },
    [quickMessages, getFormatedMessage, setMessageText, setShowQuickMessageSearchControl, setShowQuickMessageControl],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (quickMessages.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentPosition === null) {
          setCurrentPosition(0);
        } else {
          const nextPosition = currentPosition + 1;
          const hasNextPosition = quickMessages?.[nextPosition];
          const containerElement = boxRef.current;
          if (hasNextPosition && containerElement) {
            const elementItem = containerElement.querySelector(
              `div[data-id="${hasNextPosition.id}"]`,
            ) as HTMLDivElement;
            setCurrentPosition(nextPosition);
            if (!isScrolledIntoView(containerElement, elementItem)) boxRef.current?.scrollTo(0, elementItem.offsetTop);
          }
        }
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentPosition === null) {
          setCurrentPosition(0);
        } else {
          const prevPosition = currentPosition - 1;
          const hasNextPosition = quickMessages?.[prevPosition];
          const containerElement = boxRef.current;
          if (hasNextPosition && containerElement) {
            const elementItem = containerElement.querySelector(
              `div[data-id="${hasNextPosition.id}"]`,
            ) as HTMLDivElement;
            setCurrentPosition(prevPosition);
            if (!isScrolledIntoView(containerElement, elementItem)) boxRef.current?.scrollTo(0, elementItem.offsetTop);
          }
        }
      }
      if (e.key === 'Enter' && currentPosition !== null) {
        if (currentPosition === null) return;
        const selectedMessage = quickMessages?.[currentPosition];
        if (selectedMessage) setMessageText(selectedMessage.message);
        const image = selectedMessage?.images?.[0];
        if (image) {
          setSelectedImages([image]);
        } else {
          setSelectedImages([]);
        }
        setShowQuickMessageSearchControl(false);
        setShowQuickMessageControl(false);
      }
    },
    [quickMessages, currentPosition, getFormatedMessage, setMessageText, setShowQuickMessageSearchControl],
  );

  const handleCreateQuickMessage = () => {
    navigate({
      pathname: location.pathname,
      search: `?${createSearchParams({
        modal: ModalTypes.QuickMessageCreate,
        placement: ModalPlacement.Right,
        size: ModalSize.Xsmall,
        initValue: quickMessages.length === 0 && innerSearch ? innerSearch : '',
      })}`,
    });
  };

  const handleOpenQuickMessageConfig = () => {
    navigate(MainRouteKeys.ChatConfigsQuickMessage);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (showQuickMessageSearchControl) {
      boxRef.current?.focus();
    }
  }, [showQuickMessageSearchControl]);

  useEffect(() => {
    const handleClickOutSide = (e: ExpectedAny) => {
      const modalType = searchParams.get('modal') as string;
      if (!containerRef?.current?.contains(e.target) && modalType !== ModalTypes.QuickMessageCreate) {
        setShowQuickMessageControl(false);
        setShowQuickMessageSearchControl(false);
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutSide, false);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutSide, false);
    };
  }, [setShowQuickMessageControl, setShowQuickMessageSearchControl, searchParams]);

  if (isError) return null;

  return (
    <div
      className="pw-rounded pw-shadow-dropdown pw-absolute pw-bottom-14 pw-w-full pw-z-10 pw-bg-neutral-white"
      ref={containerRef}
    >
      {showQuickMessageSearchControl ? (
        <div className="pw-py-3 pw-px-4">
          <div className="pw-flex pw-justify-between pw-gap-x-6">
            <InputGroup inside>
              <InputGroup.Addon>
                <SearchIcon />
              </InputGroup.Addon>
              <Input
                value={innerSearch}
                onChange={(value) => setInnerSearch(value)}
                placeholder={t('placeholder.find_shortcut_name') || ''}
              />
            </InputGroup>
            <Whisper
              placement="autoVerticalEnd"
              trigger="hover"
              speaker={<Tooltip arrow={true}>{t('quick_message_manangement')}</Tooltip>}
            >
              <button onClick={handleOpenQuickMessageConfig}>
                <BsGearFill
                  size={24}
                  className=" pw-text-neutral-secondary pw-cursor-pointer hover:pw-text-secondary-main-blue"
                />
              </button>
            </Whisper>
          </div>
          {canCreateNewMessage ? (
            <button
              className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-3 
              pw-fill-secondary-main-blue pw-text-secondary-main-blue"
              type="button"
              onClick={handleCreateQuickMessage}
            >
              <BsPlusCircleFill className="pw-fill-inherit" size={20} />
              <span className="pw-text-sm pw-font-bold">
                {t('action.create_message')} {innerSearch && quickMessages.length === 0 ? `"${innerSearch}"` : ''}
              </span>
            </button>
          ) : (
            <Whisper
              placement="autoVerticalStart"
              trigger="hover"
              speaker={<Tooltip arrow={true}>{t('error.limit_quick_message')}</Tooltip>}
            >
              <button
                className="pw-flex pw-items-center pw-justify-center pw-gap-x-2 pw-mt-3 
              pw-fill-neutral-disable pw-text-neutral-disable"
                disabled={true}
                type="button"
              >
                <BsPlusCircleFill className="pw-fill-inherit" size={20} />
                <span className="pw-text-sm pw-font-bold">{t('action.create_message')}</span>
              </button>
            </Whisper>
          )}
        </div>
      ) : null}
      <div className="pw-max-h-106 pw-overflow-auto pw-relative" ref={boxRef} tabIndex={-1}>
        {quickMessages.length === 0 ? (
          <div className="pw-pb-8">
            <div className="pw-py-3 pw-flex pw-flex-col pw-items-center pw-justify-center pw-text-sm pw-text-neutral-secondary">
              <NoDataImage width={120} height={120} />
              <div>{t('common:no-data')}</div>
              {!showQuickMessageSearchControl && canCreateNewMessage ? (
                <div>{t('create_quick_message_with_this_shortcut')}</div>
              ) : null}
            </div>
            {!showQuickMessageSearchControl && canCreateNewMessage ? (
              <div className="pw-w-full pw-flex pw-items-center pw-justify-center">
                <IconButton
                  icon={<BsPlus className="rs-icon" size={20} />}
                  appearance="primary"
                  onClick={handleCreateQuickMessage}
                >
                  <strong>{t('action.create_message')}</strong>
                </IconButton>
              </div>
            ) : null}
          </div>
        ) : (
          quickMessages.map((item, index) => (
            <QuickMessageItem
              key={item.id}
              index={index}
              data={item}
              isSelected={index === currentPosition}
              onClick={handleSelect}
            />
          ))
        )}
      </div>
      <QuickMessageInstruction />
    </div>
  );
};

export default memo(QuickMessageControl);
