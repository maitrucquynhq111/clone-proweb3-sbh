import { memo, useMemo, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { BsBoxSeam, BsFileEarmarkText, BsPlusCircle } from 'react-icons/bs';
import { Popover, Whisper } from 'rsuite';
import { OrderSelect, ProductSelect } from '~app/features/chat-inbox/details/components';
import { useGetCountTotalOrdersQuery } from '~app/services/queries';
import { useCurrentConversation } from '~app/utils/hooks';
import { getParticipant } from '~app/features/chat-inbox/utils';
import { SenderType, MessageType, ConversationTag } from '~app/utils/constants';

const OPTIONS = [
  { label: 'action.send_product', value: 'product', icon: <BsBoxSeam size={28} />, count: 0 },
  { label: 'action.send_order_buy', value: 'order_buy', icon: <BsFileEarmarkText size={28} />, count: 0 },
  { label: 'action.send_order_sold', value: 'order_sold', icon: <BsFileEarmarkText size={28} />, count: 0 },
];

type Props = {
  onSendMessage: (value: string, type: MessageType) => void;
};

const SendMoreButton = ({ onSendMessage }: Props) => {
  const [open, setOpen] = useState(false);
  const [activePopover, setActivePopover] = useState('');
  const { currentConversation } = useCurrentConversation();

  const dataMemo = useMemo(() => {
    if (!currentConversation) return { me: null, other: null };
    const me = getParticipant(currentConversation.participants, true);
    const other = getParticipant(currentConversation.participants, false);
    return { me, other };
  }, [currentConversation]);

  const { data } = useGetCountTotalOrdersQuery({
    buyer_id: dataMemo.other?.info?.id || '',
    seller_id: dataMemo.me?.info?.id || '',
    enabled: open,
  });

  const renderContent = (onClose: () => void) => {
    switch (activePopover) {
      case 'product':
        return (
          <ProductSelect
            onChange={(values: string[]) => {
              values.forEach((value) => {
                onSendMessage(value, MessageType.PRODUCT);
              });
            }}
            onClose={() => {
              onClose();
              setActivePopover('');
            }}
          />
        );
      case 'order_buy':
      case 'order_sold':
        return (
          <OrderSelect
            defaultTab={activePopover}
            onChange={(values: string[]) => {
              values.forEach((value) => {
                onSendMessage(value, MessageType.ORDER);
              });
            }}
            onClose={() => {
              onClose();
              setActivePopover('');
            }}
          />
        );
      default:
        return (
          <OptionSelect
            onClick={setActivePopover}
            totalBought={data?.total_bought || 0}
            totalSold={data?.total_sold || 0}
            conversationTag={currentConversation?.tag || ''}
            otherParticipant={dataMemo.other}
          />
        );
    }
  };

  return (
    <>
      <Whisper
        placement="topEnd"
        trigger="click"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        speaker={({ onClose, left, top, className }, ref) => {
          return (
            <Popover ref={ref} className={cx('!pw-rounded-none', className)} style={{ left, top }} arrow={false} full>
              <div>{renderContent(onClose)}</div>
            </Popover>
          );
        }}
      >
        <div>
          <BsPlusCircle
            className={cx('pw-text-neutral-secondary pw-cursor-pointer', {
              '!pw-text-blue-primary': open,
            })}
            size={20}
          />
        </div>
      </Whisper>
    </>
  );
};

type OptionSelectProps = {
  totalBought: number;
  totalSold: number;
  otherParticipant: Participant | null;
  conversationTag: string;
  onClick: (value: string) => void;
};

const OptionSelect = ({ totalBought, totalSold, otherParticipant, conversationTag, onClick }: OptionSelectProps) => {
  const { t } = useTranslation('chat');
  return (
    <div className="pw-w-84">
      {OPTIONS.map((option, index) => {
        if (option.value === 'order_buy') option.count = totalBought;
        if (option.value === 'order_sold') option.count = totalSold;
        if (conversationTag === ConversationTag.FB_MESSAGE && option.value === 'order_buy') return null;
        if (
          option.value !== 'product' &&
          conversationTag !== ConversationTag.FB_MESSAGE &&
          otherParticipant?.sender_type === SenderType.USER
        )
          return null;
        return (
          <div
            className={cx('pw-p-3 pw-flex pw-items-center pw-justify-between pw-cursor-pointer', {
              'pw-border-b pw-border-neutral-divider': index + 1 < OPTIONS.length,
            })}
            onClick={() => onClick(option.value)}
          >
            <div key={option.value} className="pw-flex pw-items-center">
              {option.icon}
              <span className="pw-text-base pw-ml-2">{t(option.label)}</span>
            </div>
            {option.count > 0 && (
              <div
                className="pw-flex pw-items-center pw-justify-center pw-ml-2 pw-bg-neutral-background 
            pw-text-xs pw-font-bold pw-w-6 pw-h-6 pw-rounded-full"
              >
                {option.count > 99 ? '99+' : option.count}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(SendMoreButton);
