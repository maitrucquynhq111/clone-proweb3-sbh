import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Nav } from 'rsuite';
import { useChatStore } from '~app/features/chat-inbox/hooks';
import { ChatChannel } from '~app/utils/constants';

export enum ConversationTabEnum {
  ALL = 'all',
  MESSAGES = 'messages',
  COMMENT = 'comment',
}

const tabList = [
  {
    label: 'all',
    value: ConversationTabEnum.ALL,
  },
  {
    label: 'message',
    value: ConversationTabEnum.MESSAGES,
  },
  {
    label: 'comment',
    value: ConversationTabEnum.COMMENT,
  },
];

const Navbar = ({
  active,
  onSelect,
  ...props
}: {
  appearance: 'default' | 'subtle' | 'tabs';
  active: string;
  onSelect: (value: string) => void;
}) => {
  const { t } = useTranslation('common');
  const [showOrderInChat] = useChatStore((store) => store.showOrderInChat);
  return (
    <Nav {...props} className="pw-flex pw-items-center" justified activeKey={active} onSelect={onSelect}>
      {tabList.map((tab, index) => (
        <>
          {index > 0 && <span className="pw-text-neutral-border">|</span>}
          <Nav.Item
            key={tab.value}
            eventKey={tab.value}
            className={cx('pw-text-center pw-font-bold pw-text-sm !pw-py-3', {
              '!pw-text-left': showOrderInChat && tab.value === ConversationTabEnum.ALL,
            })}
          >
            {t(tab.label)}
            {/* {t(tab.label)} {index > 0 && <Badge content={1} />} */}
          </Nav.Item>
        </>
      ))}
    </Nav>
  );
};

const ConversationTab = () => {
  const { t } = useTranslation('common');
  const [tab, setStore] = useChatStore((store) => store.tab);

  const handleSelect = (value: string) => {
    if (tab === value) return;
    switch (value) {
      case ConversationTabEnum.COMMENT:
        setStore((prevState) => ({
          ...prevState,
          tab: value,
          filter: {
            ...prevState.filter,
            tag: [
              JSON.stringify({
                label: 'Facebook',
                value: ChatChannel.FACEBOOK,
              }),
            ],
          },
        }));
        break;
      case ConversationTabEnum.MESSAGES:
        setStore((prevState) => ({
          ...prevState,
          tab: value,
          filter: {
            ...prevState.filter,
            tag: [
              JSON.stringify({
                label: t('chat:filter.chat_sbh'),
                value: ChatChannel.SBH,
              }),
              JSON.stringify({
                label: 'Messenger',
                value: ChatChannel.MESSENGER,
              }),
              JSON.stringify({
                label: 'Zalo',
                value: ChatChannel.ZALO,
              }),
            ],
          },
        }));
        break;
      default:
        setStore((prevState) => ({
          ...prevState,
          tab: value,
          filter: {
            ...prevState.filter,
            tag: [],
          },
        }));
        break;
    }
  };

  return <Navbar appearance="subtle" active={tab} onSelect={handleSelect} />;
};

export default ConversationTab;
