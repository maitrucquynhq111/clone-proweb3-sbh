import cx from 'classnames';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillPhoneFill, BsFonts, BsGenderAmbiguous, BsPersonSquare } from 'react-icons/bs';
import { Tooltip, Whisper } from 'rsuite';
import { QUICK_MESSAGE_TYPE_CODE } from '~app/utils/constants';

const DEFAULT_PATTERN = [
  {
    id: '1',
    type: 'customer_name',
    content: QUICK_MESSAGE_TYPE_CODE.CUSTOMER_NAME,
    tooltip: 'tooltip.customer_name',
    icon: <BsPersonSquare className="pw-fill-neutral-placeholder hover:pw-fill-secondary-main-blue" size={20} />,
  },
  {
    id: '2',
    content: QUICK_MESSAGE_TYPE_CODE.CUSTOMER_PHONE,
    type: 'customer_phone',
    tooltip: 'tooltip.customer_phone',
    icon: <BsFillPhoneFill className="pw-fill-neutral-placeholder hover:pw-fill-secondary-main-blue" size={20} />,
  },
  {
    id: '3',
    type: 'customer_gender',
    content: QUICK_MESSAGE_TYPE_CODE.CUSTOMER_GENDER,
    tooltip: 'tooltip.customer_gender',
    icon: <BsGenderAmbiguous className="pw-fill-neutral-placeholder hover:pw-fill-secondary-main-blue" size={20} />,
  },
  {
    id: '4',
    content: QUICK_MESSAGE_TYPE_CODE.SHOP_NAME,
    type: 'shop_name',
    tooltip: 'tooltip.shop_name',
    icon: <BsFonts className="pw-fill-neutral-placeholder hover:pw-fill-secondary-main-blue" size={20} />,
  },
];

type Props = {
  className?: string;
  maxLength?: number;
  currentLength?: number;
  excludeTypes?: string[];
  onChange(value: string): void;
};

const InsertPattern = ({ maxLength, currentLength = 0, excludeTypes = [], className, onChange }: Props) => {
  const { t } = useTranslation('chat');

  const finalPattern = useMemo(() => {
    if (excludeTypes.length === 0) return DEFAULT_PATTERN;
    return DEFAULT_PATTERN.filter((item) => !excludeTypes.includes(item.content));
  }, [excludeTypes]);

  return (
    <div
      className={cx(
        'pw-rounded-b pw-bg-neutral-white pw-border pw-border-t-0 pw-border-solid pw-border-neutral-divider pw-py-2 pw-px-3.5',
        className,
      )}
    >
      <div className="pw-flex pw-items-center pw-justify-between">
        <div className="pw-flex pw-gap-x-6">
          {finalPattern.map((item) => {
            return (
              <Whisper
                placement="bottomStart"
                trigger="hover"
                key={item.id}
                speaker={<Tooltip arrow={false}>{t(item.tooltip)}</Tooltip>}
              >
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(item.content);
                  }}
                >
                  {item.icon}
                </button>
              </Whisper>
            );
          })}
        </div>
        <div className="pw-text-neutral-placeholder pw-font-semibold pw-text-xs">
          {currentLength || 0}/{maxLength || 0}
        </div>
      </div>
    </div>
  );
};

export default InsertPattern;
