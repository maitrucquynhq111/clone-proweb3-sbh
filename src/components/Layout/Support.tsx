import cx from 'classnames';
import { BsBook, BsQuestionCircle, BsQuestionLg } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Popover, Whisper } from 'rsuite';
import { MdHeadsetMic } from 'react-icons/md';
import { SUPPORT_CUSTOMER, SUPPORT_COMMON_QUESTION } from '~app/configs';

const OPTIONS = [
  {
    key: 'customer',
    label: 'support_option.customer',
    icon: <MdHeadsetMic size={28} className="pw-text-neutral-secondary" />,
  },
  {
    key: 'common_questions',
    label: 'support_option.common_questions',
    icon: <BsQuestionLg size={28} className="pw-text-neutral-secondary" />,
  },
  {
    key: 'using_guide',
    label: 'support_option.using_guide',
    icon: <BsBook size={28} className="pw-text-neutral-secondary" />,
    disabled: true,
  },
  // { key: 'printer_guide', label: 'support_option.printer_guide', icon: <BsPrinter size={28} /> },
];

export default function Support() {
  const { t } = useTranslation('common');
  return (
    <Whisper
      placement="bottomEnd"
      trigger="click"
      speaker={({ onClose, left, top, className }, ref) => {
        const handleClick = (key: string) => {
          switch (key) {
            case 'customer':
              window.open(SUPPORT_CUSTOMER, '_blank');
              break;
            case 'common_questions':
              window.open(SUPPORT_COMMON_QUESTION, '_blank');
              break;
            case 'using_guide':
              break;
            default:
              break;
          }
          onClose();
        };

        return (
          <Popover
            ref={ref}
            className={cx('!pw-rounded-none pw-w-min', className)}
            style={{ left, top }}
            arrow={false}
            full
          >
            <Dropdown.Menu>
              {OPTIONS.map((option, index) => (
                <Dropdown.Item
                  disabled={option?.disabled}
                  className={cx('!pw-flex pw-items-center !pw-py-3 !pw-px-4', {
                    'pw-border-b pw-border-b-neutral-divider': index + 1 < OPTIONS.length,
                  })}
                  onClick={() => handleClick(option.key)}
                >
                  {option.icon}
                  <span className="pw-ml-2">{t(option.label)}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Popover>
        );
      }}
    >
      <div className="pw-mr-4">
        <Button
          startIcon={<BsQuestionCircle size={20} />}
          size="md"
          className="!pw-bg-transparent hover:!pw-bg-neutral-background"
        >
          <span className="pw-cursor-pointer pw-text-sm">{t('support')}</span>
        </Button>
      </div>
    </Whisper>
  );
}
